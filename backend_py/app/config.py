from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    port: int = 8000
    log_level: str = "info"

    database_url: str
    qdrant_url: str
    qdrant_api_key: str
    qdrant_collection: str = "banking_knowledge"

    openrouter_api_key: str
    openrouter_embed_model: str = "openai/text-embedding-3-small"
    openrouter_llm_model: str = "meta-llama/llama-3.3-70b-instruct:free"

    internal_api_key: str = ""
    frontend_url: str = "http://localhost:3000"
    sync_interval_seconds: int = 60

    model_config = {"env_file": ".env", "extra": "ignore"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
