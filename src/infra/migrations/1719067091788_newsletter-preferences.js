exports.up = (pgm) => {
  pgm.sql(`
        CREATE TABLE "newsletter_preferences" (
            "id" serial PRIMARY KEY,
            "title" varchar,
            "created_at" timestamp with time zone not null default (current_timestamp at time zone 'utc')
        );
    `);
};

exports.down = (pgm) => {
  pgm.dropTable('newsletter_preferences');
};
