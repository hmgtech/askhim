from pydantic import BaseModel
from typing import Optional, List, Dict

class QueryResponse(BaseModel):
    """Response model for query results"""
    answer: str
    repository: Optional[str] = None
    execution_time: float

class IngestStatus(BaseModel):
    """Response model for ingestion status"""
    status: str  # "started", "processing", "completed", "error"
    repository: Optional[str] = None
    message: str
    timestamp: float

class TemplateInfo(BaseModel):
    """Response model for template information"""
    name: str
    path: str

class TemplateListResponse(BaseModel):
    """Response model for template listing"""
    templates: List[TemplateInfo]

class TemplateContentResponse(BaseModel):
    """Response model for template content"""
    name: str
    content: str

class RepositoryListResponse(BaseModel):
    """Response model for repository listing"""
    repositories: List[str]
