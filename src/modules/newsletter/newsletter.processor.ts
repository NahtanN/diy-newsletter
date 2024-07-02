import { InjectQueue, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { NewsletterService } from './newsletter.service';
import { Newsletter } from './entities/newsletter.entity';
import { FIRST_ATTEMPT, NewsletterStatus, Queues } from 'src/constants';

@Processor(Queues.NEWSLETTER.name)
export class NewsletterProcessor {
	private readonly logger = new Logger(NewsletterProcessor.name);

	constructor(
		@InjectQueue(Queues.CRAWLER.name)
		private readonly urlCrawlerQueue: Queue,
		private readonly newsletterService: NewsletterService,
	) {}

	@Process(Queues.NEWSLETTER.process.CRAW_URLS)
	async handlerCrawUrls(job: Job) {
		this.logger.log(`process started: creating newsletter ${job.data.id}`);
		const data = job.data as Newsletter;

		if (job.attemptsMade === FIRST_ATTEMPT) {
			await this.newsletterService.updateStatus(data.id, NewsletterStatus.IN_PROGRESS);
		}

		const crawUrlsJobs = data.crawledUrls.map((source) =>
			this.urlCrawlerQueue.add(Queues.CRAWLER.process.URL, source, {
				attempts: 3,
				backoff: {
					type: 'fixed',
					delay: 3000,
				},
			}),
		);

		const jobs = await Promise.allSettled(crawUrlsJobs);

		for (const result of jobs) {
			if (result.status === 'fulfilled') continue;

			this.logger.warn(`failed to added url crawler job: ${result.reason}`);
			throw new Error(result.reason);
		}
	}

	@OnQueueFailed()
	async handleFailed(job: Job) {
		this.logger.warn(`process failed: newsletter-${job.data.id};retry:${job.attemptsMade}`);

		if (job.opts.attempts === job.attemptsMade) {
			this.logger.error(`process failed: newsletter-${job.data.id}`);
			await this.newsletterService.updateStatus(job.data.id, NewsletterStatus.FAILED);
		}
	}
}
