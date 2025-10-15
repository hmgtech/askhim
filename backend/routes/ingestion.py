from fastapi import APIRouter, HTTPException, BackgroundTasks
import os
import time

from models.requests import IngestRequest, IngestFileRequest
from models.responses import IngestStatus
from ingest import process_workspace, process_file
from services.task_manager import create_task, update_task_status, get_task_status

router = APIRouter()

@router.post("/ingest/workspace", response_model=IngestStatus)
async def ingest_workspace(request: IngestRequest, background_tasks: BackgroundTasks):
    """
    Start ingesting a workspace in the background.
    """
    if not os.path.isdir(request.workspace_path):
        raise HTTPException(status_code=400, detail=f"Directory not found: {request.workspace_path}")
    
    repository_name = request.repository_name or os.path.basename(os.path.abspath(request.workspace_path))
    task_id = create_task("ingest", repository_name, request.workspace_path)
    
    # Add task to background
    background_tasks.add_task(
        _ingest_workspace_bg,
        request.workspace_path,
        repository_name,
        task_id
    )
    
    task_status = get_task_status(task_id)
    return IngestStatus(
        status=task_status["status"],
        repository=repository_name,
        message=task_status["message"],
        timestamp=task_status["timestamp"]
    )

@router.post("/ingest/file", response_model=IngestStatus)
async def ingest_file(request: IngestFileRequest, background_tasks: BackgroundTasks):
    """
    Ingest a single file in the background.
    """
    if not os.path.isfile(request.file_path):
        raise HTTPException(status_code=400, detail=f"File not found: {request.file_path}")
    
    repository_name = request.repository_name or os.path.basename(os.path.dirname(os.path.abspath(request.file_path)))
    task_id = create_task("ingest_file", repository_name, request.file_path)
    
    # Add task to background
    background_tasks.add_task(
        _ingest_file_bg,
        request.file_path,
        repository_name,
        task_id
    )
    
    task_status = get_task_status(task_id)
    return IngestStatus(
        status=task_status["status"],
        repository=repository_name,
        message=task_status["message"],
        timestamp=task_status["timestamp"]
    )

@router.get("/ingest/status/{task_id}", response_model=IngestStatus)
async def get_ingestion_status(task_id: str):
    """
    Get the status of an ingestion task.
    """
    task_status = get_task_status(task_id)
    if not task_status:
        raise HTTPException(status_code=404, detail=f"Task ID not found: {task_id}")
    
    return IngestStatus(
        status=task_status["status"],
        repository=task_status.get("repository"),
        message=task_status["message"],
        timestamp=task_status["timestamp"]
    )

# Background task functions
async def _ingest_workspace_bg(workspace_path: str, repository_name: str, task_id: str):
    """Background task for workspace ingestion"""
    try:
        update_task_status(task_id, "processing", f"Processing workspace: {workspace_path}")
        
        await process_workspace(workspace_path)
        
        update_task_status(task_id, "completed", f"Successfully ingested {repository_name}")
    except Exception as e:
        update_task_status(task_id, "error", f"Error ingesting workspace: {str(e)}")

async def _ingest_file_bg(file_path: str, repository_name: str, task_id: str):
    """Background task for file ingestion"""
    try:
        update_task_status(task_id, "processing", f"Processing file: {file_path}")
        
        await process_file(file_path, repository_name)
        
        update_task_status(task_id, "completed", f"Successfully ingested file into {repository_name}")
    except Exception as e:
        update_task_status(task_id, "error", f"Error ingesting file: {str(e)}")
