
from pydantic import ConfigDict
from sqlmodel import SQLModel, Field


class CategoriaBase(SQLModel):
    nombre: str = Field(
        min_length=2,
        max_length=100,
    )
    descripcion: str | None = None


class CategoriaCreate(CategoriaBase):
    pass


class CategoriaUpdate(SQLModel):
    nombre: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )
    descripcion: str | None = None


class CategoriaRead(CategoriaBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    activo: bool
