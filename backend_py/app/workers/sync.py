"""
Background sync worker: polls PostgreSQL every N seconds for new/updated rows
in product_columns and glossary_entries, generates embeddings, and upserts into Qdrant.
Uses APScheduler so it runs inside the FastAPI process without a separate service.
"""
import logging
import hashlib
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy import text
from app.database import AsyncSessionLocal
from app.services.embeddings import get_embedding
from app.services.vector_store import upsert_point, ensure_collection
from app.config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)
scheduler = AsyncIOScheduler()


def _make_point_id(prefix: str, row_id: int) -> str:
    """Deterministic UUID-compatible point ID from row identity."""
    raw = f"{prefix}:{row_id}"
    return hashlib.md5(raw.encode()).hexdigest()


async def sync_columns() -> None:
    try:
        async with AsyncSessionLocal() as db:
            result = await db.execute(
                text(
                    "SELECT id, product_id, table_name, column_name, data_type, "
                    "description, example_value, business_meaning, constraints, is_sensitive "
                    "FROM product_columns ORDER BY updated_at DESC LIMIT 200"
                )
            )
            rows = result.fetchall()

        for row in rows:
            content = (
                f"Column: {row.column_name} | Table: {row.table_name} | "
                f"Type: {row.data_type} | Description: {row.description} | "
                f"Business meaning: {row.business_meaning} | "
                f"Example: {row.example_value} | Constraints: {row.constraints} | "
                f"Sensitive: {row.is_sensitive}"
            )
            vector = await get_embedding(content)
            await upsert_point(
                point_id=_make_point_id("col", row.id),
                vector=vector,
                product_id=row.product_id,
                content=content,
                content_type="column",
                table_name=row.table_name,
                column_name=row.column_name,
            )
        if rows:
            logger.info("sync_columns: synced %d rows", len(rows))
    except Exception as exc:
        logger.error("sync_columns failed: %s", exc)


async def sync_glossary() -> None:
    try:
        async with AsyncSessionLocal() as db:
            result = await db.execute(
                text(
                    "SELECT id, product_id, term, definition, related_fields "
                    "FROM glossary_entries ORDER BY updated_at DESC LIMIT 200"
                )
            )
            rows = result.fetchall()

        for row in rows:
            content = (
                f"Term: {row.term} | Definition: {row.definition} | "
                f"Related fields: {row.related_fields}"
            )
            vector = await get_embedding(content)
            await upsert_point(
                point_id=_make_point_id("gls", row.id),
                vector=vector,
                product_id=row.product_id,
                content=content,
                content_type="glossary",
            )
        if rows:
            logger.info("sync_glossary: synced %d rows", len(rows))
    except Exception as exc:
        logger.error("sync_glossary failed: %s", exc)


async def sync_blogs() -> None:
    try:
        async with AsyncSessionLocal() as db:
            result = await db.execute(
                text(
                    "SELECT id, product_id, title, content "
                    "FROM blogs ORDER BY published_at DESC LIMIT 50"
                )
            )
            rows = result.fetchall()

        for row in rows:
            content = f"Blog: {row.title}\n{row.content[:1000]}"
            vector = await get_embedding(content)
            await upsert_point(
                point_id=_make_point_id("blog", row.id),
                vector=vector,
                product_id=row.product_id,
                content=content,
                content_type="blog",
            )
        if rows:
            logger.info("sync_blogs: synced %d rows", len(rows))
    except Exception as exc:
        logger.error("sync_blogs failed: %s", exc)


async def run_full_sync() -> None:
    await ensure_collection()
    await sync_columns()
    await sync_glossary()
    await sync_blogs()


def start_scheduler() -> None:
    scheduler.add_job(run_full_sync, "interval", seconds=settings.sync_interval_seconds, id="full_sync")
    scheduler.start()
    logger.info("Background sync started (interval=%ss)", settings.sync_interval_seconds)


def stop_scheduler() -> None:
    scheduler.shutdown(wait=False)
