from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.product import Product
from app.schemas.chat import ChatRequest, ChatResponse, SqlGenRequest, SqlGenResponse, RagSearchRequest, RagSearchResult
from app.services.rag import answer
from app.services.sql_generator import generate_sql
from app.services.embeddings import get_embedding
from app.services.vector_store import search

router = APIRouter(prefix="/api/products", tags=["ai"])


async def _require_product(product_id: int, db: AsyncSession) -> None:
    result = await db.execute(select(Product).where(Product.id == product_id))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail=f"Product {product_id} not found")


@router.post("/{product_id}/chat", response_model=ChatResponse)
async def product_chat(product_id: int, req: ChatRequest, db: AsyncSession = Depends(get_db)):
    await _require_product(product_id, db)
    reply, session_id = await answer(product_id, req.message, req.session_id)
    return ChatResponse(reply=reply, session_id=session_id, product_id=product_id)


@router.post("/{product_id}/sql-generate", response_model=SqlGenResponse)
async def product_sql_generate(product_id: int, req: SqlGenRequest, db: AsyncSession = Depends(get_db)):
    await _require_product(product_id, db)
    sql, explanation = await generate_sql(db, product_id, req.question)
    return SqlGenResponse(sql=sql, explanation=explanation, product_id=product_id)


@router.post("/{product_id}/rag/search", response_model=list[RagSearchResult])
async def product_rag_search(product_id: int, req: RagSearchRequest, db: AsyncSession = Depends(get_db)):
    await _require_product(product_id, db)
    limit = min(req.limit, 10)
    vector = await get_embedding(req.query)
    hits = await search(vector, product_id, limit=limit)
    return [RagSearchResult(**h) for h in hits]
