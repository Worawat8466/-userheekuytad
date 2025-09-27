const oracledb = require('oracledb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Debug environment variables
console.log('Environment variables loaded:');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'NOT SET');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_SERVICE_NAME:', process.env.DB_SERVICE_NAME);

// Oracle Database Configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SERVICE_NAME}`
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
      console.error('❌ Error creating Oracle Database connection pool:', error);
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