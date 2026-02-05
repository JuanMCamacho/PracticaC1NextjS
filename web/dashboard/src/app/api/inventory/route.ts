import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM vw_inventory_turnover ORDER BY product_name');

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Inventory API Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener inventario' },
      { status: 500 }
    );
  }
}
