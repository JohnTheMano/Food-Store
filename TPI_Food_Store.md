Tecnicatura Universitaria en Programación a Distancia 



Materia: Programación 4 

TRABAJO PRÁCTICO INTEGRADOR · FOOD STORE, SISTEMA DE PEDIDOS DE COMIDA 

# Food Store 

Coordinador: Prof. Carlos Martínez Profesores: Cinthia Rigoni, Neyen Bianchi y Ramiro Hualpa 

## Objetivos 

Construir una aplicación web completa para un negocio de comidas, con un backend FastAPI + SQLModel y un frontend React + TypeScript, aplicando la arquitectura en capas con Unit of Work, la autenticación con JWT en cookie HttpOnly, la autorización por roles, el manejo del estado del servidor con TanStack Query y del estado del cliente con Zustand. 

Al finalizar el trabajo se espera que el alumno sea capaz de: 

- Modelar un dominio con SQLModel (relaciones 1:N, baja lógica y copia de datos en las líneas de un pedido) a partir de un diagrama UML. 

- Implementar reglas de negocio transaccionales (descuento y restitución de stock, máquina de estados) dentro de un Unit of Work. 

- Exponer una API REST documentada, con códigos de respuesta correctos y errores sin ambigüedad. 

- Consumir esa API desde React con Axios, TanStack Query, TanStack Form y TanStack Table, y proteger las pantallas según el rol. 

## Descripción del sistema 

Food Store es una aplicación web para un negocio de comidas. Los clientes se registran, recorren el catálogo, arman un carrito y confirman un pedido indicando la dirección de entrega y la forma de pago (efectivo o transferencia). El negocio administra categorías, productos, stock, pedidos y usuarios desde un panel de administración. 

|Actor|Objetivo|
|---|---|
|Cliente(rol<br>user)|Navegar el catálogo,gestionar el carrito,confirmar el pedido con dirección y|
||forma de pago,y consultar y cancelar sus pedidos.|
|Administrador(rol|Gestionar categorías,productos,stock y usuarios,avanzar los pedidos según la|
|admin)|máquina de estados y ver un resumen del negocio.|



Programación 4 

Página 1 de 23 

Tecnicatura Universitaria en Programación a Distancia 



|Actor|Objetivo|
|---|---|
|Sistema|Garantizar que un pedido se cree completo o no se cree,que el stock se<br>descuente y se restituya de forma coherente y que los precios de un pedido no<br>cambien después de creado.|



Alcance. Autenticación con JWT en cookie HttpOnly y dos roles; catálogo con una categoría por producto e imagen como URL; carrito persistido en el navegador; pedidos con máquina de 4 estados, descuento de stock en la transacción y restitución al cancelar; pago manual sin pasarela; panel de administración con CRUD de categorías y productos, stock, pedidos, usuarios y resumen; CORS con credenciales, .env.example y seed; API documentada en /docs y /redoc . 

Fuera de alcance. Direcciones guardadas por usuario, varias categorías por producto, historial de cambios de estado, gráficos, pasarela de pago, pruebas automatizadas y notificaciones. 

Arquitectura general. Dos proyectos independientes que se comunican por HTTP. El backend expone la API REST bajo /api/v1 , aplica las reglas de negocio y persiste en PostgreSQL. El frontend es una aplicación React que consume la API con Axios. La sesión viaja en una cookie HttpOnly que el navegador adjunta en cada petición: el frontend nunca lee ni guarda el token. El modelo de datos se entrega en el diagrama UML adjunto, UML_FOOD_STORE (archivos PNG y SVG), reproducido en el anexo (Figura 1): detalla entidades, campos, tipos, restricciones, relaciones con su multiplicidad y las reglas de negocio en notas. 

Se puede partir del proyecto de seguridad con JWT y cookie HttpOnly de la materia: aporta el módulo de usuarios, el login, las dependencias de sesión y rol, CORS con credenciales y el seed. 

## Flujo de trabajo propuesto 

El trabajo se organiza en diez partes, en el orden sugerido para construirlas. Cada parte indica qué se construye; el detalle técnico está en las secciones de especificación que siguen y el puntaje de cada una, en «Criterios de evaluación». 

Backend: estructura y configuración 

Crear el proyecto backend/ con la estructura de carpetas de la especificación del backend: un paquete core/ con la infraestructura compartida y un paquete por dominio en modules/ . Los módulos usuarios , categorias , productos y pedidos tienen router, service, unit of work, repository, models y schemas; auth solo router, service y schemas, porque usa el modelo Usuario. Configurar las variables con pydantic-settings leídas de .env , el middleware CORS con credenciales, el prefijo /api/v1 y el seed idempotente. Fijar las versiones de todas las dependencias en requirements.txt , incluidas passlib[bcrypt]==1.7.4 y bcrypt==4.0.1 . 

Programación 4 

Página 2 de 23 

Tecnicatura Universitaria en Programación a Distancia 



#### Modelo de datos 

Implementar las cinco entidades del diagrama UML como modelos SQLModel con table=True : campos, tipos, valores por defecto, claves y relaciones con los nombres exactos indicados en «Modelos y relaciones». Baja lógica con un campo booleano; los pedidos no se borran. DetallePedido guarda una copia del nombre y del precio del producto. 

#### Unit of Work y Repository 

Implementar BaseRepository[T] y un UnitOfWork base que abre la sesión en =_enter=_ y hace commit, rollback y close en =_exit=_ . En los módulos categorias , productos y pedidos , el Service abre with self.uow as uow: , aplica las reglas y devuelve el schema de salida dentro del bloque; el Router obtiene el Service con Depends y no abre el Unit of Work. Ningún Service ni Router llama a session.commit() . 

#### Autenticación y usuarios 

Implementar el registro público, el login por formulario OAuth2 que entrega el JWT en la cookie HttpOnly access_token , el logout que borra la cookie y el perfil /me , con las dependencias get_current_user , get_current_active_user y require_role . Agregar el listado, la activación y la desactivación de usuarios para el rol admin . Las contraseñas se guardan con hash bcrypt. Los códigos de error son los de la especificación: 409 en el registro duplicado, 401 en credenciales incorrectas, 400 en cuenta desactivada y 404 en usuario inexistente. 

#### API de catálogo 

Implementar los endpoints de categorías y productos con los verbos, códigos y schemas de la especificación: lecturas públicas que devuelven solo registros activos, escrituras solo para admin , listado de productos paginado con búsqueda y filtros, cambio de stock y disponibilidad, y baja lógica con DELETE que responde 204. 

#### API de pedidos y reglas de negocio 

Implementar la creación transaccional del pedido desde el carrito (RN-01), la máquina de estados (RN-02), la cancelación con restitución de stock (RN-03), los permisos por dueño y rol (RN-04), la inmutabilidad de líneas y total (RN-05), la validación de forma de pago y dirección (RN-06) y el resumen para el panel. Los códigos de error de cada endpoint son los de la especificación. 

Programación 4 

Página 3 de 23 

Tecnicatura Universitaria en Programación a Distancia 



Frontend: cliente 

