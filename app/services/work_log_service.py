from datetime import date, datetime
from app.models.work_log import WorkLog


def create_log(db, user_id, work_type):
    existing = db.query(WorkLog).filter(
        WorkLog.user_id == user_id,
        WorkLog.work_date == date.today()
    ).first()

    if existing:
        raise Exception("Уже есть запись")

    log = WorkLog(
        user_id=user_id,
        work_type=work_type,
        work_date=date.today()
    )

    if work_type in ["OFFICE", "REMOTE"]:
        log.start_time = datetime.utcnow()

    db.add(log)
    db.commit()
    db.refresh(log)

    return log