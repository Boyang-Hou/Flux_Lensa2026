import os

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "your-api-key-here")
OPENAI_BASE_URL = os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1")

OPENAI_MODEL_RECOGNIZE = os.environ.get("OPENAI_MODEL_RECOGNIZE", "gpt-4o")
OPENAI_MODEL_ANNOTATE = os.environ.get("OPENAI_MODEL_ANNOTATE", "gpt-image-2")

REDIS_HOST = os.environ.get("REDIS_HOST", "localhost")
REDIS_PORT = int(os.environ.get("REDIS_PORT", "6379"))
REDIS_DB = int(os.environ.get("REDIS_DB", "0"))
REDIS_VOCAB_KEY = os.environ.get("REDIS_VOCAB_KEY", "lensa:id_vocabulary:text")
REDIS_VOCAB_HASH_KEY = os.environ.get("REDIS_VOCAB_HASH_KEY", "lensa:id_vocabulary:hash")

VOCAB_PATH = os.environ.get("VOCAB_PATH", "./id_vocabulary.json")

HOST = os.environ.get("HOST", "0.0.0.0")
PORT = int(os.environ.get("PORT", "8000"))

CORS_ORIGINS = [
    origin.strip()
    for origin in os.environ.get("CORS_ORIGINS", "*").split(",")
    if origin.strip()
]
