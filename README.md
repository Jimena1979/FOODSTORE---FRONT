# Food Store — Sistema de Pedidos de Comida

Trabajo Práctico Integrador — **Programación 4**

**Tecnicatura Universitaria en Programación a Distancia — UTN**

## Repositorio y Entrega

* **URL del repositorio BACK público:** `https://github.com/Jimena1979/FOODSTORE---BACK`

* **URL del repositorio FRONT público:** `https://github.com/Jimena1979/FOODSTORE---FRONT`

* **Video de demostración (10 a 15 minutos):** `https://drive.google.com/file/d/1iu6GUQXjXTsqQc9od9CDkiG1ZS7FeqKI/view?usp=sharing` 

## 1. Descripción General del Sistema

**Food Store** es una aplicación web full stack para gestionar un negocio de comidas con dos roles diferenciados (**`user`** y **`admin`**) y separación completa entre backend y frontend:

* **¿Qué hace el backend (`FOODSTORE - BACK`)?**
  Está construido con **FastAPI** y **SQLModel** bajo el prefijo `/api/v1` (con documentación interactiva en `/docs` y `/redoc`), persistiendo en **PostgreSQL** (o **SQLite** en desarrollo local). Organiza los dominios en módulos con arquitectura en capas (**Router**, **Service**, **Unit of Work**, **Repository**, **Models** y **Schemas**), aplica autenticación con **JWT en cookie `HttpOnly`**, protege rutas por sesión y rol, administra bajas lógicas y ejecuta reglas transaccionales en pedidos (descuento y restitución de stock, copia inmutable de nombre/precio/subtotal y máquina de estados).

* **¿Qué hace el frontend (`FOODSTORE - FRONT`)?**
  Está construido con **React + TypeScript + Vite + Tailwind CSS v4**, consumiendo la API con **Axios** (`withCredentials: true`), gestionando el estado del servidor con **TanStack Query** (consultas, mutaciones e invalidación) y el estado del cliente con **Zustand + persist** (`authStore` y `cartStore`). Incluye **TanStack Form** para formularios y **TanStack Table** para los paneles de administración, con rutas protegidas mediante `ProtectedRoute`. En `vite.config.ts` se utiliza `import.meta.dirname` en lugar de `__dirname` para evitar avisos de Vite en ESM.

## 2. Requisitos

### Backend (`FOODSTORE - BACK`)

* **Python:** 3.11 a 3.13

* **Base de datos:** PostgreSQL 15+ (para desarrollo local se admite SQLite cambiando `DATABASE_URL`)

* **Dependencias:** fijadas en `requirements.txt` (incluye `passlib[bcrypt]==1.7.4` y `bcrypt==4.0.1`)

### Frontend (`FOODSTORE - FRONT`)

* **Node.js:** 20.19 o superior

* **Gestor de paquetes:** `pnpm` 9 o superior

## 3. Variables de Entorno

### Backend (`FOODSTORE - BACK/.env.example` -> `FOODSTORE - BACK/.env`)

Copiá `.env.example` a `.env` dentro de `FOODSTORE - BACK` y completá los valores:

```
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/foodstore_db
SECRET_KEY=cambiar-esta-clave-de-al-menos-32-caracteres
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_ORIGIN=http://localhost:5173

```

> Para pruebas locales rápidas sin servidor PostgreSQL podés usar `DATABASE_URL=sqlite:///./foodstore.db`.
>
> Recordá mantener alineados los parámetros de conexión de PostgreSQL (`POSTGRES_DB`, usuario, contraseña y URL de conexión) con la base de datos existente y la configuración en `app/core/config.py`.

### Frontend (`FOODSTORE - FRONT/.env.example` -> `FOODSTORE - FRONT/.env`)

Copiá `.env.example` a `.env` dentro de `FOODSTORE - FRONT`:

```
VITE_API_URL=http://localhost:8000/api/v1

```

## 4. Árbol de Carpetas

