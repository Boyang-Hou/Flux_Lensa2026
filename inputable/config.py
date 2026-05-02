import os

IMAGE_DIR = os.getenv("IMAGE_DIR", "images")
ANKI_DIR = os.getenv("ANKI_DIR", "anki")
BASE_URL = os.getenv("BASE_URL", "http://localhost:7860")

HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "7860"))

CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173",
    ).split(",")
    if origin.strip()
]

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./app.db")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = int(os.getenv("ACCESS_TOKEN_EXPIRE_HOURS", "168"))

DEMO_DIR = os.getenv("DEMO_DIR", "demo")
DEMO_RENDER_DELAY = float(os.getenv("DEMO_RENDER_DELAY", "1.5"))
DEMO_MODE = os.getenv("DEMO_MODE", "false").lower() == "true"

DEMO_USER_EMAIL = os.getenv("DEMO_USER_EMAIL", "demo@lensa.example.com")
DEMO_USER_PASSWORD = os.getenv("DEMO_USER_PASSWORD", "123456")

VOCAB_PATH = os.getenv("VOCAB_PATH", os.path.join("data", "id_vocabulary.json"))
