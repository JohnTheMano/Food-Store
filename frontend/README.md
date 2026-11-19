Food Store – Frontend

Aplicación web desarrollada para el Trabajo Práctico de la Unidad 10 de Programación IV de la Tecnicatura Universitaria en Programación.

El sistema permite consultar el catálogo y administrar categorías, productos y pedidos mediante una interfaz desarrollada con React y TypeScript, conectada a un backend REST con FastAPI.

Tecnologías utilizadas
React 19
TypeScript
Vite
Tailwind CSS
React Router DOM
TanStack Query: gestión de consultas y mutaciones con la API.
TanStack Form: gestión y validación de formularios.
TanStack Table v8: tablas con ordenamiento y paginación.
Funcionalidades implementadas
Categorías
Listado de categorías.
Alta de nuevas categorías.
Edición de categorías existentes.
Eliminación con confirmación.
Validación del nombre obligatorio.
Productos
Listado de productos.
Alta de productos.
Edición de productos.
Eliminación con confirmación.
Gestión de nombre, descripción, precio base, imágenes y disponibilidad.
Validación del nombre obligatorio y precio no negativo.
Pedidos
Los clientes pueden crear pedidos y consultar los propios. El dueño puede cancelar solamente los pedidos en estado `PENDIENTE`.
El administrador puede avanzar los pedidos por `PENDIENTE` → `EN_PREPARACION` → `ENTREGADO`, o cancelarlos desde `PENDIENTE` o `EN_PREPARACION`.
`ENTREGADO` y `CANCELADO` son estados terminales. Los pedidos no se eliminan: se cancelan.
La forma de pago puede ser `EFECTIVO` o `TRANSFERENCIA`.
El total se calcula a partir de los subtotales de los detalles y queda fijo al crear el pedido.
Organización del proyecto

El código usa arquitectura por features:

- `src/features/auth`: autenticación, registro, administración y store de sesión.
- `src/features/categories`: categorías, componentes, tipos y hook de datos.
- `src/features/products`: productos, componentes, tipos y hook de datos.
- `src/features/pedidos`: carrito, creación, consulta y administración de pedidos.
- `src/shared`: componentes compartidos e instancia de Axios con interceptores.
- `src/store`: tema persistido y notificaciones.
- `src/routes`: rutas públicas, protegidas y por rol.

Cada feature expone su API pública mediante un archivo `index.ts`. Los imports entre carpetas usan el alias `@/`.
Instalación
Instalar las dependencias:


bash
pnpm install
Ejecución
Iniciar el servidor de desarrollo:


bash
pnpm dev
La aplicación estará disponible en:

http://localhost:5173

Backend
El frontend consume una API REST desarrollada con FastAPI.

Dirección del backend:

http://localhost:8000

Documentación interactiva:

http://localhost:8000/docs

Compilación
Para generar la versión de producción:


bash
pnpm build
Verificación
Para ejecutar ESLint:


bash
pnpm lint
Trabajo Práctico – Unidad 10
Programación IV
Tecnicatura Universitaria en Programación a Distancia.