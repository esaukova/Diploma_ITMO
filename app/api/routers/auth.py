from fastapi import (
    APIRouter,
    HTTPException,
    Depends
)

from sqlalchemy.orm import Session

from pydantic import BaseModel

from datetime import datetime

from app.ldap.ldap_client import authenticate

from app.core.security import create_token

from app.db.session import get_db

from app.models.user import User


router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


class LoginRequest(BaseModel):

    username: str

    password: str


@router.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):

    ldap_user = authenticate(
        data.username,
        data.password
    )

    if not ldap_user:

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    user = db.query(User).filter(
        User.username == data.username
    ).first()

    if not user:

        user = User(
            username=data.username,
            role=ldap_user["role"]
        )

        db.add(user)

    user.last_login = datetime.utcnow()

    db.commit()

    db.refresh(user)

    token = create_token({
        "username": user.username,
        "role": user.role
    })

    return {
        "access_token": token,
        "role": user.role
    }