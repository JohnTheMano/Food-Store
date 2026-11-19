
from fastapi import APIRouter, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm

from app.core.deps import get_current_active_user
from app.core.security import ACCESS_TOKEN_EXPIRE_MINUTES
from app.modules.auth.schema import AuthMessage, UserCreate
from app.modules.auth.service import AuthService
from app.modules.usuarios.model import Usuario
from app.modules.usuarios.schema import UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork, get_usuario_uow

router = APIRouter(prefix="/api/v1/auth", tags=["Autenticación"])


@router.post("/register", response_model=UserPublic, status_code=201)
def register(
    datos: UserCreate,
    uow: UsuarioUnitOfWork = Depends(get_usuario_uow),
):
    usuario = AuthService(uow.usuarios).registrar(datos)
    return UserPublic.model_validate(usuario)


@router.post("/token", response_model=AuthMessage)
def login(
    response: Response,
    form: OAuth2PasswordRequestForm = Depends(),
    uow: UsuarioUnitOfWork = Depends(get_usuario_uow),
):
    token = AuthService(uow.usuarios).iniciar_sesion(form.username, form.password)

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/"
    )

    return {"message": "Login exitoso"}


@router.post("/logout", response_model=AuthMessage)
def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=False,
        samesite="lax",
        path="/"
    )

    return {"message": "Sesión cerrada"}


@router.get("/me", response_model=UserPublic)
def me(
    usuario: Usuario = Depends(get_current_active_user),
):
    return UserPublic.model_validate(usuario)
