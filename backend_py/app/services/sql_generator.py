import httpx
from app.config import get_settings
from app.services.embeddings import get_embedding
from app.services.vector_store import search
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text

settings = get_settings()
_LLM_URL = "https://openrouter.ai/api/v1/chat/completions"


async def _build_schema_context(db: AsyncSession, product_id: int) -> str:
    result = await db.execute(
        text(
            "SELECT table_name, column_name, data_type, description, constraints "
            "FROM product_columns WHERE product_id = :pid ORDER BY table_name, column_name"
        ),
        {"pid": product_id},
    )
    rows = result.fetchall()
    if not rows:
        return "No schema information available."

    tables: dict[str, list[str]] = {}
    for row in rows:
        col_desc = f"  {row.column_name} {row.data_type}"
        if row.constraints:
            col_desc += f" ({row.constraints})"
        if row.description:
            col_desc += f" -- {row.description}"
        tables.setdefault(row.table_name, []).append(col_desc)

    lines = []
    for tbl, cols in tables.items():
        lines.append(f"Table: {tbl}")
        lines.extend(cols)
        lines.append("")
    return "\n".join(lines)


async def generate_sql(db: AsyncSession, product_id: int, question: str) -> tuple[str, str]:
    schema_context = await _build_schema_context(db, product_id)

    messages = [
        {
            "role": "system",
            "content": (
                f"You are a SQL expert for a banking data platform (Product {product_id}). "
                "Given a business question, generate a valid PostgreSQL SELECT query. "
                "Only use tables and columns from the schema provided. "
                "Return your answer in this exact format:\n"
                "SQL:\n<the sql query>\n\nEXPLANATION:\n<1-3 sentences explaining what the query does>"
                f"\n\nDatabase Schema:\n{schema_context}"
            ),
        },
        {"role": "user", "content": question},
    ]

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
                "max_tokens": 600,
                "temperature": 0.1,
            },
        )
        resp.raise_for_status()

    raw = resp.json()["choices"][0]["message"]["content"].strip()

    sql = ""
    explanation = ""
    if "SQL:" in raw and "EXPLANATION:" in raw:
        parts = raw.split("EXPLANATION:")
        sql = parts[0].replace("SQL:", "").strip()
        explanation = parts[1].strip()
    else:
        sql = raw
        explanation = "Generated SQL query based on your question."

    return sql, explanation
