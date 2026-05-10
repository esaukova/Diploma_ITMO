from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.ldap.ldap_client import authenticate
from app.core.security import create_token

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
def login(data: LoginRequest):

    user = authenticate(
        data.username,
        data.password
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = create_token(user)

    return {
        "access_token": token,
        "role": user["role"]
    }