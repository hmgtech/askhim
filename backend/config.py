from dotenv import load_dotenv
import os

load_dotenv()

WORKSPACE_DIR = os.getenv("WORKSPACE_DIR")
EMBEDDING_API_URL = os.getenv("EMBEDDING_API_URL")
LLM_API_URL = os.getenv("LLM_API_URL")
EMBEDDING_DIM = int(os.getenv("EMBEDDING_DIM", 768))
