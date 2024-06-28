import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function NewsletterCreateDocs() {
 return applyDecorators(
  ApiOperation({
   summary: 'Criar uma newsletter',
   description: 'O processo será adicionado em uma fila.',
  }),
  ApiResponse({
   status: 201,
   schema: {
    example: {
     message: 'Newsletter adicionada na fila',
     newsletter: {
      newsletterPreferenceId: 2,
      jobs: 1,
      status: 'pending',
      crawledUrls: [
       {
        status: 'pending',
        newsletterPreferenceConfigId: 2,
        sourceUrl: 'https://',
        newsletterId: 10,
        id: 16,
        createdAt: '2024-06-28T12:08:31.341Z',
       },
      ],
      id: 10,
      createdAt: '2024-06-28T12:08:31.341Z',
     },
    },
   },
  }),
 );
}
