# AskHim

An LLM-powered codebase assistant backend that indexes your project files, stores embeddings using ChromaDB (local, persistent), and answers codebase questions via semantic search and remote LLM APIs.

---

## Demo Video

Watch the demo video to see Ask Him in action:

[![Watch the video](media\screenshot.png)](askhim.mp4)

---

## ✨ Architecture

- **ChromaDB (local persistent):** Stores your code/code-chunk embeddings and supports fast semantic search.
- **Remote Embedding API:** Converts code or queries to embedding vectors.
- **Remote LLM API:** Turns a question + code context into a plain-language answer.
- **FastAPI:** Orchestrates file scanning, embedding, search, and LLM interaction.

---

## 🚀 Quickstart

### 1. Clone and Set Up

#### Backend

```sh
git clone <your-repo-url>
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Or install manually:
pip install fastapi uvicorn chromadb httpx tqdm python-dotenv

```

#### LLM and Embedding Servers

The backend requires an LLM server and an embedding server. You can use [OLLAMA](https://ollama.com/) for both.

1. **Install OLLAMA**:
   - Follow the instructions at [https://ollama.com/](https://ollama.com/) to install and set up OLLAMA.

2. **Download Models**:
   - For embeddings, download a suitable embedding model (e.g., `text-embedding-ada-002`):
     ```sh
     ollama pull text-embedding-ada-002
     ```
   - For the LLM, download a suitable chat model (e.g., `llama2`):
     ```sh
     ollama pull llama2
     ```

3. **Start the Servers**:
   - Start the embedding server:
     ```sh
     ollama serve --model text-embedding-ada-002
     ```
   - Start the LLM server:
     ```sh
     ollama serve --model llama2
     ```

---

### 2. Build Language Grammars

The system uses Tree-sitter grammars to parse and chunk code. You need to build the language grammars before using the backend.

Supported languages:
- Python
- Bash
- Groovy
- TypeScript
- TSX

Make sure the following repositories are cloned in the project root:
- [tree-sitter-python](https://github.com/tree-sitter/tree-sitter-python.git)
- [tree-sitter-bash](https://github.com/tree-sitter/tree-sitter-bash.git)
- [tree-sitter-groovy](https://github.com/murtaza64/tree-sitter-groovy.git)
- [tree-sitter-typescript](https://github.com/tree-sitter/tree-sitter-typescript.git)

Run the following script to build the grammars:

```sh
python backend/clone.py
python backend/build_languages.py
```

This will generate a shared library (`my-languages.so`) in the `build/` directory.



---

### 3. Configure Settings

Create a `.env` file in the project root:

```ini
WORKSPACE_DIR=/path/to/your/codebase
EMBEDDING_API_URL=http://localhost:11434/v1/embeddings  # Replace with your embedding server URL
LLM_API_URL=http://localhost:11434/v1/chat/completions # Replace with your LLM server URL
EMBEDDING_DIM=768
```

---

### 4. Ingest Your Codebase

You can ingest a codebase using the command-line interface:

```sh
# Ingest a specific repository
python ingest.py /path/to/your/codebase

# Ingest a single file
python ingest.py /path/to/your/file.py
```

The system will:
1. Scan for code files
2. Split code into semantic chunks
3. Generate embeddings for each chunk
4. Store embeddings in ChromaDB

---

### 5. Using the FastAPI Service

Start the API server:

```sh
# Start with default settings
python -m uvicorn api:app --reload

# Specify host and port
python -m uvicorn api:app --host 0.0.0.0 --port 8000
```

Access the API documentation at [http://localhost:8000/docs](http://localhost:8000/docs).

#### API Endpoints:

**Query Endpoint:**
```sh
# Ask a question about a codebase
curl -X 'POST' \
  'http://localhost:8000/api/query/stream' \
  -H 'Content-Type: application/json' \
  -d '{
    "question": "How does authentication work?",
    "repository": "my_repo",
    "template_name": "code_qa_template"
  }'
```

**Ingest a Repository:**
```sh
# Start ingesting a workspace
curl -X 'POST' \
  'http://localhost:8000/ingest/workspace' \
  -H 'Content-Type: application/json' \
  -d '{
    "workspace_path": "/path/to/your/repo",
    "repository_name": "my_repo"
  }'
```

**Ingest a Single File:**
```sh
# Ingest a single file
curl -X 'POST' \
  'http://localhost:8000/ingest/file' \
  -H 'Content-Type: application/json' \
  -d '{
    "file_path": "/path/to/your/file.py",
    "repository_name": "my_repo"
  }'
```

**List Repositories:**
```sh
# List all repositories
curl -X 'GET' 'http://localhost:8000/repositories'
```

**List Prompt Templates:**
```sh
# List available prompt templates
curl -X 'GET' 'http://localhost:8000/templates'
```

---

## 📋 Prompt Templates

The system uses customizable prompt templates to guide LLM responses. Templates are stored in the `prompts/` directory.

### Default Template

The default template instructs the LLM to focus on the provided code context:

```
You are a senior software engineer who writes clean, scalable code and explains your reasoning.

Please answer the question based strictly on the provided code context.
...
```

### Custom Templates

Create your own templates in the `prompts/` directory with the `.txt` format:

1. First line: System role/instruction
2. Body: Instructions with placeholders `{context}` and `{question}`

---

## ⚙️ Project Structure

```
backend/        # Backend implementation
├── api.py              # FastAPI application
├── routes/             # API route modules
│   ├── query.py        # Query endpoints
│   ├── ingestion.py    # Ingestion endpoints
│   ├── templates.py    # Template endpoints
│   └── repositories.py # Repository endpoints
├── models/             # Pydantic models
│   ├── requests.py     # Request models
│   └── responses.py    # Response models
├── services/           # Business logic
│   └── task_manager.py # Background task management
├── rag_llm.py          # RAG implementation
├── ingest.py           # Codebase ingestion
├── milvusdb.py         # Database interaction
├── embeddings.py       # Embedding generation
├── chunker.py          # Code chunking logic
├── workspace.py        # Workspace scanning
└── prompts/            # LLM prompt templates
    └── code_qa_template.txt # Default template
cli/                    # Command-line interface
├── askhim              # Bash wrapper script
└── askhim_cli.py       # Python CLI implementation
```

---

## 🖥️ Chat Interface

The project includes a React-based chat interface for interacting with the AskHim system:

### Setting up the Frontend

```sh
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The chat interface will be available at [http://localhost:3000](http://localhost:3000).

### Features:
- Real-time streaming responses
- Code syntax highlighting 
- Repository selection
- Markdown rendering for rich responses
- Mobile-responsive design

### Docker Deployment

You can deploy both the frontend and backend using Docker:

```sh
# Build and start both services
docker-compose up -d

# Access the chat interface at http://localhost:3000
# Access the API at http://localhost:8000
```

---

## 🔧 Troubleshooting

### Streaming Issues

If you're experiencing problems with streaming responses:

1. **Check LLM API Configuration**: Make sure your LLM API supports streaming responses.
   
2. **Test with the Debug Tool**: Use the included test page to verify streaming works:
   ```
   # Start the API server
   python -m uvicorn api:app --reload
   
   # Open in browser
   http://localhost:8000/test_stream.html
   ```

3. **Inspect Network Traffic**: Use browser developer tools to check the network requests:
   - The response should have `Content-Type: text/event-stream`
   - You should see a flow of chunk data in the response

4. **Common Issues**:
   - **CORS**: Make sure CORS is properly configured if accessing from a different origin
   - **Buffering**: Some reverse proxies (like Nginx) buffer responses by default
   - **Timeouts**: Long-running requests might be terminated by proxies or load balancers

---

## 🔗 Customization

- **Embedding dimension:** Set `EMBEDDING_DIM` in your .env file.
- **Prompt templates:** Create custom templates in the `prompts/` directory.
- **Repository-specific queries:** Use the `-r` flag or repository parameter.
- **Chunk size/strategy:** Modify the chunking logic in `chunker.py`.

---

## 🧩 Advanced Features

- **Background processing:** Large repositories are processed in the background.
- **Multi-repository support:** Query across different codebases.
- **Status tracking:** Track ingestion progress for large repositories.
- **Custom prompt templates:** Tailor LLM responses for different use cases.

---

## 🧑‍💻 Contributing

- Fork the repo, make changes, submit PRs!
- Issues and feature requests welcome.

---

## 📝 License

Use it BRUH!!!!

---

## 🙋‍♂️ Contact

Maintainer: Hiteshkumar Gupta

---

Happy coding!
