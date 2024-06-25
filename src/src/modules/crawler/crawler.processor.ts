import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { NewsletterStatus, Queues } from 'src/src/constants';
import { CrawledUrl } from './entities/crawled_url.entity';
import { CrawlerService } from './crawler.service';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';

const FIRST_ATTEMPT = 0;

@Processor(Queues.CRAWLER.name)
export class CrawlerProcessor {
  private readonly logger = new Logger(CrawlerProcessor.name);

  constructor(
    private readonly crawlerService: CrawlerService,
    private readonly httpService: HttpService,
  ) {}

  @Process(Queues.CRAWLER.process.URL)
  async handlerCrawUrls(job: Job) {
    this.logger.log(`process started: creating newsletter ${job.data.id}`);
    const data = job.data as CrawledUrl;

    if (job.attemptsMade === FIRST_ATTEMPT) {
      data.status = NewsletterStatus.IN_PROGRESS;

      await this.crawlerService.update(data);
    }

    const { data: response } = await firstValueFrom(
      this.httpService
        .post(process.env.CRAW_URL, {
          url: data.sourceUrl,
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

    data.jobId = response.jobId;

    await this.crawlerService.update(data);
  }

  @OnQueueFailed()
  async handleFailed(job: Job) {
    this.logger.warn(`process failed: newsletter-${job.data.id};retry:${job.attemptsMade}`);

    if (job.opts.attempts === job.attemptsMade) {
      this.logger.error(`process failed: newsletter-${job.data.id}`);

      const data = job.data as CrawledUrl;
      data.status = NewsletterStatus.FAILED;

      await this.crawlerService.update(data);
    }
  }
}
