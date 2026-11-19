from fastapi import APIRouter

from app.modules.usuarios.admin_router import router as admin_router


router = APIRouter()
router.include_router(admin_router)