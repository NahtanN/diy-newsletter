import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { NewsletterPreference } from './newsletter_preference.entity';

@Entity('newsletter_preference_config')
export class NewsletterPreferenceConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'newsletter_id' })
  newsletterId: number;

  @Column()
  title: string;

  @Column({ name: 'source_url' })
  sourceUrl: string;

  @ManyToOne(() => NewsletterPreference, (entity) => entity.config)
  @JoinColumn({ name: 'newsletter_id' })
  newsletterPreference: NewsletterPreference;
}
