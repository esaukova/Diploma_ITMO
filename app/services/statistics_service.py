def calc_hours(log):
    if not log.start_time or not log.end_time:
        return 0
    return (log.end_time - log.start_time).total_seconds() / 3600


def stats(db, user_id):
    logs = db.query(WorkLog).filter_by(user_id=user_id).all()

    return {
        "days": len(logs),
        "hours": sum(calc_hours(l) for l in logs)
    }