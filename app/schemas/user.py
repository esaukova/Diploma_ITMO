from pydantic import BaseModel
from datetime import datetime


class UserBase(BaseModel):
    username: str
    role: str


class UserResponse(UserBase):

    id: int

    created_at: datetime

    last_login: datetime

    class Config:
        orm_mode = True