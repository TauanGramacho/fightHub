const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function main() {
  const client = new Client({
    host: 'db.jwojnxopkuqmmwpomfss.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'Codenity@FH',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Conectando ao banco...');
    await client.connect();
    console.log('Conectado! Executando migração...');
    
    const sql = fs.readFileSync(path.join(__dirname, '..', 'supabase-full-migration.sql'), 'utf8');
    await client.query(sql);
    
    console.log('✅ Migração executada com sucesso!');
    
    // Verificar tabelas criadas
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    console.log('\nTabelas no banco:');
    tables.rows.forEach(r => console.log('  - ' + r.table_name));
    
    // Contar registros
    const counts = await client.query(`
      SELECT 
        (SELECT count(*) FROM public.fighters) as fighters,
        (SELECT count(*) FROM public.teams) as teams,
        (SELECT count(*) FROM public.events) as events,
        (SELECT count(*) FROM public.fights) as fights,
        (SELECT count(*) FROM public.rankings) as rankings
    `);
    console.log('\nRegistros:');
    console.log('  Lutadores:', counts.rows[0].fighters);
    console.log('  Equipes:', counts.rows[0].teams);
    console.log('  Eventos:', counts.rows[0].events);
    console.log('  Lutas:', counts.rows[0].fights);
    console.log('  Rankings:', counts.rows[0].rankings);
    
  } catch (err) {
    console.error('❌ Erro:', err.message);
  } finally {
    await client.end();
  }
}

main();
