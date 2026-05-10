from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    ForeignKey
)

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
        String(255),
        ForeignKey("users.username")
    )

    work_date = Column(Date)

    status = Column(String(50))

    user = relationship(
        "User",
        back_populates="logs"
    )