
from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
from app.modules.usuarios.model import Usuario


class UsuarioRepository(BaseRepository[Usuario]):

    def __init__(self, session: Session):
        super().__init__(session, Usuario)

    def obtener_por_email(self, email: str):
        statement = select(Usuario).where(Usuario.email == email)
        return self.session.exec(statement).first()

    def obtener_por_username(self, username: str):
        statement = select(Usuario).where(Usuario.username == username)
        return self.session.exec(statement).first()

    def obtener_por_id(self, usuario_id: int):
        return self.get_by_id(usuario_id)

    def crear(self, usuario: Usuario):
        self.session.add(usuario)
        self.session.flush()
        return usuario

    def listar(self):
        return self.get_all()

    def guardar(self):
        self.session.flush()

    def refrescar(self, usuario):
        self.session.refresh(usuario)
        return usuario
