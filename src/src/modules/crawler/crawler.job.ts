import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CrawlerService } from './crawler.service';
import { NewsletterStatus } from 'src/src/constants';

@Injectable()
export class CrawlerJob {
  constructor(private readonly service: CrawlerService) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleCron() {
    const crawls = await this.service.findByStatus(NewsletterStatus.IN_PROGRESS);
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
        crawled.status = NewsletterStatus.COMPLETED;

        await this.service.update(crawled);
      });

    await Promise.all(filterPromises);
  }
}
