from fastapi import APIRouter
import requests

router = APIRouter()

@router.post("/ollama/test")
def ollama_test():
    try:
        response = requests.get("http://localhost:11434")
        response.raise_for_status()
        return {"message": "Ollama API is running"}
    except requests.exceptions.RequestException as e:
        return {"message": f"Ollama API is not running: {e}"}
