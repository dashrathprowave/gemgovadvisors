-- GeM Advisor — database schema (MySQL / MariaDB)
--
-- Run with:  node scripts/db-setup.mjs
-- Safe to re-run: every statement uses IF NOT EXISTS.
--
-- The columns mirror the form fields exactly. If a field is added to a form,
-- add the column here too — see db/migrations/ for changing an existing table.
--
-- utf8mb4 throughout so the rupee sign, em dashes and Indic scripts survive.

-- Business registrations — the form at /register
CREATE TABLE IF NOT EXISTS `registrations` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(120) NOT NULL,
  `designation` VARCHAR(120) NULL,
  `phone`       VARCHAR(20)  NOT NULL,
  `email`       VARCHAR(190) NOT NULL,
  `company`     VARCHAR(190) NULL,
  `consent`     TINYINT(1)   NOT NULL DEFAULT 0,
  `ip_address`  VARCHAR(45)  NULL,
  `user_agent`  VARCHAR(255) NULL,
  -- Workflow columns so the team can track who has been dealt with.
  `status`      VARCHAR(20)  NOT NULL DEFAULT 'new',
  `notes`       TEXT         NULL,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_registrations_created_at` (`created_at`),
  KEY `idx_registrations_status` (`status`),
  KEY `idx_registrations_phone` (`phone`),
  KEY `idx_registrations_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Enquiries — the "Tell us about your requirement" form in the Contact sections
CREATE TABLE IF NOT EXISTS `leads` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(120) NOT NULL,
  `company`     VARCHAR(190) NULL,
  `phone`       VARCHAR(20)  NOT NULL,
  `email`       VARCHAR(190) NOT NULL,
  `service`     VARCHAR(120) NULL,
  `message`     TEXT         NULL,
  `ip_address`  VARCHAR(45)  NULL,
  `user_agent`  VARCHAR(255) NULL,
  `status`      VARCHAR(20)  NOT NULL DEFAULT 'new',
  `notes`       TEXT         NULL,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_leads_created_at` (`created_at`),
  KEY `idx_leads_status` (`status`),
  KEY `idx_leads_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