Construir las pantallas de login, registro, catálogo (paginado en el servidor, con búsqueda, filtro por categoría, skeleton y estado vacío), carrito persistido, checkout con TanStack Form y «Mis pedidos» con detalle y cancelación en PENDIENTE. 

Frontend: panel de administración 

Construir las pantallas de resumen (tarjetas con los indicadores), ABM de categorías y productos con TanStack Table y TanStack Form (incluido el cambio de stock y disponibilidad), gestión de pedidos con cambio de estado y gestión de usuarios con activar y desactivar. 

Frontend: estado, datos y sesión 

Acceder a la API con una instancia de Axios con withCredentials e interceptor de 401; obtener y modificar los datos del servidor con TanStack Query ( useQuery , useMutation , invalidación); mantener la sesión en authStore y el carrito en cartStore con Zustand y persist ; proteger las rutas de cliente y de administración con ProtectedRoute . 

Calidad y entrega 

TypeScript con strict: true y sin any ; nombres consistentes; README.md en la raíz con requisitos, instalación, ejecución, variables de entorno, usuario del seed y URL del repositorio. La organización del frontend por features se exige como arquitectura del proyecto. 

## Modelo de dominio 

### Entidades 

Cinco tablas. Tipos: claves int autoincrementales, montos float y fechas datetime . Las restricciones ( == 0 , == 1 , largos, valores permitidos) se validan en los schemas con Field y en el Service; no se exigen CHECK en la base. 

|Entidad|Campos|Reglas|
|---|---|---|
|Usuario|id,<br>username(único),<br>full_name,<br>email|El registro público crea|
||(único),<br>hashed_password,<br>role(<br>user o|usuarios con rol<br>user.Baja|
||admin),<br>disabled(default<br>false),<br>created_at|lógica con<br>disabled.|



Programación 4 

Página 4 de 23 

Tecnicatura Universitaria en Programación a Distancia 



|Entidad|Campos|Reglas|
|---|---|---|
|Categoria|id,<br>nombre(único, 2a100caracteres),<br>descripcion,<br>activo(default<br>true)|Baja lógica con<br>activo.|
|Producto|id,<br>categoria_id(FK a Categoria),<br>nombre,<br>descripcion,<br>precio_base(<br>==0),<br>imagen_<br>url,<br>stock(<br>==0,default0),<br>disponible<br>(default<br>true),<br>activo(default<br>true)|Pertenece a una categoría<br>(1:N).Baja lógica con<br>activo.<br>Solo se vende si está activo,<br>disponible y con stock<br>suficiente.|
|Pedido|id,<br>usuario_id(FK a Usuario),<br>estado(default<br>PENDIENTE),<br>forma_pago(<br>EFECTIVO o<br>TRANSFERENCIA),<br>direccion_entrega(5a200<br>caracteres),<br>notas(opcional),<br>total,<br>created_<br>at,<br>updated_at|total=suma de los<br>subtotales de sus líneas;fijo<br>desde la creación.No se<br>borra:se cancela.|
|DetallePedido|id,<br>pedido_id(FK a Pedido),<br>producto_id(FK a<br>Producto),<br>cantidad(<br>==1),<br>nombre_producto,<br>precio_unitario,<br>subtotal|Línea inmutable con copia del<br>nombre y del precio.<br>subtotal = precio_<br>unitario × cantidad.|



### Máquina de estados del pedido 

|Estado|Significado|Transiciones válidas|Quién|
|---|---|---|---|
|PENDIENTE|Pedido creado|a<br>EN_PREPARACION,a|admin avanza o cancela;el|
|||CANCELADO|cliente dueño cancela|
|EN_|Se está|a<br>ENTREGADO,a|admin|
|PREPARACION|preparando|CANCELADO||
|ENTREGADO|Terminal|ninguna|—|
|CANCELADO|Terminal|ninguna|—|



El mapa de transiciones vive en el Service de pedidos como un diccionario; toda transición se valida antes de modificar el pedido. 

### Reglas de negocio 

- RN-01 Crear pedido. Al menos un ítem y ningún producto repetido entre los ítems. Cada producto debe existir, estar activo y disponible y tener stock suficiente. Por cada ítem, en la misma iteración, se verifica el stock, se descuenta y se crea la línea copiando 

- nombre_producto y precio_unitario ; se calculan los subtotales y el total , y el pedido nace 

- en PENDIENTE . Todo ocurre en una sola transacción: si falla una validación, no se persiste nada. 

- RN-02 Transiciones. Solo las de la tabla de estados; un estado terminal no admite cambios. Una transición inválida responde 400. 

Programación 4 

Página 5 de 23 

Tecnicatura Universitaria en Programación a Distancia 



- RN-03 Cancelar. Restituye el stock de cada línea en la misma transacción que cambia el estado. 

- RN-04 Permisos. El cliente solo ve y cancela sus propios pedidos y solo desde PENDIENTE ; el admin ve todos y puede avanzar o cancelar desde cualquier estado no terminal. 

- RN-05 Inmutabilidad. Las líneas y el total no cambian después de crear el pedido. No hay endpoint de edición ni de borrado de pedidos. 

- RN-06 Datos del pedido. forma_pago es EFECTIVO o TRANSFERENCIA y direccion_entrega tiene entre 5 y 200 caracteres. Se validan en el schema. 

### Roles y permisos 

|Rol|Permisos|Restricciones|
|---|---|---|
|admin|CRUD de categorías y productos,stock,ver todos los pedidos,|No puede|
||avanzar y cancelar pedidos,resumen,listar,activar y desactivar|desactivarse a sí|
||usuarios.También puede crear pedidos como cualquier usuario con<br>sesión.|mismo.|
|user|Ver catálogo,crear pedidos,ver y cancelar sus pedidos(solo en|Solo accede a sus|
||PENDIENTE).|propios pedidos.|



## Especificación del backend 

API REST construida con FastAPI y SQLModel sobre PostgreSQL. Expone todos los endpoints bajo /api/v1 y documenta la API en /docs y /redoc . 

### Stack del backend 

Las versiones se fijan en requirements.txt . 

|Tecnología|Versión|Rol|
|---|---|---|
|Python|3.11a3.13 (SQLModel0.0.22no funciona<br>con3.14)|Lenguaje|
|FastAPI|fastapi[standard]0.115o superior(el<br>extra instala uvicorn y email-validator)|Framework REST y OpenAPI|
|SQLModel|0.0.22o superior|ORM y schemas Pydantic v2|
|PostgreSQL+<br>psycopg2-binary|PostgreSQL15o superior;psycopg2-<br>binary2.9|Base de datos.Para desarrollo<br>local se acepta SQLite<br>cambiando<br>DATABASE_URL|
|python-<br>jose[cryptography]|3.5.0|Firma y validación de JWT|



Programación 4 

Página 6 de 23 

Tecnicatura Universitaria en Programación a Distancia 



|Tecnología|Versión|Rol|
|---|---|---|
|Passlib+bcrypt|passlib[bcrypt]==1.7.4 y|Hash de contraseñas|
||bcrypt==4.0.1(fijar ambas:Passlib||
||falla con bcrypt5)||
|pydantic-settings,|2.x; 0.0.20|Variables de entorno;formulario|
|python-multipart||OAuth2del login|



