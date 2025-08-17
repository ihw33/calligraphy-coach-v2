from fastapi import APIRouter

router = APIRouter()

@router.post("/analysis/test")
def analysis_test():
    return {"message": "analysis test"}
