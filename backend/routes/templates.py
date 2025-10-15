from fastapi import APIRouter, HTTPException
import os

from models.responses import TemplateListResponse, TemplateContentResponse, TemplateInfo
from rag_llm import load_prompt_template

router = APIRouter()

@router.get("/templates", response_model=TemplateListResponse)
async def list_templates():
    """
    List all available prompt templates.
    """
    prompts_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "prompts")
    templates = []
    
    if os.path.exists(prompts_dir):
        for file in os.listdir(prompts_dir):
            if file.endswith('.txt'):
                template_name = file[:-4]  # Remove .txt extension
                templates.append(TemplateInfo(
                    name=template_name,
                    path=os.path.join(prompts_dir, file)
                ))
                
    return TemplateListResponse(templates=templates)

@router.get("/template/{template_name}", response_model=TemplateContentResponse)
async def get_template(template_name: str):
    """
    Get the content of a specific template.
    """
    try:
        template_content = load_prompt_template(template_name)
        return TemplateContentResponse(name=template_name, content=template_content)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Template not found: {str(e)}")
