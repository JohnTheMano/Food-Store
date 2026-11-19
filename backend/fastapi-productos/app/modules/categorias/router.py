
from fastapi import APIRouter, Depends, HTTPException, Response, status

from app.core.deps import require_role
from app.modules.categorias.schema import CategoriaCreate, CategoriaRead, CategoriaUpdate
from app.modules.categorias.service import (
    CategoriaNoEncontrada,
    CategoriaService,
    NombreDuplicado,
)


router = APIRouter(
    prefix="/api/v1/categorias",
    tags=["Categorías"],
)


def get_categoria_service() -> CategoriaService:
    return CategoriaService()


@router.get("/", response_model=list[CategoriaRead])
def listar_categorias(
    service: CategoriaService = Depends(get_categoria_service),
):
    return service.listar_categorias()


@router.get("/{categoria_id}", response_model=CategoriaRead)
def obtener_categoria(
    categoria_id: int,
    service: CategoriaService = Depends(get_categoria_service),
):
    try:
        return service.obtener_categoria(categoria_id)
    except CategoriaNoEncontrada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada",
        )


@router.post(
    "/",
    response_model=CategoriaRead,
    status_code=status.HTTP_201_CREATED,
)
def crear_categoria(
    datos: CategoriaCreate,
    admin=Depends(require_role(["admin"])),
    service: CategoriaService = Depends(get_categoria_service),
):
    try:
        return service.crear_categoria(datos)
    except NombreDuplicado:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El nombre de la categoría ya existe",
        )


@router.put("/{categoria_id}", response_model=CategoriaRead)
def actualizar_categoria(
    categoria_id: int,
    datos: CategoriaUpdate,
    admin=Depends(require_role(["admin"])),
    service: CategoriaService = Depends(get_categoria_service),
):
    try:
        return service.actualizar_categoria(categoria_id, datos)
    except CategoriaNoEncontrada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada",
        )
    except NombreDuplicado:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El nombre de la categoría ya existe",
        )


@router.delete(
    "/{categoria_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def eliminar_categoria(
    categoria_id: int,
    admin=Depends(require_role(["admin"])),
    service: CategoriaService = Depends(get_categoria_service),
):
    try:
        service.eliminar_categoria(categoria_id)
    except CategoriaNoEncontrada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada",
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)
