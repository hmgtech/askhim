from fastapi import APIRouter, HTTPException

from models.responses import RepositoryListResponse

router = APIRouter()

@router.get("/repositories", response_model=RepositoryListResponse)
async def list_repositories():
    """
    List all repositories in the database.
    """
    try:
        from milvusdb import client
        collections = client.list_collections()
        repositories = []
        
        for collection in collections:
            collection_name = collection.name
            
            if collection_name.startswith("repo_"):
                # Extract the repository name from the collection name
                # The format is: repo_<hash>_<repository_name>
                parts = collection_name.split("_", 2)
                if len(parts) >= 3:
                    repositories.append(parts[2])
        
        return RepositoryListResponse(repositories=repositories)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing repositories: {str(e)}")
