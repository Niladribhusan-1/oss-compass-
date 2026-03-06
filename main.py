from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routes.profile import router as profile_router
from routes.recommend import router as recommend_router
from routes.mentor import router as mentor_router

load_dotenv()

app = FastAPI(
    title="OSS Compass API",
    description="AI-powered open source project recommender and code mentor",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://your-frontend.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(profile_router, prefix="/api/profile", tags=["Profile"])
app.include_router(recommend_router, prefix="/api/recommend", tags=["Recommend"])
app.include_router(mentor_router, prefix="/api/mentor", tags=["Mentor"])


@app.get("/")
def root():
    return {"message": "OSS Compass API is running 🚀", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "ok"}
