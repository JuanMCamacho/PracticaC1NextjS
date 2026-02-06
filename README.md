# AWOS - Aplicación Web Orientada a Servicios

Dashboard de reportes SQL con Next.js (TypeScript) + PostgreSQL + Docker.


## 🔐 Características de Seguridad

- **Usuario dedicado `app_user`** con permisos limitados
- **Solo acceso SELECT sobre VIEWS** - sin acceso directo a tablas
- **Filtros con whitelist** para prevenir inyección SQL
- **Paginación server-side** para optimizar rendimiento
- **Parámetros validados** en todas las APIs

## 🏗️ Arquitectura

```
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   API Routes    │
│   (REST API)    │
└────────┬────────┘
         │
         ▼ SELECT only
┌─────────────────┐
│   PostgreSQL    │
│   VIEWS         │
│   (app_user)    │
└─────────────────┘
```

## 📊 Vistas SQL Implementadas

1. **vw_sales_daily** - Ventas diarias con totales
2. **vw_top_products_ranked** - Ranking de productos por revenue
3. **vw_inventory_risk** - Riesgo de inventario por categoría
4. **vw_customer_value** - Valor y comportamiento de clientes
5. **vw_payment_mix** - Distribución de métodos de pago
6. **vw_product_profitability** - Rentabilidad por producto (CTE)
7. **vw_inventory_turnover** - Rotación de inventario
8. **vw_order_lifecycle** - Ciclo de vida de pedidos

## 🚀 Instalación y Ejecución

### Requisitos Previos

- **Docker Desktop** instalado y ejecutándose
- **Node.js 18+** (solo si vas a desarrollar sin Docker)
- Git (opcional)

### 🎯 Inicio Rápido (Recomendado)

1. **Clonar el repositorio**
   ```bash
   git clone <repo-url>
   cd PracticaC1NextJs
   ```

2. **Configurar variables de entorno**
  ``` 
   # En el directorio del dashboard
   cp web/dashboard/.env.example web/dashboard/.env
   ```
   

3. **Levantar los contenedores con Docker**
   ```bash
   docker-compose up --build -d
   ```
   
   Esto va a:
   - Crear la base de datos PostgreSQL
   - Ejecutar todos los scripts SQL automáticamente
   - Construir y levantar la aplicación Next.js
   - Configurar el usuario `app_user` con permisos limitados

4. **Verificar que todo esté corriendo**
   ```bash
   docker-compose ps
   ```
   
   Deberías ver:
   ```
   awos_db    postgres:16-alpine   Up
   awos_web   ...                  Up
   ```

5. **Acceder a la aplicación**
   - 🌐 Frontend: http://localhost:3000
   - 🗄️ Base de datos: localhost:5432

### 🛠️ Comandos Útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Ver solo logs del web
docker-compose logs -f web

# Detener servicios (mantiene datos)
docker-compose down

# Limpiar TODO y empezar de cero
docker-compose down -v
docker-compose up --build -d

# Acceder a la base de datos
docker exec -it awos_db psql -U postgres -d awos

# Reiniciar solo el servicio web
docker-compose restart web
```


### ⚠️ Solución de Problemas

**Error: Puerto 5432 ya está en uso**
```bash
# Cambia el puerto en .env
POSTGRES_PORT=5433
```

**Error: Puerto 3000 ya está en uso**
```bash
# Cambia el puerto en .env
WEB_PORT=3001
```

**La base de datos no se inicializa**
```bash
# Limpia los volúmenes y vuelve a crear
docker-compose down -v
docker volume prune
docker-compose up --build -d
```

**No puedo conectarme a la base de datos**
```bash
# Verifica que el contenedor esté corriendo
docker-compose ps

