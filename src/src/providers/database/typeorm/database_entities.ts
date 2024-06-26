import { CrawledUrl } from 'src/src/modules/crawler/entities/crawled_url.entity';
import { SourceUrlMeta } from 'src/src/modules/crawler/entities/source_url_meta.entity';
import { Newsletter } from 'src/src/modules/newsletter/entities/newsletter.entity';
import { NewsletterPreference } from 'src/src/modules/newsletter_preferences/entities/newsletter_preference.entity';
import { NewsletterPreferenceConfig } from 'src/src/modules/newsletter_preferences/entities/newsletter_preference_config.entity';
import { ScrapedArticle } from 'src/src/modules/scraper/entities/scraped_article.entity';

export const entities = [
  NewsletterPreference,
  NewsletterPreferenceConfig,
  Newsletter,
  CrawledUrl,
  SourceUrlMeta,
  ScrapedArticle,
];
