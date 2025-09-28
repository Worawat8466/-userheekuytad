// Temporary mock API server for development
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'],
  credentials: true
}));
app.use(express.json());

// Mock data that mirrors real DB structure
const mockPersons = [
  {
    PERSONID: 'P000000001',
    NAME: 'John Smith',
    USERNAME: 'john.smith',
    SYSTEMPERMIS: 'U',
    RANKID: 'R001',
    DEPARTMENTID: 'D001',
    IS_ACTIVE: 1,
    RANK_NAME: 'Manager',
    DEPARTMENT_NAME: 'IT Department'
  },
  {
    PERSONID: 'P000000002',
    NAME: 'Jane Doe',
    USERNAME: 'jane.doe',
    SYSTEMPERMIS: 'A',
    RANKID: 'R002',
    DEPARTMENTID: 'D002',
    IS_ACTIVE: 1,
    RANK_NAME: 'Analyst',
    DEPARTMENT_NAME: 'HR Department'
  }
];

const mockDepartments = [
  { DEPARTMENTID: 'D001', NAME: 'IT Department', IS_ACTIVE: 1 },
  { DEPARTMENTID: 'D002', NAME: 'HR Department', IS_ACTIVE: 1 },
  { DEPARTMENTID: 'D003', NAME: 'Finance Department', IS_ACTIVE: 1 }
];

const mockRanks = [
  { RANKID: 'R001', NAME: 'Manager', IS_ACTIVE: 1 },
  { RANKID: 'R002', NAME: 'Analyst', IS_ACTIVE: 1 },
  { RANKID: 'R003', NAME: 'Assistant', IS_ACTIVE: 1 }
];

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Temporary mock API server' });
});

app.get('/api/persons', (req, res) => {
  res.json({
    success: true,
    data: mockPersons,
    message: 'Persons retrieved successfully (TEMPORARY MOCK - awaiting Oracle DB fix)'
  });
});

app.get('/api/departments', (req, res) => {
  res.json({
    success: true,
    data: mockDepartments,
    message: 'Departments retrieved successfully (TEMPORARY MOCK)'
  });
});

app.get('/api/ranks', (req, res) => {
  res.json({
    success: true,
    data: mockRanks,
    message: 'Ranks retrieved successfully (TEMPORARY MOCK)'
  });
});

app.get('/api/persons/next-id/generate', (req, res) => {
  const nextId = 'P' + String(mockPersons.length + 1).padStart(9, '0');
  res.json({
    success: true,
    data: { personId: nextId },
    message: 'Next person ID generated successfully (MOCK)'
  });
});

// Catch-all for other person routes
app.use('/api/persons/*', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'CRUD operations not implemented in mock server'
  });
});

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║          TEMPORARY MOCK API SERVER          ║
║                                              ║
║  🚀 Server running on port ${PORT}             ║
║  ⚠️  THIS IS A TEMPORARY MOCK SERVER         ║
║  🔧 Replace with real Oracle DB server       ║
║                                              ║
║  Frontend: http://localhost:5174             ║
║  Mock API: http://localhost:${PORT}/api        ║
╚══════════════════════════════════════════════╝
  `);
});