# Revisa los logs de la base de datos
docker-compose logs db
```

## 📡 API Endpoints

### Dashboard
- `GET /api/dashboard` - Métricas principales

### Ventas (con filtros)
- `GET /api/sales/daily?date_from=2024-01-01&date_to=2024-12-31`
  - Parámetros opcionales: `date_from`, `date_to`

### Productos (con búsqueda y paginación)
- `GET /api/products/top?search=cafe&page=1&limit=10`
  - `search` - Búsqueda por nombre
  - `page` - Número de página (default: 1)
  - `limit` - Registros por página (default: 10, max: 100)

### Inventario (con filtros)
- `GET /api/inventory/risk?category=Café`
  - `category` - Nombre de categoría (whitelist)
  - `category_id` - ID de categoría

### Clientes (con paginación)
- `GET /api/customers/value?page=1&limit=20`
  - `page` - Número de página
  - `limit` - Registros por página (default: 20)

## 🗄️ Estructura de la Base de Datos

### Tablas Principales
- `categories` - Categorías de productos
- `suppliers` - Proveedores
- `products` - Catálogo de productos
- `customers` - Información de clientes
- `orders` - Órdenes de compra
- `order_items` - Detalle de órdenes
- `payments` - Pagos realizados
- `product_costs` - Histórico de costos
- `inventory_movements` - Movimientos de inventario
- `order_status_history` - Historial de estados de órdenes

### Permisos del Usuario `app_user`

```sql
-- ✅ PERMITIDO
SELECT * FROM vw_sales_daily;
SELECT * FROM vw_top_products_ranked;

-- ❌ BLOQUEADO
SELECT * FROM products;  -- Sin acceso directo a tablas
UPDATE products SET stock = 100;  -- Sin permisos de escritura
```

## 🎨 Páginas del Dashboard

1. **Dashboard Principal** (`/`)
   - Métricas del día (ventas, órdenes, stock bajo)
   - Top 10 productos
   - Riesgo de inventario
   - Métodos de pago

2. **Ventas** (`/sales`)
   - Filtros por rango de fechas
   - Historial de ventas diarias
   - Métricas: total, tickets, promedio

3. **Productos** (`/products`)
   - Búsqueda por nombre
   - Paginación server-side
   - Ranking por ventas

4. **Inventario** (`/inventory`)
   - Filtro por categoría (whitelist)
   - Porcentaje de riesgo por categoría
   - Productos en riesgo vs totales

5. **Clientes** (`/customers`)
   - Lista paginada de clientes
   - Valor total y promedio
   - Número de órdenes

## 🔧 Configuración

### Variables de Entorno

El proyecto usa variables de entorno para una fácil configuración. Hay dos archivos `.env`:

**1. `.env` en la raíz del proyecto** (para Docker Compose)
```env
# PostgreSQL Configuration
POSTGRES_DB=awos
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password_here

# App User Credentials
APP_USER=app_user
APP_PASSWORD=app_secure_password_2024

# Port Mapping
POSTGRES_PORT=5432
WEB_PORT=3000

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

**2. `web/dashboard/.env`** (para la aplicación Next.js)
```env
DATABASE_URL=postgresql://app_user:app_secure_password_2024@localhost:5432/awos
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

> 📝 **Nota:** Los archivos `.env.example` están incluidos como plantillas. Cópialos y personalízalos según tus necesidades.

### 🔒 Importante sobre Seguridad

- ⚠️ **Nunca compartas** tus archivos `.env` con contraseñas reales
- ⚠️ **Los archivos `.env` están en `.gitignore`** por seguridad
- ✅ **Usa `.env.example`** para documentar las variables necesarias
- ✅ **Cambia las contraseñas por defecto** antes de usar en cualquier ambiente

## 📚 Stack Tecnológico

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Base de Datos:** PostgreSQL 16
- **ORM/Query:** node-postgres (pg)
- **Containerización:** Docker + Docker Compose

## 🔒 Seguridad Implementada

1. **Principio de Menor Privilegio**
   - Usuario `app_user` con permisos mínimos
   - Solo SELECT sobre vistas específicas

2. **Prevención de SQL Injection**
   - Consultas parametrizadas ($1, $2, etc.)
   - Validación de entrada con whitelist

3. **Paginación y Límites**
   - Límite máximo de 100 registros por página
   - Prevención de consultas masivas

4. **Validación de Filtros**
   - Categorías validadas contra whitelist
   - Fechas parseadas correctamente

## 📝 Notas Técnicas

- Todas las consultas son **SELECT sobre VIEWS**
- No hay acceso directo a tablas desde la aplicación
- Paginación implementada en server-side
- Filtros validados antes de ejecutar queries
- Respuestas API con formato estándar

## 👨‍💻 Desarrollo

```bash
# Instalar dependencias
cd web/dashboard
npm install

# Ejecutar en modo desarrollo
npm run dev

# Build para producción
npm run build
```

## 📄 Licencia

Este proyecto es parte de una práctica académica para el curso de AWOS.

