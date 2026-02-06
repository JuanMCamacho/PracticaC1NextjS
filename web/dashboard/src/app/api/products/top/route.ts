import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { successResponse } from '@/lib/api-types';
import { handleApiError } from '@/lib/api-helpers';

/**
 * GET /api/products/top
 * Obtiene top productos con búsqueda y paginación
 * @query search - Búsqueda por nombre de producto
 * @query page - Número de página (default: 1)
 * @query limit - Productos por página (default: 10, max: 100)
 * @returns {Object} Productos paginados con metadatos
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const offset = (page - 1) * limit;

    // Construir consulta con búsqueda
    let sql = 'SELECT * FROM vw_top_products_ranked WHERE 1=1';
    const params: any[] = [];

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      sql += ` AND LOWER(product_name) LIKE $${params.length}`;
    }

    // Contar total de registros (para paginación)
    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
    const countResult = await query(countSql, params);
    const totalRecords = parseInt(countResult.rows[0]?.total || '0');
    const totalPages = Math.ceil(totalRecords / limit);

    // Obtener registros paginados
    sql += ` ORDER BY ranking LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    return NextResponse.json(successResponse({
      data: result.rows,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      filters: { search }
    }));
  } catch (error) {
    return handleApiError(error);
  }
}
