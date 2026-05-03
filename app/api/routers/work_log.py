from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.work_log_service import create_log, get_user_logs, get_all_logs
from datetime import date

router = APIRouter(prefix="/work-log")

# заглушка пользователя (потом заменим на JWT)
def get_current_user():
    return {"sub": "esaukova"}

@router.post("/mark")
def mark(
    work_type: str,
    date: str,   # 🔥 принимаем дату
    db: Session = Depends(get_db)
):
    user = get_current_user()
    return create_log(db, user["sub"], work_type, date)

@router.get("/my")
def get_my_logs(db: Session = Depends(get_db)):
    user = get_current_user()
    return get_user_logs(db, user["sub"])

@router.get("/all")
def get_all(db: Session = Depends(get_db)):
    return get_all_logs(db)