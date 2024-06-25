import { Module } from '@nestjs/common';
import { NewsletterController } from './newsletter.controller';
import { NewsletterService } from './newsletter.service';
import { BullModule } from '@nestjs/bull';
import { Queues } from 'src/src/constants';
import { NewsletterPreferencesModule } from '../newsletter_preferences/newsletter_preferences.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Newsletter } from './entities/newsletter.entity';
import { NewsletterProcessor } from './newsletter.processor';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';

@Module({
  imports: [
    BullModule.registerQueue({
      name: Queues.NEWSLETTER.name,
    }),
    BullBoardModule.forFeature({
      name: Queues.NEWSLETTER.name,
      adapter: BullAdapter,
    }),
    TypeOrmModule.forFeature([Newsletter]),
    NewsletterPreferencesModule,
  ],
  controllers: [NewsletterController],
  providers: [NewsletterService, NewsletterProcessor],
})
export class NewsletterModule {}
