CREATE VIEW vw_inventory_turnover AS
SELECT
    p.id AS product_id,
    p.name AS product_name,
    SUM(
        CASE 
            WHEN im.movement_type = 'OUT' THEN im.qty 
            ELSE 0 
        END
    ) AS unidades_salidas,
    p.stock AS stock_actual
FROM products p
LEFT JOIN inventory_movements im ON im.product_id = p.id
GROUP BY p.id, p.name, p.stock;
