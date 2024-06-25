import { Module } from '@nestjs/common';
import { NewsletterPreferencesService } from './newsletter_preferences.service';
import { NewsletterPreferencesController } from './newsletter_preferences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsletterPreference } from './entities/newsletter_preference.entity';
import { NewsletterPreferenceConfig } from './entities/newsletter_preference_config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NewsletterPreference, NewsletterPreferenceConfig])],
  providers: [NewsletterPreferencesService],
  controllers: [NewsletterPreferencesController],
})
export class NewsletterPreferencesModule {}
