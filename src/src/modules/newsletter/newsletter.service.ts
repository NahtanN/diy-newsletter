import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { NewsletterStatus, Queues } from 'src/src/constants';
import { NewsletterPreferencesService } from '../newsletter_preferences/newsletter_preferences.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Newsletter } from './entities/newsletter.entity';
import { Repository } from 'typeorm';
import { CrawledUrl } from '../crawler/entities/crawled_url.entity';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectQueue(Queues.NEWSLETTER.name) private readonly newsletterQueue: Queue,
    @InjectRepository(Newsletter)
    private readonly newsletterRepository: Repository<Newsletter>,
    private readonly newsletterPreferenceService: NewsletterPreferencesService,
  ) {}

  async findOne(id: number) {
    return await this.newsletterRepository.findOne({
      where: {
        id,
      },
      relations: {},
    });
  }

  async create(preferenceId: number) {
    const preference = await this.newsletterPreferenceService.findOne(preferenceId);

    const crawUrls = preference.config.map(
      (cg) =>
        ({
          status: NewsletterStatus.PENDING,
          newsletterPreferenceConfigId: preference.id,
          sourceUrl: cg.sourceUrl,
        }) as CrawledUrl,
    );

    const newsletter = await this.newsletterRepository.save({
      newsletterPreferenceId: preference.id,
      jobs: preference.config.length,
      status: NewsletterStatus.PENDING,
      crawledUrls: crawUrls,
    } as Newsletter);

    await this.newsletterQueue.add(Queues.NEWSLETTER.process.CRAW_URLS, newsletter, {
      attempts: 3,
      backoff: {
        type: 'fixed',
        delay: 5000,
      },
    });

    return {
      message: 'Newsletter adicionada na fila',
      newsletter,
    };
  }

  async updateStatus(id: number, status: string) {
    await this.newsletterRepository.update(id, {
      status,
    });
  }
}
