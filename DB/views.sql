
-- reports_vw.sql
-- Vistas obligatorias + extendidas

-- 1. Ventas diarias
CREATE VIEW vw_sales_daily AS
SELECT
    DATE(o.created_at) AS sale_date,
    SUM(oi.qty * oi.unit_price) AS total_ventas,
    COUNT(DISTINCT o.id) AS tickets,
    ROUND(SUM(oi.qty * oi.unit_price) / NULLIF(COUNT(DISTINCT o.id), 0), 2) AS ticket_promedio
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
WHERE o.status = 'COMPLETED'
GROUP BY DATE(o.created_at);

-- 2. Ranking de productos
CREATE VIEW vw_top_products_ranked AS
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

-- 3. Riesgo de inventario
CREATE VIEW vw_inventory_risk AS
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

-- 4. Valor del cliente
CREATE VIEW vw_customer_value AS
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

-- 5. Mezcla de pagos
CREATE VIEW vw_payment_mix AS
SELECT
    method,
    SUM(paid_amount) AS total_pagado,
    ROUND(
        SUM(paid_amount) / NULLIF(SUM(SUM(paid_amount)) OVER (), 0) * 100,
        2
    ) AS porcentaje
FROM payments
GROUP BY method;

-- 6. Rentabilidad por producto (CTE)
CREATE VIEW vw_product_profitability AS
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

-- 7. Rotación de inventario
CREATE VIEW vw_inventory_turnover AS
SELECT
    p.id AS product_id,
    p.name AS product_name,
    SUM(CASE WHEN im.movement_type = 'OUT' THEN im.qty ELSE 0 END) AS unidades_salidas,
    p.stock AS stock_actual
FROM products p
LEFT JOIN inventory_movements im ON im.product_id = p.id
GROUP BY p.id, p.name, p.stock;

-- 8. Ciclo de vida de pedidos
CREATE VIEW vw_order_lifecycle AS
SELECT
    o.id AS order_id,
    MIN(osh.changed_at) AS primer_estado,
    MAX(osh.changed_at) AS ultimo_estado,
    AGE(MAX(osh.changed_at), MIN(osh.changed_at)) AS duracion_total
FROM orders o
JOIN order_status_history osh ON osh.order_id = o.id
GROUP BY o.id;
