import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function NewsletterFindAllDocs() {
 return applyDecorators(
  ApiOperation({
   summary: 'Retorna todas newsletters',
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
