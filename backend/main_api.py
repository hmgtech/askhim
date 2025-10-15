from fastapi import FastAPI, Query
from workspace import scan_workspace, chunk_file
from embeddings import get_embedding, get_embeddings
from milvusdb import insert_chunks, semantic_search
from llm import ask_llm
import os
from config import WORKSPACE_DIR

# This is the main FastAPI application for the Ask Him backend.
# It initializes the application, builds the index on startup,
# and provides an endpoint to ask questions based on code snippets.
# Make sure to set the WORKSPACE_DIR in your config.py file.
app = FastAPI()

@app.on_event("startup")
def build_index():
    # OPTIONAL: Only call this once or when files change!
    all_chunks = []
    for file in scan_workspace(WORKSPACE_DIR):
        all_chunks.extend(chunk_file(file))
    texts = [c['content'] for c in all_chunks]
    embeddings = get_embeddings(texts)
    insert_chunks(all_chunks, embeddings)

@app.get("/")
def root():
    return {"status": "ok"}

@app.post("/ask")
def ask(question: str = Query(...)):
    q_emb = get_embedding(question)
    results = semantic_search(q_emb, top_k=5)
    code_snippets = [r["content"] for r in results]
    answer = ask_llm(question, code_snippets)
    return {
        "answer": answer,
        "sources": [
            {"file": r["file"], "start_line": r["start_line"]}
            for r in results]
    }