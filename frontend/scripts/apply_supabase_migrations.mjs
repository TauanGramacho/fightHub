import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { Client } from 'pg';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is required.');
  process.exit(1);
}

const repoRoot = path.resolve(process.cwd(), '..');
const migrationFiles = [
  'supabase-fighter-auth-link.sql',
  'supabase-fighter-photo-settings.sql',
  'supabase-fighter-follows.sql',
  'supabase-fighter-showcase.sql',
];

const client = new Client({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  await client.connect();

  for (const file of migrationFiles) {
    const fullPath = path.join(repoRoot, file);
    const sql = await fs.readFile(fullPath, 'utf8');
    console.log(`Applying ${file}...`);
    await client.query(sql);
  }

  const schemaCheck = await client.query(`
    select
      exists (
        select 1
        from information_schema.columns
        where table_schema = 'public'
          and table_name = 'fighters'
          and column_name = 'auth_id'
      ) as fighters_has_auth_id,
      exists (
        select 1
        from information_schema.columns
        where table_schema = 'public'
          and table_name = 'fighters'
          and column_name = 'photo_position'
      ) as fighters_has_photo_position,
      exists (
        select 1
        from information_schema.columns
        where table_schema = 'public'
          and table_name = 'fighters'
          and column_name = 'photo_zoom'
      ) as fighters_has_photo_zoom,
      exists (
        select 1
        from information_schema.tables
        where table_schema = 'public'
          and table_name = 'fighter_follows'
      ) as has_fighter_follows_table
  `);

  const followsCount = await client.query(`
    select count(*)::int as total
    from public.fighter_follows
  `);

  console.log(JSON.stringify({
    schema: schemaCheck.rows[0],
    fighterFollowsCount: followsCount.rows[0]?.total ?? 0,
  }, null, 2));
}

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await client.end().catch(() => {});
  });
