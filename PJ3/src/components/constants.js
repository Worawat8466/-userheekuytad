// ข้อมูลเริ่มต้น
export const initialEmployees = [
  {
    id: 1,
    username: '6611130011',
    name: 'สมชาย ใจดี',
    password: 'pass1234',
    phones: ['0812345678', '0898765432'],
    email: 'somchai@example.com',
    position: 'Admin',
    department: 'Operations',
  },
  {
    id: 2,
    username: '6611130012',
    name: 'สุดา สวยงาม',
    password: 'suda5678',
    phones: ['0823456789'],
    email: 'suda@example.com',
    position: 'Manager',
    department: 'HR',
  },
  {
    id: 3,
    username: '6611130013',
    name: 'ประยุทธ์ ขยัน',
    password: 'prayut999',
    phones: ['0834567890'],
    email: 'prayut@example.com',
    position: 'Staff',
    department: 'Finance',
  },
];

// เมนูด้านซ้าย
export const sidebarMenu = [
  { key: 'Schedule', label: 'Schedule' },
  { key: 'Routes', label: 'Routes' },
  { key: 'Person', label: 'Person' },
  { key: 'Booking', label: 'Booking' },
  { key: 'Driver', label: 'Driver' },
];

// ตัวเลือกสำหรับ dropdown
export const positions = ['All', 'Admin', 'Manager', 'Staff'];
export const departments = ['Operations', 'HR', 'Finance'];

// ฟอร์มเริ่มต้น
export const initialForm = {
  username: '',
  password: '',
  name: '',
  phones: [''],
  email: '',
  position: '',
  department: ''
};

// ข้อผิดพลาดฟอร์มเริ่มต้น
export const initialFormErrors = {
  username: '',
  password: '',
  name: '',
  phone: '',
  email: '',
  position: '',
  department: ''
};