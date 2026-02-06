import { NextResponse } from 'next/server';
import { ApiResponse, ErrorCode, errorResponse } from './api-types';

export function handleApiError(error: any): NextResponse<ApiResponse> {
  console.error('API Error:', error);

  // Error de base de datos
  if (error.code?.startsWith('P')) {
    return NextResponse.json(
      errorResponse(
        ErrorCode.DATABASE_ERROR,
        'Error al consultar la base de datos',
        { dbError: error.message }
      ),
      { status: 500 }
    );
  }

  // Error de conexión
  if (error.code === 'ECONNREFUSED' || error.message?.includes('connect')) {
    return NextResponse.json(
      errorResponse(
        ErrorCode.DATABASE_ERROR,
        'No se pudo conectar a la base de datos. Verifica que Docker esté corriendo.',
        { hint: 'Ejecuta: docker-compose up db -d' }
      ),
      { status: 503 }
    );
  }

  // Error genérico
  return NextResponse.json(
    errorResponse(
      ErrorCode.INTERNAL_ERROR,
      'Error interno del servidor',
      { message: error.message }
    ),
    { status: 500 }
  );
}
