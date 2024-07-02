import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ScraperService } from './scraper.service';
import { CrawlerService } from '../crawler/crawler.service';

@Injectable()
export class ScraperJob {
	private readonly logger = new Logger(ScraperJob.name);

	constructor(
		private readonly service: ScraperService,
		private readonly crawler: CrawlerService,
	) {}

	@Cron(CronExpression.EVERY_10_SECONDS)
	async checkPending() {
		this.logger.debug('CRON JOB STARTED: Check crawled urls');

		try {
			const result = await this.service.findPendingScrapes();

			result.map(async (crawled) => {
				if (crawled.scrapedArticles.length >= Number(process.env.SCRAPER_LIMIT)) {
					return;
				}

				const addScraper = this.service.limitArticles(crawled);

				const result = await this.service.filterPendingArticles(addScraper);
				await this.service.addOnScraperQueue(crawled, result.filtered);

				if (!result.filtered.length) {
					crawled.scrapedArticles = result.articles;
					await this.crawler.update(crawled);
				}
			});
		} catch (error) {
			this.logger.error(`CRON JOB FAILED: ${error}`);
		}

		this.logger.debug('CRON JOB FINISHED: Check crawled urls');
	}
}
