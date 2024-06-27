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
            content: `Você é um assitente que ajuda a criar newsletters personalizadas de acordo com o conteúdo de artigos
                    fornecidos a você, no formato markdown. O usuário fornecerá os dados no seguinte formato.
                        {
                        "title": "título da newsletter",
                        "data": [
                            "conteúdo do artigo",
                            "conteúdo do artigo"
                        ]
                    }

                    O seu papel será criar uma newsletter personalizada, de acordo com os artigos. Tente agrupar conteúdos
                    semelhantes, resumir informação e criar insights no formato bullet point para alguns conteúdos.

                        O artigo será retornado no formato markdown, dentro do objeto json, como no exemplo:
                    {
                        "newsletter": "conteúdo da newsletter no formato markdown"
                    }`,
          },
          { role: 'user', content: JSON.stringify(data) },
        ],
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
      });

      console.log(completion.choices[0].message.content);
      return JSON.parse(completion.choices[0].message.content) as { newsletter: string };
    } catch (error) {
      this.logger.error(`Não foi possível criar o conteúdo da newsletter: ${error}`);
    }
  }
}
