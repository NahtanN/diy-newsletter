import { Module } from '@nestjs/common';
import { NewsletterController } from './newsletter.controller';
import { NewsletterService } from './newsletter.service';
import { BullModule } from '@nestjs/bull';
import { NewsletterPreferencesModule } from '../newsletter_preferences/newsletter_preferences.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Newsletter } from './entities/newsletter.entity';
import { NewsletterProcessor } from './newsletter.processor';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { NewsletterJob } from './newsletter.job';
import { Queues } from 'src/constants';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: Queues.NEWSLETTER.name,
      },
      {
        name: Queues.CRAWLER.name,
      },
      {
        name: Queues.AI.name,
      },
    ),
    BullBoardModule.forFeature(
      {
        name: Queues.NEWSLETTER.name,
        adapter: BullAdapter,
      },
      {
        name: Queues.CRAWLER.name,
        adapter: BullAdapter,
      },
      {
        name: Queues.AI.name,
        adapter: BullAdapter,
      },
    ),
    TypeOrmModule.forFeature([Newsletter]),
    NewsletterPreferencesModule,
  ],
  controllers: [NewsletterController],
  providers: [NewsletterService, NewsletterProcessor, NewsletterJob],
  exports: [NewsletterService],
})
export class NewsletterModule {}
