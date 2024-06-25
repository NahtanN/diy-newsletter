exports.up = (pgm) => {
  pgm.sql(`
        CREATE TABLE "scraped_articles" (
            "id" serial PRIMARY KEY,
            "crawled_url_id" integer NOT NULL,
            "article_content" text,
            "created_at" timestamp with time zone not null default (current_timestamp at time zone 'utc'),
            "status" varchar
        );
    `);

  pgm.sql(`
        ALTER TABLE "scraped_articles" ADD FOREIGN KEY ("crawled_url_id") REFERENCES "crawled_urls" ("id");
    `);
};

exports.down = (pgm) => {
  pgm.dropTable(`scraped_articles`);
};
