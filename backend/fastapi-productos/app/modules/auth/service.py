from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError

from app.core.security import crear_access_token, hash_password, verificar_password
from app.modules.auth.schema import UserCreate
from app.modules.usuarios.repository import UsuarioRepository
from app.modules.usuarios.model import Usuario


class AuthService:
    def __init__(self, usuarios: UsuarioRepository):
        self.usuarios = usuarios

    def registrar(self, datos: UserCreate) -> Usuario:
        email = str(datos.email).lower()

        if self.usuarios.obtener_por_email(email):
            raise HTTPException(409, "El email ya está registrado")
        if self.usuarios.obtener_por_username(datos.username):
            raise HTTPException(409, "El nombre de usuario ya existe")

        usuario = Usuario(
            username=datos.username,
            full_name=datos.full_name,
            email=email,
            hashed_password=hash_password(datos.password),
            role="user",
            disabled=False,
        )

        try:
            self.usuarios.crear(usuario)
            self.usuarios.refrescar(usuario)
        except IntegrityError:
            self.usuarios.session.rollback()
            raise HTTPException(409, "El email o nombre de usuario ya existe")
        return usuario

    def iniciar_sesion(self, username: str, password: str) -> str:
        usuario = self.usuarios.obtener_por_username(username)
        if usuario is None:
            usuario = self.usuarios.obtener_por_email(username.lower())

        if not usuario or not verificar_password(password, usuario.hashed_password):
            raise HTTPException(401, "Email o contraseña incorrectos")
        if usuario.disabled:
            raise HTTPException(400, "Cuenta de usuario desactivada")

        return crear_access_token({"sub": str(usuario.id)})
