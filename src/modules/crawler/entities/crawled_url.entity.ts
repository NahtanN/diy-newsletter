import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
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

	@ManyToMany(() => ScrapedArticle, { cascade: true })
	@JoinTable({
		name: 'crawled_url_scraped_articles',
		joinColumn: { name: 'crawled_url_id', referencedColumnName: 'id' },
		inverseJoinColumn: { name: 'scraped_article_id', referencedColumnName: 'id' },
	})
	scrapedArticles: ScrapedArticle[];
}
