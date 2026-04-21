from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from datetime import datetime
from app.db.base import Base


class WorkLog(Base):
    __tablename__ = "work_logs"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    work_type = Column(String)
    work_date = Column(Date)

    start_time = Column(DateTime)
    end_time = Column(DateTime)