
from datetime import datetime
from typing import Literal

from sqlmodel import SQLModel, Field
from pydantic import ConfigDict


class ItemPedidoCreate(SQLModel):
    producto_id: int
    cantidad: int = Field(ge=1)


class DetallePedidoRead(SQLModel):
    model_config = ConfigDict(from_attributes=True)

    producto_id: int
    nombre_producto: str
    cantidad: int
    precio_unitario: float
    subtotal: float


class PedidoCreate(SQLModel):
    items: list[ItemPedidoCreate] = Field(min_length=1)
    forma_pago: Literal["EFECTIVO", "TRANSFERENCIA"]
    direccion_entrega: str = Field(min_length=5, max_length=200)
    notas: str | None = None


class PedidoUpdate(SQLModel):
    estado: Literal[
        "PENDIENTE",
        "EN_PREPARACION",
        "ENTREGADO",
        "CANCELADO",
    ]


class PedidoRead(SQLModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    usuario_id: int
    estado: str
    forma_pago: str
    direccion_entrega: str
    notas: str | None
    total: float
    created_at: datetime
    updated_at: datetime
    items: list[DetallePedidoRead] = Field(default_factory=list)


class PedidosPaginados(SQLModel):
    total: int
    items: list[PedidoRead]


class CambioEstado(SQLModel):
    estado: Literal["PENDIENTE", "EN_PREPARACION", "ENTREGADO", "CANCELADO"]


class ResumenPedidos(SQLModel):
    pendientes: int
    en_preparacion: int
    entregados: int
    cancelados: int
    pedidos_hoy: int
    ingresos_entregados: float
