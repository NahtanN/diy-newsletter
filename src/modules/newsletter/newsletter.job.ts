import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NewsletterService } from './newsletter.service';
import { NewsletterStatus } from 'src/constants';

@Injectable()
export class NewsletterJob {
 private readonly logger = new Logger(NewsletterJob.name);

 constructor(private readonly service: NewsletterService) {}

 @Cron(CronExpression.EVERY_MINUTE)
 async handleCreateNewsletter() {
  this.logger.debug('CRON JOB STARTED: validate newsletters');
  const newsletters = await this.service.findByStatus(NewsletterStatus.IN_PROGRESS);

  const filteredNewsletters = newsletters.filter((newsletter) => {
   const jobsFinished = newsletter.crawledUrls.every((crawled) => crawled.status === NewsletterStatus.COMPLETED);

   if (newsletter.jobs === newsletter.crawledUrls.length && jobsFinished) {
    return newsletter;
   }
  });

  for (const newsletter of filteredNewsletters) {
   this.service.addOnAIQueue(newsletter);
  }

  this.logger.debug('CRON JOB FINISHED: validate newsletters');
 }
}
