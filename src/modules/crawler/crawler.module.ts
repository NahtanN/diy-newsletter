import { Module } from '@nestjs/common';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';
import { CrawlerProcessor } from './crawler.processor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrawledUrl } from './entities/crawled_url.entity';
import { HttpModule } from '@nestjs/axios';
import { CrawlerJob } from './crawler.job';
import { SourceUrlMeta } from './entities/source_url_meta.entity';

@Module({
 imports: [TypeOrmModule.forFeature([CrawledUrl, SourceUrlMeta]), HttpModule],
 controllers: [CrawlerController],
 providers: [CrawlerService, CrawlerProcessor, CrawlerJob],
 exports: [CrawlerService],
})
export class CrawlerModule {}
