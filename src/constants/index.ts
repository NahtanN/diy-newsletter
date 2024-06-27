export const PG_CONNECTION = 'PG_CONNECTION';

export const NewsletterStatus = Object.freeze({
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  WAITING: 'waiting',
});

export const Queues = Object.freeze({
  NEWSLETTER: {
    name: 'newsletter',
    process: {
      CRAW_URLS: 'craw_urls',
    },
  },
  CRAWLER: {
    name: 'crawler',
    process: {
      URL: 'url',
    },
  },
  SCRAPER: {
    name: 'scraper',
    process: {
      URL: 'url',
    },
  },
  AI: {
    name: 'ai',
    process: {
      NEWSLETTER: 'newsletter',
    },
  },
});
