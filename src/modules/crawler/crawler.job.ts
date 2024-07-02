import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CrawlerService } from './crawler.service';
import { NewsletterStatus } from 'src/constants';

@Injectable()
export class CrawlerJob {
	private readonly logger = new Logger(CrawlerJob.name);

	constructor(private readonly service: CrawlerService) {}

	@Cron(CronExpression.EVERY_MINUTE)
	async handleUpdateJobStatus() {
		this.logger.debug('CRON JOB STARTED: Filter crawled URLs');
		try {
			const crawls = await this.service.findByJobStatus(NewsletterStatus.IN_PROGRESS);
			const crawledPromises = crawls.map(async (crawl) => {
				const response = await this.service.crawlUrlStatus(crawl.jobId);

				if (response.status === 'completed' && response.data.length) {
					const articlesUrl = response.data.map((rs) => rs.url);
					crawl.articlesUrl = articlesUrl;
				}

				return crawl;
			});

			const result = await Promise.all(crawledPromises);

			const filterPromises = result
				.filter((dt) => dt.articlesUrl && dt.articlesUrl.length)
				.map(async (crawled) => {
					const filtered = await this.service.filterCrawledUrls(crawled.sourceUrl, crawled.articlesUrl);
					crawled.articlesUrl = filtered;
					crawled.jobStatus = NewsletterStatus.COMPLETED;

					await this.service.update(crawled);
				});

			await Promise.all(filterPromises);
		} catch (error) {
			this.logger.error(`CRON JOB FAILED: ${error}`);
		}
		this.logger.debug('CRON JOB FINISHED: Filter crawled URLs');
	}

	@Cron(CronExpression.EVERY_30_SECONDS)
	async handleCrawledStatus() {
		this.logger.debug('CRON JOB STARTED: Handle crawled status');

		const crawls = await this.service.findByStatus(NewsletterStatus.IN_PROGRESS);

		const scrapedFiltered = crawls.filter((cr) => {
			const filteredScrapes = cr.scrapedArticles.filter((sa) => sa.status === NewsletterStatus.COMPLETED);

			if (filteredScrapes.length >= Number(process.env.SCRAPER_LIMIT)) {
				return cr;
			}
		});

		const updatePromises = scrapedFiltered.map(async (sf) => {
			sf.status = NewsletterStatus.COMPLETED;
			await this.service.update(sf);
		});

		await Promise.all(updatePromises);
	}
}
