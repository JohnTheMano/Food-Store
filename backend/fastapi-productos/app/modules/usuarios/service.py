
from fastapi import HTTPException

from app.modules.usuarios.model import Usuario
from app.modules.usuarios.repository import UsuarioRepository


class UsuarioService:

    def __init__(self, repository: UsuarioRepository):
        self.repository = repository

    def listar_usuarios(self):
        return self.repository.listar()

    def activar(self, usuario_id: int):
        usuario = self.repository.obtener_por_id(usuario_id)

        if not usuario:
            raise HTTPException(404, "Usuario no encontrado")

        usuario.disabled = False
        self.repository.session.add(usuario)
        self.repository.guardar()

        return usuario

    def desactivar(self, usuario_id: int):
        usuario = self.repository.obtener_por_id(usuario_id)

        if not usuario:
            raise HTTPException(404, "Usuario no encontrado")

        usuario.disabled = True
        self.repository.session.add(usuario)
        self.repository.guardar()

        return usuario
