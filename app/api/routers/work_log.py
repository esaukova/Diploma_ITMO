from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.services.work_log_service import create_log
from app.db.session import SessionLocal

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/mark")
def mark(work_type: str, user=Depends(get_current_user), db=Depends(get_db)):
    return create_log(db, user["sub"], work_type)