### Arquitectura en capas 

Módulos por dominio y, dentro de cada módulo, la cadena Router, Service, Unit of Work, Repository y Model. El flujo de dependencias es unidireccional: ninguna capa importa de la capa superior. 

|Capa|Archivo|Responsabilidad|Conoce a|
|---|---|---|---|
|Router|router.py|HTTP:valida el cuerpo con schemas,resuelve sesión<br>y rol con<br>Depends,delega al Service y traduce las<br>excepciones de dominio a<br>HTTPException.|Service|
|Service|service.py|Reglas de negocio.Abre el Unit of Work con<br>with<br>self.uow as uow: y devuelve el schema de salida<br>dentro del bloque.|Unit of Work|
|Unit of<br>Work|unit_of_<br>work.py|Crea la sesión,expone los repositorios que la<br>comparten y hace commit o rollback en<br>__exit__.|Repository,<br>Session|
|Repository|repository.<br>py|Consultas con<br>select;hereda de<br>BaseRepository[T].Sin reglas de negocio.|Model,<br>Session|
|Model|models.py|Tablas SQLModel(<br>table=True)y relaciones.|Ninguna|
|Schemas|schemas.py|Modelos de entrada y salida(SQLModel sin<br>table=True).|Ninguna|



##### REGLA DEL UNIT OF WORK 

El commit ocurre en el =_exit=_ del Unit of Work. Ningún Service ni Router llama a session.commit() . El Router obtiene el Service con Depends(get_<modulo>_service) y nunca abre el Unit of Work. Esta regla se exige en categorias , productos y pedidos ; los módulos auth y usuarios pueden conservar el estilo del proyecto de seguridad del que se parte. Se aceptan los nombres de archivo de ese proyecto ( model.py , core/uow.py ). 

Programación 4 

Página 7 de 23 

Tecnicatura Universitaria en Programación a Distancia 



### Componentes del núcleo ( app/core/ ) 

|Componente|Archivo|Provee|
|---|---|---|
|Configuración|config.py|Settings con pydantic-settings:<br>DATABASE_URL,<br>SECRET_KEY,<br>ALGORITHM,<br>ACCESS_TOKEN_EXPIRE_MINUTES,<br>FRONTEND_<br>ORIGIN.|
|Base de datos|database.py|engine,<br>create_all_tables y<br>session_factory.|
|Seguridad|security.py|Hash y verificación con bcrypt,<br>create_access_token y<br>decode_access_token.|
|Dependencias|deps.py|get_current_user(lee la cookie),<br>get_current_active_<br>user(rechaza<br>disabled)y<br>require_role.|
|Unit of Work|unit_of_work.|Clase<br>UnitOfWork:abre la sesión en<br>__enter__;commit,|
|base|py|rollback y close en<br>__exit__.|
|Repositorio|base_|BaseRepository[T] con<br>get_by_id,<br>get_all,<br>add y|
|base|repository.py|delete.|



### Módulos de dominio ( app/modules/ ) 

|Módulo|Contenido|Consultas propias del<br>repositorio|
|---|---|---|
|auth|Registro,login con cookie HttpOnly,logout y perfil(<br>/me).<br>Usa el modelo Usuario.|—|
|usuarios|Modelo Usuario;listado,activación y desactivación por el<br>admin.|get_by_username,<br>get_by_email|
|categorias|CRUD con baja lógica y nombre único.|get_by_nombre|
|productos|CRUD,stock y disponibilidad,baja lógica,listado paginado<br>con búsqueda.|search(nombre,<br>categoría,disponible)|
|pedidos|Creación transaccional,máquina de estados,cancelación y<br>resumen.Su Unit of Work expone los repositorios de pedidos<br>y productos.|list_by_usuario,<br>count_by_estado|



### Estructura de carpetas del backend 

Cada módulo de app/modules/ repite la misma cadena de archivos; se despliega pedidos/ como ejemplo. 

Programación 4 

Página 8 de 23 

Tecnicatura Universitaria en Programación a Distancia 



|bac|kend|/||
|---|---|---|---|
|app|/||Paquete de la aplicación.|
|`├──`|mai|n.py|Crea la aplicación FastAPI,registra CORS con credenciales e<br>incluye los routers con el prefijo/api/v1.|
|**`├──`**|cor|e/|Infraestructura compartida por todos los módulos.|
|`│`|`├──`|config.py|Settings con pydantic-settings,leídas de.env.|
|`│`|`├──`|database.py|engine,create_all_tables y session_factory.|
|`│`|`├──`|security.py|Hash bcrypt,create_access_token y decode_access_token.|
|`│`|`├──`|deps.py|get_current_user,get_current_active_user y require_role.|
|`│`|`├──`|unit_of_work.py|UnitOfWork base:commit,rollback y close en__exit__.|
|`│`|`└──`|base_repository.py|BaseRepository[T]:get_by_id,get_all,add y delete.|
|**`├──`**|mod|ules/|Un paquete por dominio.|
|**`│`**|**`├──`**|auth/|router.py,service.py y schemas.py;usa el modelo Usuario.|
|**`│`**|**`├──`**|usuarios/|models,schemas,repository,unit_of_work,service y router.|
|**`│`**|**`├──`**|categorias/|Misma cadena de archivos que usuarios.|
|**`│`**|**`├──`**|productos/|Misma cadena de archivos que usuarios.|
|**`│`**|**`└──`**|pedidos/|Dominio central,desplegado como ejemplo:|
|`│`||`├──`models.py|Pedido y DetallePedido.|
|`│`||`├──`schemas.py|PedidoCreate,PedidoRead,CambioEstado,ResumenPedidos y los<br>demás schemas del módulo.|
|`│`||`├──`repository.py|PedidoRepository:list_by_usuario y count_by_estado.|
|`│`||`├──`unit_of_work.py|PedidoUnitOfWork:repositorios de pedidos y de productos sobre<br>la misma sesión.|
|`│`||`├──`service.py|RN-01a RN-06,mapa de transiciones y excepciones de dominio.|
|`│`||`└──`router.py|get_pedido_service,endpoints de pedidos y traducción de<br>errores.|
|**`└──`**|db/|||
||`└──`|seed.py|Carga admin,categorías y productos;idempotente.|
|req|uire|ments.txt|Dependencias con versiones fijadas.|



Los nombres de archivo son orientativos; lo que se evalúa son las piezas y sus responsabilidades. 

### Modelos y relaciones 

Las cinco entidades se implementan según el diagrama UML adjunto (Figura 1, en el anexo): nombres de campos, tipos, valores por defecto, claves y relaciones. Las relaciones se declaran con Relationship y back_populates , con estos nombres exactos, porque los schemas de lectura dependen de ellos: 

Programación 4 

Página 9 de 23 

Tecnicatura Universitaria en Programación a Distancia 



