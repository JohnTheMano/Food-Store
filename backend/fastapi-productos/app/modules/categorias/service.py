from app.modules.categorias.model import Categoria
from app.modules.categorias.schema import (
    CategoriaCreate,
    CategoriaRead,
    CategoriaUpdate,
)
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork


class CategoriaNoEncontrada(Exception):
    pass


class NombreDuplicado(Exception):
    pass


class CategoriaService:
    def __init__(self, uow: CategoriaUnitOfWork | None = None):
        self.uow = uow or CategoriaUnitOfWork()

    def listar_categorias(self) -> list[CategoriaRead]:
        with self.uow as uow:
            return [
                CategoriaRead.model_validate(categoria)
                for categoria in uow.categorias.listar_activas()
            ]

    def obtener_categoria(self, categoria_id: int) -> CategoriaRead:
        with self.uow as uow:
            categoria = uow.categorias.obtener_por_id(categoria_id)
            if categoria is None or not categoria.activo:
                raise CategoriaNoEncontrada
            return CategoriaRead.model_validate(categoria)

    def crear_categoria(self, datos: CategoriaCreate) -> CategoriaRead:
        with self.uow as uow:
            if uow.categorias.obtener_por_nombre(datos.nombre):
                raise NombreDuplicado
            categoria = Categoria.model_validate(datos)
            categoria = uow.categorias.guardar(categoria)
            return CategoriaRead.model_validate(categoria)

    def actualizar_categoria(
        self,
        categoria_id: int,
        datos: CategoriaUpdate,
    ) -> CategoriaRead:
        with self.uow as uow:
            categoria = uow.categorias.obtener_por_id(categoria_id)
            if categoria is None or not categoria.activo:
                raise CategoriaNoEncontrada

            cambios = datos.model_dump(exclude_unset=True, exclude_none=True)
            if "nombre" in cambios and uow.categorias.obtener_por_nombre(
                cambios["nombre"],
                excluir_id=categoria_id,
            ):
                raise NombreDuplicado

            categoria.sqlmodel_update(cambios)
            categoria = uow.categorias.guardar(categoria)
            return CategoriaRead.model_validate(categoria)

    def eliminar_categoria(self, categoria_id: int) -> None:
        with self.uow as uow:
            categoria = uow.categorias.obtener_por_id(categoria_id)
            if categoria is None or not categoria.activo:
                raise CategoriaNoEncontrada
            categoria.activo = False
            uow.categorias.guardar(categoria)
