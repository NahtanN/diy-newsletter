import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import OpenAI from 'openai';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  private readonly openai: OpenAI;
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly httpService: HttpService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async getWebData(): Promise<string> {
    const { data: response } = await firstValueFrom(
      this.httpService
        .post('http://localhost:3002/v0/crawl', {
          url: 'https://www.techdrop.news/',
          crawlerOptions: {
            generateImgAltText: false,
            returnOnlyUrls: true,
            maxDepth: 2,
            limit: 10,
          },
          pageOptions: {
            onlyMainContent: true,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );

    return response;
  }

  async getStatus(jobId: string) {
    const { data: response } = await firstValueFrom(
      this.httpService.get(`http://localhost:3002/v0/crawl/status/${jobId}`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );

    if (response.data) {
      //const articleRegex = /^https:\/\/www\.tabnews\.com\.br\/[^\/]+\/[^\/]+$/;
      const articleRegex = /https:\/\/www\.techdrop\.news\/p\/.+/;
      const articleUrls = response.data.filter((item: { url: string }) => articleRegex.test(item.url));

      return articleUrls;
    }

    return response;
  }

  async scrape(url: string) {
    const { data: response } = await firstValueFrom(
      this.httpService
        .post('http://localhost:3002/v0/scrape', {
          url,
          pageOptions: {
            onlyMainContent: true,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );

    const userInput = {
      title: 'techdrops resumo',
      content: [response.data.content],
    };

    const completion = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Você é um assitente que ajuda a extrair insights de blog posts. O usuário fornecerá os dados no seguinte formato.
                {
                    "title": "título dos insights",
                    "content": [
                        "conteúdo a ser analisado para extrair os insights",
                        "conteúdo a ser analisado para extrair os insights"
                    ]
                }
              Os insights devem ser retornados no formato de json. Como no exemplo:
                {
                    "insights": {
                        "title": "título fornecido pelo usuário",
                        "data": [
                            "texto do insight...",
                            "texto do insight...",
                            "texto do insight..."
                        ]
                    } 
                }`,
        },
        { role: 'user', content: JSON.stringify(userInput) },
      ],
      model: 'gpt-3.5-turbo-0125',
      response_format: { type: 'json_object' },
    });

    return JSON.parse(completion.choices[0].message.content);
  }
}
