
from datetime import datetime, timezone
from typing import TYPE_CHECKING

from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from app.modules.usuarios.model import Usuario
    from app.modules.productos.model import Producto


def fecha_actual():
    return datetime.now(timezone.utc)


class Pedido(SQLModel, table=True):
    __tablename__ = "pedidos"

    id: int | None = Field(default=None, primary_key=True)

    usuario_id: int = Field(
        foreign_key="usuarios.id",
        index=True,
    )

    usuario: "Usuario" = Relationship(back_populates="pedidos")
    estado: str = Field(default="PENDIENTE", max_length=20)
    forma_pago: str = Field(max_length=20)
    direccion_entrega: str = Field(min_length=5, max_length=200)
    notas: str | None = None
    total: float = Field(ge=0)
    created_at: datetime = Field(default_factory=fecha_actual)
    updated_at: datetime = Field(default_factory=fecha_actual)
    items: list["DetallePedido"] = Relationship(back_populates="pedido")


class DetallePedido(SQLModel, table=True):
    __tablename__ = "detalle_pedido"

    id: int | None = Field(default=None, primary_key=True)
    pedido_id: int = Field(foreign_key="pedidos.id")
    producto_id: int = Field(foreign_key="productos.id")
    cantidad: int = Field(ge=1)
    nombre_producto: str
    precio_unitario: float = Field(ge=0)
    subtotal: float = Field(ge=0)
    pedido: Pedido = Relationship(back_populates="items")
    producto: "Producto" = Relationship(back_populates="detalles")
