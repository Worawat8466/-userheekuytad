const express = require('express');
const cors = require('cors');
const database = require('./config/database');

// Import routes
const personRoutes = require('./routes/personRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const rankRoutes = require('./routes/rankRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174', 'http://localhost:3000'], // Vite ports + React dev server
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'PJ3 API Server'
  });
});

// Database connection test endpoint
app.get('/api/test-connection', async (req, res) => {
  try {
    const result = await database.executeQuery('SELECT SYSDATE FROM DUAL');
    res.json({
      success: true,
      message: 'Database connection successful',
      data: {
        currentTime: result.rows[0].SYSDATE,
        status: 'Connected'
      }
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// API Routes
app.use('/api/persons', personRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/ranks', rankRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'PJ3 API Server is running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      testConnection: '/api/test-connection',
      persons: '/api/persons',
      departments: '/api/departments',
      ranks: '/api/ranks'
    }
  });
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Initialize database connection pool and start server
const startServer = async () => {
  try {
    // Initialize database connection
    console.log('Initializing database connection...');
    await database.initialize();
    console.log('Database connection pool initialized successfully');

    // Start the server
    app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════════╗
║              PJ3 API SERVER                  ║
║                                              ║
║  🚀 Server running on port ${PORT}             ║
║  🌍 Health check: http://localhost:${PORT}/health ║
║  🔗 API Base: http://localhost:${PORT}/api        ║
║  📊 Database: Oracle DB Connected            ║
║                                              ║
║  Available Endpoints:                        ║
║    • GET /api/persons                        ║
║    • GET /api/departments                    ║
║    • GET /api/ranks                         ║
║    • GET /api/test-connection               ║
╚══════════════════════════════════════════════╝
      `);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nReceived SIGINT. Gracefully shutting down...');
  try {
    await database.close();
    console.log('Database connections closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\nReceived SIGTERM. Gracefully shutting down...');
  try {
    await database.close();
    console.log('Database connections closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the server
startServer();