from fastapi import APIRouter
from app.ldap.ldap_client import search_users

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/search")
def search(query: str):
    return search_users(query)