|Relación|Atributos|
|---|---|
|Categoria1:N Producto|Categoria.productos y<br>Producto.categoria|
|Usuario1:N Pedido|Usuario.pedidos y<br>Pedido.usuario|
|Pedido1:N DetallePedido|Pedido.items y<br>DetallePedido.pedido|
|Producto1:N DetallePedido|Producto.detalles y<br>DetallePedido.producto|



### Autenticación y autorización 

|Paso|Actor|Acción|Resultado|
|---|---|---|---|
|1|Cliente|POST /api/v1/auth/token con formulario<br>OAuth2 (<br>username,<br>password)|200;el JWT viaja en la cookie<br>HttpOnly<br>access_token,que<br>expira a los30minutos.El<br>cuerpo no incluye el token.|
|2|Navegador|Adjunta la cookie en cada petición(Axios<br>con<br>withCredentials: true).|El frontend nunca lee ni guarda el<br>token.|
|3|Backend|get_current_user lee la cookie,valida<br>firma y expiración y carga el usuario;<br>get_<br>current_active_user rechaza usuarios<br>con<br>disabled.|401sin sesión válida; 400si la<br>cuenta está desactivada.|
|4|Backend|require_role(["admin"]) verifica el rol<br>del usuario.|403si el rol no está permitido.|
|5|Cliente|POST /api/v1/auth/logout|200;la respuesta borra la cookie.|



### API REST 

Convenciones. Prefijo /api/v1 ; documentación en /docs y /redoc . Los listados paginados reciben skip y limit (default 0 y 20, máximo 100) y devuelven { "total": N, "items": [==.] } ; opcionalmente pueden aceptar además page y size y devolver page , size y pages . Los listados públicos devuelven solo registros activos. Un registro dado de baja se trata como inexistente: su detalle, PUT , PATCH y DELETE responden 404. La baja lógica de una categoría no libera su nombre único ni oculta sus productos: para retirar una categoría del catálogo se dan de baja también sus productos. PUT actualiza los campos enviados y conserva los demás (actualización parcial). Activar y desactivar un usuario son operaciones idempotentes: responden 200 aunque el estado no cambie. 

Errores. Todo error responde HTTPException con detail . Hay cuatro códigos comunes que no se repiten en las tablas: 

Programación 4 

Página 10 de 23 

Tecnicatura Universitaria en Programación a Distancia 



|Código|Cuándo|Quién lo produce|
|---|---|---|
|401|Falta la cookie o el token es inválido o venció,en<br>cualquier endpoint con acceso«Sesión», «Dueño»<br>o<br>admin.|get_current_user|
|400 «Cuenta de<br>usuario desactivada»|Usuario con<br>disabled = true,en el login y en<br>cualquier endpoint con sesión.|get_current_<br>active_user y el<br>login|
|403|El rol no está permitido,en cualquier endpoint con<br>acceso<br>admin.|require_role|
|422|El cuerpo o los parámetros no pasan la validación<br>del schema.|FastAPI|



Las tablas siguientes listan, en la columna «Errores», solo los códigos propios de cada endpoint. El Service los produce lanzando excepciones de dominio definidas en su service.py ; el Router las captura con try/except y responde el código indicado. 

|Excepción de dominio|Código|
|---|---|
|CategoriaNoEncontrada,<br>ProductoNoEncontrado,<br>PedidoNoEncontrado,|404|
|UsuarioNoEncontrado||
|NombreDuplicado,<br>UsuarioDuplicado|409|
|PedidoAjeno|403|
|StockInsuficiente,<br>ProductoNoDisponible,<br>ProductoRepetido,|400|
|TransicionInvalida y las demás reglas de negocio||



En auth y usuarios se admite lanzar HTTPException directamente desde el Service, como en el proyecto de seguridad de la materia. 

#### Auth y usuarios 

|Método|Endpoint|Descripción|Acceso|Respuesta|Errores|
|---|---|---|---|---|---|
|POST|/auth/|Registra un|Público|201<br>UserPublic|409si|
||register|usuario con rol|||username o|
|||user.|||email ya<br>existen|
|POST|/auth/token|Login con|Público|200<br>{ "message":|401credenciales|
|||formulario||"Login exitoso" }|incorrectas; 400|
|||OAuth2;|||cuenta|
|||establece la<br>cookie.|||desactivada|



Programación 4 

Página 11 de 23 

Tecnicatura Universitaria en Programación a Distancia 



|Método|Endpoint|Descripción|Acceso|Respuesta|Errores|
|---|---|---|---|---|---|
|POST|/auth/<br>logout|Borra la cookie.|Público|200|—|
|GET|/auth/me|Usuario<br>autenticado.|Sesión|200<br>UserPublic|—|
|GET|/admin/<br>usuarios|Listado de<br>usuarios.|admin|200<br>list[UserPublic]|—|
|POST|/admin/<br>usuarios/<br>{id}/activar|Alta lógica<br>(<br>disabled =<br>false).|admin|200<br>UserPublic|404|
|POST|/admin/<br>usuarios/<br>{id}/<br>desactivar|Baja lógica<br>(<br>disabled=<br>true).|admin|200<br>UserPublic|404; 400si el<br>admin intenta<br>desactivarse a sí<br>mismo|



#### Categorías 

|Método|Endpoint|Descripción|Acceso|Respuesta|Errores|
|---|---|---|---|---|---|
|GET|/categorias|Lista las activas.|Público|200<br>list[CategoriaRead]|—|
|GET|/categorias/<br>{id}|Detalle.|Público|200<br>CategoriaRead|404|
|POST|/categorias|Crea;nombre único.|admin|201<br>CategoriaRead|409|
|PUT|/categorias/<br>{id}|Actualiza.|admin|200<br>CategoriaRead|404,<br>409|
|DELETE|/categorias/<br>{id}|Baja lógica(<br>activo<br>= false).|admin|204sin cuerpo|404|



#### Productos 

|Método|Endpoint|Descripción|Acceso|Respuesta|Errores|
|---|---|---|---|---|---|
|GET|/|Lista activos.Query:|Público|200|—|
||productos|skip,<br>limit,<br>search(sobre<br>nombre,sin<br>distinguir<br>mayúsculas),<br>categoria_id,<br>disponible.||ProductosPaginados||



Programación 4 

Página 12 de 23 

Tecnicatura Universitaria en Programación a Distancia 



|Método|Endpoint|Descripción|Acceso|Respuesta|Errores|
|---|---|---|---|---|---|
|GET|/<br>productos/<br>{id}|Detalle con su<br>categoría.|Público|200<br>ProductoRead|404|
|POST|/<br>productos|Crea con<br>categoria_id.|admin|201<br>ProductoRead|404si la<br>categoría no<br>existe o está<br>dada de baja|
|PUT|/<br>productos/<br>{id}|Actualiza los<br>campos enviados.|admin|200<br>ProductoRead|404producto<br>inexistente;<br>404si la nueva<br>categoría no<br>existe o está<br>dada de baja|
|PATCH|/<br>productos/<br>{id}/stock|Actualiza<br>stock y<br>disponible.|admin|200<br>ProductoRead|404|
|DELETE|/<br>productos/<br>{id}|Baja lógica(<br>activo<br>=false).|admin|204sin cuerpo|404|