```
FOODSTORE/
├── README.md
├── FOODSTORE - BACK/
│   ├── .env.example
│   ├── .env
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       ├── core/
│       │   ├── config.py
│       │   ├── database.py
│       │   ├── security.py
│       │   ├── deps.py
│       │   ├── unit_of_work.py
│       │   └── base_repository.py
│       ├── db/
│       │   └── seed.py
│       └── modules/
│           ├── auth/
│           ├── usuarios/
│           ├── categorias/
│           ├── productos/
│           └── pedidos/
└── FOODSTORE - FRONT/
    ├── .env.example
    ├── .env
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── index.css
        ├── main.tsx
        ├── shared/
        │   ├── api/
        │   ├── components/
        │   ├── layout/
        │   └── ui/
        ├── features/
        │   ├── auth/
        │   ├── categorias/
        │   ├── productos/
        │   ├── pedidos/
        │   └── usuarios/
        ├── store/
        │   ├── authStore.ts
        │   └── cartStore.ts
        └── routes/
            ├── AppRouter.tsx
            └── ProtectedRoute.tsx

```

## 5. Instalación y Ejecución

### A. Backend (`FOODSTORE - BACK`)

1. **Entrar a `FOODSTORE - BACK` y crear/activar el entorno virtual**:

   ```
   cd "FOODSTORE - BACK"
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # Linux / macOS:
   source .venv/bin/activate
   
   ```

2. **Instalar dependencias**:

   ```
   pip install -r requirements.txt
   
   ```

3. **Crear el archivo `.env` y ejecutar el seed**:

   ```
   cp .env.example .env
   python -m app.db.seed
   
   ```

   El comando `python -m app.db.seed` es idempotente y carga el usuario administrador, categorías y productos iniciales con stock.

4. **Levantar el servidor**:

   ```
   uvicorn app.main:app --reload
   
   ```

* API disponible en: `http://localhost:8000/api/v1`

* Swagger UI: `http://localhost:8000/docs`

* ReDoc: `http://localhost:8000/redoc`

### B. Frontend (`FOODSTORE - FRONT`)

1. **Entrar a `FOODSTORE - FRONT` e instalar dependencias con `pnpm`**:

   ```
   cd "FOODSTORE - FRONT"
   pnpm install
   
   ```

2. **Configurar el archivo `.env`**:

   ```
   cp .env.example .env
   
   ```

3. **Verificar compilación de tipos/build y ejecutar en modo desarrollo**:

   ```
   pnpm build
   pnpm dev
   
   ```

* Aplicación disponible en: `http://localhost:5173`

## 6. Seed de Base de Datos y Usuario Administrador (`app/db/seed.py`)

Al ejecutar `python -m app.db.seed` de forma idempotente se crean (o verifican sin duplicar) los datos iniciales del sistema:

* **Usuario administrador:**

  * **Usuario (`username`):** `admin`

  * **Contraseña (`password`):** `Admin1234!`

  * **Rol:** `admin`

* **Categorías iniciales:** `Pizzas`, `Hamburguesas`, `Bebidas`, `Postres`.

* **Productos iniciales con stock:** `Pizza Muzzarella` (stock: `20`), `Pizza Napolitana` (stock: `15`), `Pizza Fugazzeta` (stock: `12`), `Burger Clásica` (stock: `25`), `Burger Doble Bacon` (stock: `18`), `Gaseosa Cola 1.5L` (stock: `30`), `Agua sin Gas 500ml` (stock: `40`) y `Flan Casero con Dulce` (stock: `14`).

Los clientes nuevos pueden registrarse desde la pantalla `/register` y se crean automáticamente con rol `user`.

Salida esperada al ejecutar `python -m app.db.seed`:

```
Iniciando seed de Food Store...
- Admin creado: admin / Admin1234!
- Categoría creada: Pizzas
- Categoría creada: Hamburguesas
- Categoría creada: Bebidas
- Categoría creada: Postres
- Producto creado: Pizza Muzzarella (stock: 20)
- Producto creado: Pizza Napolitana (stock: 15)
- Producto creado: Pizza Fugazzeta (stock: 12)
- Producto creado: Burger Clásica (stock: 25)
- Producto creado: Burger Doble Bacon (stock: 18)
- Producto creado: Gaseosa Cola 1.5L (stock: 30)
- Producto creado: Agua sin Gas 500ml (stock: 40)
- Producto creado: Flan Casero con Dulce (stock: 14)
Seed completado correctamente.

```

## 7. Funcionalidades, Rutas y Reglas de Negocio

