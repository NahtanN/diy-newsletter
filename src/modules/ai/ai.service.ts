import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
	private readonly logger = new Logger(AiService.name);
	private openai: OpenAI;

	constructor() {
		this.openai = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		});
	}

	async createAIContent(data: { title: string; articles: string[] }) {
		try {
			const completion = await this.openai.chat.completions.create({
				messages: [
					{
						role: 'system',
						content: `Você é um assitente que ajuda a criar resumos de artigos fornecidos a você no formato markdown.
          O usuário fornecerá os dados em um objeto JSON no seguinte formato.
          {
            "title": "título da newsletter",
            "data": [
                "conteúdo do artigo",
                "conteúdo do artigo"
            ]
          }

    O seu papel será criar resumos, de acordo com o conteúdo principal de cada artigo. Extraia o 
    conteúdo principal, resuma as informação do conteúdo principal e criar insights no formato bullet 
    point para cada artigo. Faça isso para cada artigo e agrupe os resultados em um texto markdown.

    O resumo de todos os artigos será retornado no formato markdown, dentro de um objeto JSON, como no exemplo:
        { "newsletter": "conteúdo do resumo dos artigos no formato markdown" }
    `,
					},
					{ role: 'user', content: JSON.stringify(data) },
				],
				model: 'gpt-4o',
				response_format: { type: 'json_object' },
			});

			return JSON.parse(completion.choices[0].message.content) as { newsletter: string };
		} catch (error) {
			this.logger.error(`Não foi possível criar o conteúdo da newsletter: ${error}`);
		}
	}
}
