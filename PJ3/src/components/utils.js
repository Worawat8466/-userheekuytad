// ฟังก์ชันสำหรับตรวจสอบข้อมูล
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone) => {
  const digits = (phone || '').replace(/[^0-9]/g, '');
  return digits.length >= 7;
};

export const validateForm = (form) => {
  const errors = {
    username: '',
    password: '',
    name: '',
    phone: '',
    email: '',
    position: '',
    department: ''
  };

  // ตรวจสอบ username
  if (!form.username || form.username.trim().length < 3) {
    errors.username = 'โปรดระบุ Username อย่างน้อย 3 ตัวอักษร';
  }

  // ตรวจสอบ password
  if (!form.password || form.password.length < 6) {
    errors.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
  }

  // ตรวจสอบชื่อ
  if (!form.name || form.name.trim() === '') {
    errors.name = 'โปรดระบุชื่อ';
  }

  // ตรวจสอบเบอร์โทร
  const anyValidPhone = (form.phones || []).some(p => validatePhone(p));
  if (!anyValidPhone) {
    errors.phone = 'โปรดระบุหมายเลขโทรศัพท์อย่างน้อยหนึ่งหมายเลขที่ถูกต้อง';
  }

  // ตรวจสอบอีเมล
  if (!validateEmail(form.email || '')) {
    errors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
  }

  // ตรวจสอบตำแหน่ง
  if (!form.position || form.position === '') {
    errors.position = 'โปรดเลือกตำแหน่ง';
  }

  // ตรวจสอบแผนก
  if (!form.department || form.department === '') {
    errors.department = 'โปรดเลือกแผนก';
  }

  return {
    errors,
    isValid: Object.values(errors).every(v => !v)
  };
};