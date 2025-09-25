

import React, { useState } from 'react';
import DepartmentManager from './DepartmentManager';
import PositionManager from './PositionManager';
import './EmployeeManager.css';
// Avatar removed per request

const sidebarMenu = [
  { key: 'Schedule', label: 'Schedule' },
  { key: 'Routes', label: 'Routes' },
  { key: 'Person', label: 'Person' },
  { key: 'Booking', label: 'Booking' },
  { key: 'Driver', label: 'Driver' },
];

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

function EmployeeManager() {
  const [activePage, setActivePage] = useState('employee');
  const [activeMenu, setActiveMenu] = useState('Person');
  const [employees, setEmployees] = useState(initialEmployees);
  const [form, setForm] = useState({ username: '', password: '', name: '', phones: [''], email: '', position: '', department: '' });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [detailEmp, setDetailEmp] = useState(null);

  const positions = ['All', 'Admin', 'Manager', 'Staff'];
  const departments = ['Operations', 'HR', 'Finance'];
  const [formErrors, setFormErrors] = useState({ username: '', password: '', name: '', phone: '', email: '', position: '', department: '' });

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

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    const digits = (phone || '').replace(/[^0-9]/g, '');
    return digits.length >= 7;
  };

  const validateForm = () => {
    const errors = { username: '', password: '', name: '', phone: '', email: '', position: '', department: '' };
    if (!form.username || form.username.trim().length < 3) errors.username = 'โปรดระบุ Username อย่างน้อย 3 ตัวอักษร';
    if (!form.password || form.password.length < 6) errors.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    if (!form.name || form.name.trim() === '') errors.name = 'โปรดระบุชื่อ';
    // ensure at least one valid phone
    const anyValidPhone = (form.phones || []).some(p => validatePhone(p));
    if (!anyValidPhone) errors.phone = 'โปรดระบุหมายเลขโทรศัพท์อย่างน้อยหนึ่งหมายเลขที่ถูกต้อง';
    if (!validateEmail(form.email || '')) errors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    if (!form.position || form.position === '') errors.position = 'โปรดเลือกตำแหน่ง';
    if (!form.department || form.department === '') errors.department = 'โปรดเลือกแผนก';
    setFormErrors(errors);
    return Object.values(errors).every(v => !v);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.username || !form.name || !form.position || !form.email || !form.department) return;
    if (!validateForm()) return;
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
  };

  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setForm({ username: emp.username || '', password: emp.password || '', name: emp.name || '', phones: emp.phones || [''], email: emp.email || '', position: emp.position || '', department: emp.department || '' });
    setShowForm(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
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
  };

  const handleDelete = (id) => {
    if (!window.confirm('ยืนยันการลบพนักงานนี้?')) return;
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  // exportCSV removed per request

  const filteredEmployees = employees.filter(
    (emp) =>
      (filter === 'All' || emp.position === filter) &&
      (emp.username.includes(search) || emp.name.toLowerCase().includes(search.toLowerCase()))
  );

  // ...existing code...
  // Sidebar active menu logic
  const getMenuTitle = () => {
    const found = sidebarMenu.find(m => m.key === activeMenu);
    return found ? found.label : 'Person';
  };

  return (
    <div className="em-root">
      {/* Sidebar */}
      <div className="em-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
          <div className="em-sidebar-logo">
            <img src="/logo.png" alt="logo" className="em-logo-img" />
          </div>
          <div className="em-sidebar-title">Admin Panel</div>
        </div>
        {sidebarMenu.map((menu) => (
          <div
            key={menu.key}
            className={menu.key === activeMenu ? 'em-sidebar-menu active' : 'em-sidebar-menu'}
            style={{ color: menu.key === activeMenu ? '#FFD600' : undefined, fontWeight: menu.key === activeMenu ? 'bold' : undefined, cursor: 'pointer' }}
            onClick={() => setActiveMenu(menu.key)}
          >{menu.label}</div>
        ))}
      </div>

      {/* Main Content */}
      <div className="em-main">
        <div className="em-title">{getMenuTitle()}</div>
        {/* Top Buttons and content only for Person */}
        {activeMenu === 'Person' && (
          <>
            <div className="em-top-btns">
              <button onClick={() => setActivePage('employee')} className={`em-btn${activePage === 'employee' ? ' primary' : ''}`}>บุคคล</button>
              <button onClick={() => setActivePage('department')} className={`em-btn${activePage === 'department' ? ' primary' : ''}`}>แผนก</button>
              <button onClick={() => setActivePage('position')} className={`em-btn${activePage === 'position' ? ' primary' : ''}`}>ตำแหน่ง</button>
              {activePage === 'employee' && (
                <>
                  <div style={{ flex: 1 }} />
                  <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ username: '', password: '', name: '', phones: [''], email: '', position: '', department: '' }); }} className="em-btn primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20 }}>+</span> เพิ่มบุคคล
                  </button>
                  <input
                    type="text"
                    placeholder="ค้นหา"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="em-search"
                  />
                  <select value={filter} onChange={e => setFilter(e.target.value)} className="em-select">
                    {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                  </select>
                </>
              )}
            </div>

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
                          <button className="em-action-btn" onClick={() => handleEdit(emp)}>แก้ไข</button>
                          <button className="em-action-btn view" onClick={() => { setDetailEmp(emp); setShowDetail(true); }}>ดูข้อมูล</button>
                          <button className="em-action-btn delete" onClick={() => handleDelete(emp.id)}>ลบ</button>
                        </td>
                      </tr>
                    ))}
                    {filteredEmployees.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', padding: '24px 0', color: '#888' }}>ไม่มีข้อมูลพนักงาน</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {activePage === 'department' && <DepartmentManager />}
            {activePage === 'position' && <PositionManager />}
          </>
        )}
        {/* Other menu content placeholder */}
        {activeMenu !== 'Person' && (
          <div style={{ padding: 32, color: '#888', fontSize: 24 }}>Coming soon: {getMenuTitle()}</div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="em-modal-bg">
            <form onSubmit={editingId ? handleUpdate : handleAdd} className="em-modal em-modal--wide">
              <div className="em-modal-title">{editingId ? 'แก้ไขข้อมูลบุคคล' : 'เพิ่มบุคคล'}</div>
              <div className="em-modal-grid">
                <div className="em-modal-col">
                  <label className="em-input-label">Username</label>
                  <input name="username" placeholder="Username" value={form.username} onChange={handleChange} className="em-modal-input" required />
                  {formErrors.username && <div className="em-error">{formErrors.username}</div>}

                  <label className="em-input-label">ชื่อ</label>
                  <input name="name" placeholder="ชื่อ" value={form.name} onChange={handleChange} className="em-modal-input" required />
                  {formErrors.name && <div className="em-error">{formErrors.name}</div>}

                  <label className="em-input-label">เบอร์โทร</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input name="phones[0]" placeholder="เบอร์โทร" value={form.phones[0]} onChange={e => handlePhoneChange(0, e.target.value)} className="em-modal-input" required />
                  </div>
                  {formErrors.phone && <div className="em-error">{formErrors.phone}</div>}

                  <label className="em-input-label">อีเมล</label>
                  <input name="email" placeholder="อีเมล" value={form.email} onChange={handleChange} className="em-modal-input" required />
                  {formErrors.email && <div className="em-error">{formErrors.email}</div>}
                </div>

                <div className="em-modal-col">
                  <label className="em-input-label">รหัสผ่าน</label>
                  <input name="password" placeholder="Password" value={form.password} onChange={handleChange} className="em-modal-input" required />
                  {formErrors.password && <div className="em-error">{formErrors.password}</div>}

                  <label className="em-input-label">ตำแหน่ง</label>
                  <select name="position" value={form.position} onChange={handleChange} className="em-modal-select" required>
                    <option value="">เลือกตำแหน่ง</option>
                    {positions.filter(p => p !== 'All').map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {formErrors.position && <div className="em-error">{formErrors.position}</div>}

                  <label className="em-input-label">แผนก</label>
                  <select name="department" value={form.department} onChange={handleChange} className="em-modal-select" required>
                    <option value="">เลือกแผนก</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {formErrors.department && <div className="em-error">{formErrors.department}</div>}

                  {/* additional phones can be edited below if present */}
                </div>
              </div>

              <div className="em-modal-btns">
                <button type="submit" className="em-modal-btn">{editingId ? 'บันทึก' : 'เพิ่ม'}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm({ username: '', password: '', name: '', phones: [''], email: '', position: '', department: '' }); }} className="em-modal-btn cancel">ยกเลิก</button>
              </div>
            </form>
          </div>
        )}

        {/* Detail Modal */}
        {showDetail && detailEmp && (
          <div className="em-modal-bg">
            <div className="em-modal em-modal--wide">
              <div className="em-modal-title">ข้อมูลบุคคล</div>
              <div className="em-modal-grid">
                <div className="em-modal-col">
                  <div><b>Username:</b> {detailEmp.username}</div>
                  <div><b>ชื่อ:</b> {detailEmp.name}</div>
                  <div><b>เบอร์โทร:</b> {(detailEmp.phones && detailEmp.phones.join(', ')) || '-'}</div>
                  <div><b>อีเมล:</b> {detailEmp.email || '-'}</div>
                </div>
                <div className="em-modal-col">
                  <div><b>ตำแหน่ง:</b> {detailEmp.position}</div>
                  <div><b>แผนก:</b> {detailEmp.department}</div>
                  <div><b>รหัสผ่าน:</b> {detailEmp.password}</div>
                </div>
              </div>
              <div className="em-modal-btns">
                <button type="button" onClick={() => { setShowDetail(false); setDetailEmp(null); }} className="em-modal-btn cancel">ปิด</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeManager;
