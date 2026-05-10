from pydantic import BaseModel
from datetime import date, datetime


class WorkLogCreate(BaseModel):
    status: str


class WorkLogResponse(BaseModel):

    id: int

    user_id: str

    work_date: date

    status: str

    created_at: datetime

    class Config:
        orm_mode = True