import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ScraperService } from './scraper.service';

@Injectable()
export class ScraperJob {
  private readonly logger = new Logger(ScraperJob.name);

  constructor(private readonly service: ScraperService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async checkPending() {
    this.logger.debug('CRON JOB STARTED: Check crawled urls');

    try {
      const result = await this.service.findPendingScrapes();

      result.map(async (crawled) => {
        if (crawled.scrapedArticles.length < Number(process.env.SCRAPER_LIMIT)) {
          const addScraper = this.service.validatePendingArticles(crawled);

          const filtered = await this.service.filterPendingarticles(addScraper);
          await this.service.addScraper(crawled, filtered);
        }
      });
    } catch (error) {
      this.logger.error(`CRON JOB FAILED: ${error}`);
    }

    this.logger.debug('CRON JOB FINISHED: Check crawled urls');
  }
}
