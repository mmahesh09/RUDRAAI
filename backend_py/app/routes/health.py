from fastapi import APIRouter
from app.services.vector_store import get_qdrant
from app.config import get_settings
from app.database import engine
import httpx

router = APIRouter()
settings = get_settings()


@router.get("/health")
async def health():
    status = {"api": "ok", "database": "unknown", "qdrant": "unknown"}

    try:
        async with engine.connect() as conn:
            await conn.execute(__import__("sqlalchemy", fromlist=["text"]).text("SELECT 1"))
        status["database"] = "ok"
    except Exception as e:
        status["database"] = f"error: {e}"

    try:
        client = get_qdrant()
        await client.get_collections()
        status["qdrant"] = "ok"
    except Exception as e:
        status["qdrant"] = f"error: {e}"

    overall = "ok" if all(v == "ok" for v in status.values()) else "degraded"
    return {"status": overall, "checks": status}
