from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ProductOut(BaseModel):
    id: int
    name: str
    description: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ProductTableOut(BaseModel):
    id: int
    product_id: int
    table_name: str
    description: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ProductColumnOut(BaseModel):
    id: int
    product_id: int
    table_name: str
    column_name: str
    data_type: str
    description: str
    example_value: str
    constraints: str
    is_sensitive: bool
    business_meaning: str

    model_config = {"from_attributes": True}


class GlossaryEntryOut(BaseModel):
    id: int
    product_id: int
    term: str
    definition: str
    related_fields: str

    model_config = {"from_attributes": True}


class BlogOut(BaseModel):
    id: int
    product_id: int
    title: str
    slug: str
    content: str
    published_at: datetime

    model_config = {"from_attributes": True}


class ProductSchemaOut(BaseModel):
    id: int
    product_id: int
    schema_json: dict

    model_config = {"from_attributes": True}
