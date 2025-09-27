// === IMPORTS ===
import React, { useState } from 'react';
import DepartmentManager from '../components/DepartmentManager';
import PositionManager from '../components/PositionManager';
import './PersonPage.css';

// === CONSTANTS & INITIAL DATA ===

const initialEmployees = [
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

function PersonPage() {
  // === NAVIGATION STATE ===
  const [activePage, setActivePage] = useState('employee');

  // === EMPLOYEE DATA STATE ===
  const [employees, setEmployees] = useState(initialEmployees);
  const [form, setForm] = useState({
    username: '', 
    password: '', 
    name: '', 
    phones: [''], 
    email: '', 
    position: '', 
    department: ''
  });
  const [editingId, setEditingId] = useState(null);

  // === SEARCH & FILTER STATE ===
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  // === MODAL STATE ===
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [detailEmp, setDetailEmp] = useState(null);

  // === UX STATE ===
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [formErrors, setFormErrors] = useState({
    username: '', 
    password: '', 
    name: '', 
    phone: '', 
    email: '', 
    position: '', 
    department: ''
  });

  // === STATIC DATA ===
  const positions = ['All', 'Admin', 'Manager', 'Staff'];
  const departments = ['Operations', 'HR', 'Finance'];

  // === FORM HANDLERS ===
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (index, value) => {
    const phones = [...form.phones];
    phones[index] = value;
    setForm({ ...form, phones });
  };

  const addPhone = () => {
    setForm({ ...form, phones: [...form.phones, ''] });
  };

  const removePhone = (index) => {
    const phones = form.phones.filter((_, i) => i !== index);
    setForm({ ...form, phones: phones.length ? phones : [''] });
  };

  // === VALIDATION FUNCTIONS ===
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    const digits = (phone || '').replace(/[^0-9]/g, '');
    return digits.length >= 7;
  };

  const validateForm = () => {
    const errors = { 
      username: '', password: '', name: '', phone: '', 
      email: '', position: '', department: '' 
    };
    
    // ตรวจสอบแต่ละฟิลด์
    if (!form.username || form.username.trim().length < 3) {
      errors.username = 'โปรดระบุ Username อย่างน้อย 3 ตัวอักษร';
    }
    if (!form.password || form.password.length < 6) {
      errors.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    }
    if (!form.name || form.name.trim() === '') {
      errors.name = 'โปรดระบุชื่อ';
    }
    
    // ตรวจสอบเบอร์โทร (ต้องมีอย่างน้อย 1 เบอร์ที่ถูกต้อง)
    const anyValidPhone = (form.phones || []).some(p => validatePhone(p));
    if (!anyValidPhone) {
      errors.phone = 'โปรดระบุหมายเลขโทรศัพท์อย่างน้อยหนึ่งหมายเลขที่ถูกต้อง';
    }
    
    if (!validateEmail(form.email || '')) {
      errors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    }
    if (!form.position || form.position === '') {
      errors.position = 'โปรดเลือกตำแหน่ง';
    }
    if (!form.department || form.department === '') errors.department = 'โปรดเลือกแผนก';
    setFormErrors(errors);
    return Object.values(errors).every(v => !v);
  };

  // === UTILITY FUNCTIONS ===
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // === CRUD OPERATIONS ===
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.username || !form.name || !form.position || !form.email || !form.department) return;
    if (!validateForm()) return;
    
    setLoading(true);
    // จำลองการโหลด
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setEmployees([
      ...employees,
      {
        id: Date.now(),
        username: form.username,
        password: form.password,
        name: form.name,
        phones: form.phones,
        email: form.email,
        position: form.position,
        department: form.department,
      },
    ]);
    setForm({ username: '', password: '', name: '', phones: [''], email: '', position: '', department: '' });
    setShowForm(false);
    setLoading(false);
    showToast('เพิ่มพนักงานเรียบร้อยแล้ว');
  };

  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setForm({ username: emp.username || '', password: emp.password || '', name: emp.name || '', phones: emp.phones || [''], email: emp.email || '', position: emp.position || '', department: emp.department || '' });
    setShowForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setEmployees(
      employees.map((emp) =>
        emp.id === editingId
          ? { ...emp, ...form }
          : emp
      )
    );
    setEditingId(null);
    setForm({ username: '', password: '', name: '', phones: [''], email: '', position: '', department: '' });
    setShowForm(false);
    setLoading(false);
    showToast('แก้ไขข้อมูลเรียบร้อยแล้ว');
  };

  const handleDelete = (id) => {
    if (!window.confirm('ยืนยันการลบพนักงานนี้?')) return;
    setEmployees(employees.filter((emp) => emp.id !== id));
    showToast('ลบข้อมูลเรียบร้อยแล้ว');
  };

  // === DATA FILTERING ===
  const filteredEmployees = employees.filter((emp) => {
    const matchesFilter = filter === 'All' || emp.position === filter;
    const matchesSearch = 
      emp.username.includes(search) || 
      emp.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });



  // === RENDER ===
  return (
    <>
      {/* Navigation Tabs */}
      <div className="em-top-btns">
        <button 
          onClick={() => setActivePage('employee')} 
          className={`em-btn${activePage === 'employee' ? ' primary' : ''}`}
        >
          Person
        </button>
        <button 
          onClick={() => setActivePage('department')} 
          className={`em-btn${activePage === 'department' ? ' primary' : ''}`}
        >
          Department
        </button>
        <button 
          onClick={() => setActivePage('position')} 
          className={`em-btn${activePage === 'position' ? ' primary' : ''}`}
        >
          Position
        </button>
        
        {/* Employee Page Controls */}
        {activePage === 'employee' && (
          <>
            <div style={{ flex: 1 }} />
            <button 
              onClick={() => { 
                setShowForm(true); 
                setEditingId(null); 
                setForm({ 
                  username: '', 
                  password: '', 
                  name: '', 
                  phones: [''], 
                  email: '', 
                  position: '', 
                  department: '' 
                }); 
              }} 
              className="em-btn primary" 
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <span style={{ fontSize: 20 }}>+</span> Add Person
            </button>
            <input
              type="text"
              placeholder="ค้นหา"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="em-search"
            />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)} 
              className="em-select"
            >
              {positions.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* Employee Table */}
      {activePage === 'employee' && (
        <div className="em-table-wrap">
          <table className="em-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>ชื่อ</th>
                <th>แผนก</th>
                <th className="center">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => (
                <tr key={emp.id}>
                  <td>{emp.username}</td>
                  <td>{emp.name}</td>
                  <td>{emp.department || '-'}</td>
                  <td className="center">
                    <button 
                      className="em-action-btn" 
                      onClick={() => handleEdit(emp)}
                    >
                      แก้ไข
                    </button>
                    <button 
                      className="em-action-btn view" 
                      onClick={() => { 
                        setDetailEmp(emp); 
                        setShowDetail(true); 
                      }}
                    >
                      ดูข้อมูล
                    </button>
                    <button 
                      className="em-action-btn delete" 
                      onClick={() => handleDelete(emp.id)}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={4}>
                    <div className="em-empty-state">
                      <h3>ไม่พบข้อมูลพนักงาน</h3>
                      <p>ลองปรับเปลี่ยนคำค้นหาหรือตัวกรอง หรือเพิ่มพนักงานใหม่</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Department & Position Management */}
      {activePage === 'department' && <DepartmentManager />}
      {activePage === 'position' && <PositionManager />}

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="em-modal-bg">
            <form 
              onSubmit={editingId ? handleUpdate : handleAdd} 
              className="em-modal em-modal--wide"
            >
              <div className="em-modal-title">
                {editingId ? 'แก้ไขข้อมูลบุคคล' : 'เพิ่มบุคคล'}
              </div>
              
              <div className="em-modal-grid">
                {/* Left Column */}
                <div className="em-modal-col">
                  <label className="em-input-label">Username</label>
                  <input 
                    name="username" 
                    placeholder="Username" 
                    value={form.username} 
                    onChange={handleChange} 
                    className="em-modal-input" 
                    required 
                  />
                  {formErrors.username && (
                    <div className="em-error">{formErrors.username}</div>
                  )}

                  <label className="em-input-label">ชื่อ</label>
                  <input 
                    name="name" 
                    placeholder="ชื่อ" 
                    value={form.name} 
                    onChange={handleChange} 
                    className="em-modal-input" 
                    required 
                  />
                  {formErrors.name && (
                    <div className="em-error">{formErrors.name}</div>
                  )}

                  <label className="em-input-label">เบอร์โทร</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input 
                      name="phones[0]" 
                      placeholder="เบอร์โทร" 
                      value={form.phones[0]} 
                      onChange={(e) => handlePhoneChange(0, e.target.value)} 
                      className="em-modal-input" 
                      required 
                    />
                  </div>
                  {formErrors.phone && (
                    <div className="em-error">{formErrors.phone}</div>
                  )}

                  <label className="em-input-label">อีเมล</label>
                  <input 
                    name="email" 
                    placeholder="อีเมล" 
                    value={form.email} 
                    onChange={handleChange} 
                    className="em-modal-input" 
                    required 
                  />
                  {formErrors.email && (
                    <div className="em-error">{formErrors.email}</div>
                  )}
                </div>

                {/* Right Column */}
                <div className="em-modal-col">
                  <label className="em-input-label">รหัสผ่าน</label>
                  <input 
                    name="password" 
                    type="password"
                    placeholder="Password" 
                    value={form.password} 
                    onChange={handleChange} 
                    className="em-modal-input" 
                    required 
                  />
                  {formErrors.password && (
                    <div className="em-error">{formErrors.password}</div>
                  )}

                  <label className="em-input-label">ตำแหน่ง</label>
                  <select 
                    name="position" 
                    value={form.position} 
                    onChange={handleChange} 
                    className="em-modal-select" 
                    required
                  >
                    <option value="">เลือกตำแหน่ง</option>
                    {positions.filter(p => p !== 'All').map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  {formErrors.position && (
                    <div className="em-error">{formErrors.position}</div>
                  )}

                  <label className="em-input-label">แผนก</label>
                  <select 
                    name="department" 
                    value={form.department} 
                    onChange={handleChange} 
                    className="em-modal-select" 
                    required
                  >
                    <option value="">เลือกแผนก</option>
                    {departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  {formErrors.department && (
                    <div className="em-error">{formErrors.department}</div>
                  )}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="em-modal-btns">
                <button type="submit" className="em-modal-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="em-loading"></span>
                      {editingId ? 'กำลังบันทึก...' : 'กำลังเพิ่ม...'}
                    </>
                  ) : (
                    editingId ? 'บันทึก' : 'เพิ่ม'
                  )}
                </button>
                <button 
                  type="button" 
                  onClick={() => { 
                    setShowForm(false); 
                    setEditingId(null); 
                    setForm({ 
                      username: '', 
                      password: '', 
                      name: '', 
                      phones: [''], 
                      email: '', 
                      position: '', 
                      department: '' 
                    }); 
                  }} 
                  className="em-modal-btn cancel" 
                  disabled={loading}
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Employee Detail Modal */}
        {showDetail && detailEmp && (
          <div className="em-modal-bg">
            <div className="em-modal em-modal--wide">
              <div className="em-modal-title">ข้อมูลบุคคล</div>
              
              <div className="em-modal-grid">
                <div className="em-modal-col">
                  <div><b>Username:</b> {detailEmp.username}</div>
                  <div><b>ชื่อ:</b> {detailEmp.name}</div>
                  <div>
                    <b>เบอร์โทร:</b> {(detailEmp.phones && detailEmp.phones.join(', ')) || '-'}
                  </div>
                  <div><b>อีเมล:</b> {detailEmp.email || '-'}</div>
                </div>
                <div className="em-modal-col">
                  <div><b>ตำแหน่ง:</b> {detailEmp.position}</div>
                  <div><b>แผนก:</b> {detailEmp.department}</div>
                  <div><b>รหัสผ่าน:</b> {detailEmp.password}</div>
                </div>
              </div>
              
              <div className="em-modal-btns">
                <button 
                  type="button" 
                  onClick={() => { 
                    setShowDetail(false); 
                    setDetailEmp(null); 
                  }} 
                  className="em-modal-btn cancel"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toast && (
          <div className={`em-toast ${toast.type}`}>
            {toast.message}
          </div>
        )}
    </>
  );
}

export default PersonPage;
