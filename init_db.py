import os
import time
import fdb

from app.db.base import Base
from app.db.session import engine

# импорт моделей ОБЯЗАТЕЛЕН
from app.models.user import User
from app.models.work_log import WorkLog

DB_PATH = "/firebird/data/db.fdb"

fdb.load_api(
    "/usr/lib/x86_64-linux-gnu/libfbclient.so.2"
)


def wait_for_firebird():
    print("Waiting for Firebird...")
    time.sleep(10)


def create_database_if_not_exists():

    if os.path.exists(DB_PATH):
        print("Database already exists")
        return

    print("Creating Firebird database...")

    fdb.create_database(
        dsn=f"firebird/3050:{DB_PATH}",
        user="sysdba",
        password="masterkey"
    )

    print("Database created")


def create_tables():
    print("🔥 Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created")


if __name__ == "__main__":
    wait_for_firebird()
    create_database_if_not_exists()
    create_tables()