
from datetime import date

from sqlmodel import Session, func, select

from app.core.base_repository import BaseRepository
from app.modules.pedidos.model import Pedido, DetallePedido
from app.modules.productos.model import Producto


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: Session):
        super().__init__(session, Pedido)

    def get_all(self):
        return super().get_all()

    def get_by_owner(self, usuario_id: int):
        statement = select(Pedido).where(Pedido.usuario_id == usuario_id)
        return self.session.exec(statement).all()

    def get_by_id(self, pedido_id: int):
        return super().get_by_id(pedido_id)

    def count_by_state(self, estado: str) -> int:
        return self.session.exec(
            select(func.count()).select_from(Pedido).where(Pedido.estado == estado)
        ).one()

    def count_created_today(self, today: date) -> int:
        return self.session.exec(
            select(func.count())
            .select_from(Pedido)
            .where(func.date(Pedido.created_at) == today)
        ).one()

    def total_by_state(self, estado: str) -> float:
        return self.session.exec(
            select(func.coalesce(func.sum(Pedido.total), 0)).where(
                Pedido.estado == estado
            )
        ).one()

    def create(self, pedido: Pedido):
        self.add(pedido)
        self.session.refresh(pedido)
        return pedido

    def update(self, pedido: Pedido):
        return self.add(pedido)


class DetallePedidoRepository(BaseRepository[DetallePedido]):
    def __init__(self, session: Session):
        super().__init__(session, DetallePedido)

    def get_by_pedido(self, pedido_id: int):
        statement = select(DetallePedido).where(
            DetallePedido.pedido_id == pedido_id
        )
        return self.session.exec(statement).all()

    def create(self, detalle: DetallePedido):
        return self.add(detalle)


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session):
        super().__init__(session, Producto)

    def get_by_id(self, producto_id: int):
        return super().get_by_id(producto_id)
