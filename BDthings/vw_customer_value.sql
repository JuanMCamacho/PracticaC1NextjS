CREATE VIEW vw_customer_value AS
SELECT
    c.id AS customer_id,
    c.name AS customer_name,
    COUNT(DISTINCT o.id) AS num_ordenes,
    SUM(oi.qty * oi.unit_price) AS total_gastado,
    ROUND(
        SUM(oi.qty * oi.unit_price) 
        / NULLIF(COUNT(DISTINCT o.id), 0),
        2
    ) AS gasto_promedio
FROM customers c
JOIN orders o ON o.customer_id = c.id
JOIN order_items oi ON oi.order_id = o.id
WHERE o.status = 'COMPLETED'
GROUP BY c.id, c.name;