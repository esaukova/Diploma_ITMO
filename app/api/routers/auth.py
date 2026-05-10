from datetime import datetime

from fastapi import (
    APIRouter,
    HTTPException,
    Depends
)

from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.ldap.ldap_client import authenticate

from app.db.session import get_db

from app.models.user import User

from app.core.security import (
    create_token,
    hash_password,
    verify_password
)

router = APIRouter(
    prefix="/auth"
)


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):

    try:

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
                role=ldap_user["role"],
                password_hash=hash_password(
                    data.password
                ),
                last_login=datetime.now(),
                last_sync=datetime.now()
            )

            db.add(user)

        else:

            user.role = ldap_user["role"]

            user.password_hash = hash_password(
                data.password
            )

            user.last_login = datetime.now()

            user.last_sync = datetime.now()

        db.commit()

        token = create_token({
            "username": user.username,
            "role": user.role
        })

        return {
            "access_token": token,
            "role": user.role,
            "auth_type": "ldap"
        }

    except Exception as ldap_error:

        print("LDAP unavailable:", ldap_error)

        user = db.query(User).filter(
            User.username == data.username
        ).first()

        if not user:
            raise HTTPException(
                status_code=401,
                detail="LDAP unavailable and user not cached"
            )

        if not verify_password(
            data.password,
            user.password_hash
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid credentials"
            )

        user.last_login = datetime.now()

        db.commit()

        token = create_token({
            "username": user.username,
            "role": user.role
        })

        return {
            "access_token": token,
            "role": user.role,
            "auth_type": "local_cache"
        }