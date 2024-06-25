import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrawledUrl } from './entities/crawled_url.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CrawlerService {
  constructor(
    @InjectRepository(CrawledUrl)
    private readonly createdUrlRepository: Repository<CrawledUrl>,
  ) {}

  async update(data: CrawledUrl) {
    await this.createdUrlRepository.save(data);
  }
}
