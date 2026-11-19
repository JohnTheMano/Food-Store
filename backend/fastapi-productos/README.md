	Crear producto
PUT	/productos/{id}	Actualizar producto
DELETE	/productos/{id}	Eliminar producto
GET	/pedidos	Listar pedidos
GET	/pedidos/{id}	Obtener pedido con detalles
POST	/pedidos	Crear pedido
PUT	/pedidos/{id}	Actualizar estado
DELETE	/pedidos/{id}	Borrado lógico
Requisitos previos
Python instalado.
PostgreSQL instalado y funcionando.
Base de datos configurada.
REST Client instalado en Visual Studio Code para ejecutar las pruebas HTTP.

Estructura del backend

- `app/core`: configuración, base de datos, seguridad y dependencias compartidas.
- `app/modules/usuarios`, `categorias`, `productos` y `pedidos`: cada dominio contiene router, service, unit of work, repository, model y schema.
- `app/modules/auth`: router, service y schemas de autenticación; utiliza el modelo de usuario.

Configuración

Copiar `.env.example` como `.env` y completar sus valores. La aplicación los carga con `pydantic-settings`. `DATABASE_URL`, `SECRET_KEY`, `ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES` y `FRONTEND_ORIGIN` son configurables. `SECRET_KEY` debe tener al menos 32 caracteres.

Instalación y ejecución
Ubicarse en la carpeta del backend.

Crear el entorno virtual:


powershell
python -m venv .venv
Activar el entorno virtual:


powershell
.venv\Scripts\activate
Instalar las dependencias:


powershell
pip install -r requirements.txt
Ejecutar el seed idempotente:


powershell
python seed.py
Iniciar el servidor desde esta carpeta (`backend\fastapi-productos`), donde se encuentra el paquete `app`:


powershell
python -m uvicorn app.main:app --reload
Documentación de la API
Con el servidor iniciado, acceder a Swagger:

http://localhost:8000/docs

Autenticación y permisos

- `POST /api/v1/auth/register` es público y crea usuarios con el rol `user`.
- Las lecturas de categorías y productos son públicas.
- Las escrituras de categorías y productos requieren el rol `admin`.
- `user` puede crear pedidos, consultar los propios y cancelar únicamente los que estén `PENDIENTE`; `admin` puede consultar todos y gestionar sus estados.
- Los pedidos se cancelan; no se eliminan.

Datos iniciales

Ejecutar `python -m app.db.seed` desde esta carpeta. El seed carga el usuario admin, categorías y productos de ejemplo de forma idempotente.

Pruebas con REST Client
Los archivos `pedidos.http` y `productos.http` requieren credenciales. Reemplazar sus variables `COMPLETAR_*` por cuentas existentes antes de ejecutar las pruebas. Las cookies de sesión permiten probar las rutas protegidas.

El archivo `pedidos.http` prueba el aislamiento de pedidos por cliente y las operaciones administrativas.

Se incluyen pruebas de creación, consulta, actualización, eliminación lógica y validaciones de errores HTTP 404 y 422.

CORS
Se encuentra habilitado CORS para permitir la comunicación entre el backend y el frontend desarrollado con React y Vite.

Objetivo académico
Aplicar los conceptos de desarrollo de APIs REST, persistencia con PostgreSQL, validación con Pydantic y arquitectura por capas.

Se implementa especialmente el patrón Unit of Work para garantizar que la creación de un pedido y sus detalles se realice de manera atómica.

Trabajo Práctico – Unidad 9
Programación IV
Tecnicatura Universitaria en Programación a Distancia.