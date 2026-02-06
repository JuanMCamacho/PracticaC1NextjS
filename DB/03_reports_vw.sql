-- reports_vw.sql
-- Vistas para reportes y análisis de datos

-- ======================
-- VISTAS PRINCIPALES
-- ======================

-- 1. Ventas diarias
CREATE OR REPLACE VIEW vw_sales_daily 
WITH (security_barrier = true) AS
SELECT
    DATE(o.created_at) AS sale_date,
    SUM(oi.qty * oi.unit_price) AS total_ventas,
    COUNT(DISTINCT o.id) AS tickets,
    ROUND(SUM(oi.qty * oi.unit_price) / NULLIF(COUNT(DISTINCT o.id), 0), 2) AS ticket_promedio
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
WHERE o.status = 'COMPLETED'
GROUP BY DATE(o.created_at);

ALTER VIEW vw_sales_daily OWNER TO postgres;

-- 2. Ranking de productos
CREATE OR REPLACE VIEW vw_top_products_ranked
WITH (security_barrier = true) AS
SELECT
    p.id AS product_id,
    p.name AS product_name,
    SUM(oi.qty) AS unidades_vendidas,
    SUM(oi.qty * oi.unit_price) AS revenue,
    RANK() OVER (ORDER BY SUM(oi.qty * oi.unit_price) DESC) AS ranking
FROM products p
JOIN order_items oi ON oi.product_id = p.id
JOIN orders o ON o.id = oi.order_id
WHERE o.status = 'COMPLETED'
GROUP BY p.id, p.name;

ALTER VIEW vw_top_products_ranked OWNER TO postgres;

-- 3. Riesgo de inventario
CREATE OR REPLACE VIEW vw_inventory_risk
WITH (security_barrier = true) AS
SELECT
    c.id AS category_id,
    c.name AS category_name,
    COUNT(p.id) AS productos_totales,
    SUM(CASE WHEN p.stock < 10 THEN 1 ELSE 0 END) AS productos_en_riesgo,
    ROUND(
        SUM(CASE WHEN p.stock < 10 THEN 1 ELSE 0 END)::numeric
        / NULLIF(COUNT(p.id), 0) * 100,
        2
    ) AS porcentaje_riesgo
FROM products p
JOIN categories c ON c.id = p.category_id
GROUP BY c.id, c.name
HAVING COUNT(p.id) > 0;

ALTER VIEW vw_inventory_risk OWNER TO postgres;

-- 4. Valor del cliente
CREATE OR REPLACE VIEW vw_customer_value
WITH (security_barrier = true) AS
SELECT
    c.id AS customer_id,
    c.name AS customer_name,
    COUNT(DISTINCT o.id) AS num_ordenes,
    SUM(oi.qty * oi.unit_price) AS total_gastado,
    ROUND(SUM(oi.qty * oi.unit_price) / NULLIF(COUNT(DISTINCT o.id), 0), 2) AS gasto_promedio
FROM customers c
JOIN orders o ON o.customer_id = c.id
JOIN order_items oi ON oi.order_id = o.id
WHERE o.status = 'COMPLETED'
GROUP BY c.id, c.name;

ALTER VIEW vw_customer_value OWNER TO postgres;

-- 5. Mezcla de pagos
CREATE OR REPLACE VIEW vw_payment_mix
WITH (security_barrier = true) AS
SELECT
    method,
    SUM(paid_amount) AS total_pagado,
    ROUND(
        SUM(paid_amount) / NULLIF(SUM(SUM(paid_amount)) OVER (), 0) * 100,
        2
    ) AS porcentaje
FROM payments
GROUP BY method;

ALTER VIEW vw_payment_mix OWNER TO postgres;

-- 6. Rentabilidad por producto (CTE)
CREATE OR REPLACE VIEW vw_product_profitability
WITH (security_barrier = true) AS
WITH latest_cost AS (
    SELECT pc.product_id, pc.cost
    FROM product_costs pc
    JOIN (
        SELECT product_id, MAX(effective_from) AS max_date
        FROM product_costs
        GROUP BY product_id
    ) lc ON lc.product_id = pc.product_id
       AND lc.max_date = pc.effective_from
)
SELECT
    p.id AS product_id,
    p.name AS product_name,
    SUM(oi.qty * oi.unit_price) AS revenue,
    SUM(oi.qty * lc.cost) AS total_cost,
    SUM(oi.qty * oi.unit_price) - SUM(oi.qty * lc.cost) AS profit
FROM products p
JOIN order_items oi ON oi.product_id = p.id
JOIN orders o ON o.id = oi.order_id
JOIN latest_cost lc ON lc.product_id = p.id
WHERE o.status = 'COMPLETED'
GROUP BY p.id, p.name;

ALTER VIEW vw_product_profitability OWNER TO postgres;

-- 7. Rotación de inventario
CREATE OR REPLACE VIEW vw_inventory_turnover
WITH (security_barrier = true) AS
SELECT
    p.id AS product_id,
    p.name AS product_name,
    SUM(CASE WHEN im.movement_type = 'OUT' THEN im.qty ELSE 0 END) AS unidades_salidas,
    p.stock AS stock_actual
FROM products p
LEFT JOIN inventory_movements im ON im.product_id = p.id
GROUP BY p.id, p.name, p.stock;

ALTER VIEW vw_inventory_turnover OWNER TO postgres;

-- 8. Ciclo de vida de pedidos
CREATE OR REPLACE VIEW vw_order_lifecycle
WITH (security_barrier = true) AS
SELECT
    o.id AS order_id,
    MIN(osh.changed_at) AS primer_estado,
    MAX(osh.changed_at) AS ultimo_estado,
    AGE(MAX(osh.changed_at), MIN(osh.changed_at)) AS duracion_total
FROM orders o
JOIN order_status_history osh ON osh.order_id = o.id
GROUP BY o.id;

ALTER VIEW vw_order_lifecycle OWNER TO postgres;

-- ======================
-- VISTAS DE MÉTRICAS
-- ======================

-- Vista para ventas del día actual
CREATE OR REPLACE VIEW vw_today_sales
WITH (security_barrier = true) AS
SELECT COALESCE(SUM(oi.qty * oi.unit_price), 0) as total
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
WHERE DATE(o.created_at) = CURRENT_DATE AND o.status = 'COMPLETED';

ALTER VIEW vw_today_sales OWNER TO postgres;

-- Vista para órdenes del día actual
CREATE OR REPLACE VIEW vw_today_orders
WITH (security_barrier = true) AS
SELECT COUNT(*) as total
FROM orders
WHERE DATE(created_at) = CURRENT_DATE;

ALTER VIEW vw_today_orders OWNER TO postgres;

-- Vista para productos con stock bajo
CREATE OR REPLACE VIEW vw_low_stock_count
WITH (security_barrier = true) AS
SELECT COUNT(*) as total
FROM products
WHERE stock < 10 AND active = true;

ALTER VIEW vw_low_stock_count OWNER TO postgres;

-- Vista para lista completa de productos
CREATE OR REPLACE VIEW vw_products_list
WITH (security_barrier = true) AS
SELECT 
  p.id,
  p.name,
  p.category_id,
  p.supplier_id,
  p.price,
  p.stock,
  p.active,
  c.name as category_name,
  s.name as supplier_name
FROM products p
LEFT JOIN categories c ON c.id = p.category_id
LEFT JOIN suppliers s ON s.id = p.supplier_id
WHERE p.active = true
ORDER BY p.name;

ALTER VIEW vw_products_list OWNER TO postgres;
