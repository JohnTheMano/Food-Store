from sqlalchemy.orm import selectinload
from sqlmodel import Session, func, select

from app.core.base_repository import BaseRepository
from app.modules.productos.model import Producto


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session):
        super().__init__(session, Producto)

    def listar(
        self,
        skip: int = 0,
        limit: int = 20,
        search: str | None = None,
        categoria_id: int | None = None,
        disponible: bool | None = None,
    ) -> tuple[list[Producto], int]:
        filters = [Producto.activo.is_(True)]
        if search:
            filters.append(Producto.nombre.ilike(f"%{search}%"))
        if categoria_id is not None:
            filters.append(Producto.categoria_id == categoria_id)
        if disponible is not None:
            filters.append(Producto.disponible == disponible)

        total = self.session.exec(
            select(func.count()).select_from(Producto).where(*filters)
        ).one()
        statement = (
            select(Producto)
            .options(selectinload(Producto.categoria))
            .where(*filters)
            .offset(skip)
            .limit(limit)
        )
        return list(self.session.exec(statement).all()), total

    def obtener_por_id(self, producto_id: int) -> Producto | None:
        return self.session.exec(
            select(Producto)
            .options(selectinload(Producto.categoria))
            .where(Producto.id == producto_id)
        ).first()

    def guardar(self, producto: Producto) -> Producto:
        self.session.add(producto)
        self.session.flush()
        return producto
