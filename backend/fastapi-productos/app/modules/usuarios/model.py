
from datetime import datetime, timezone
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, Column, String
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from app.modules.pedidos.model import Pedido


def fecha_actual():
    return datetime.now(timezone.utc)


class Usuario(SQLModel, table=True):
    __tablename__ = "usuarios"
    __table_args__ = (
        CheckConstraint("role IN ('user', 'admin')", name="ck_usuarios_role"),
    )

    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(max_length=100, unique=True, index=True)
    full_name: str = Field(max_length=100)
    email: str = Field(sa_column=Column(String(255), unique=True, nullable=False))
    hashed_password: str
    role: str = Field(default="user", max_length=20)
    disabled: bool = Field(default=False)
    created_at: datetime = Field(default_factory=fecha_actual)
    pedidos: list["Pedido"] = Relationship(back_populates="usuario")
