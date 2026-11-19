
from fastapi import APIRouter, Depends, HTTPException

from app.core.deps import require_role
from app.modules.usuarios.service import UsuarioService
from app.modules.usuarios.schema import UserAdmin, UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork, get_usuario_uow

router = APIRouter(
    prefix="/api/v1/admin/usuarios",
    tags=["Administración de usuarios"]
)


@router.get("", response_model=list[UserAdmin])
def listar_usuarios(
    uow: UsuarioUnitOfWork = Depends(get_usuario_uow),
    admin=Depends(require_role(["admin"]))
):
    usuarios = UsuarioService(uow.usuarios).listar_usuarios()

    return [UserAdmin.model_validate(usuario) for usuario in usuarios]


@router.post("/{usuario_id}/activar", response_model=UserPublic)
def activar_usuario(
    usuario_id: int,
    uow: UsuarioUnitOfWork = Depends(get_usuario_uow),
    admin=Depends(require_role(["admin"]))
):
    usuario = UsuarioService(uow.usuarios).activar(usuario_id)

    return UserPublic.model_validate(usuario)


@router.post("/{usuario_id}/desactivar", response_model=UserPublic)
def desactivar_usuario(
    usuario_id: int,
    uow: UsuarioUnitOfWork = Depends(get_usuario_uow),
    admin=Depends(require_role(["admin"]))
):
    if admin.id == usuario_id:
        raise HTTPException(
            status_code=400,
            detail="No podés desactivar tu propia cuenta"
        )

    usuario = UsuarioService(uow.usuarios).desactivar(usuario_id)

    return UserPublic.model_validate(usuario)
