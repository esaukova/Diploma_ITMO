from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime
)
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    username = Column(
        String(255),
        unique=True,
        nullable=False
    )

    role = Column(
        String(50)
    )

    created_at = Column(
        DateTime,
        default=datetime.now
    )

    last_login = Column(
        DateTime,
        default=datetime.now
    )

    logs = relationship(
        "WorkLog",
        back_populates="user"
    )