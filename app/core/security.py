from datetime import datetime, timedelta
from jose import jwt

SECRET_KEY = "supersecret"
ALGORITHM = "HS256"


def create_token(user):
    payload = {
        "sub": user["username"],
        "role": user["role"],   # 🔥 ВАЖНО
        "exp": datetime.utcnow() + timedelta(hours=8)
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)