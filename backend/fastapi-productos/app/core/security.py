
from datetime import datetime, timedelta, timezone

from jose import jwt, JWTError
from passlib.context import CryptContext

from app.core.config import settings

SECRET_KEY = settings.secret_key
ALGORITHM = settings.algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def verificar_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def crear_access_token(data: dict) -> str:
    contenido = data.copy()

    expiracion = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    contenido.update({"exp": expiracion})

    return jwt.encode(
        contenido,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def decodificar_token(token: str):
    try:
        return jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
    except JWTError:
        return None
