from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Date

from sqlalchemy import ForeignKey

from sqlalchemy.orm import relationship

from app.db.base import Base


class WorkLog(Base):

    __tablename__ = "work_logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    work_date = Column(
        Date
    )

    status = Column(
        String(50)
    )

    user = relationship(
        "User",
        back_populates="logs"
    )