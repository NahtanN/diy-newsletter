import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('source_url_meta')
export class SourceUrlMeta {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	url: string;

	@Column({ name: 'articles_regex' })
	articlesRegex: string;
}
