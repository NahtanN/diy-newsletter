import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('scraped_articles')
export class ScrapedArticle {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: 'source_url' })
	sourceUrl: string;

	@Column({ name: 'article_content' })
	articleContent: string;

	@Column()
	status: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;
}
