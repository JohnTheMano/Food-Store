
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status

from app.core.deps import require_role
from app.modules.productos.schema import (
    ProductoCreate,
    ProductoRead,
    ProductoUpdate,
    ProductosPaginados,
    ProductoStockUpdate,
)
from app.modules.productos.service import (
    CategoriaNoEncontrada,
    ProductoNoEncontrado,
    ProductoService,
)


router = APIRouter(prefix="/api/v1/productos", tags=["Productos"])


def get_producto_service() -> ProductoService:
    return ProductoService()


@router.get("", response_model=ProductosPaginados)
def listar_productos(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: str | None = None,
    categoria_id: int | None = None,
    disponible: bool | None = None,
    service: ProductoService = Depends(get_producto_service),
):
    return service.listar_productos(skip, limit, search, categoria_id, disponible)


@router.get("/{producto_id}", response_model=ProductoRead)
def obtener_producto(
    producto_id: int,
    service: ProductoService = Depends(get_producto_service),
):
    try:
        return service.obtener_producto(producto_id)
    except ProductoNoEncontrado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado",
        )


@router.post("/", response_model=ProductoRead, status_code=status.HTTP_201_CREATED)
def crear_producto(
    datos: ProductoCreate,
    admin=Depends(require_role(["admin"])),
    service: ProductoService = Depends(get_producto_service),
):
    try:
        return service.crear_producto(datos)
    except CategoriaNoEncontrada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada",
        )


@router.put("/{producto_id}", response_model=ProductoRead)
def actualizar_producto(
    producto_id: int,
    datos: ProductoUpdate,
    admin=Depends(require_role(["admin"])),
    service: ProductoService = Depends(get_producto_service),
):
    try:
        return service.actualizar_producto(producto_id, datos)
    except CategoriaNoEncontrada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada",
        )
    except ProductoNoEncontrado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado",
        )


@router.patch("/{producto_id}/stock", response_model=ProductoRead)
def actualizar_stock(
    producto_id: int,
    datos: ProductoStockUpdate,
    admin=Depends(require_role(["admin"])),
    service: ProductoService = Depends(get_producto_service),
):
    try:
        return service.actualizar_stock(producto_id, datos)
    except ProductoNoEncontrado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado",
        )


@router.delete("/{producto_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto(
    producto_id: int,
    admin=Depends(require_role(["admin"])),
    service: ProductoService = Depends(get_producto_service),
):
    try:
        service.eliminar_producto(producto_id)
    except ProductoNoEncontrado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado",
        )
    return Response(status_code=status.HTTP_204_NO_CONTENT)