|Pedidos|
|---|



|Método|Endpoint|Descripción|Acceso|Respuesta|Errores|
|---|---|---|---|---|---|
|POST|/pedidos|Crea el pedido<br>desde el carrito<br>(RN-01).|Sesión|201<br>PedidoRead|404producto<br>inexistente o<br>inactivo; 400stock<br>insuficiente,<br>producto no<br>disponible o<br>repetido|
|GET|/pedidos|Propios(<br>user)o<br>todos(<br>admin).<br>Query:<br>skip,<br>limit,<br>estado.|Sesión|200<br>PedidosPaginados|—|
|GET|/pedidos/<br>resumen|Indicadores del<br>panel.Se declara<br>antes de<br>/{id}.|admin|200<br>ResumenPedidos|—|
|GET|/pedidos/<br>{id}|Detalle con sus<br>líneas.|Dueño o<br>admin|200<br>PedidoRead|404; 403si el<br>pedido es de otro<br>usuario|



Programación 4 

Página 13 de 23 

Tecnicatura Universitaria en Programación a Distancia 



|Método|Endpoint|Descripción|Acceso|Respuesta|Errores|
|---|---|---|---|---|---|
|PATCH|/pedidos/|Avanza o cancela|admin|200<br>PedidoRead|404; 400transición|
||{id}/|según la máquina|||inválida|
||estado|de estados(RN-<br>02,RN-03).||||
|PATCH|/pedidos/|Cancela un|Dueño|200<br>PedidoRead|404; 403pedido|
||{id}/|pedido propio en|||ajeno; 400si no|
||cancelar|PENDIENTE(RN-|||está en<br>PENDIENTE|
|||03,RN-04).||||



### Schemas 

Los schemas son SQLModel sin table=True ; los de lectura permiten 

Modelo.model_validate(objeto) dentro del Unit of Work. Nunca se expone un modelo de tabla como respuesta. 

|Schema|Campos|Validaciones|
|---|---|---|
|UserCreate/<br>UserPublic|username,<br>full_name,<br>email,<br>password(<br>UserPublic:<br>id,<br>username,<br>full_name,<br>email,<br>role,<br>disabled,<br>created_at;nunca<br>hashed_<br>password)|password mínimo8<br>caracteres.|
|CategoriaCreate/<br>CategoriaUpdate/<br>CategoriaRead|nombre,<br>descripcion(+<br>id,<br>activo<br>en Read)|nombre2a100<br>caracteres.|
|ProductoCreate/<br>ProductoUpdate/<br>ProductoRead|nombre,<br>descripcion,<br>precio_base,<br>imagen_url,<br>stock,<br>disponible,<br>categoria_id(+<br>id,<br>activo,<br>categoria: CategoriaRead en Read)|precio_base==0,<br>stock==0.|
|ProductoStockUpdate|stock,<br>disponible|stock==0.|
|ProductosPaginados|total: int,<br>items:<br>list[ProductoRead]|—|
|ItemPedidoCreate|producto_id,<br>cantidad|cantidad==1.|
|PedidoCreate|items: list[ItemPedidoCreate],<br>forma_pago,<br>direccion_entrega,<br>notas|Mínimo1ítem;<br>forma_<br>pago en(<br>EFECTIVO,<br>TRANSFERENCIA);<br>direccion_entrega5a<br>200caracteres.|



Programación 4 

Página 14 de 23 

Tecnicatura Universitaria en Programación a Distancia 



|Schema|Campos|Validaciones|
|---|---|---|
|DetallePedidoRead|producto_id,<br>nombre_producto,<br>precio_unitario,<br>cantidad,<br>subtotal|—|
|PedidoRead|id,<br>usuario_id,<br>estado,<br>forma_<br>pago,<br>direccion_entrega,<br>notas,<br>total,<br>created_at,<br>updated_at,<br>items: list[DetallePedidoRead]|—|
|PedidosPaginados|total,<br>items: list[PedidoRead]|—|
|CambioEstado|estado|Uno de los cuatro estados.|
|ResumenPedidos|pendientes,<br>en_preparacion,<br>entregados,<br>cancelados,<br>pedidos_<br>hoy,<br>ingresos_entregados|Conteos con<br>func.count;<br>ingresos_entregados=<br>suma de<br>total de los<br>pedidos<br>ENTREGADO.|



### Flujo de crear pedido con Unit of Work 

|Paso|Capa|Operación|BD|
|---|---|---|---|
|1|Router|Recibe<br>POST /api/v1/pedidos,valida<br>PedidoCreate y obtiene el<br>usuario con<br>get_current_active_user.|No|
|2|Service|Abre<br>with self.uow as uow:,valida que no haya productos<br>repetidos y crea el<br>Pedido en<br>PENDIENTE con<br>total = 0.|INSERT|
|3|Service|Por cada ítem:obtiene el producto con<br>uow.productos.get_by_id<br>(<br>ProductoNoEncontrado si no existe o no está activo);verifica<br>disponible(<br>ProductoNoDisponible)y<br>stock==cantidad<br>(<br>StockInsuficiente);descuenta<br>producto.stock;crea el<br>DetallePedido con<br>nombre_producto,<br>precio_unitario y<br>subtotal;acumula el<br>total.|Lectura,<br>UPDATE,<br>INSERT|
|4|Service|Asigna<br>pedido.total con la suma de los subtotales.|UPDATE|
|5|Service|Convierte a<br>PedidoRead con<br>model_validate dentro del bloque y<br>lo devuelve.|Lectura|
|6|UoW|__exit__ sin excepción:commit y close.Con excepción:rollback y<br>close;no se persiste nada,tampoco el descuento de stock.|COMMIT/<br>ROLLBACK|
|7|Router|Responde201con el<br>PedidoRead;<br>ProductoNoEncontrado<br>responde404;<br>StockInsuficiente,<br>ProductoRepetido u otra<br>regla, 400.|No|



Programación 4 

Página 15 de 23 

Tecnicatura Universitaria en Programación a Distancia 



### Configuración y ejecución del backend 

|Variable|Descripción|Valor de ejemplo|
|---|---|---|
|DATABASE_URL|Conexión a la base|postgresql://user:pass@localhost:5432/<br>foodstore_db(desarrollo:<br>sqlite:///./foodstore.<br>db)|
|SECRET_KEY|Firma del JWT,<br>mínimo32<br>caracteres|cambiar-esta-clave-de-al-menos-32-caracteres|
|ALGORITHM|Algoritmo del JWT|HS256|
|ACCESS_TOKEN_<br>EXPIRE_MINUTES|Expiración de la<br>cookie y del token|30|
|FRONTEND_ORIGIN|Origen permitido en<br>CORS|http://localhost:5173|



python -m app.db.seed es idempotente: crea el usuario admin ( admin / Admin1234! , rol admin ), al menos 3 categorías y 8 productos con stock. Ejecución: pip install -r requirements.txt , copiar .env.example a .env , python -m app.db.seed , uvicorn app.main:app -reload . 

## Especificación del frontend 

