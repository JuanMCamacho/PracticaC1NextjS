-- Limpiar tablas existentes
DROP TABLE IF EXISTS order_status_history CASCADE;
DROP TABLE IF EXISTS inventory_movements CASCADE;
DROP TABLE IF EXISTS product_costs CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    contact_email VARCHAR(150)
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category_id INT REFERENCES categories(id),
    supplier_id INT REFERENCES suppliers(id),
    price NUMERIC(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150)
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    status VARCHAR(50) NOT NULL,
    channel VARCHAR(50) NOT NULL
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    product_id INT REFERENCES products(id),
    qty INT NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    method VARCHAR(50) NOT NULL,
    paid_amount NUMERIC(10,2) NOT NULL
);

CREATE TABLE product_costs (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id),
    cost NUMERIC(10,2) NOT NULL,
    effective_from DATE NOT NULL
);

CREATE TABLE inventory_movements (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id),
    qty INT NOT NULL,
    movement_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE order_status_history (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    status VARCHAR(50) NOT NULL,
    changed_at TIMESTAMP NOT NULL DEFAULT NOW()
);