import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { successResponse } from '@/lib/api-types';
import { handleApiError } from '@/lib/api-helpers';

/**
 * GET /api/dashboard
 * Obtiene métricas y datos principales del dashboard
 * @returns {Object} Métricas del dashboard incluyendo ventas, productos top, inventario
 */
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
    
    // Total de ventas hoy (usando vista)
    const todaySales = await query('SELECT * FROM vw_today_sales');
    
    // Total de órdenes hoy (usando vista)
    const todayOrders = await query('SELECT * FROM vw_today_orders');
    
    // Productos con bajo stock (usando vista)
    const lowStock = await query('SELECT * FROM vw_low_stock_count');

    const data = {
      salesDaily: salesDaily.rows,
      topProducts: topProducts.rows,
      inventoryRisk: inventoryRisk.rows,
      paymentMix: paymentMix.rows,
      todaySales: Number(todaySales.rows[0]?.total || 0),
      todayOrders: Number(todayOrders.rows[0]?.total || 0),
      lowStock: Number(lowStock.rows[0]?.total || 0),
    };

    return NextResponse.json(successResponse(data));
  } catch (error) {
    return handleApiError(error);
  }
}
