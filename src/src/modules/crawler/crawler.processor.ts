import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { NewsletterStatus, Queues } from 'src/src/constants';
import { CrawledUrl } from './entities/crawled_url.entity';
import { CrawlerService } from './crawler.service';

const FIRST_ATTEMPT = 0;

@Processor(Queues.CRAWLER.name)
export class CrawlerProcessor {
  private readonly logger = new Logger(CrawlerProcessor.name);

  constructor(private readonly service: CrawlerService) {}

  @Process(Queues.CRAWLER.process.URL)
  async handlerCrawUrls(job: Job) {
    this.logger.log(`Process started: creating newsletter ${job.data.id}`);
    const data = job.data as CrawledUrl;

    if (job.attemptsMade === FIRST_ATTEMPT) {
      data.status = NewsletterStatus.IN_PROGRESS;

      await this.service.update(data);
    }

    const response = await this.service.crawlUrl(data.sourceUrl);

    data.jobId = response.jobId;
    data.jobStatus = NewsletterStatus.IN_PROGRESS;

    await this.service.update(data);
  }

  @OnQueueFailed()
  async handleFailed(job: Job) {
    this.logger.warn(`Process failed: newsletter-${job.data.id};retry:${job.attemptsMade}`);

    if (job.opts.attempts === job.attemptsMade) {
      this.logger.error(`Process failed: newsletter-${job.data.id}`);

      const data = job.data as CrawledUrl;
      data.status = NewsletterStatus.FAILED;
      data.jobStatus = NewsletterStatus.FAILED;

      await this.service.update(data);
    }
  }
}
