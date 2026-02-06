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

- Docker Desktop instalado y ejecutándose
- Git (opcional)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repo-url>
   cd PracticaC1NextJs
   ```

2. **Levantar los contenedores**
   ```bash
   docker-compose up --build -d
   ```

3. **Verificar que los contenedores estén corriendo**
   ```bash
   docker-compose ps
   ```

4. **Acceder a la aplicación**
   - Frontend: http://localhost:3000
   - Base de datos: localhost:5432

### Comandos Útiles

```bash
# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Limpiar datos y reiniciar
docker-compose down -v
docker-compose up --build -d

# Acceder a la base de datos
docker exec -it awos_db psql -U postgres -d awos
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

**`.env` (para desarrollo local)**
```env
DATABASE_URL=postgresql://app_user:app_secure_password_2024@localhost:5432/awos
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

**Docker Compose**
```yaml
services:
  db:
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: anona29050XD
  
  web:
    environment:
      DATABASE_URL: postgresql://app_user:app_secure_password_2024@db:5432/awos
```

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