### Funcionalidades de Cliente (`user`)

* **Catálogo (`/`)**: listado paginado desde el servidor (`skip` y `limit`), búsqueda por nombre, filtro por categoría, `Skeleton` de carga, estado vacío y botón **Agregar al carrito**. Los productos con `stock = 0` o no disponibles pueden visualizarse en el catálogo activo, pero no se permiten agregar/vender sin stock suficiente y disponibilidad.

* **Carrito (`/carrito`)**: gestión de cantidades, subtotales, total y persistencia en el navegador vía `cartStore` por clave de usuario (`user-<id>`) o invitado (`guest`), con fusión automática del carrito invitado al iniciar sesión o recuperar sesión (`mergeGuestCartToUser`).

* **Checkout (`/checkout`)**: formulario con **TanStack Form** para `direccion_entrega` (5 a 200 caracteres), `forma_pago` (`EFECTIVO` o `TRANSFERENCIA`) y `notas` opcionales; crea el pedido en `PENDIENTE`, limpia el carrito y redirige a `/mis-pedidos`.

* **Mis pedidos (`/mis-pedidos`)**: consulta de pedidos propios, modal de detalle con líneas inmutables y cancelación permitida únicamente en estado `PENDIENTE`.

### Funcionalidades de Administración (`admin`)

* **Resumen (`/admin/resumen`)**: tarjetas con indicadores (`pendientes`, `en_preparacion`, `entregados`, `cancelados`, `pedidos_hoy` e `ingresos_entregados`).

* **Categorías (`/admin/categorias`)**: ABM con **TanStack Table** y **TanStack Form**, validación de nombre único (2 a 100 caracteres) y baja lógica (`activo = false`). La baja lógica de una categoría no libera su nombre único ni oculta por sí sola sus productos.

* **Productos (`/admin/productos`)**: ABM con **TanStack Table** y **TanStack Form**, validación de categoría existente y activa (`activo = true`), actualización de stock y disponibilidad (`PATCH /productos/{id}/stock`) y baja lógica (`activo = false`).

* **Pedidos (`/admin/pedidos`)**: listado con filtro por estado y transiciones según la máquina de estados (`PENDIENTE` -> `EN_PREPARACION` o `CANCELADO`; `EN_PREPARACION` -> `ENTREGADO` o `CANCELADO`; `ENTREGADO` y `CANCELADO` son terminales).

* **Usuarios (`/admin/usuarios`)**: listado con **TanStack Table** y botones **Activar** / **Desactivar** (`disabled = false` / `disabled = true`), ocultando **Desactivar** en la fila del usuario de la sesión actual y evitando que un admin se desactive a sí mismo. `username` y `email` se mantienen únicos y no se reutilizan en nuevos registros tras una baja lógica.

### Seguridad, Transacciones y Estado

* **Cookie `HttpOnly`:** el login envía credenciales por formulario OAuth2 a `POST /api/v1/auth/token` y el JWT viaja en la cookie `HttpOnly` `access_token`. El frontend nunca lee ni guarda tokens.

* **Interceptor de Axios:** ante `401` fuera de `/auth/token` y `/auth/me`, o `400` con `detail` `"Cuenta de usuario desactivada"`, limpia `authStore` y redirige a `/login`.

* **Estado y selectores en frontend:** se utilizan referencias estables para carritos vacíos en los selectores de Zustand (`EMPTY_CART`) para evitar bucles de renderizado, y `ProductoCard` / vistas de carrito funcionan tanto sin sesión (`guest`) como con sesión iniciada (`user-<id>`).

* **Transacciones de pedidos (`RN-01` a `RN-06`):** al crear un pedido se valida que exista al menos un ítem y que no haya productos repetidos (`ProductoRepetido` -> `400`); cada producto debe existir, estar activo y disponible y tener stock suficiente. En la misma transacción se verifica el stock, se descuenta (naciendo el pedido en `PENDIENTE`), se copian `nombre_producto`, `precio_unitario` y `subtotal` en cada línea inmutable y se calcula el `total` en el servidor. Al cancelar un pedido (por el cliente en `PENDIENTE` o por el admin desde un estado no terminal permitido), el stock se restituye automáticamente en la misma transacción.