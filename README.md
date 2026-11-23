# Food Store

Trabajo Práctico Integrador de Programación 4. Aplicación web de pedidos con backend FastAPI/SQLModel y frontend React/TypeScript.

- **Repositorio público:** https://github.com/JohnTheMano/Food-Store
- **Video demostración:**  https://youtu.be/U9l9ZtWagSU

## Requisitos

- Python 3.11 a 3.13
- PostgreSQL 15 o superior (también se puede usar SQLite)
- Node.js 20.19 o superior
- pnpm 9 o superior

## Backend

```powershell
Set-Location .\backend\fastapi-productos
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python -m app.db.seed
python -m uvicorn app.main:app --reload
```

Ejecutá estos comandos desde la raíz del repositorio y mantené la terminal ubicada en `backend\fastapi-productos` al iniciar Uvicorn, porque ahí está el paquete `app`.

API: http://localhost:8000/docs  
Documentación alternativa: http://localhost:8000/redoc

Variables de entorno:

- `DATABASE_URL`: conexión PostgreSQL o `sqlite:///./foodstore.db`
- `SECRET_KEY`: clave mínima de 32 caracteres
- `ALGORITHM`: `HS256`
- `ACCESS_TOKEN_EXPIRE_MINUTES`: duración del token
- `FRONTEND_ORIGIN`: origen permitido por CORS

Usuario administrador del seed:

- Usuario: `admin`
- Contraseña: `Admin1234!`
- Rol: `admin`

## Frontend

```powershell
cd frontend
Copy-Item .env.example .env
pnpm install
pnpm build
pnpm dev
```

Aplicación: http://localhost:5173
