CREATE VIEW vw_payment_mix AS
SELECT
    method,
    SUM(paid_amount) AS total_pagado,
    ROUND(
        SUM(paid_amount) 
        / NULLIF(SUM(SUM(paid_amount)) OVER (), 0) * 100,
        2
    ) AS porcentaje
FROM payments
GROUP BY method;