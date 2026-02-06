import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { successResponse } from '@/lib/api-types';
import { handleApiError } from '@/lib/api-helpers';

/**
 * GET /api/customers/value
 * Obtiene valor de clientes con paginación
 * @query page - Número de página (default: 1)
 * @query limit - Registros por página (default: 20, max: 100)
 * @returns {Object} Clientes paginados con metadatos
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const offset = (page - 1) * limit;

    // Contar total de registros
    const countResult = await query('SELECT COUNT(*) as total FROM vw_customer_value');
    const totalRecords = parseInt(countResult.rows[0]?.total || '0');
    const totalPages = Math.ceil(totalRecords / limit);

    // Obtener registros paginados
    const result = await query(
      'SELECT * FROM vw_customer_value ORDER BY total_gastado DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    return NextResponse.json(successResponse({
      data: result.rows,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }));
  } catch (error) {
    return handleApiError(error);
  }
}
