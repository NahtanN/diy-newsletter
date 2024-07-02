import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrapedArticle } from './entities/scraped_article.entity';
import { CrawledUrl } from '../crawler/entities/crawled_url.entity';
import { ScraperJob } from './scraper.job';
import { BullModule } from '@nestjs/bull';
import { Queues } from 'src/constants';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { HttpModule } from '@nestjs/axios';
import { ScraperProcessor } from './scraper.processor';
import { CrawlerModule } from '../crawler/crawler.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([ScrapedArticle, CrawledUrl]),
		BullModule.registerQueue({
			name: Queues.SCRAPER.name,
		}),
		BullBoardModule.forFeature({
			name: Queues.SCRAPER.name,
			adapter: BullAdapter,
		}),
		HttpModule,
		CrawlerModule,
	],
	providers: [ScraperService, ScraperJob, ScraperProcessor],
})
export class ScraperModule {}