Aplicación React + TypeScript construida con Vite y estilada con Tailwind CSS. Consume la API con Axios, gestiona el estado del servidor con TanStack Query y el estado del cliente con Zustand. 

### Stack del frontend 

Las versiones se fijan en package.json . 

|Tecnología|Versión|Rol|
|---|---|---|
|Node.js|20.19o superior|Entorno de ejecución de las herramientas|
|React+|19.x+ 5.9o superior|Interfaz|
|TypeScript|||
|Vite|7o superior|Build y servidor de desarrollo|
|Tailwind CSS|4.x con<br>@tailwindcss/vite|Estilos|
|TanStack Query|5.x|Estado del servidor:fetching,caché e<br>invalidación|
|TanStack Form|1.x|Formularios con validación|



Programación 4 

Página 16 de 23 

Tecnicatura Universitaria en Programación a Distancia 



|Tecnología|Versión|Rol|
|---|---|---|
|TanStack Table|8.x|Tablas del panel de administración|
|React Router|react-router-<br>(<br>BrowserRou|dom7.x<br>ter)<br>Navegación y rutas protegidas|
|Zustand|5.x|Estado global del cliente(sesión y carrito)|
|Axios|1.x|Cliente HTTP con<br>withCredentials e<br>interceptor de401|
|pnpm|9o superior|Gestor de paquetes|
|rquitectura p<br>l frontend se or<br>cceso a la API <br>s rutas en<br>rou<br>Pieza|or features<br>ganiza por dom<br>y tipos.Lo trans<br>tes/.Las featu<br>Carpeta|inios:cada feature agrupa sus páginas,componentes,hooks,<br>versal vive en<br>shared/,el estado global del cliente en<br>store/<br>res espejan los módulos del backend.<br>Responsabilidad|
|Páginas|pages/|Componen la pantalla de una ruta:obtienen datos con hooks o<br>directamente con<br>useQuery y los pasan a los componentes.|
|Componentes|components/|Presentación con props tipadas;pueden leer los stores de sesión y<br>carrito.|
|Hooks|hooks/|useQuery y<br>useMutation de TanStack Query con<br>queryKey<br>descriptivas e invalidación.|
|API|api/|Funciones que llaman a los endpoints con la instancia de Axios y<br>devuelven datos tipados.|
|Tipos|types/|Interfaces con los mismos nombres de campo que los schemas del<br>backend.|
|Stores|store/|Estado del cliente con Zustand:sesión(<br>authStore)y carrito<br>(<br>cartStore).|



### Arquitectura por features 

El frontend se organiza por dominios: cada feature agrupa sus páginas, componentes, hooks, acceso a la API y tipos. Lo transversal vive en shared/ , el estado global del cliente en store/ y las rutas en routes/ . Las features espejan los módulos del backend. 

SEPARACIÓN DEL ESTADO 

TanStack Query gestiona el estado del servidor: catálogo, pedidos, usuarios y resumen. Zustand gestiona el estado del cliente: sesión y carrito. Ningún componente obtiene datos del servidor con fetch dentro de useEffect ; la única llamada en useEffect es checkSession al montar la aplicación. 

Programación 4 

Página 17 de 23 

Tecnicatura Universitaria en Programación a Distancia 



### Componentes compartidos 

|Car<br>sha|peta<br>red|Componentes<br>Uso<br>/api/<br>axiosInstance.ts,<br>handleApiError.ts,<br>queryClient.ts<br>Cliente HTTP único,mensajes de error a partir de<br>detail e instancia de TanStack Query.|
|---|---|---|
|sha|red|/ui/<br>Button,<br>Card,<br>Input,<br>Modal,<br>BadgeEstado<br>Piezas visuales base con Tailwind;<br>BadgeEstado<br>colorea los cuatro estados del pedido.|
|sha<br>comp|red<br>one|/<br>nts/<br>Paginacion,<br>Skeleton,<br>EstadoVacio,<br>EstadoError<br>Estados de carga,vacío y error reutilizados en<br>todas las listas.|
|sha<br>layo<br>str<br>ada <br>jem|red<br>ut/<br>uct<br> fea<br>plo.|/<br><br>Navbar,<br>MainLayout<br>Navbar con nombre y rol, «Cerrar sesión»y<br>acceso al panel solo para<br>admin;<br>MainLayout<br>reúne la<br>Navbar y el contenido de la ruta.<br>ura de carpetas del frontend<br>ture de<br>src/features/ repite la misma organización;se despliega<br>pedidos/ como|
|fro|nten|d/|
|src|/||
|**`├──`**|sha|red/<br>Transversal,sin lógica de negocio.|
|**`│`**|**`├──`**|api/|
|`│`|`│`|`├──`axiosInstance.ts<br>baseURL=VITE_API_URL,withCredentials e interceptor de401.|
|`│`|`│`|`├──`handleApiError.ts<br>Convierte el detail de la API en un mensaje para la pantalla.|
|`│`|`│`|`└──`queryClient.ts<br>Instancia única de TanStack Query.|
|**`│`**|**`├──`**|ui/<br>Button,Card,Input,Modal y BadgeEstado.|
|**`│`**|**`├──`**|components/<br>Paginacion,Skeleton,EstadoVacio y EstadoError.|
|**`│`**|**`└──`**|layout/<br>Navbar y MainLayout.|
|**`├──`**|fea|tures/<br>Un dominio por carpeta:pages,components,hooks,api y types.|
|**`│`**|**`├──`**|auth/<br>LoginPage,RegisterPage y UnauthorizedPage.|
|**`│`**|**`├──`**|categorias/<br>AdminCategoriasPage y useCategorias.|
|**`│`**|**`├──`**|productos/<br>CatalogoPage,AdminProductosPage,ProductoCard y<br>useProductos.|
|**`│`**|**`├──`**|usuarios/<br>AdminUsuariosPage y useUsuarios.|
|**`│`**|**`└──`**|pedidos/<br>Desplegado como ejemplo:|
|**`│`**||**`├──`**pages/<br>CarritoPage,CheckoutPage,MisPedidosPage,AdminPedidosPage<br>y AdminResumenPage.|



### Estructura de carpetas del frontend 

Cada feature de src/features/ repite la misma organización; se despliega pedidos/ como ejemplo. 

Programación 4 

Página 18 de 23 

Tecnicatura Universitaria en Programación a Distancia 



|**`│`** **`├──`**components/|Formulario de checkout,detalle del pedido,tabla de pedidos y|
|---|---|
||tarjeta de resumen.|
|**`│`** **`├──`**hooks/|usePedidos,useCrearPedido,useCambiarEstadoPedido,<br>useCancelarPedido y useResumenPedidos.|
|**`│`** **`├──`**api/|pedidos.ts:funciones que llaman a/pedidos.|
|**`│`** **`└──`**types/|Pedido,DetallePedido,EstadoPedido y ResumenPedidos.|
|**`├──`**store/||
|`│` `├──`authStore.ts|usuario,cargando,login,logout y checkSession;persist con<br>partialize.|
|`│` `└──`cartStore.ts|items,agregar,quitar,cambiarCantidad,vaciar y total;persist.|
|**`├──`**routes/||
|`│` `├──`AppRouter.tsx|BrowserRouter y la tabla de rutas.|
|`│` `└──`ProtectedRoute.tsx|Sin sesión redirige a/login;sin el rol,a/unauthorized.|
|`├──`App.tsx|Llama a checkSession al montar y renderiza AppRouter.|
|`├──`main.tsx|QueryClientProvider.|
|`└──`index.css|@import"tailwindcss".|
|.env.example|VITE_API_URL.|
|package.json|Dependencias con versiones fijadas.|
|vite.config.ts|Plugins react y@tailwindcss/vite.|



