from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.product import Product, ProductTable, ProductColumn, GlossaryEntry, Blog, ProductSchema
from app.schemas.product import (
    ProductOut, ProductTableOut, ProductColumnOut,
    GlossaryEntryOut, BlogOut, ProductSchemaOut,
)

router = APIRouter(prefix="/api/products", tags=["products"])


async def _get_product_or_404(product_id: int, db: AsyncSession) -> Product:
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail=f"Product {product_id} not found")
    return product


@router.get("", response_model=list[ProductOut])
async def list_products(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).order_by(Product.id))
    return result.scalars().all()


@router.get("/{product_id}", response_model=ProductOut)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    return await _get_product_or_404(product_id, db)


@router.get("/{product_id}/tables", response_model=list[ProductTableOut])
async def get_tables(product_id: int, db: AsyncSession = Depends(get_db)):
    await _get_product_or_404(product_id, db)
    result = await db.execute(
        select(ProductTable)
        .where(ProductTable.product_id == product_id)
        .order_by(ProductTable.table_name)
    )
    return result.scalars().all()


@router.get("/{product_id}/columns", response_model=list[ProductColumnOut])
async def get_columns(product_id: int, table: str | None = None, db: AsyncSession = Depends(get_db)):
    await _get_product_or_404(product_id, db)
    query = select(ProductColumn).where(ProductColumn.product_id == product_id)
    if table:
        query = query.where(ProductColumn.table_name == table)
    result = await db.execute(query.order_by(ProductColumn.table_name, ProductColumn.column_name))
    return result.scalars().all()


@router.get("/{product_id}/glossary", response_model=list[GlossaryEntryOut])
async def get_glossary(product_id: int, db: AsyncSession = Depends(get_db)):
    await _get_product_or_404(product_id, db)
    result = await db.execute(
        select(GlossaryEntry)
        .where(GlossaryEntry.product_id == product_id)
        .order_by(GlossaryEntry.term)
    )
    return result.scalars().all()


@router.get("/{product_id}/blogs", response_model=list[BlogOut])
async def get_blogs(product_id: int, db: AsyncSession = Depends(get_db)):
    await _get_product_or_404(product_id, db)
    result = await db.execute(
        select(Blog)
        .where(Blog.product_id == product_id)
        .order_by(Blog.published_at.desc())
    )
    return result.scalars().all()


@router.get("/{product_id}/schemas", response_model=list[ProductSchemaOut])
async def get_schemas(product_id: int, db: AsyncSession = Depends(get_db)):
    await _get_product_or_404(product_id, db)
    result = await db.execute(
        select(ProductSchema).where(ProductSchema.product_id == product_id)
    )
    return result.scalars().all()
