import numpy as np
from milvusdb import semantic_search

# Example: create a dummy query embedding (replace with your real embedding)
# Make sure the embedding dimension matches EMBEDDING_DIM from your config
query_embedding = np.random.rand(768).tolist()  # Replace 768 with your EMBEDDING_DIM

# Perform semantic search
results = semantic_search(query_embedding, top_k=5,repo_name="full-stack-fastapi-template")

# Print the results
for hit in results:
    print(f"File: {hit['file']}, Line: {hit['start_line']}, Type: {hit['type']}, Name: {hit['name']}")
    print(f"Content: {hit['content']}")
    print(f"Distance: {hit['distance']}")
    print("-" * 40)
