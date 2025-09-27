// Mock data for testing when database is not available
const mockPersons = [
  {
    PERSONID: 'P000000001',
    NAME: 'Alice Johnson (จาก API)',
    USERNAME: 'ajohnson',
    PASSWORD: 'pass123',
    SYSTEMPERMIS: 'A',
    RANKID: 'RANK4',
    DEPARTMENTID: 'DEPT2',
    IS_ACTIVE: 1,
    RANK_NAME: 'Director',
    DEPARTMENT_NAME: 'IT'
  },
  {
    PERSONID: 'P000000002',
    NAME: 'Bob Smith (จาก API)',
    USERNAME: 'bsmith',
    PASSWORD: 'securepwd',
    SYSTEMPERMIS: 'U',
    RANKID: 'RANK3',
    DEPARTMENTID: 'DEPT1',
    IS_ACTIVE: 1,
    RANK_NAME: 'Manager',
    DEPARTMENT_NAME: 'Sales'
  }
];

const mockDepartments = [
  { DEPARTMENTID: 'DEPT1', NAME: 'Sales (จาก API)', IS_ACTIVE: 1 },
  { DEPARTMENTID: 'DEPT2', NAME: 'IT (จาก API)', IS_ACTIVE: 1 },
  { DEPARTMENTID: 'DEPT3', NAME: 'Human Resources (จาก API)', IS_ACTIVE: 1 },
  { DEPARTMENTID: 'DEPT4', NAME: 'Finance (จาก API)', IS_ACTIVE: 1 }
];

const mockRanks = [
  { RANKID: 'RANK1', NAME: 'Entry Level (จาก API)', IS_ACTIVE: 1 },
  { RANKID: 'RANK2', NAME: 'Senior Staff (จาก API)', IS_ACTIVE: 1 },
  { RANKID: 'RANK3', NAME: 'Manager (จาก API)', IS_ACTIVE: 1 },
  { RANKID: 'RANK4', NAME: 'Director (จาก API)', IS_ACTIVE: 1 },
  { RANKID: 'RANK5', NAME: 'Intern (จาก API)', IS_ACTIVE: 0 }
];

module.exports = {
  mockPersons,
  mockDepartments,
  mockRanks
};