import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrawledUrl } from './entities/crawled_url.entity';
import { IsNull, Repository, Not, Like } from 'typeorm';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { SourceUrlMeta } from './entities/source_url_meta.entity';
import OpenAI from 'openai';

@Injectable()
export class CrawlerService {
	private readonly logger = new Logger(CrawlerService.name);
	private readonly openai: OpenAI;

	constructor(
		@InjectRepository(CrawledUrl)
		private readonly crawledUrlRepository: Repository<CrawledUrl>,
		@InjectRepository(SourceUrlMeta)
		private readonly sourceUrlMetaRepository: Repository<SourceUrlMeta>,
		private readonly httpService: HttpService,
	) {
		this.openai = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		});
	}

	async crawlUrl(sourceUrl: string) {
		const { data: response } = await firstValueFrom(
			this.httpService
				.post(process.env.CRAWL_URL, {
					url: sourceUrl,
					crawlerOptions: {
						generateImgAltText: false,
						returnOnlyUrls: true,
						maxDepth: 33,
						limit: 33,
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

	async crawlUrlStatus(jobId: string) {
		const { data: response } = await firstValueFrom(
			this.httpService.get(`${process.env.CRAWL_STATUS_URL}/${jobId}`).pipe(
				catchError((error: AxiosError) => {
					this.logger.error(error.response.data);
					throw 'An error happened!';
				}),
			),
		);

		return response as { status: string; data: { url: string }[] };
	}

	async filterCrawledUrls(sourceUrl: string, data: string[]): Promise<string[]> {
		let articlesRegex: RegExp;

		const sourceUrlMeta = await this.sourceUrlMetaRepository.findOne({
			where: {
				url: Like(sourceUrl),
			},
		});
		if (!sourceUrlMeta || !sourceUrlMeta.articlesRegex) {
			const { regex } = await this.createSourceUrlRegex(data);

			await this.sourceUrlMetaRepository.save({
				id: sourceUrlMeta?.id,
				url: sourceUrl,
				articlesRegex: regex,
			} as SourceUrlMeta);

			articlesRegex = new RegExp(regex);
		} else {
			articlesRegex = new RegExp(sourceUrlMeta.articlesRegex);
		}

		return data.filter((url) => articlesRegex.test(url));
	}

	async createSourceUrlRegex(data: string[]) {
		const input = {
			data,
		};

		const completion = await this.openai.chat.completions.create({
			messages: [
				{
					role: 'system',
					content: `Você é uma assitente que ajuda a criar regex para identificar urls de artigos. O usuário fonecerá
          um json contendo diversas urls, de acordo com o seguinte exemplo:
                {
                    "data": [
                        {
                          "url": "http://..."
                        },
                        {
                          "url": "http://..."
                        }
                    ]
                }
              O seu trabalho será identificar o padrão para as urls de artigos, criar a regex para esse padrão e
                  retornar a regex no formato json, de acordo com o seguinte exemplo:
                {
                    "regex": "regex para as urls de artigos"
                }`,
				},
				{ role: 'user', content: JSON.stringify(input) },
			],
			model: 'gpt-3.5-turbo-0125',
			response_format: { type: 'json_object' },
		});

		return JSON.parse(completion.choices[0].message.content) as { regex: string };
	}

	// REFATORAR
	async findByJobStatus(status: string): Promise<CrawledUrl[]> {
		return await this.crawledUrlRepository.find({
			where: {
				jobId: Not(IsNull()),
				jobStatus: Like(status),
			},
		});
	}

	// REFATORAR
	async findByStatus(status: string) {
		return await this.crawledUrlRepository.find({
			where: {
				status: Like(status),
			},
			relations: {
				scrapedArticles: true,
			},
		});
	}

	async update(data: CrawledUrl) {
		await this.crawledUrlRepository.save(data);
	}
}
