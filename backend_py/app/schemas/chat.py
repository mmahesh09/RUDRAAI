from pydantic import BaseModel
from typing import Optional


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    reply: str
    session_id: str
    product_id: int


class SqlGenRequest(BaseModel):
    question: str


class SqlGenResponse(BaseModel):
    sql: str
    explanation: str
    product_id: int


class RagSearchRequest(BaseModel):
    query: str
    limit: int = 5


class RagSearchResult(BaseModel):
    content: str
    score: float
    content_type: str
    table_name: Optional[str] = None
    column_name: Optional[str] = None
