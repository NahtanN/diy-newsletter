import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CrawledUrl } from '../../crawler/entities/crawled_url.entity';

@Entity('scraped_articles')
export class ScrapedArticle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'crawled_url_id' })
  crawledUrlId: number;

  @Column({ name: 'source_url' })
  sourceUrl: string;

  @Column({ name: 'article_content' })
  articleContent: string;

  @Column()
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => CrawledUrl, (entity) => entity.scrapedArticles)
  @JoinColumn({ name: 'crawled_url_id' })
  crawledUrl: CrawledUrl;
}
