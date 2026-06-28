from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.routes import health, products, glossary, ai
from app.workers.sync import start_scheduler, stop_scheduler, run_full_sync

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await run_full_sync()
    start_scheduler()
    yield
    stop_scheduler()


app = FastAPI(
    title="Banking AI Knowledge Platform",
    version="1.0.0",
    description="Enterprise banking product knowledge portal with RAG and SQL generation",
    lifespan=lifespan,
)

origins = [o.strip() for o in settings.frontend_url.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(products.router)
app.include_router(glossary.router)
app.include_router(ai.router)
