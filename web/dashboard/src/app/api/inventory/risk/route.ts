import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { successResponse } from '@/lib/api-types';
import { handleApiError } from '@/lib/api-helpers';

// Whitelist de categorías válidas (seguridad)
const VALID_CATEGORIES = ['Café', 'Bebidas frías', 'Panadería', 'Postres', 'Snacks'];

/**
 * GET /api/inventory/risk
 * Obtiene inventario en riesgo con filtro por categoría
 * @query category - Nombre de categoría (debe estar en whitelist)
 * @query category_id - ID de categoría (alternativa)
 * @returns {Array} Productos en riesgo por categoría
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const categoryId = searchParams.get('category_id');

    let sql = 'SELECT * FROM vw_inventory_risk WHERE 1=1';
    const params: any[] = [];

    // Filtrar por nombre de categoría (validado con whitelist)
    if (category) {
      if (!VALID_CATEGORIES.includes(category)) {
        return NextResponse.json({
          success: false,
          error: {
            code: 'INVALID_CATEGORY',
            message: `Categoría inválida. Valores permitidos: ${VALID_CATEGORIES.join(', ')}`
          }
        }, { status: 400 });
      }
      params.push(category);
      sql += ` AND category_name = $${params.length}`;
    }

    // Filtrar por ID de categoría
    if (categoryId && !isNaN(Number(categoryId))) {
      params.push(Number(categoryId));
      sql += ` AND category_id = $${params.length}`;
    }

    sql += ' ORDER BY porcentaje_riesgo DESC';

    const result = await query(sql, params);

    return NextResponse.json(successResponse({
      data: result.rows,
      filters: { category, category_id: categoryId },
      validCategories: VALID_CATEGORIES,
      count: result.rows.length
    }));
  } catch (error) {
    return handleApiError(error);
  }
}
