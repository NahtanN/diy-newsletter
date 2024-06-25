import { Module } from '@nestjs/common';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';
import { CrawlerProcessor } from './crawler.processor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrawledUrl } from './entities/crawled_url.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([CrawledUrl]), HttpModule],
  controllers: [CrawlerController],
  providers: [CrawlerService, CrawlerProcessor],
})
export class CrawlerModule {}
