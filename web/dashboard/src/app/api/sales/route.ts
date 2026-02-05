import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Ventas diarias
    const salesDaily = await query('SELECT * FROM vw_sales_daily ORDER BY sale_date DESC LIMIT 30');
    
    // Valor del cliente
    const customerValue = await query('SELECT * FROM vw_customer_value ORDER BY total_gastado DESC LIMIT 20');
    
    // Rentabilidad por producto
    const profitability = await query('SELECT * FROM vw_product_profitability ORDER BY profit DESC LIMIT 10');

    return NextResponse.json({
      salesDaily: salesDaily.rows,
      customerValue: customerValue.rows,
      profitability: profitability.rows,
    });
  } catch (error) {
    console.error('Sales API Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos de ventas' },
      { status: 500 }
    );
  }
}
