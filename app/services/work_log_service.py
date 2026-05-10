from sqlalchemy.orm import joinedload

from app.models.work_log import WorkLog
from app.models.user import User


def create_log(
    db,
    username,
    work_type,
    work_date
):

    user = db.query(User).filter(
        User.username == username
    ).first()

    if not user:
        raise Exception("User not found")

    existing = db.query(WorkLog).filter(
        WorkLog.user_id == user.id,
        WorkLog.work_date == work_date
    ).first()

    if existing:
        existing.status = work_type

        db.commit()
        db.refresh(existing)

        return existing

    log = WorkLog(
        user_id=user.id,
        work_date=work_date,
        status=work_type
    )

    db.add(log)

    db.commit()
    db.refresh(log)

    return log


def get_user_logs(
    db,
    username
):

    user = db.query(User).filter(
        User.username == username
    ).first()

    if not user:
        return []

    return (
        db.query(WorkLog)
        .filter(
            WorkLog.user_id == user.id
        )
        .all()
    )


def get_all_logs(db):
    return (
        db.query(WorkLog)
        .options(
            joinedload(WorkLog.user)
        )
        .all()
    )