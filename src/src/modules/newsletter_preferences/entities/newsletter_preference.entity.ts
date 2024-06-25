import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { NewsletterPreferenceConfig } from './newsletter_preference_config.entity';
import { Newsletter } from '../../newsletter/entities/newsletter.entity';

@Entity('newsletter_preferences')
export class NewsletterPreference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @OneToMany(() => NewsletterPreferenceConfig, (entity) => entity.newsletterPreference)
  config: NewsletterPreferenceConfig[];

  @OneToMany(() => Newsletter, (entity) => entity.preferences)
  newsletter: Newsletter;
}
