from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlmodel import SQLModel

from app.core.config import settings
from app.core.database import engine
from app.modules.categorias.router import router as categoria_router
from app.modules.categorias import model as categoria_model
from app.modules.productos.router import router as producto_router
from app.modules.productos import model as producto_model
from app.modules.pedidos.router import router as pedido_router
from app.modules.pedidos import model as pedido_model
from app.modules.usuarios import model as usuarios_model
from app.modules.auth.router import router as auth_router
from app.modules.usuarios.router import router as usuarios_router
from seed import seed

@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    seed()
    if engine.dialect.name == "postgresql":
        with engine.begin() as connection:
            connection.execute(
                text(
                    "ALTER TABLE pedidos "
                    "ADD COLUMN IF NOT EXISTS usuario_id INTEGER "
                    "REFERENCES usuarios(id)"
                )
            )
            connection.execute(
                text("CREATE INDEX IF NOT EXISTS ix_pedidos_usuario_id ON pedidos (usuario_id)")
            )
    yield


app = FastAPI(
    title="Food Store API",
    description="API REST de pedidos de comida",
    version="1.0.0",
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(categoria_router)
app.include_router(producto_router)
app.include_router(pedido_router)
app.include_router(auth_router)
app.include_router(usuarios_router)

@app.get("/")
def inicio():
    return {"mensaje": "API de Productos funcionando"}
