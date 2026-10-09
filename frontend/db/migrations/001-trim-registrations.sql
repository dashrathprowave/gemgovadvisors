-- Drops the registration columns whose form fields are not in use.
--
-- Only needed on a database created before this change. `node scripts/db-setup.mjs`
-- uses CREATE TABLE IF NOT EXISTS, so it will not alter a table that already exists.
--
-- Run with:
--   mysql --socket=/run/mysqld/mysqld.sock -u USER -p DBNAME < db/migrations/001-trim-registrations.sql

ALTER TABLE `registrations`
  DROP COLUMN `business_type`,
  DROP COLUMN `turnover`,
  DROP COLUMN `gst`,
  DROP COLUMN `udyam`,
  DROP COLUMN `city`,
  DROP COLUMN `state`,
  DROP COLUMN `products`,
  DROP COLUMN `gem_status`,
  DROP COLUMN `interests`,
  DROP COLUMN `message`;
