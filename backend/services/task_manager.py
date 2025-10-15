import time
from typing import Dict, Any

# In-memory store for task status
task_statuses = {}

def create_task(task_type: str, repository_name: str, resource_path: str) -> str:
    """Create a new task and return its ID"""
    task_id = f"{task_type}_{int(time.time())}_{repository_name}"
    
    task_statuses[task_id] = {
        "status": "started",
        "repository": repository_name,
        "message": f"Started {task_type} of {resource_path}",
        "timestamp": time.time()
    }
    
    return task_id

def update_task_status(task_id: str, status: str, message: str) -> None:
    """Update the status of an existing task"""
    if task_id in task_statuses:
        task_statuses[task_id].update({
            "status": status,
            "message": message,
            "timestamp": time.time()
        })

def get_task_status(task_id: str) -> Dict[str, Any]:
    """Get the current status of a task"""
    return task_statuses.get(task_id)
