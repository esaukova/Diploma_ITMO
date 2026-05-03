from datetime import datetime
from app.models.work_log import WorkLog


def create_log(db, username, work_type, date_str):
    """
    Создать или обновить запись о работе за конкретную дату
    """

    # 🔥 преобразуем строку в дату
    work_date = datetime.strptime(date_str, "%Y-%m-%d").date()

    # 🔍 проверяем, есть ли уже запись на эту дату
    existing = db.query(WorkLog).filter(
        WorkLog.user_id == username,
        WorkLog.work_date == work_date
    ).first()

    # 🔁 если есть — обновляем
    if existing:
        existing.status = work_type
        db.commit()
        return existing

    # 🆕 если нет — создаём новую
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

def get_all_logs(db):
    return db.query(WorkLog).all()