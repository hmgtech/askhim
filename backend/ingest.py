import asyncio
from embeddings import get_embedding
from workspace import scan_workspace
from milvusdb import insert_chunks
from config import WORKSPACE_DIR
from tqdm import tqdm
from chunker import chunk_python_by_functions_and_classes
import pickle
import os

async def process_file(file_path, repo_name=None):
    if repo_name is None:
        # Use parent directory name as repo name
        repo_name = os.path.basename(os.path.dirname(os.path.abspath(file_path)))
    
    if file_path.endswith('.py'):
        chunks = chunk_python_by_functions_and_classes(file_path)
    else:
        chunks = []
    print(f"Total chunks to embed: {len(chunks)}")
    embeddings = []
    for c in tqdm(chunks, desc="Embedding chunks"):
        emb = await get_embedding(c["content"])
        embeddings.append(emb)
    if len(chunks) != len(embeddings):
        print(f"ERROR: Number of chunks ({len(chunks)}) does not match number of embeddings ({len(embeddings)}).")
        return
    inserted = insert_chunks(chunks, embeddings, repo_name)
    print(f"Inserted into ChromaDB (repository: {repo_name}).")
    print("Collection count after insert:", len(inserted["ids"]))
    for i in range(len(inserted["ids"])):
        print({
            "id": inserted["ids"][i],
            "file": inserted["metadatas"][i].get("file"),
            "start_line": inserted["metadatas"][i].get("start_line"),
            "type": inserted["metadatas"][i].get("type"),
            "name": inserted["metadatas"][i].get("name"),
            "content": inserted["documents"][i][:80] + "..."
        })

async def process_workspace(workspace_dir):
    # Use the directory name as the repo name
    repo_name = os.path.basename(os.path.abspath(workspace_dir))
    print(f"Processing workspace as repository: {repo_name}")
    
    all_chunks = []
    for file in scan_workspace(workspace_dir):
        if file.endswith('.py'):
            chunks = chunk_python_by_functions_and_classes(file)
            all_chunks.extend(chunks)
    print(f"Total chunks to embed: {len(all_chunks)}")
    embeddings = []
    for c in tqdm(all_chunks, desc="Embedding chunks"):
        emb = await get_embedding(c["content"])
        embeddings.append(emb)
    
    if len(all_chunks) != len(embeddings):
        print(f"ERROR: Number of chunks ({len(all_chunks)}) does not match number of embeddings ({len(embeddings)}).")
        print("Aborting insertion.")
        return
    inserted = insert_chunks(all_chunks, embeddings, repo_name)
    print(f"Inserted into ChromaDB (repository: {repo_name}).")
    print("Collection count after insert:", len(inserted["ids"]))

if __name__ == "__main__":
    import sys
    if len(sys.argv) == 2:
        arg = sys.argv[1]
        if arg.endswith('.py'):
            asyncio.run(process_file(arg))
            exit(0)
        else:
            workspace_dir = arg
    elif WORKSPACE_DIR:
        workspace_dir = WORKSPACE_DIR
    else:
        print("Usage: python main.py <workspace_dir|file.py> or set WORKSPACE_DIR in your environment/config.py")
        exit(1)
    asyncio.run(process_workspace(workspace_dir))
