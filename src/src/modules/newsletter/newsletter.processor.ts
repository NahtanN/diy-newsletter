import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { Queues } from 'src/src/constants';

@Processor(Queues.NEWSLETTER.name)
export class NewsletterProcessor {
  private readonly logger = new Logger(NewsletterProcessor.name);

  @Process(Queues.NEWSLETTER.process.CRAW_URLS)
  handlerCrawUrls(job: Job) {
    this.logger.log('PROCESS STARTED: Creating newsletter');
    console.log(job);
  }
}
