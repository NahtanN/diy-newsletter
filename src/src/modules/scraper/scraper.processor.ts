import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { NewsletterStatus, Queues } from 'src/src/constants';
import { ScraperService } from './scraper.service';
import { ScrapedArticle } from './entities/scraped_article.entity';
import { Job } from 'bull';

const FIRST_ATTEMPT = 0;

@Processor(Queues.SCRAPER.name)
export class ScraperProcessor {
  private readonly logger = new Logger(ScraperProcessor.name);

  constructor(private readonly service: ScraperService) {}

  @Process(Queues.SCRAPER.process.URL)
  async handleScraper(job: Job) {
    this.logger.log(`Process started: creating newsletter ${job.data.id}`);

    const data = job.data as ScrapedArticle;

    if (job.attemptsMade === FIRST_ATTEMPT) {
      data.status = NewsletterStatus.IN_PROGRESS;

      await this.service.update(data);
    }

    const response = await this.service.scrapeUrl(data.sourceUrl);
    const content = response.data.markdown;
    if (!content) {
      throw new Error('Scraper failed');
    }

    data.articleContent = content;
    data.status = NewsletterStatus.COMPLETED;
    await this.service.update(data);
  }

  @OnQueueFailed()
  async handleFailed(job: Job) {
    this.logger.warn(`Process failed: scraper-${job.data.id};retry:${job.attemptsMade}`);

    if (job.opts.attempts === job.attemptsMade) {
      this.logger.error(`Process failed: scraper-${job.data.id}`);

      const data = job.data as ScrapedArticle;
      data.status = NewsletterStatus.FAILED;

      await this.service.update(data);
    }
  }
}