Los nombres de archivo son orientativos; lo que se evalúa son las piezas y su comportamiento. Las consultas con TanStack Query pueden vivir en hooks propios o directamente en la página. 

### Rutas y pantallas 

|Ruta|Pantalla|Acceso|Qué hace|
|---|---|---|---|
|/login,<br>/<br>register|Formularios<br>con TanStack<br>Form|Público|Login con<br>username y<br>password;registro con<br>validación.|
|/|Catálogo|Público|Lista paginada en el servidor(<br>skip = página ×<br>limit)con búsqueda y filtro por categoría;<br>skeleton mientras carga;estado vacío;botón<br>«Agregar al carrito».|
|/carrito|Carrito|Público|Ítems,cantidades,subtotal y total;persiste al<br>recargar.|
|/checkout|Confirmar<br>pedido|Sesión|Formulario con<br>direccion_entrega,<br>forma_<br>pago y<br>notas;envía<br>POST /pedidos;vacía el<br>carrito y redirige a«Mis pedidos».|



Programación 4 

Página 19 de 23 

Tecnicatura Universitaria en Programación a Distancia 



|Ruta|Pantalla|Acceso|Qué hace|
|---|---|---|---|
|/mis-pedidos|Mis pedidos|Sesión|Lista y detalle de pedidos propios;botón cancelar<br>solo en<br>PENDIENTE.|
|/admin/resumen|Resumen|admin|Tarjetas con los indicadores de<br>ResumenPedidos.|
|/admin/<br>categorias,<br>/<br>admin/productos|ABM|admin|TanStack Table con paginación del lado del cliente<br>(el panel pide<br>limit=100);TanStack Form para<br>crear y editar;cambio de stock y disponibilidad.|
|/admin/pedidos|Pedidos|admin|Tabla con filtro por estado y botones para avanzar<br>o cancelar según la máquina de estados.|
|/admin/usuarios|Usuarios|admin|TanStack Table con<br>username,nombre,email,rol<br>y estado;botones Activar y Desactivar con<br>useMutation e invalidación.El botón Desactivar<br>no se muestra en la fila del usuario de la sesión.|
|/unauthorized|Sin permiso|Público|Mensaje y enlace al inicio.|



### Estado, datos y sesión 

|Pieza|Herramienta|Detalle|
|---|---|---|
|Estado del<br>servidor|TanStack Query|useQuery para listados y detalles con<br>queryKey descriptivas<br>(<br>['productos', filtros]);<br>useMutation para crear,editar,<br>borrar y cambiar estado,con<br>invalidateQueries en<br>onSuccess.|
|authStore|Zustand+<br>persist con<br>partialize|usuario(nombre,email y rol),<br>cargando y las acciones<br>login,<br>logout y<br>checkSession(llama a<br>/auth/me al montar la<br>aplicación).<br>partialize guarda solo<br>usuario;nunca el token.|
|cartStore|Zustand+<br>persist|Ítems(<br>producto_id,<br>nombre,<br>precio_unitario,<br>cantidad),<br>agregar,<br>quitar,<br>cambiarCantidad,<br>vaciar y<br>total.|
|Cliente HTTP|Axios|baseURL = VITE_API_URL,<br>withCredentials: true e<br>interceptor de respuesta:ante401fuera de<br>/auth/token y<br>/<br>auth/me,o ante400con<br>detail«Cuenta de usuario<br>desactivada»,limpia el<br>authStore;la vuelta a<br>/login la hace el<br>propio interceptor o<br>ProtectedRoute al quedar sin usuario.|
|Rutas<br>protegidas|React Router|ProtectedRoute redirige a<br>/login sin sesión y a<br>/<br>unauthorized si el rol no está permitido;muestra un indicador<br>mientras<br>checkSession confirma la sesión.La protección real<br>está en el backend:ocultar un botón no reemplaza a<br>require_<br>role.|
|Logout|authStore+<br>Axios|Llama a<br>POST /auth/logout,limpia el<br>authStore y redirige a<br>/<br>login.|



Programación 4 

Página 20 de 23 

Tecnicatura Universitaria en Programación a Distancia 



### Configuración y ejecución del frontend 

Variable VITE_API_URL en frontend/.env (ejemplo: http:=/localhost:8000/api/v1 ). Ejecución: pnpm install , pnpm build (verifica los tipos) y pnpm dev . 

## Criterios de evaluación 

Condición de aprobación. El trabajo se califica sobre 100 puntos y el resultado es Aprobado o Desaprobado. Se aprueba con 60 puntos o más, siempre que el proyecto corra siguiendo el README.md de la raíz; si no corre, se descuenta el 30 % de la nota antes de decidir el resultado. Un trabajo desaprobado recibe la devolución «Requiere correcciones» y se vuelve a presentar en la instancia siguiente con todas las observaciones resueltas y un video nuevo. Las instancias (primera entrega, recuperatorio en la primera mesa de examen y mesa de examen final) y sus fechas son las publicadas en el aula virtual. 

El puntaje se asigna sobre el código entregado, según los criterios de la tabla. 

|#|Criterio|Pts|Puntaje completo|Qué resta|
|---|---|---|---|---|
|1|Backend:<br>estructura y<br>configuración|10|Módulos por dominio con las capas y los<br>componentes del núcleo;<br>.env.example;<br>requirements.txt con versiones fijadas<br>(incluye<br>bcrypt==4.0.1);CORS con<br>credenciales;seed idempotente.|Capas mezcladas,<br>seed incompleto,<br>dependencias sin<br>fijar.|
|2|Modelo de<br>datos|10|Las5entidades del UML con sus campos,<br>relaciones con los nombres indicados,baja<br>lógica y copia de nombre y precio en<br>DetallePedido.|Entidades o campos<br>faltantes,líneas sin<br>copia de precio,<br>pedidos borrables.|
|3|Unit of Work y<br>Repository|10|UnitOfWork con<br>__exit__(commit,<br>rollback,close);<br>BaseRepository[T];en<br>categorias,<br>productos y<br>pedidos,<br>Services que abren el<br>with y devuelven<br>schemas dentro del bloque y Routers que no<br>abren el Unit of Work.|commit en Service o<br>Router;repositorios<br>con reglas de<br>negocio.|
|4|Autenticación y<br>usuarios|10|Registro,login con cookie HttpOnly,logout y<br>/<br>me con los códigos409, 401y400indicados;<br>get_current_user,<br>get_current_active_<br>user y<br>require_role;escrituras de catálogo<br>y gestión de pedidos y usuarios solo para<br>admin;listado,activación y desactivación de<br>usuarios(404, 400).|Token en el cuerpo o<br>en localStorage;<br>escrituras sin rol;<br>códigos incorrectos;<br>sin gestión de<br>usuarios.|



