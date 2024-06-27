import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScrapedArticle } from './entities/scraped_article.entity';
import { In, Like, Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { NewsletterStatus, Queues } from 'src/constants';
import { Queue } from 'bull';
import { CrawledUrl } from '../crawler/entities/crawled_url.entity';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  constructor(
    @InjectRepository(ScrapedArticle)
    private readonly scrapedArticleRepository: Repository<ScrapedArticle>,
    @InjectRepository(CrawledUrl)
    private readonly crawledUrlRepository: Repository<CrawledUrl>,
    @InjectQueue(Queues.SCRAPER.name)
    private readonly scraperQueue: Queue,
    private readonly httpService: HttpService,
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

    const addOnQueue = databaseRecords.map((record) =>
      this.scraperQueue.add(Queues.SCRAPER.process.URL, record, {
        attempts: 3,
        backoff: {
          type: 'fixed',
          delay: 3000,
        },
      }),
    );
    await Promise.all(addOnQueue);
  }

  async update(scrapedArticle: ScrapedArticle) {
    await this.scrapedArticleRepository.save(scrapedArticle);
  }

  async scrapeUrl(url: string) {
    const { data: response } = await firstValueFrom(
      this.httpService
        .post('http://localhost:3002/v0/scrape', {
          url,
          pageOptions: {
            onlyMainContent: true,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );

    return response;
  }
}
