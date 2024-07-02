import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function NewsletterPreferenceSaveDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Salvar as preferências da newsletter',
		}),
		ApiResponse({
			status: 201,
			schema: {
				example: {
					message: 'Configuração de newsletter criada com sucesso.',
					newsletterPreference: {
						id: 2,
						title: 'Título da Newsletter',
						createdAt: '2024-06-28T00:00:31.463Z',
						config: [
							{
								id: 3,
								newsletterId: 2,
								title: 'Título da fonte',
								sourceUrl: 'https://...',
							},
						],
					},
				},
			},
		}),
	);
}
