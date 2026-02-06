-- roles.sql
-- Configuración de roles y permisos de seguridad

-- Crear usuario de aplicación con contraseña segura
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'app_user') THEN
    CREATE USER app_user WITH PASSWORD 'app_secure_password_2024';
  END IF;
END
$$;

-- Revocar todos los privilegios por defecto
REVOKE ALL ON DATABASE awos FROM app_user;
REVOKE ALL ON SCHEMA public FROM app_user;

-- Permitir conectarse a la base de datos
GRANT CONNECT ON DATABASE awos TO app_user;

-- Permitir usar el schema public
GRANT USAGE ON SCHEMA public TO app_user;

-- Denegar acceso directo a TODAS las tablas
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app_user;

-- Otorgar SELECT únicamente sobre las VIEWS
GRANT SELECT ON vw_sales_daily TO app_user;
GRANT SELECT ON vw_top_products_ranked TO app_user;
GRANT SELECT ON vw_inventory_risk TO app_user;
GRANT SELECT ON vw_customer_value TO app_user;
GRANT SELECT ON vw_payment_mix TO app_user;
GRANT SELECT ON vw_product_profitability TO app_user;
GRANT SELECT ON vw_inventory_turnover TO app_user;
GRANT SELECT ON vw_order_lifecycle TO app_user;
GRANT SELECT ON vw_today_sales TO app_user;
GRANT SELECT ON vw_today_orders TO app_user;
GRANT SELECT ON vw_low_stock_count TO app_user;
GRANT SELECT ON vw_products_list TO app_user;

-- Verificación de permisos (opcional, para debug)
-- SELECT table_name, privilege_type 
-- FROM information_schema.table_privileges 
-- WHERE grantee = 'app_user';
