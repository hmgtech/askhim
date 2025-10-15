from config import EMBEDDING_DIM
import chromadb
import numpy as np
import os
import hashlib

# Always use project-root-relative chroma_data directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROMA_DATA_DIR = os.path.join(BASE_DIR, "chroma_data")

print("ChromaDB persist_directory:", CHROMA_DATA_DIR)
os.makedirs(CHROMA_DATA_DIR, exist_ok=True)
if not os.access(CHROMA_DATA_DIR, os.W_OK):
    raise PermissionError(f"Cannot write to ChromaDB persist_directory: {CHROMA_DATA_DIR}")

client = chromadb.PersistentClient(path=CHROMA_DATA_DIR)
DEFAULT_COLLECTION_NAME = "code_chunks"

def get_collection_name(repo_name=None):
    """Generate a collection name based on the repository name"""
    if not repo_name:
        return DEFAULT_COLLECTION_NAME
    
    # Use hash to ensure collection name is valid regardless of repo name format
    # Prefix with 'repo_' to make it clear this is a repository collection
    hashed = hashlib.md5(repo_name.encode()).hexdigest()[:10]
    return f"repo_{hashed}_{os.path.basename(repo_name)}"

def get_collection(repo_name=None):
    """Get or create a collection for the specified repository"""
    collection_name = get_collection_name(repo_name)
    try:
        collection = client.get_collection(name=collection_name)
        # print(f"Using existing collection: {collection_name}")
    except Exception:
        collection = client.create_collection(name=collection_name)
        print(f"Created new collection: {collection_name}")
    return collection

def insert_chunks(chunks, embeddings, repo_name=None):
    collection = get_collection(repo_name)
    ids = [f"{c['file']}:{c['start_line']}" for c in chunks]
    metadatas = [
        {
            "file": c["file"],
            "start_line": c["start_line"],
            "type": c.get("type") or "",
            "name": c.get("name") or ""
        }
        for c in chunks
    ]
    documents = [c["content"] for c in chunks]
    collection.add(
        ids=ids,
        embeddings=embeddings,
        metadatas=metadatas,
        documents=documents
    )
    return {
        "ids": ids,
        "metadatas": metadatas,
        "documents": documents
    }

def semantic_search(query_embedding, top_k=5, repo_name=None):
    collection = get_collection(repo_name)
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        include=["metadatas", "documents", "distances"]
    )
    hits = []
    for i in range(len(results["ids"][0])):
        meta = results["metadatas"][0][i]
        hits.append({
            "file": meta.get("file"),
            "start_line": meta.get("start_line"),
            "content": results["documents"][0][i],
            "type": meta.get("type"),
            "name": meta.get("name"),
            "distance": results["distances"][0][i]
        })
    return hits
