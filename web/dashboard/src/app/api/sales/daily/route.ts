import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { successResponse } from '@/lib/api-types';
import { handleApiError } from '@/lib/api-helpers';

/**
 * GET /api/sales/daily
 * Obtiene ventas diarias con filtros de fecha
 * @query date_from - Fecha inicial (YYYY-MM-DD)
 * @query date_to - Fecha final (YYYY-MM-DD)
 * @returns {Array} Ventas diarias filtradas
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');

    let sql = 'SELECT * FROM vw_sales_daily WHERE 1=1';
    const params: any[] = [];

    if (dateFrom) {
      params.push(dateFrom);
      sql += ` AND sale_date >= $${params.length}`;
    }

    if (dateTo) {
      params.push(dateTo);
      sql += ` AND sale_date <= $${params.length}`;
    }

    sql += ' ORDER BY sale_date DESC LIMIT 100';

    const result = await query(sql, params);

    return NextResponse.json(successResponse({
      data: result.rows,
      filters: { date_from: dateFrom, date_to: dateTo },
      count: result.rows.length
    }));
  } catch (error) {
    return handleApiError(error);
  }
}
