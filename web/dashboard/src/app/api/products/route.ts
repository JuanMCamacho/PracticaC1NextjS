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
    const result = await query(`
      SELECT 
        p.*,
        c.name as category_name,
        s.name as supplier_name
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN suppliers s ON s.id = p.supplier_id
      WHERE p.active = true
      ORDER BY p.name
    `);

    return NextResponse.json(successResponse(result.rows));
  } catch (error) {
    return handleApiError(error);
  }
}
