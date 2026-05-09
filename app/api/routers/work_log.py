from fastapi import APIRouter, Depends
from jose import jwt
from sqlalchemy.orm import Session

from app.api.deps import oauth2_scheme
from app.core.security import ALGORITHM, SECRET_KEY
from app.db.session import get_db
from app.models.user import User
from app.services import work_log_service
from app.services.work_log_service import create_log, get_user_logs, get_all_logs
from datetime import date

router = APIRouter(
    prefix="/work-log",
    tags=["Work Log"]
)

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

    username = payload.get("sub")

    return User(username=username)

@router.post("/mark")
def mark_work_log(
    work_type: str,
    work_date: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return work_log_service.create_log(
        db,
        current_user.username,
        work_type,
        work_date
    )

@router.get("/my")
def get_my_logs(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return work_log_service.get_user_logs(
        db,
        current_user.username
    )

@router.get("/all")
def get_all(db: Session = Depends(get_db)):
    return get_all_logs(db)