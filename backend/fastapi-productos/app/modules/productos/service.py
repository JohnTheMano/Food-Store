from app.modules.productos.model import Producto
from app.modules.productos.schema import (
    ProductoCreate,
    ProductoRead,
    ProductoStockUpdate,
    ProductoUpdate,
    ProductosPaginados,
)
from app.modules.productos.unit_of_work import ProductoUnitOfWork


class ProductoNoEncontrado(Exception):
    pass


class CategoriaNoEncontrada(Exception):
    pass


class ProductoService:
    def __init__(self, uow: ProductoUnitOfWork | None = None):
        self.uow = uow or ProductoUnitOfWork()

    def listar_productos(
        self,
        skip: int = 0,
        limit: int = 20,
        search: str | None = None,
        categoria_id: int | None = None,
        disponible: bool | None = None,
    ) -> ProductosPaginados:
        with self.uow as uow:
            productos, total = uow.productos.listar(
                skip,
                limit,
                search,
                categoria_id,
                disponible,
            )
            return ProductosPaginados(
                total=total,
                items=[
                    ProductoRead.model_validate(producto)
                    for producto in productos
                ],
            )

    def obtener_producto(self, producto_id: int) -> ProductoRead:
        with self.uow as uow:
            producto = uow.productos.obtener_por_id(producto_id)
            if producto is None or not producto.activo:
                raise ProductoNoEncontrado
            return ProductoRead.model_validate(producto)

    def crear_producto(self, datos: ProductoCreate) -> ProductoRead:
        with self.uow as uow:
            categoria = uow.categorias.obtener_por_id(datos.categoria_id)
            if categoria is None or not categoria.activo:
                raise CategoriaNoEncontrada
            producto = Producto.model_validate(datos)
            producto.categoria = categoria
            producto = uow.productos.guardar(producto)
            return ProductoRead.model_validate(producto)

    def actualizar_producto(
        self,
        producto_id: int,
        datos: ProductoUpdate,
    ) -> ProductoRead:
        with self.uow as uow:
            producto = uow.productos.obtener_por_id(producto_id)
            if producto is None or not producto.activo:
                raise ProductoNoEncontrado

            cambios = datos.model_dump(exclude_unset=True, exclude_none=True)
            if "categoria_id" in cambios:
                categoria = uow.categorias.obtener_por_id(cambios["categoria_id"])
                if categoria is None or not categoria.activo:
                    raise CategoriaNoEncontrada
                producto.categoria = categoria

            producto.sqlmodel_update(cambios)
            producto = uow.productos.guardar(producto)
            return ProductoRead.model_validate(producto)

    def actualizar_stock(
        self,
        producto_id: int,
        datos: ProductoStockUpdate,
    ) -> ProductoRead:
        with self.uow as uow:
            producto = uow.productos.obtener_por_id(producto_id)
            if producto is None or not producto.activo:
                raise ProductoNoEncontrado
            producto.stock = datos.stock
            producto.disponible = datos.disponible
            producto = uow.productos.guardar(producto)
            return ProductoRead.model_validate(producto)

    def eliminar_producto(self, producto_id: int) -> None:
        with self.uow as uow:
            producto = uow.productos.obtener_por_id(producto_id)
            if producto is None or not producto.activo:
                raise ProductoNoEncontrado
            producto.activo = False
            uow.productos.guardar(producto)
