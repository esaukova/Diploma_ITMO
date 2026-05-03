from sqlalchemy import Column, Integer, String, Date
from app.db.session import Base

class WorkLog(Base):
    __tablename__ = "work_logs"

    id = Column(Integer, primary_key=True)
    user_id = Column(String(255))   # 🔥 ВАЖНО
    work_date = Column(Date)
    status = Column(String(50))