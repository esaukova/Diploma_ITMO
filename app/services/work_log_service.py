from datetime import date
from app.models.work_log import WorkLog


def create_log(
    db,
    username,
    work_type,
    work_date
):
    """
    Создать или обновить запись о работе за конкретную дату
    """

    # 🔍 проверяем, есть ли уже запись на эту дату
    existing = db.query(WorkLog).filter(
        WorkLog.user_id == username,
        WorkLog.work_date == work_date
    ).first()

    # 🔁 если запись уже есть — обновляем статус
    if existing:
        existing.status = work_type

        db.commit()
        db.refresh(existing)

        return existing

    # 🆕 создаём новую запись
    log = WorkLog(
        user_id=username,
        work_date=work_date,
        status=work_type
    )

    db.add(log)

    db.commit()
    db.refresh(log)

    return log


def get_user_logs(db, username):
    """
    Получить все записи конкретного пользователя
    """

    return db.query(WorkLog).filter(
        WorkLog.user_id == username
    ).all()


def get_all_logs(db):
    """
    Получить все записи (для менеджера)
    """

    return db.query(WorkLog).all()