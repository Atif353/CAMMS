import pg from 'pg';

const { Pool } = pg;

export async function checkDatabaseConnection() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'camms_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    connectionTimeoutMillis: 5000,
  });

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    await pool.end();
    console.log('✅ PostgreSQL connection successful');
    console.log(`   Database: ${process.env.DB_NAME || 'camms_db'}`);
    console.log(`   Server time: ${result.rows[0].now}`);
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:');
    console.error(`   Error: ${error.message}`);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check if PostgreSQL service is running');
    console.error('   2. Verify database credentials in .env file');
    console.error('   3. Ensure database "camms_db" exists');
    console.error('   4. Check if PostgreSQL is listening on port 5432');
    await pool.end();
    return false;
  }
}

