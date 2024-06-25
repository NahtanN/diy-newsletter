exports.up = (pgm) => {
  pgm.sql(`
        CREATE TABLE "newsletters" (
            "id" serial PRIMARY KEY,
            "newsletter_preference_id" integer NOT NULL,
            "jobs" integer NOT NULL,
            "status" varchar,
            "content" text,
            "created_at" timestamp with time zone not null default (current_timestamp at time zone 'utc') 
        );
    `);

  pgm.sql(
    'ALTER TABLE "newsletters" ADD FOREIGN KEY ("newsletter_preference_id") REFERENCES "newsletter_preferences" ("id");',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('newsletter');
};
