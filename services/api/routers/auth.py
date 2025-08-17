from fastapi import APIRouter
from ..models.user import User

router = APIRouter()

@router.post("/auth/register")
def register(user: User):
    return {"message": f"User {user.username} registered"}

@router.post("/auth/login")
def login():
    return {"message": "login"}
