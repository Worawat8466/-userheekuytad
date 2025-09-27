const oracledb = require('oracledb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Try to initialize Oracle Client on Windows if ORACLE_CLIENT_DIR is provided
try {
  if (process.platform === 'win32') {
    const libDir = process.env.ORACLE_CLIENT_DIR;
    if (libDir) {
      oracledb.initOracleClient({ libDir });
      console.log('✅ Oracle Client initialized with libDir:', libDir);
    } else {
      console.log('ℹ️ ORACLE_CLIENT_DIR not set. Ensure Instant Client is installed and on PATH.');
    }
  }
} catch (e) {
  console.error('❌ Failed to initialize Oracle Client. Set ORACLE_CLIENT_DIR to your Instant Client path. Error:', e.message);
}

// Debug environment variables
console.log('Environment variables loaded:');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'NOT SET');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_SERVICE_NAME:', process.env.DB_SERVICE_NAME);
console.log('DB_SID:', process.env.DB_SID);
console.log('DB_CONNECT_STRING (override):', process.env.DB_CONNECT_STRING ? 'SET' : 'NOT SET');

// Build connect string precedence: DB_CONNECT_STRING > SERVICE_NAME > SID (DESCRIPTION)
const buildConnectString = () => {
  if (process.env.DB_CONNECT_STRING) {
    return process.env.DB_CONNECT_STRING;
  }
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT || '1521';
  const svc = process.env.DB_SERVICE_NAME;
  const sid = process.env.DB_SID;
  if (host && port && svc) {
    return `${host}:${port}/${svc}`; // EZCONNECT with service name
  }
  if (host && port && sid) {
    return `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${host})(PORT=${port}))(CONNECT_DATA=(SID=${sid})))`;
  }
  throw new Error('Database connect string is not configured. Set DB_CONNECT_STRING or DB_HOST/DB_PORT with DB_SERVICE_NAME or DB_SID.');
};

// Oracle Database Configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: buildConnectString()
};

// Connection Pool Configuration
const poolConfig = {
  ...dbConfig,
  poolMin: 2,
  poolMax: 10,
  poolIncrement: 2,
  poolTimeout: 60
};

class Database {
  constructor() {
    this.pool = null;
  }

  async initialize() {
    try {
      // Create connection pool
      this.pool = await oracledb.createPool(poolConfig);
      console.log('✅ Oracle Database connection pool created successfully');
      return true;
    } catch (error) {
      if (String(error.message || '').includes('DPI-1047')) {
        console.error('❌ DPI-1047: Cannot locate Oracle Client libraries.');
        console.error('   • On Windows, install Oracle Instant Client (x64) and set ORACLE_CLIENT_DIR to its folder,');
        console.error('     or add the client bin directory to PATH and restart the terminal.');
      } else {
        console.error('❌ Error creating Oracle Database connection pool:', error);
      }
      throw error;
    }
  }

  async getConnection() {
    try {
      if (!this.pool) {
        await this.initialize();
      }
      return await this.pool.getConnection();
    } catch (error) {
      console.error('❌ Error getting database connection:', error);
      throw error;
    }
  }

  async executeQuery(sql, binds = [], options = {}) {
    let connection;
    try {
      connection = await this.getConnection();
      const result = await connection.execute(sql, binds, {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        autoCommit: true,
        ...options
      });
      return result;
    } catch (error) {
      console.error('❌ Database query error:', error);
      throw error;
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          console.error('❌ Error closing database connection:', error);
        }
      }
    }
  }

  async close() {
    try {
      if (this.pool) {
        await this.pool.close();
        console.log('✅ Oracle Database connection pool closed');
      }
    } catch (error) {
      console.error('❌ Error closing database pool:', error);
    }
  }

  // Test database connection
  async testConnection() {
    try {
      const result = await this.executeQuery('SELECT 1 as TEST FROM DUAL');
      console.log('✅ Database connection test successful');
      return result.rows[0];
    } catch (error) {
      console.error('❌ Database connection test failed:', error);
      throw error;
    }
  }
}

module.exports = new Database();