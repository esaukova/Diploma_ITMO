from fastapi import APIRouter, HTTPException
from app.ldap.ldap_client import authenticate
from app.core.security import create_token

router = APIRouter()


@router.post("/login")
def login(username: str, password: str):
    user = authenticate(username, password)

    if not user:
        raise HTTPException(401)

    token = create_token(user)

    return {"access_token": token}