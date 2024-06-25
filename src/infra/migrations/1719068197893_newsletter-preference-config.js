exports.up = (pgm) => {
  pgm.sql(`
        CREATE TABLE "newsletter_preference_config" (
            "id" serial PRIMARY KEY,
            "newsletter_id" integer NOT NULL,
            "title" varchar,
            "source_url" varchar
        );
    `);

  pgm.sql(`
        ALTER TABLE "newsletter_preference_config" ADD FOREIGN KEY ("newsletter_id") REFERENCES "newsletter_preferences" ("id");
    `);
};

exports.down = (pgm) => {
  pgm.dropTable('newsletter_config');
};
