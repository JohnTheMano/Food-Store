from datetime import datetime, timezone

from app.modules.pedidos.model import Pedido, DetallePedido
from app.modules.pedidos.schema import (
    DetallePedidoRead,
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedidos,
)
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork


TRANSITIONS = {
    "PENDIENTE": {"EN_PREPARACION", "CANCELADO"},
    "EN_PREPARACION": {"ENTREGADO", "CANCELADO"},
    "ENTREGADO": set(),
    "CANCELADO": set(),
}


class ProductoNoEncontrado(Exception):
    pass


class ProductoNoDisponible(Exception):
    pass


class StockInsuficiente(Exception):
    pass


class ProductoRepetido(Exception):
    pass


class PedidoNoEncontrado(Exception):
    pass


class PedidoAjeno(Exception):
    pass


class TransicionInvalida(Exception):
    pass


class PedidoService:
    def __init__(self, uow: PedidoUnitOfWork | None = None):
        self.uow = uow or PedidoUnitOfWork()

    def _read(self, uow, pedido: Pedido) -> PedidoRead:
        detalles = uow.detalles.get_by_pedido(pedido.id)
        return PedidoRead(
            id=pedido.id,
            usuario_id=pedido.usuario_id,
            estado=pedido.estado,
            forma_pago=pedido.forma_pago,
            direccion_entrega=pedido.direccion_entrega,
            notas=pedido.notas,
            total=pedido.total,
            created_at=pedido.created_at,
            updated_at=pedido.updated_at,
            items=[
                DetallePedidoRead(
                    producto_id=detalle.producto_id,
                    nombre_producto=detalle.nombre_producto,
                    cantidad=detalle.cantidad,
                    precio_unitario=detalle.precio_unitario,
                    subtotal=detalle.subtotal,
                )
                for detalle in detalles
            ],
        )

    def crear(self, data: PedidoCreate, usuario_id: int):
        with self.uow as uow:
            ids = [item.producto_id for item in data.items]
            if len(ids) != len(set(ids)):
                raise ProductoRepetido()

            pedido = uow.pedidos.create(
                Pedido(
                    usuario_id=usuario_id,
                    estado="PENDIENTE",
                    forma_pago=data.forma_pago,
                    direccion_entrega=data.direccion_entrega,
                    notas=data.notas,
                    total=0,
                )
            )

            total = 0.0
            for item in data.items:
                producto = uow.productos.get_by_id(item.producto_id)
                if producto is None or not producto.activo:
                    raise ProductoNoEncontrado()
                if not producto.disponible:
                    raise ProductoNoDisponible()
                if producto.stock < item.cantidad:
                    raise StockInsuficiente()

                producto.stock -= item.cantidad
                uow.session.add(producto)
                subtotal = producto.precio_base * item.cantidad
                uow.detalles.create(
                    DetallePedido(
                        pedido_id=pedido.id,
                        producto_id=producto.id,
                        cantidad=item.cantidad,
                        nombre_producto=producto.nombre,
                        precio_unitario=producto.precio_base,
                        subtotal=subtotal,
                    )
                )
                total += subtotal

            pedido.total = total
            pedido.updated_at = datetime.now(timezone.utc)
            uow.pedidos.update(pedido)
            return self._read(uow, pedido)

    def obtener(self, pedido_id: int, usuario_id: int | None = None):
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)
            if pedido is None:
                raise PedidoNoEncontrado()
            if usuario_id is not None and pedido.usuario_id != usuario_id:
                raise PedidoAjeno()
            return self._read(uow, pedido)

    def listar(
        self,
        usuario_id: int | None = None,
        estado: str | None = None,
        skip: int = 0,
        limit: int = 20,
    ) -> PedidosPaginados:
        with self.uow as uow:
            pedidos = uow.pedidos.get_by_owner(usuario_id) if usuario_id is not None else uow.pedidos.get_all()
            if estado:
                pedidos = [pedido for pedido in pedidos if pedido.estado == estado]
            total = len(pedidos)
            pagina = pedidos[skip:skip + limit]
            return PedidosPaginados(
                total=total,
                items=[self._read(uow, pedido) for pedido in pagina],
            )

    def resumen(self) -> ResumenPedidos:
        with self.uow as uow:
            estados = {
                estado: uow.pedidos.count_by_state(estado)
                for estado in ("PENDIENTE", "EN_PREPARACION", "ENTREGADO", "CANCELADO")
            }
            ingresos = uow.pedidos.total_by_state("ENTREGADO")
            return ResumenPedidos(
                pendientes=estados["PENDIENTE"],
                en_preparacion=estados["EN_PREPARACION"],
                entregados=estados["ENTREGADO"],
                cancelados=estados["CANCELADO"],
                pedidos_hoy=uow.pedidos.count_created_today(datetime.now().date()),
                ingresos_entregados=float(ingresos),
            )

    def cambiar_estado(self, pedido_id: int, nuevo_estado: str):
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)
            if pedido is None:
                raise PedidoNoEncontrado()
            if nuevo_estado not in TRANSITIONS.get(pedido.estado, set()):
                raise TransicionInvalida()

            if nuevo_estado == "CANCELADO":
                self._restituir(uow, pedido)
            pedido.estado = nuevo_estado
            pedido.updated_at = datetime.now(timezone.utc)
            uow.pedidos.update(pedido)
            return self._read(uow, pedido)

    def cancelar(self, pedido_id: int, usuario_id: int):
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)
            if pedido is None:
                raise PedidoNoEncontrado()
            if pedido.usuario_id != usuario_id:
                raise PedidoAjeno()
            if pedido.estado != "PENDIENTE":
                raise TransicionInvalida()
            self._restituir(uow, pedido)
            pedido.estado = "CANCELADO"
            pedido.updated_at = datetime.now(timezone.utc)
            uow.pedidos.update(pedido)
            return self._read(uow, pedido)

    def _restituir(self, uow, pedido: Pedido):
        for detalle in uow.detalles.get_by_pedido(pedido.id):
            producto = uow.productos.get_by_id(detalle.producto_id)
            if producto is not None:
                producto.stock += detalle.cantidad
                uow.session.add(producto)
