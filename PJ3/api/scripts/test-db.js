// Quick DB connectivity check using the shared database module
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const database = require('../config/database');

(async () => {
  console.log('--- DB Connectivity Check ---');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('DB_USER:', process.env.DB_USER);
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_PORT:', process.env.DB_PORT);
  console.log('DB_SERVICE_NAME:', process.env.DB_SERVICE_NAME);
  console.log('DB_SID:', process.env.DB_SID);
  console.log('DB_CONNECT_STRING set:', !!process.env.DB_CONNECT_STRING);
  console.log('ORACLE_CLIENT_DIR:', process.env.ORACLE_CLIENT_DIR);

  try {
    await database.initialize();
    const result = await database.testConnection();
    console.log('Connection OK. Test result:', result);
    await database.close();
    process.exit(0);
  } catch (err) {
    console.error('\nConnection FAILED:', err && err.message ? err.message : err);
    if ((err.message || '').includes('DPI-1047')) {
      console.error('\nHint: DPI-1047 means Oracle Client libraries are not found.');
      console.error('• Install Oracle Instant Client (x64) and set ORACLE_CLIENT_DIR to its folder');
      console.error('• Or add the Instant Client bin directory to PATH and restart the terminal');
    }
    process.exit(1);
  }
})();
