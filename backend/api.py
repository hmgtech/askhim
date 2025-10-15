from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import os
import uvicorn

from routes.query import router as query_router
from routes.ingestion import router as ingestion_router
from routes.templates import router as template_router
from routes.repositories import router as repository_router

# Initialize FastAPI app
app = FastAPI(
    title="AskHim API",
    description="API for code retrieval augmented generation and repository ingestion",
    version="0.1.0"
)

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
    expose_headers=["Content-Type", "Content-Length"]  # Expose headers needed for SSE
)

# Include routers for different features
app.include_router(query_router, prefix="/api", tags=["Query"])
app.include_router(ingestion_router, prefix="/api", tags=["Ingestion"])
app.include_router(template_router, prefix="/api", tags=["Templates"])
app.include_router(repository_router, prefix="/api", tags=["Repositories"])

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to AskHim API",
        "docs": "/docs",
        "redoc": "/redoc",
        "test_stream": "/test_stream.html"
    }

# Run the server if executed directly
if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
