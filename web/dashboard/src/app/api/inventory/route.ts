import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { successResponse } from '@/lib/api-types';
import { handleApiError } from '@/lib/api-helpers';

/**
 * GET /api/inventory
 * Obtiene datos de rotación de inventario
 * @returns {Array} Lista de productos con información de inventario
 */
export async function GET() {
  try {
    const result = await query('SELECT * FROM vw_inventory_turnover ORDER BY product_name');

    return NextResponse.json(successResponse(result.rows));
  } catch (error) {
    return handleApiError(error);
  }
}
