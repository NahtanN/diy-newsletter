exports.up = (pgm) => {
  pgm.sql(`
        ALTER TABLE "crawled_urls" ADD FOREIGN KEY ("newsletter_id") REFERENCES "newsletters" ("id");
    `);
};

exports.down = (pgm) => {};
