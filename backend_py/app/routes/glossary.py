from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.product import Product, GlossaryEntry
from app.schemas.product import GlossaryEntryOut

router = APIRouter(prefix="/api/glossary", tags=["glossary"])


@router.get("/{product_id}", response_model=list[GlossaryEntryOut])
async def get_glossary(product_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).where(Product.id == product_id))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail=f"Product {product_id} not found")

    result = await db.execute(
        select(GlossaryEntry)
        .where(GlossaryEntry.product_id == product_id)
        .order_by(GlossaryEntry.term)
    )
    return result.scalars().all()
