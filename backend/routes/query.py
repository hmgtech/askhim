from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
import time
import json
import asyncio

from models.requests import QueryRequest
from models.responses import QueryResponse
from rag_llm import rag_ask

router = APIRouter()

@router.post("/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    """
    Query the RAG system with a question about a specific repository.
    """
    start_time = time.time()
    try:
        result = await rag_ask(
            question=request.question,
            repo_name=request.repository,
            template_name=request.template_name
        )
        execution_time = time.time() - start_time
        return QueryResponse(
            answer=result,
            repository=request.repository,
            execution_time=execution_time
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@router.post("/query/stream")
async def query_stream(request: QueryRequest):
    """
    Stream query results from the RAG system.
    """
    start_time = time.time()
    
    # Improved debugging to show exactly what's being received
    print(f"Received request: question='{request.question}', repository={request.repository}")
    print(f"include_context={request.include_context} (type: {type(request.include_context)}, value in dict: {request.dict()['include_context']})")
    
    try:
        # Get context first (this remains the same)
        from embeddings import get_embedding
        from milvusdb import semantic_search
        
        embedding = await get_embedding(request.question)
        hits = semantic_search(embedding, top_k=5, repo_name=request.repository)
        
        # Format context with better readability for parsing by ContextDialog
        context_parts = []
        for h in hits:
            file_path = h['file']
            line_number = h['start_line']
            content = h['content'].strip()
            # Format in a way that's easily parseable by the regex in ContextDialog
            context_parts.append(f"**File: {file_path}:{line_number}**\n```\n{content}\n```")
        
        context = "\n\n".join(context_parts)
        
        # Function to stream the response
        async def response_generator():
            # Send initial message
            init_message = json.dumps({
                "type": "start",
                "repository": request.repository,
                "timestamp": time.time()
            }) + "\n"
            yield init_message
            
            # Stream the response from LLM
            from config import LLM_API_URL
            import httpx
            from rag_llm import load_prompt_template
            
            # Load the prompt template
            prompt_template = load_prompt_template(request.template_name)
            
            # Format the template with context and question
            user_prompt = prompt_template.format(context=context, question=request.question)
            
            # Extract system prompt - first line of the template
            system_prompt_line = prompt_template.split('\n', 1)[0]
            system_prompt = system_prompt_line if not system_prompt_line.startswith('{') else "You are a helpful assistant."
            
            headers = {
                "Content-Type": "application/json",
                "Accept": "text/event-stream"
            }
            
            payload = {
                "model": "gpt-4",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "temperature": 0.7,
                "stream": True
            }
            
            try:
                async with httpx.AsyncClient(timeout=120) as client:
                    async with client.stream("POST", LLM_API_URL, headers=headers, json=payload) as response:
                        response.raise_for_status()
                        buffer = ""
                        async for chunk in response.aiter_text():
                            buffer += chunk
                            while "data:" in buffer:
                                # Extract data
                                parts = buffer.split("data:", 1)
                                before = parts[0]
                                parts = parts[1].split("\n", 1)
                                data = parts[0].strip()
                                
                                # Reset buffer with the remainder
                                buffer = parts[1] if len(parts) > 1 else ""
                                
                                # Handle special case for "[DONE]"
                                if data == "[DONE]":
                                    continue
                                    
                                try:
                                    json_data = json.loads(data)
                                    delta = json_data.get("choices", [{}])[0].get("delta", {})
                                    content = delta.get("content", "")
                                    
                                    if content:
                                        # Stream the content to the client
                                        output = json.dumps({
                                            "type": "content",
                                            "content": content
                                        }) + "\n"
                                        yield output
                                except json.JSONDecodeError as e:
                                    # Try to recover
                                    continue
            except Exception as e:
                print(f"Error during streaming: {e}")
                # Send error notification to client
                error_message = json.dumps({
                    "type": "error",
                    "content": f"Error during streaming: {str(e)}"
                }) + "\n"
                yield error_message
            
            # Send completion message with timing info
            execution_time = time.time() - start_time
            end_message = json.dumps({
                "type": "end",
                "execution_time": execution_time
            }) + "\n"
            yield end_message
            
            # Check include_context - convert to boolean again for extra safety
            if request.include_context:
                print(f"Including context as requested (include_context={request.include_context})")
                # Send context with delimiter
                context_delimiter = "--- CONTEXT_DELIMITER ---"
                context_message = json.dumps({
                    "type": "content",
                    "content": f"\n\n{context_delimiter}\n\n{context}"
                }) + "\n"
                yield context_message
            else:
                print(f"Skipping context as not requested (include_context={request.include_context})")
    
        return StreamingResponse(
            response_generator(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache, no-transform",
                "Connection": "keep-alive",
                "Content-Type": "text/event-stream",
                "X-Accel-Buffering": "no",  # Disable buffering in Nginx
                "Transfer-Encoding": "chunked"
            }
        )
    
    except Exception as e:
        print(f"Stream error: {e}")
        raise HTTPException(status_code=500, detail=f"Error streaming query: {str(e)}")
