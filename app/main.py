from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers import work_log, auth
from app.api.routers import users

app = FastAPI()

# 🔥 CORS НАСТРОЙКА
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # 👉 на dev можно так
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(work_log.router)
app.include_router(users.router)