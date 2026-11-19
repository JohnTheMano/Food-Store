
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.deps import get_current_active_user, require_role
from app.modules.usuarios.model import Usuario
from app.modules.pedidos.service import (
    PedidoService,
    PedidoNoEncontrado,
    ProductoNoEncontrado,
    ProductoNoDisponible,
    StockInsuficiente,
    ProductoRepetido,
    PedidoAjeno,
    TransicionInvalida,
)
from app.modules.pedidos.schema import (
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    CambioEstado,
    ResumenPedidos,
)


router = APIRouter(
    prefix="/api/v1/pedidos",
    tags=["pedidos"],
)


def get_pedido_service() -> PedidoService:
    return PedidoService()

@router.get("/resumen", response_model=ResumenPedidos)
def resumen_pedidos(
    admin: Usuario = Depends(require_role(["admin"])),
    service: PedidoService = Depends(get_pedido_service),
):
    return service.resumen()


@router.get("", response_model=PedidosPaginados)
def listar_pedidos(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    estado: str | None = None,
    usuario: Usuario = Depends(get_current_active_user),
    service: PedidoService = Depends(get_pedido_service),
):
    owner = None if usuario.role == "admin" else usuario.id
    return service.listar(owner, estado, skip, limit)


@router.get("/{pedido_id}", response_model=PedidoRead)
def obtener_pedido(
    pedido_id: int,
    usuario: Usuario = Depends(get_current_active_user),
    service: PedidoService = Depends(get_pedido_service),
):
    try:
        usuario_id = None if usuario.role == "admin" else usuario.id
        return service.obtener(pedido_id, usuario_id)
    except PedidoNoEncontrado:
        raise HTTPException(404, "Pedido no encontrado")
    except PedidoAjeno:
        raise HTTPException(403, "Pedido ajeno")


@router.post("", response_model=PedidoRead, status_code=status.HTTP_201_CREATED)
def crear_pedido(
    data: PedidoCreate,
    usuario: Usuario = Depends(get_current_active_user),
    service: PedidoService = Depends(get_pedido_service),
):
    try:
        return service.crear(data, usuario.id)
    except ProductoNoEncontrado:
        raise HTTPException(404, "Producto no encontrado")
    except ProductoNoDisponible:
        raise HTTPException(400, "Producto no disponible")
    except StockInsuficiente:
        raise HTTPException(400, "Stock insuficiente")
    except ProductoRepetido:
        raise HTTPException(400, "Producto repetido")


@router.patch("/{pedido_id}/estado", response_model=PedidoRead)
def cambiar_estado(
    pedido_id: int,
    data: CambioEstado,
    admin: Usuario = Depends(require_role(["admin"])),
    service: PedidoService = Depends(get_pedido_service),
):
    try:
        return service.cambiar_estado(pedido_id, data.estado)
    except PedidoNoEncontrado:
        raise HTTPException(404, "Pedido no encontrado")
    except TransicionInvalida:
        raise HTTPException(400, "Transición inválida")


@router.patch("/{pedido_id}/cancelar", response_model=PedidoRead)
def cancelar_pedido(
    pedido_id: int,
    usuario: Usuario = Depends(get_current_active_user),
    service: PedidoService = Depends(get_pedido_service),
):
    try:
        return service.cancelar(pedido_id, usuario.id)
    except PedidoNoEncontrado:
        raise HTTPException(404, "Pedido no encontrado")
    except PedidoAjeno:
        raise HTTPException(403, "Pedido ajeno")
    except TransicionInvalida:
        raise HTTPException(400, "El pedido no está en PENDIENTE")
