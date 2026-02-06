# Sistema de Gestión de Ventas AWOS

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Docker](https://img.shields.io/badge/Docker-ready-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

Dashboard interactivo para análisis de ventas, inventario y clientes con Next.js 14 y PostgreSQL.

## 🌟 Características

- **Dashboard Analítico**: Métricas en tiempo real de ventas, productos y clientes
- **Vistas SQL Optimizadas**: 12 vistas especializadas con seguridad a nivel de BD
- **Seguridad Robusta**: Usuario de aplicación con permisos mínimos (SELECT only)
- **API RESTful**: Endpoints con filtros, búsqueda y paginación
- **Arquitectura Containerizada**: Docker Compose para fácil despliegue
- **Producción Ready**: Multi-stage builds, Nginx, HTTPS, backups automatizados

## 🚀 Inicio Rápido

### Desarrollo

```bash
# Clonar repositorio
git clone https://github.com/JuanMCamacho/PracticaC1NextjS.git
cd PracticaC1NextjS

# Iniciar servicios
docker-compose up -d

# Acceder a la aplicación
# http://localhost:3000
```

### Producción

```bash
# Configurar variables de entorno
cp .env.production.example .env.production
nano .env.production  # Editar con contraseñas seguras

# Desplegar
./deploy.sh

# Ver documentación completa
cat DEPLOYMENT.md
```

## 📊 Vistas SQL Implementadas

| Vista | Descripción | Filtros/Funcionalidad |
|-------|-------------|----------------------|
| `vw_sales_daily` | Ventas agregadas por día | Rango de fechas |
| `vw_top_products_ranked` | Ranking de productos | Búsqueda, paginación |
| `vw_inventory_risk` | Análisis de riesgo de stock | Filtro por categoría (whitelist) |
| `vw_customer_value` | Valor de vida del cliente | Paginación |
| `vw_payment_mix` | Distribución de métodos de pago | - |
| `vw_product_profitability` | Rentabilidad por producto (CTE) | - |
| `vw_inventory_turnover` | Rotación de inventario | - |
| `vw_order_lifecycle` | Tiempos de procesamiento | - |
| `vw_today_sales` | Métricas del día actual | - |
| `vw_today_orders` | Órdenes del día | - |
| `vw_low_stock_count` | Productos críticos | - |
| `vw_products_list` | Catálogo completo | - |

## 🗄️ Arquitectura de Base de Datos

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   App       │────▶│  PostgreSQL  │◀────│   Vistas    │
│ (app_user)  │     │   (postgres) │     │ (12 views)  │
└─────────────┘     └──────────────┘     └─────────────┘
 SELECT only          Owner: postgres      Security Barrier
```

### Archivos SQL

- `01_schema.sql`: 10 tablas normalizadas
- `02_seed.sql`: 100 clientes, 300 órdenes (18 meses de datos)
- `03_reports_vw.sql`: 12 vistas analíticas con security barrier
- `04_indexes.sql`: Índices optimizados para JOIN y filtros
- `05_roles.sql`: Usuario app_user con permisos mínimos

## 🛡️ Seguridad

- ✅ **Vistas con Security Barrier**: Prevención de ataques de timing
- ✅ **Usuario de Aplicación**: Sin acceso directo a tablas
- ✅ **Consultas Parametrizadas**: Prevención de inyección SQL
- ✅ **Validación Whitelist**: Filtros de categoría validados
- ✅ **Headers de Seguridad**: X-Frame-Options, CSP, HSTS
- ✅ **Rate Limiting**: Nginx con límites por IP

## 📁 Estructura del Proyecto

```
├── DB/                      # Scripts SQL
│   ├── 01_schema.sql
│   ├── 02_seed.sql
│   ├── 03_reports_vw.sql
│   ├── 04_indexes.sql
│   └── 05_roles.sql
├── web/dashboard/           # Aplicación Next.js
│   ├── src/
│   │   ├── app/            # Pages y API routes
│   │   ├── components/     # Componentes React
│   │   └── lib/            # Pool de conexiones DB
│   ├── Dockerfile          # Build de producción
│   ├── Dockerfile.dev      # Build de desarrollo
│   └── next.config.js      # Configuración Next.js
├── nginx/                   # Reverse proxy
│   └── nginx.conf
├── docker-compose.yml       # Desarrollo
├── docker-compose.prod.yml  # Producción
├── deploy.sh               # Script de despliegue
├── update.sh               # Script de actualización
├── backup.sh               # Script de respaldo
├── DEPLOYMENT.md           # Guía de despliegue
└── REPORTE_TECNICO.md      # Documentación técnica
```

## 🔧 Variables de Entorno

### Desarrollo (`.env`)

```env
DATABASE_URL=postgresql://app_user:app_secure_password_2024@localhost:5432/awos
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### Producción (`.env.production`)

```env
DATABASE_URL=postgresql://app_user:STRONG_PASSWORD@db:5432/awos
NEXT_PUBLIC_API_BASE_URL=https://tu-dominio.com
POSTGRES_PASSWORD=POSTGRES_STRONG_PASSWORD
```

## 📡 Endpoints API

| Endpoint | Método | Descripción | Query Params |
|----------|--------|-------------|--------------|
| `/api/dashboard` | GET | Métricas generales | - |
| `/api/sales/daily` | GET | Ventas diarias | `date_from`, `date_to` |
| `/api/products/top` | GET | Top productos | `search`, `page`, `limit` |
| `/api/inventory/risk` | GET | Riesgo de inventario | `category` |
| `/api/customers/value` | GET | Valor de clientes | `page`, `limit` |

## 🧪 Volumen de Datos

- **Clientes**: 100
- **Productos**: 13 (5 categorías)
- **Órdenes**: 300 (agosto 2024 - febrero 2026)
- **Items de orden**: ~900
- **Pagos**: 300 (mix CASH/CARD)

## 🚢 Despliegue

### Requisitos

- Docker Engine 20.10+
- Docker Compose 2.0+
- 2GB RAM mínimo (4GB recomendado)
- 10GB espacio en disco

### Comandos Principales

```bash
# Desarrollo
docker-compose up -d
docker-compose logs -f

# Producción
./deploy.sh
./update.sh
./backup.sh

# Ver guía completa
cat DEPLOYMENT.md
```

## 📊 Monitoreo

```bash
# Logs en tiempo real
docker-compose -f docker-compose.prod.yml logs -f web

# Estado de servicios
docker-compose -f docker-compose.prod.yml ps

# Uso de recursos
docker stats

# Health checks
curl http://localhost:3000/api/dashboard
```

## 💾 Respaldos

Los backups se ejecutan automáticamente con `./backup.sh`:

- Backup comprimido en `./backups/`
- Rotación automática (7 días)
- Restauración simple con `psql`

## 🔄 Actualización

Cuando hagas cambios y pushees a `main`:

```bash
./update.sh  # Descarga, rebuild y reinicia sin downtime
```

## 🐛 Troubleshooting

### Base de datos no conecta

```bash
docker-compose logs db
docker-compose exec db psql -U postgres -d awos
```

### Permisos de app_user

```bash
docker-compose exec db psql -U postgres -d awos -c "
SELECT table_name, privilege_type 
FROM information_schema.table_privileges 
WHERE grantee = 'app_user';"
```

### Limpiar y reiniciar

```bash
docker-compose down -v
docker-compose up -d --build
```

## 📚 Documentación Adicional

- [DEPLOYMENT.md](DEPLOYMENT.md) - Guía completa de despliegue
- [REPORTE_TECNICO.md](REPORTE_TECNICO.md) - Análisis técnico y justificación

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es parte de la materia de Aplicaciones Web Orientadas a Servicios (AWOS).

## 👨‍💻 Autor

**Juan Manuel Camacho**
- GitHub: [@JuanMCamacho](https://github.com/JuanMCamacho)

---

**Stack**: Next.js 14 • PostgreSQL 16 • Docker • TypeScript • Tailwind CSS
