import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function NewsletterFindAllByPreferenceDocs() {
 return applyDecorators(
  ApiOperation({
   summary: 'Retorna todas newsletters por preferencia',
  }),
  ApiResponse({
   status: 200,
   schema: {
    example: [
     {
      id: 1,
      status: 'completed',
      preferences: {
       id: 1,
       title: 'Teste',
      },
     },
     {
      id: 2,
      status: 'completed',
      preferences: {
       id: 1,
       title: 'Teste',
      },
     },
     {
      id: 3,
      status: 'completed',
      preferences: {
       id: 1,
       title: 'Teste',
      },
     },
    ],
   },
  }),
 );
}
