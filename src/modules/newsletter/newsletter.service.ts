import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { NewsletterStatus, Queues } from 'src/constants';
import { NewsletterPreferencesService } from '../newsletter_preferences/newsletter_preferences.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Newsletter } from './entities/newsletter.entity';
import { Like, Repository } from 'typeorm';
import { CrawledUrl } from '../crawler/entities/crawled_url.entity';

@Injectable()
export class NewsletterService {
	constructor(
		@InjectQueue(Queues.NEWSLETTER.name) private readonly newsletterQueue: Queue,
		@InjectQueue(Queues.AI.name) private readonly aiQueue: Queue,
		@InjectRepository(Newsletter)
		private readonly newsletterRepository: Repository<Newsletter>,
		private readonly newsletterPreferenceService: NewsletterPreferencesService,
	) {}

	async findAll(preferenceId?: number) {
		let where = {};

		if (preferenceId) {
			where = {
				newsletterPreferenceId: preferenceId,
			};
		}

		return this.newsletterRepository.find({
			where,
			relations: {
				preferences: true,
			},
			select: {
				id: true,
				status: true,
				preferences: {
					id: true,
					title: true,
				},
			},
		});
	}

	async findOne(id: number) {
		return await this.newsletterRepository.findOne({
			where: {
				id,
			},
		});
	}

	async findByStatus(status: string) {
		return this.newsletterRepository.find({
			where: {
				status: Like(status),
			},
			relations: {
				preferences: true,
				crawledUrls: {
					scrapedArticles: true,
				},
			},
		});
	}

	async create(preferenceId: number) {
		const preference = await this.newsletterPreferenceService.findOne(preferenceId);

		const crawUrls = preference.config.map(
			(cg) =>
				({
					status: NewsletterStatus.PENDING,
					newsletterPreferenceConfigId: preference.id,
					sourceUrl: cg.sourceUrl,
				}) as CrawledUrl,
		);

		const newsletter = await this.newsletterRepository.save({
			newsletterPreferenceId: preference.id,
			jobs: preference.config.length,
			status: NewsletterStatus.PENDING,
			crawledUrls: crawUrls,
		} as Newsletter);

		await this.newsletterQueue.add(Queues.NEWSLETTER.process.CRAW_URLS, newsletter, {
			attempts: 3,
			backoff: {
				type: 'fixed',
				delay: 5000,
			},
		});

		return {
			message: 'Newsletter adicionada na fila',
			newsletter,
		};
	}

	async updateStatus(id: number, status: string) {
		await this.newsletterRepository.update(id, {
			status,
		});
	}

	async update(newsletter: Newsletter) {
		await this.newsletterRepository.save(newsletter);
	}

	async addOnAIQueue(newsletter: Newsletter) {
		const articles: string[] = [];

		for (const crawled of newsletter.crawledUrls) {
			for (const scraped of crawled.scrapedArticles) {
				articles.push(scraped.articleContent);
			}
		}

		const data = {
			title: newsletter.preferences.title,
			articles,
		};

		await this.updateStatus(newsletter.id, NewsletterStatus.WAITING);
		await this.aiQueue.add(
			Queues.AI.process.NEWSLETTER,
			{
				newsletter,
				aiData: data,
			},
			{
				attempts: 3,
				delay: 1500,
				backoff: {
					type: 'fixed',
					delay: 5000,
				},
			},
		);
	}
}
