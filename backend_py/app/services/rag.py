import httpx
import uuid
from app.config import get_settings
from app.services.embeddings import get_embedding
from app.services.vector_store import search

settings = get_settings()
_LLM_URL = "https://openrouter.ai/api/v1/chat/completions"


async def _call_llm(messages: list[dict]) -> str:
    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(
            _LLM_URL,
            headers={
                "Authorization": f"Bearer {settings.openrouter_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": settings.openrouter_llm_model,
                "messages": messages,
                "max_tokens": 800,
                "temperature": 0.3,
            },
        )
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"].strip()


async def answer(product_id: int, question: str, session_id: str | None = None) -> tuple[str, str]:
    """RAG answer: embed question, retrieve context, ask LLM. Returns (reply, session_id)."""
    if not session_id:
        session_id = str(uuid.uuid4())

    vector = await get_embedding(question)
    hits = await search(vector, product_id, limit=5)

    context_parts = [f"[{h['content_type']}] {h['content']}" for h in hits]
    context = "\n\n".join(context_parts) if context_parts else "No relevant context found."

    messages = [
        {
            "role": "system",
            "content": (
                f"You are a banking data expert assistant for Product {product_id}. "
                "You ONLY answer questions about this product's tables, columns, glossary, schemas, and business meaning. "
                "Do NOT reveal data from any other product. "
                "Use the retrieved context below to answer precisely.\n\n"
                f"Context:\n{context}"
            ),
        },
        {"role": "user", "content": question},
    ]

    reply = await _call_llm(messages)
    return reply, session_id
