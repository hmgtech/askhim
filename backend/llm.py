import requests
from config import LLM_API_URL

# This module provides functions to interact with a Large Language Model (LLM) API.
# It allows you to ask questions and get answers based on provided code contexts.
# Make sure to set the LLM_API_URL in your config.py file.
def ask_llm(question, code_contexts):
    context_text = "\n\n".join(code_contexts)
    resp = requests.post(LLM_API_URL, json={
        "question": question,
        "context": context_text
    })
    return resp.json()["answer"]