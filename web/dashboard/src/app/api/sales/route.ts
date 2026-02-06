import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { successResponse } from '@/lib/api-types';
import { handleApiError } from '@/lib/api-helpers';

/**
 * GET /api/sales
 * Obtiene datos de ventas incluyendo ventas diarias, valor de clientes y rentabilidad
 * @returns {Object} Datos de ventas y análisis
 */
export async function GET() {
  try {
    // Ventas diarias
    const salesDaily = await query('SELECT * FROM vw_sales_daily ORDER BY sale_date DESC LIMIT 30');
    
    // Valor del cliente
    const customerValue = await query('SELECT * FROM vw_customer_value ORDER BY total_gastado DESC LIMIT 20');
    
    // Rentabilidad por producto
    const profitability = await query('SELECT * FROM vw_product_profitability ORDER BY profit DESC LIMIT 10');

    const data = {
      salesDaily: salesDaily.rows,
      customerValue: customerValue.rows,
      profitability: profitability.rows,
    };

    return NextResponse.json(successResponse(data));
  } catch (error) {
    return handleApiError(error);
  }
}
