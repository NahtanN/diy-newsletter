import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { ScheduleModule } from '@nestjs/schedule';
import { NewsletterPreferencesModule } from './modules/newsletter_preferences/newsletter_preferences.module';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { DatabaseModule } from './providers/database/database.module';
import { CrawlerModule } from './modules/crawler/crawler.module';
import { ScraperModule } from './modules/scraper/scraper.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
 imports: [
  ConfigModule.forRoot(),
  BullModule.forRoot({
   redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
   },
  }),
  BullBoardModule.forRoot({
   route: '/queues',
   adapter: ExpressAdapter,
  }),
  ScheduleModule.forRoot(),
  HttpModule,
  NewsletterPreferencesModule,
  NewsletterModule,
  DatabaseModule,
  CrawlerModule,
  ScraperModule,
  AiModule,
 ],
})
export class AppModule {}
