from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
from app.modules.categorias.model import Categoria


class CategoriaRepository(BaseRepository[Categoria]):
    def __init__(self, session: Session):
        super().__init__(session, Categoria)

    def listar_activas(self) -> list[Categoria]:
        statement = (
            select(Categoria)
            .where(Categoria.activo.is_(True))
            .order_by(Categoria.id)
        )
        return list(self.session.exec(statement).all())

    def obtener_por_id(self, categoria_id: int) -> Categoria | None:
        return self.get_by_id(categoria_id)

    def obtener_por_nombre(
        self,
        nombre: str,
        excluir_id: int | None = None,
    ) -> Categoria | None:
        statement = select(Categoria).where(Categoria.nombre == nombre)
        if excluir_id is not None:
            statement = statement.where(Categoria.id != excluir_id)
        return self.session.exec(statement).first()

    def guardar(self, categoria: Categoria) -> Categoria:
        self.session.add(categoria)
        self.session.flush()
        return categoria
