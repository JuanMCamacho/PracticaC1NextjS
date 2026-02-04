CREATE VIEW vw_product_profitability AS
WITH latest_cost AS (
    SELECT
        pc.product_id,
        pc.cost
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
