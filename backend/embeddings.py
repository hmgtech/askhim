import httpx
import json
import os
import requests
from config import EMBEDDING_API_URL

# This module provides functions to interact with an embedding API.
# It allows you to get embeddings for a single text or a list of texts.
# Make sure to set the EMBEDDING_API_URL in your config.py file.
MODEL_NAME = "nomic-ai/nomic-embed-text-v1.5"
CACHE_PATH = "./embedding_api_cache.log"

class ForwardedHTTPException(Exception):
    def __init__(self, source, forwarded_by, response):
        self.source = source
        self.forwarded_by = forwarded_by
        self.response = response
        super().__init__(f"ForwardedHTTPException from {source} by {forwarded_by}: {response.text}")

def get_embedding(text):
    payload = {
        "input": f"search_query: {text}",
        "model": MODEL_NAME,
        "input_type": "query"
    }
    resp = requests.post(EMBEDDING_API_URL, json=payload)
    response_body = resp.json()
    if "embeddings" in response_body:
        emb = response_body["embeddings"][0]
    elif "data" in response_body and response_body["data"]:
        emb = response_body["data"][0]["embedding"]
    else:
        raise KeyError(f"Embedding not found in response: {response_body}")
    return emb  # Should be a list of floats

def get_embeddings(list_of_texts):
    payload = {
        "input": [f"search_query: {t}" for t in list_of_texts],
        "model": MODEL_NAME,
        "input_type": "query"
    }
    resp = requests.post(EMBEDDING_API_URL, json=payload)
    response_body = resp.json()
    if "embeddings" in response_body:
        return response_body["embeddings"]
    elif "data" in response_body and response_body["data"]:
        return [item["embedding"] for item in response_body["data"]]
    else:
        raise KeyError(f"Embeddings not found in response: {response_body}")

async def get_embedding(text):
    payload = {
        "input": f"search_query: {text}",
        "model": MODEL_NAME,
        "input_type": "query"
    }
    async with httpx.AsyncClient(timeout=600) as client:
        response = await client.post(EMBEDDING_API_URL, json=payload)
        # print(response)
        if response.status_code != 200:
            print(f"Failed to get response from {EMBEDDING_API_URL}:", response.text)
            raise ForwardedHTTPException(
                source="get_embedding",
                forwarded_by="embeddings.get_embedding",
                response=response,
            )
        response_body = response.json()
        # with open(CACHE_PATH, "a") as f:
        #     f.write(json.dumps({"payload": payload, "response": response_body}) + "\n")
        if "embeddings" in response_body:
            emb = response_body["embeddings"][0]
        elif "data" in response_body and response_body["data"]:
            emb = response_body["data"][0]["embedding"]
        else:
            raise KeyError(f"Embedding not found in response: {response_body}")
        return emb

async def get_embeddings(list_of_texts):
    payload = {
        "input": [f"search_query: {t}" for t in list_of_texts],
        "model": MODEL_NAME,
        "input_type": "query"
    }
    async with httpx.AsyncClient(timeout=600) as client:
        response = await client.post(EMBEDDING_API_URL, json=payload)
        if response.status_code != 200:
            print(f"Failed to get response from {EMBEDDING_API_URL}:", response.text)
            raise ForwardedHTTPException(
                source="get_embeddings",
                forwarded_by="embeddings.get_embeddings",
                response=response,
            )
        response_body = response.json()
        # with open(CACHE_PATH, "a") as f:
        #     f.write(json.dumps({"payload": payload, "response": response_body}) + "\n")
        if "embeddings" in response_body:
            return response_body["embeddings"]
        elif "data" in response_body and response_body["data"]:
            return [item["embedding"] for item in response_body["data"]]
        else:
            raise KeyError(f"Embeddings not found in response: {response_body}")