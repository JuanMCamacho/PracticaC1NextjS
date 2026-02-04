CREATE VIEW vw_inventory_risk AS
SELECT
    c.id AS category_id,
    c.name AS category_name,
    COUNT(p.id) AS productos_totales,
    SUM(
        CASE 
            WHEN p.stock < 10 THEN 1 
            ELSE 0 
        END
    ) AS productos_en_riesgo,
    ROUND(
        SUM(CASE WHEN p.stock < 10 THEN 1 ELSE 0 END)::numeric
        / NULLIF(COUNT(p.id), 0) * 100,
        2
    ) AS porcentaje_riesgo
FROM products p
JOIN categories c ON c.id = p.category_id
GROUP BY c.id, c.name
HAVING COUNT(p.id) > 0;