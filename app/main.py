from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import auth, work_log, statistics

app = FastAPI(title="Remote Work Tracker")

# 🔥 CORS — обязательно для React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # для диплома ок
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth")
app.include_router(work_log.router, prefix="/work-log")
app.include_router(statistics.router, prefix="/stats")