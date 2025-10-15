import asyncio
from embeddings import get_embedding
from milvusdb import semantic_search
import httpx
from config import LLM_API_URL
import os

def load_prompt_template(template_name):
    """Load a prompt template from file"""
    prompts_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "prompts")
    template_path = os.path.join(prompts_dir, f"{template_name}.txt")
    
    try:
        with open(template_path, "r") as f:
            return f.read()
    except FileNotFoundError:
        print(f"Warning: Template {template_name} not found at {template_path}")
        # Return a default template if file not found
        return "You are a helpful AI assistant.\n\nContext:\n{context}\n\nQuestion:\n{question}"

async def call_llm(context, question, template_name="code_qa_template"):
    # Load the prompt template
    prompt_template = load_prompt_template(template_name)
    
    # Format the template with context and question
    user_prompt = prompt_template.format(context=context, question=question)
    
    # Extract system prompt - first line of the template
    system_prompt_line = prompt_template.split('\n', 1)[0]
    system_prompt = system_prompt_line if not system_prompt_line.startswith('{') else "You are a helpful assistant."
    
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "model": "gpt-4",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.7
    }
    async with httpx.AsyncClient(timeout=120) as client:
        resp = await client.post(LLM_API_URL, headers=headers, json=payload)
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"]

async def rag_ask(question, repo_name=None, template_name="code_qa_template"):
    embedding = await get_embedding(question)
    hits = semantic_search(embedding, top_k=5, repo_name=repo_name)
    context = "\n\n".join([f"File: {h['file']}:{h['start_line']}\n{h['content']}" for h in hits])
    answer = await call_llm(context, question, template_name)
    # Return the answer instead of printing it
    return answer

if __name__ == "__main__":
    import sys
    import argparse
    
    parser = argparse.ArgumentParser(description="Ask questions about your code repository")
    parser.add_argument("question", help="The question to ask about your code")
    parser.add_argument("-r", "--repository", help="Repository name to query (defaults to most recent)")
    parser.add_argument("-t", "--template", default="code_qa_template", 
                       help="Name of prompt template file to use (without .txt extension)")
    
    args = parser.parse_args()
    
    # Create prompts directory if it doesn't exist
    prompts_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "prompts")
    os.makedirs(prompts_dir, exist_ok=True)
    
    asyncio.run(rag_ask(args.question, args.repository, args.template))
