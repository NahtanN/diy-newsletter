import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScrapedArticle } from './entities/scraped_article.entity';
import { In, Like, Not, Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { NewsletterStatus, Queues } from 'src/src/constants';
import { Queue } from 'bull';
import { CrawledUrl } from '../crawler/entities/crawled_url.entity';

@Injectable()
export class ScraperService {
  constructor(
    @InjectRepository(ScrapedArticle)
    private readonly scrapedArticleRepository: Repository<ScrapedArticle>,
    @InjectRepository(CrawledUrl)
    private readonly crawledUrlRepository: Repository<CrawledUrl>,
    @InjectQueue(Queues.SCRAPER.name)
    private readonly scraperQueue: Queue,
  ) {}

  async findPendingScrapes() {
    const result = await this.crawledUrlRepository.find({
      where: {
        jobStatus: Like(NewsletterStatus.COMPLETED),
      },
      relations: {
        scrapedArticles: true,
      },
    });

    return result;
  }

  validatePendingArticles(crawledUrl: CrawledUrl): string[] {
    const scraped = crawledUrl.scrapedArticles.map((sc) => sc.sourceUrl);
    const filtered: string[] = [];
    for (let i = 0; i < Number(process.env.SCRAPER_LIMIT); i++) {
      const url = crawledUrl.articlesUrl[i];
      if (scraped.includes(url)) continue;

      filtered.push(url);
    }

    return filtered;
  }

  async filterPendingarticles(sourceUrls: string[]) {
    const alreadyScraped = await this.scrapedArticleRepository.find({
      where: {
        sourceUrl: In(sourceUrls),
      },
    });
    const alreadyScrapedUrls = alreadyScraped.map((sc) => sc.sourceUrl);

    return sourceUrls.filter((url) => !alreadyScrapedUrls.includes(url));
  }

  async addScraper(crawledUrl: CrawledUrl, add: string[]) {
    const scrapedArticles = add.map((url) =>
      this.scrapedArticleRepository.save({
        crawledUrlId: crawledUrl.id,
        sourceUrl: url,
        status: NewsletterStatus.PENDING,
      } as ScrapedArticle),
    );
    const databaseRecords = await Promise.all(scrapedArticles);

    const addOnQueue = databaseRecords.map((record) => this.scraperQueue.add(Queues.SCRAPER.process.URL, record));
    await Promise.all(addOnQueue);
  }
}
