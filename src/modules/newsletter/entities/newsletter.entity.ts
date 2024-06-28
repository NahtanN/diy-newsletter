import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { NewsletterPreference } from '../../newsletter_preferences/entities/newsletter_preference.entity';
import { CrawledUrl } from '../../crawler/entities/crawled_url.entity';

@Entity('newsletters')
export class Newsletter {
 @PrimaryGeneratedColumn()
 id: number;

 @Column({ name: 'newsletter_preference_id' })
 newsletterPreferenceId: number;

 @Column()
 jobs: number;

 @Column()
 status: string;

 @Column()
 content: string;

 @CreateDateColumn({ name: 'created_at' })
 createdAt: Date;

 @ManyToOne(() => NewsletterPreference, (entity) => entity.newsletter)
 @JoinColumn({ name: 'newsletter_preference_id' })
 preferences: NewsletterPreference;

 @OneToMany(() => CrawledUrl, (entity) => entity.newsletter, { cascade: true })
 crawledUrls: CrawledUrl[];
}
