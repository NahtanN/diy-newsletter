exports.up = (pgm) => {
  pgm.sql(`
        CREATE TABLE "source_url_meta" (
            "id" serial PRIMARY KEY,
            "url" varchar NOT NULL,
            "articles_regex" varchar NOT NULL
        );
    `);
};

exports.down = (pgm) => {
  pgm.dropTable('source_url_meta');
};
