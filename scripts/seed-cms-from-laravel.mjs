#!/usr/bin/env node
/**
 * Populates CMS tables in bansal_immigration2 using Laravel seeders (same DB as the Node app).
 * Run from repo root: node scripts/seed-cms-from-laravel.mjs
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const laravelRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../bansal_immigration_new");
const seeders = [
  "AllMissingPagesSeeder",
  "AdditionalMigrationPagesSeeder",
  "BusinessVisaPagesSeeder",
  "EmployerSponsoredPagesSeeder",
  "MigrateToAustraliaMigrationPageSeeder",
  "ImmigrationSeeder",
  "TeamMemberSeeder",
];

for (const seeder of seeders) {
  const result = spawnSync("php", ["artisan", "db:seed", `--class=${seeder}`, "--no-interaction"], {
    cwd: laravelRoot,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log("CMS seeders finished. Run migrations in Laravel first if team_members is missing.");
