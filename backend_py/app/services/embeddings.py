import httpx
from app.config import get_settings

settings = get_settings()
_EMBED_URL = "https://openrouter.ai/api/v1/embeddings"


async def get_embedding(text: str) -> list[float]:
    """Return a 1536-dim embedding vector from OpenRouter."""
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            _EMBED_URL,
            headers={
                "Authorization": f"Bearer {settings.openrouter_api_key}",
                "Content-Type": "application/json",
            },
            json={"model": settings.openrouter_embed_model, "input": text},
        )
        resp.raise_for_status()
        return resp.json()["data"][0]["embedding"]
