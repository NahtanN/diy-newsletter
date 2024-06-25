import { CrawledUrl } from 'src/src/modules/newsletter/entities/crawled_url.entity';
import { Newsletter } from 'src/src/modules/newsletter/entities/newsletter.entity';
import { NewsletterPreference } from 'src/src/modules/newsletter_preferences/entities/newsletter_preference.entity';
import { NewsletterPreferenceConfig } from 'src/src/modules/newsletter_preferences/entities/newsletter_preference_config.entity';

export const entities = [NewsletterPreference, NewsletterPreferenceConfig, Newsletter, CrawledUrl];
