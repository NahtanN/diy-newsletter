import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { NewsletterStatus, Queues } from 'src/constants';
import { NewsletterService } from '../newsletter/newsletter.service';
import { AiService } from './ai.service';
import { Newsletter } from '../newsletter/entities/newsletter.entity';

@Processor(Queues.AI.name)
export class AiProcessor {
 private readonly logger = new Logger(AiProcessor.name);

 constructor(
  private readonly service: AiService,
  private readonly newsletterService: NewsletterService,
 ) {}

 @Process(Queues.AI.process.NEWSLETTER)
 async handleCreateContent(job: Job) {
  const { aiData, newsletter } = job.data as {
   newsletter: Newsletter;
   aiData: {
    title: string;
    articles: string[];
   };
  };

  const response = await this.service.createAIContent(aiData);

  newsletter.status = NewsletterStatus.COMPLETED;
  newsletter.content = response.newsletter;
  await this.newsletterService.update(newsletter);
 }

 @OnQueueFailed()
 async handleFailed(job: Job) {
  this.logger.warn(`Process failed: newsletter-${job.data.newsletter.id};retry:${job.attemptsMade}`);

  if (job.opts.attempts === job.attemptsMade) {
   this.logger.error(`Process failed: newsletter-${job.data.id}`);
   await this.newsletterService.updateStatus(job.data.newsletter.id, NewsletterStatus.FAILED);
  }
 }
}
