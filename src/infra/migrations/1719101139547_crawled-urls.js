exports.up = (pgm) => {
  pgm.sql(`
        CREATE TABLE "crawled_urls" (
            "id" serial PRIMARY KEY,
            "newsletter_config_id" integer NOT NULL,
            "articles_url" varchar[],
            "status" varchar
        );
    `);

  pgm.sql(`
        ALTER TABLE "crawled_urls" ADD FOREIGN KEY ("newsletter_config_id") REFERENCES "newsletter_preference_config" ("id");
    `);
};

exports.down = (pgm) => {
  pgm.dropTable('crawled_urls');
};
