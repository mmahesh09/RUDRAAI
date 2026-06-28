from qdrant_client import AsyncQdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
)
from app.config import get_settings
import uuid

settings = get_settings()
_client: AsyncQdrantClient | None = None
VECTOR_SIZE = 1536


def get_qdrant() -> AsyncQdrantClient:
    global _client
    if _client is None:
        _client = AsyncQdrantClient(url=settings.qdrant_url, api_key=settings.qdrant_api_key)
    return _client


async def ensure_collection() -> None:
    client = get_qdrant()
    collections = await client.get_collections()
    names = [c.name for c in collections.collections]
    if settings.qdrant_collection not in names:
        await client.create_collection(
            collection_name=settings.qdrant_collection,
            vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE),
        )


async def upsert_point(
    point_id: str,
    vector: list[float],
    product_id: int,
    content: str,
    content_type: str,
    table_name: str = "",
    column_name: str = "",
) -> None:
    client = get_qdrant()
    await client.upsert(
        collection_name=settings.qdrant_collection,
        points=[
            PointStruct(
                id=point_id,
                vector=vector,
                payload={
                    "product_id": product_id,
                    "content": content,
                    "content_type": content_type,
                    "table_name": table_name,
                    "column_name": column_name,
                },
            )
        ],
    )


async def search(
    vector: list[float],
    product_id: int,
    limit: int = 5,
) -> list[dict]:
    client = get_qdrant()
    results = await client.search(
        collection_name=settings.qdrant_collection,
        query_vector=vector,
        query_filter=Filter(
            must=[FieldCondition(key="product_id", match=MatchValue(value=product_id))]
        ),
        limit=limit,
        with_payload=True,
    )
    return [
        {
            "content": r.payload.get("content", ""),
            "score": r.score,
            "content_type": r.payload.get("content_type", ""),
            "table_name": r.payload.get("table_name", ""),
            "column_name": r.payload.get("column_name", ""),
        }
        for r in results
    ]
