exports.up = (pgm) => {
  pgm.sql(`
        CREATE TABLE "scraped_articles" (
            "id" serial PRIMARY KEY,
            "source_url" varchar,
            "article_content" text,
            "status" varchar,
            "created_at" timestamp with time zone not null default (current_timestamp at time zone 'utc')
        );
    `);
};

exports.down = (pgm) => {
  pgm.dropTable(`scraped_articles`);
};
