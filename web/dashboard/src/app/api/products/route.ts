import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { successResponse } from '@/lib/api-types';
import { handleApiError } from '@/lib/api-helpers';

/**
 * GET /api/products
 * Obtiene la lista completa de productos con sus categorías y proveedores
 * @returns {Array} Lista de productos
 */
export async function GET() {
  try {
    const result = await query('SELECT * FROM vw_products_list');

    return NextResponse.json(successResponse(result.rows));
  } catch (error) {
    return handleApiError(error);
  }
}
