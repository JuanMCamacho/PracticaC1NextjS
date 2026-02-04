CREATE VIEW vw_sales_daily AS
SELECT
    DATE(o.created_at) AS sale_date,
    SUM(oi.qty * oi.unit_price) AS total_ventas,
    COUNT(DISTINCT o.id) AS tickets,
    ROUND(
        SUM(oi.qty * oi.unit_price) 
        / NULLIF(COUNT(DISTINCT o.id), 0),
        2
    ) AS ticket_promedio
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
WHERE o.status = 'COMPLETED'
GROUP BY DATE(o.created_at);