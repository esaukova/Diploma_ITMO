from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime

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

    password_hash = Column(
        String(255),
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    last_login = Column(
        DateTime,
        default=datetime.utcnow
    )

    last_sync = Column(
        DateTime,
        nullable=True
    )

    logs = relationship(
        "WorkLog",
        back_populates="user"
    )