"""initial schema

Revision ID: 0001
Revises: 
Create Date: 2026-06-28
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "products",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(100), nullable=False, unique=True),
        sa.Column("description", sa.Text, nullable=False, server_default=""),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
    )
    op.create_table(
        "product_tables",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("product_id", sa.Integer, sa.ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True),
        sa.Column("table_name", sa.String(200), nullable=False),
        sa.Column("description", sa.Text, nullable=False, server_default=""),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
    )
    op.create_table(
        "product_columns",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("product_id", sa.Integer, sa.ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True),
        sa.Column("table_name", sa.String(200), nullable=False),
        sa.Column("column_name", sa.String(200), nullable=False),
        sa.Column("data_type", sa.String(100), nullable=False, server_default=""),
        sa.Column("description", sa.Text, nullable=False, server_default=""),
        sa.Column("example_value", sa.Text, nullable=False, server_default=""),
        sa.Column("constraints", sa.Text, nullable=False, server_default=""),
        sa.Column("is_sensitive", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("business_meaning", sa.Text, nullable=False, server_default=""),
        sa.Column("updated_at", sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_table(
        "glossary_entries",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("product_id", sa.Integer, sa.ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True),
        sa.Column("term", sa.String(300), nullable=False),
        sa.Column("definition", sa.Text, nullable=False),
        sa.Column("related_fields", sa.Text, nullable=False, server_default=""),
        sa.Column("updated_at", sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_table(
        "blogs",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("product_id", sa.Integer, sa.ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True),
        sa.Column("title", sa.String(500), nullable=False),
        sa.Column("slug", sa.String(500), nullable=False, unique=True),
        sa.Column("content", sa.Text, nullable=False),
        sa.Column("published_at", sa.DateTime, server_default=sa.func.now()),
    )
    op.create_table(
        "product_schemas",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("product_id", sa.Integer, sa.ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True),
        sa.Column("schema_json", JSONB, nullable=False, server_default="{}"),
        sa.Column("updated_at", sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
    )

    op.execute(
        "INSERT INTO products (name, description) VALUES "
        "('P1', 'Product 1'), ('P2', 'Product 2'), "
        "('P3', 'Product 3'), ('P4', 'Product 4'), ('P5', 'Product 5')"
    )


def downgrade():
    op.drop_table("product_schemas")
    op.drop_table("blogs")
    op.drop_table("glossary_entries")
    op.drop_table("product_columns")
    op.drop_table("product_tables")
    op.drop_table("products")
