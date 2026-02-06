-- indexes.sql
-- Índices para optimización de consultas

-- Índices para tabla orders
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Índices para tabla order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Índices para tabla products
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);

-- Índices para tabla payments
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_method ON payments(method);

-- Índices para tabla product_costs
CREATE INDEX IF NOT EXISTS idx_product_costs_product_id ON product_costs(product_id);
CREATE INDEX IF NOT EXISTS idx_product_costs_effective_from ON product_costs(effective_from);

-- Índices para tabla inventory_movements
CREATE INDEX IF NOT EXISTS idx_inventory_movements_product_id ON inventory_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_movement_type ON inventory_movements(movement_type);

-- Índices para tabla order_status_history
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_changed_at ON order_status_history(changed_at);

-- Índice compuesto para ventas diarias (optimiza vw_sales_daily)
CREATE INDEX IF NOT EXISTS idx_orders_created_at_status ON orders(created_at, status);
