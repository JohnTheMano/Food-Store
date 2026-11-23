# Food Store

Trabajo Práctico Integrador de Programación 4: aplicación web para consultar un catálogo gastronómico, armar pedidos y administrar el negocio.

- **Repositorio:** https://github.com/JohnTheMano/Food-Store
- **Video de demostración:** https://youtu.be/U9l9ZtWagSU

## Requisitos

- Python 3.11–3.13
- Node.js 20.19 o superior
- pnpm 9 o superior
- PostgreSQL 15 o superior, o SQLite para desarrollo local

## Configuración y ejecución

Iniciá el backend y el frontend en **dos terminales separadas**. Los comandos siguientes usan PowerShell y se ejecutan desde la carpeta raíz del repositorio.

### 1. Backend

Crear y activar el entorno virtual, instalar las dependencias y generar el archivo de variables de entorno:

```powershell
Set-Location .\backend\fastapi-productos
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item ..\..\.env.example .env
```

Configurar `backend\fastapi-productos\.env` antes de iniciar la API:

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `DATABASE_URL` | URL de conexión a la base de datos | `postgresql+psycopg2://postgres:TU_CONTRASENA@localhost:5432/foodstore_tpi` |
| `SECRET_KEY` | Clave para firmar los JWT; usar una clave privada de al menos 32 caracteres | `REEMPLAZAR_POR_UNA_CLAVE_SEGURA_DE_AL_MENOS_32_CARACTERES` |
| `ALGORITHM` | Algoritmo de firma del JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Duración de la sesión en minutos | `30` |
| `FRONTEND_ORIGIN` | Origen autorizado para CORS | `http://localhost:5173` |

La base de datos indicada en `DATABASE_URL` debe existir. Si preferís ejecutar el proyecto sin instalar PostgreSQL, podés usar SQLite:

```env
DATABASE_URL=sqlite:///./foodstore.db
```

El seed crea de forma idempotente las cuentas de prueba, las categorías y los productos. Se puede ejecutar manualmente:

```powershell
python -m app.db.seed
```

Iniciar la API desde `backend\fastapi-productos`:

```powershell
python -m uvicorn app.main:app --reload
```

La API también ejecuta el seed al iniciar. Documentación interactiva:

- Swagger: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 2. Frontend

En una segunda terminal, desde la raíz del repositorio:

```powershell
Set-Location .\frontend
Copy-Item .env.example .env
pnpm install
pnpm build
pnpm dev
```

El archivo `frontend\.env` contiene `VITE_API_URL`, la URL base de la API. Para desarrollo local, el valor es:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

Abrir la aplicación en http://localhost:5173.

## Usuarios de prueba

El seed crea estas cuentas. Para iniciar sesión, se puede ingresar el nombre de usuario o el email.

| Rol | Usuario | Email | Contraseña |
| --- | --- | --- | --- |
| Administrador | `admin` | `admin@foodstore.com` | `Prueba2026!` |
| Cliente | `usuario.prueba` | `usuario@gmail.com` | `Prueba2026!` |

El registro desde la aplicación crea cuentas con rol `user`; el rol administrador se asigna únicamente a la cuenta del seed.

## Funcionalidades

- Catálogo de productos con búsqueda, filtros y paginación.
- Carrito persistente y confirmación de pedidos.
- Consulta y cancelación de pedidos propios.
- Panel de administración para categorías, productos, stock, pedidos y usuarios.
- Autenticación con cookie HttpOnly y control de acceso según el rol.

No subir los archivos `.env` al repositorio: contienen configuración local y claves privadas.
