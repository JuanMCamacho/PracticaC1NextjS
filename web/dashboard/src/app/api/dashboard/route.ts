import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Ventas diarias
    const salesDaily = await query('SELECT * FROM vw_sales_daily ORDER BY sale_date DESC LIMIT 30');
    
    // Top productos
    const topProducts = await query('SELECT * FROM vw_top_products_ranked LIMIT 10');
    
    // Riesgo de inventario
    const inventoryRisk = await query('SELECT * FROM vw_inventory_risk ORDER BY porcentaje_riesgo DESC');
    
    // Mezcla de pagos
    const paymentMix = await query('SELECT * FROM vw_payment_mix');
    
    // Total de ventas hoy
    const todaySales = await query(`
      SELECT COALESCE(SUM(oi.qty * oi.unit_price), 0) as total
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      WHERE DATE(o.created_at) = CURRENT_DATE AND o.status = 'COMPLETED'
    `);
    
    // Total de órdenes hoy
    const todayOrders = await query(`
      SELECT COUNT(*) as total
      FROM orders
      WHERE DATE(created_at) = CURRENT_DATE
    `);
    
    // Productos con bajo stock
    const lowStock = await query(`
      SELECT COUNT(*) as total
      FROM products
      WHERE stock < 10 AND active = true
    `);

    return NextResponse.json({
      salesDaily: salesDaily.rows,
      topProducts: topProducts.rows,
      inventoryRisk: inventoryRisk.rows,
      paymentMix: paymentMix.rows,
      todaySales: todaySales.rows[0]?.total || 0,
      todayOrders: todayOrders.rows[0]?.total || 0,
      lowStock: lowStock.rows[0]?.total || 0,
    });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos del dashboard' },
      { status: 500 }
    );
  }
}
