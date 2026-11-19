
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    full_name: str
    email: str
    role: Literal["user", "admin"]
    disabled: bool
    created_at: datetime


class UserAdmin(UserPublic):
    pass
