from pydantic import BaseModel, Field, validator
from typing import Optional

class QueryRequest(BaseModel):
    """Request model for querying the RAG system"""
    question: str
    repository: Optional[str] = None
    template_name: str = "code_qa_template"
    include_context: bool = False  # Define as bool type

    @validator('include_context', pre=True)
    def validate_include_context(cls, v):
        """
        Ensure include_context is properly converted to a boolean
        This handles various input formats (true/false, "true"/"false", 1/0)
        """
        if isinstance(v, bool):
            return v
        if isinstance(v, str):
            return v.lower() in ('true', 't', 'yes', 'y', '1')
        if isinstance(v, int):
            return v > 0
        return bool(v)

class IngestRequest(BaseModel):
    """Request model for ingesting a workspace"""
    workspace_path: str
    repository_name: Optional[str] = None

class IngestFileRequest(BaseModel):
    """Request model for ingesting a single file"""
    file_path: str
    repository_name: Optional[str] = None
