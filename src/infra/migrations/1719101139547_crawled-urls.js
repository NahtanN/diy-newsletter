exports.up = (pgm) => {
  pgm.sql(`
        CREATE TABLE "crawled_urls" (
            "id" serial PRIMARY KEY,
            "newsletter_id" integer NOT NULL,
            "newsletter_preference_config_id" integer NOT NULL,
            "source_url" varchar,
            "job_id" varchar,
            "articles_url" varchar[],
            "status" varchar NOT NULL,
            "created_at" timestamp with time zone not null default (current_timestamp at time zone 'utc')
        );
    `);

  pgm.sql(`
        ALTER TABLE "crawled_urls" ADD FOREIGN KEY ("newsletter_preference_config_id") REFERENCES "newsletter_preference_config" ("id");
    `);
};

exports.down = (pgm) => {
  pgm.dropTable('crawled_urls');
};
