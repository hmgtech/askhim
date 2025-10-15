from milvusdb import collection
import os

print("ChromaDB persist directory:", os.path.abspath("./chroma_data"))

def show_chromadb_contents():
    # Only include valid keys: "documents", "metadatas"
    results = collection.get(include=["metadatas", "documents"])
    if not results["ids"]:
        print("ChromaDB collection is empty.")
        return
    for i in range(len(results["ids"])):
        print({
            "id": results["ids"][i],
            "file": results["metadatas"][i].get("file"),
            "start_line": results["metadatas"][i].get("start_line"),
            "type": results["metadatas"][i].get("type"),
            "name": results["metadatas"][i].get("name"),
            "content": results["documents"][i][:120] + "..."
        })

if __name__ == "__main__":
    show_chromadb_contents()
