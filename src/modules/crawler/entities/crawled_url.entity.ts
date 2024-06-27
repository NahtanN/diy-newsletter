import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Newsletter } from '../../newsletter/entities/newsletter.entity';
import { ScrapedArticle } from '../../scraper/entities/scraped_article.entity';

@Entity('crawled_urls')
export class CrawledUrl {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'newsletter_id' })
  newsletterId: number;

  @Column({ name: 'newsletter_preference_config_id' })
  newsletterPreferenceConfigId: number;

  @Column({ name: 'source_url' })
  sourceUrl: string;

  @Column({ name: 'job_id' })
  jobId: string;

  @Column({ name: 'job_status' })
  jobStatus: string;

  @Column({ name: 'articles_url', type: 'varchar', array: true })
  articlesUrl: string[];

  @Column()
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Newsletter, (entity) => entity.crawledUrls)
  @JoinColumn({ name: 'newsletter_id' })
  newsletter: Newsletter;

  @OneToMany(() => ScrapedArticle, (entity) => entity.crawledUrl)
  scrapedArticles: ScrapedArticle[];
}