Programación 4 

Página 21 de 23 

Tecnicatura Universitaria en Programación a Distancia 



|#|Criterio|Pts|Puntaje completo|Qué resta|
|---|---|---|---|---|
|5|API de catálogo|10|Endpoints de categorías y productos con<br>verbos,códigos y schemas indicados;listado<br>paginado con<br>search y<br>categoria_id;<br>PATCH de stock;DELETE204lógico.|Códigos incorrectos,<br>sin paginación,<br>borrado físico.|
|6|API de pedidos<br>y reglas de<br>negocio|15|RN-01a RN-06;errores con los códigos<br>indicados;stock descontado y restituido en la<br>misma transacción;resumen correcto.|Reglas faltantes,<br>stock inconsistente,<br>cambios de estado<br>sin validar.|
|7|Frontend:<br>cliente|10|Login y registro con TanStack Form;catálogo<br>con búsqueda,filtro,paginación y skeleton;<br>carrito persistido;checkout con TanStack<br>Form;mis pedidos con detalle y cancelar.|Carencias<br>funcionales,sin<br>estados de carga o<br>vacío.|
|8|Frontend:panel<br>de<br>administración|10|ABM de categorías y productos con TanStack<br>Table y Form;stock;pedidos con cambio de<br>estado;usuarios con activar y desactivar;<br>resumen con tarjetas.|Falta alguna pantalla<br>o solo visualización.|
|9|Frontend:<br>estado,datos y<br>sesión|10|TanStack Query para los datos del servidor,<br>con invalidación;<br>authStore y<br>cartStore<br>tipados con<br>persist;Axios con<br>withCredentials e interceptor;<br>ProtectedRoute por rol.|fetch+<br>useEffect;stores<br>sin<br>persist;rutas<br>sin proteger.|
|10|Calidad y<br>entrega|5|TypeScript<br>strict sin<br>any;nombres<br>consistentes;<br>README.md de la raíz con pasos<br>que funcionan en una máquina limpia y la URL<br>del repositorio.|any extendido,<br>README incompleto.|



## Formato de entrega 

|Ítem|Descripción|
|---|---|
|CE-|Archivo<br>.zip del proyecto(sin<br>node_modules,<br>venv ni<br>.env)y repositorio público de|
|01|GitHub;la URL va en el<br>README.md de la raíz.|
|CE-|README.md en la raíz con requisitos,instalación y ejecución del backend y del frontend,|
|02|variables de entorno y usuario<br>admin del seed.Es el único README que se tiene en cuenta.|
|CE-|backend/.env.example y<br>frontend/.env.example completos.|
|03||
|CE-|python -m app.db.seed carga<br>admin,categorías y productos.|
|04||



Programación 4 

Página 22 de 23 

Tecnicatura Universitaria en Programación a Distancia 



|Ítem|Descripción|
|---|---|
|CE-|pip install -r requirements.txt y<br>uvicorn app.main:app sin errores;<br>/docs muestra|
|05|todos los endpoints.|
|CE-|pnpm install,<br>pnpm build y<br>pnpm dev sin errores.|
|06||
|CE-|Video de demostración de10a15minutos(link público en el README):presentación con la|
|07|cámara encendida al inicio,registro,compra como cliente,gestión como<br>admin y cancelación|
||con restitución de stock.|



## Anexo: diagrama UML del modelo de datos 



<!-- Start of picture text -->
Food Store — Modelo de datos<br>Trabajo Práctico Integrador · Programación 4<br>Usuarios<br>Catálogo Usuario<br>Categoria id : int {PK}<br>id : int {PK} Baja lógica: activo = false.No libera el nombre único ni username : str {UQ, NN}full_name : str {NN}<br>nombre : str {UQ, NN, 2..100}descripcion : str oculta sus productos. 1 usuario email : str {UQ, NN}hashed_password : str {NN}<br>activo : bool = true {NN} role : str = "user" {NN}<br>disabled : bool = false {NN}<br>1 categoria created_at : datetime {NN}<br>agrupa realiza<br>Pedidos<br>0..* productos 0..* pedidos<br>Producto Pedido<br>id : int {PK} id : int {PK} Estados del pedido<br>PENDIENTE → EN_PREPARACION | CANCELADO<br>categoria_id : int {FK, NN}nombre : str {NN}descripcion : strprecio_base : float {NN, >= 0}imagen_url : strstock : int = 0 {NN, >= 0}disponible : bool = true {NN} 1 producto usuario_id : int {FK, NN}estado : str = "PENDIENTE" {NN}forma_pago : str {NN}direccion_entrega : str {NN, 5..200}notas : strtotal : float {NN}created_at : datetime {NN} EN_PREPARACION → ENTREGADO | CANCELADOENTREGADO, CANCELADO: terminales (RN-02)admin avanza o cancela; el dueño cancelasolo en PENDIENTE (RN-04).forma_pago: EFECTIVO | TRANSFERENCIA (RN-06).total = Σ DetallePedido.subtotal; fijo (RN-05).No se borra: se cancela. role: "user" | "admin".El registro público crea "user".Baja lógica: disabled = true(el admin activa / desactiva).<br>activo : bool = true {NN} updated_at : datetime {NN}<br>1 pedido<br>referenciado en contiene<br>1..* items<br>0..* detalles DetallePedido<br>id : int {PK}<br>Se vende solo si activo, disponible<br>y stock >= cantidad (RN-01). pedido_id : int {FK, NN}<br>stock se descuenta al crear el pedido producto_id : int {FK, NN}<br>(RN-01) y se restituye al cancelar (RN-03). cantidad : int {NN, >= 1}<br>Baja lógica: activo = false. nombre_producto : str {NN}<br>precio_unitario : float {NN}<br>subtotal : float {NN}<br>Línea inmutable (RN-05): nombre_producto<br>y precio_unitario se copian del producto.<br>subtotal = precio_unitario × cantidad.<br>Un producto no se repite en el pedido (RN-01).<br>Notación<br>Marca Significado<br>{ P K } Clave primaria (int autoincremental)<br>{ F K } Clave foránea<br>{ N N } Obligatorio<br>{ U Q } Único<br>= valor Valor por defecto<br>>=  n, a..b Validación en schema y Service (largo o rango)<br>1 / 0..* nombre Multiplicidad y nombre del Relationship<br>◆ — Composición: las líneas pertenecen al pedidoAsociación por clave foránea<br><!-- End of picture text -->

Figura 1. Diagrama UML del modelo de datos. Se adjunta como UML_FOOD_STORE.svg y UML_FOOD_STORE.png ; el SVG permite ampliar sin pérdida. La leyenda del diagrama explica las marcas PK, FK, NN y UQ, los valores por defecto, las multiplicidades y las notas con las reglas de negocio. 

Programación 4 

Página 23 de 23 

