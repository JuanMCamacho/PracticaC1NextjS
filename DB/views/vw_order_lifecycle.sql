CREATE VIEW vw_order_lifecycle AS
SELECT
    o.id AS order_id,
    MIN(osh.changed_at) AS primer_estado,
    MAX(osh.changed_at) AS ultimo_estado,
    AGE(
        MAX(osh.changed_at),
        MIN(osh.changed_at)
    ) AS duracion_total
FROM orders o
JOIN order_status_history osh ON osh.order_id = o.id
GROUP BY o.id;