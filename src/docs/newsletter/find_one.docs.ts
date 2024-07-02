import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function NewsletterFindOneDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Retorna uma newsletters por Id',
		}),
		ApiResponse({
			status: 200,
			schema: {
				example: {
					id: 11,
					newsletterPreferenceId: 2,
					jobs: 1,
					status: 'in_progress',
					content: 'conteudo...',
					createdAt: '2024-06-28T12:43:52.162Z',
				},
			},
		}),
	);
}
