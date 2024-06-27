exports.up = (pgm) => {
 pgm.sql(`
        CREATE TABLE "crawled_url_scraped_articles" (
            "crawled_url_id" integer,
            "scraped_article_id" integer
        );
    `);
 pgm.sql(
  'ALTER TABLE "crawled_url_scraped_articles" ADD FOREIGN KEY ("crawled_url_id") REFERENCES "crawled_urls" ("id")',
 );
 pgm.sql(
  'ALTER TABLE "crawled_url_scraped_articles" ADD FOREIGN KEY ("scraped_article_id") REFERENCES "scraped_articles" ("id")',
 );
};

exports.down = (pgm) => {};
