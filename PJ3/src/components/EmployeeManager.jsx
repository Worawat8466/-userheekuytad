

// === การ Import ===
import React, { useEffect, useState } from 'react';
import DepartmentManager from './DepartmentManager';
import PositionManager from './PositionManager';
import './EmployeeManager.css';
import logoImg from '../images/logo.png';

// === ข้อมูลคงที่ ===
// เมนูด้านซ้าย
const sidebarMenu = [
  { key: 'Schedule', label: 'Schedule' },
  { key: 'Routes', label: 'Routes' },
  { key: 'Person', label: 'Person' },
  { key: 'Booking', label: 'Booking' },
  { key: 'Driver', label: 'Driver' },
];

// ลบ initialEmployees ออก ไม่ต้องมีโค้ดนี้อีกต่อไป

// ใช้ proxy ของ Vite เพื่อความเสถียร (กำหนดไว้ใน vite.config.js)
const API_BASE_URL = '/api';

function EmployeeManager() {
  // === State สำหรับการนำทาง ===
  const [activePage, setActivePage] = useState('employee'); // หน้าปัจจุบัน (employee/department/position)
  const [activeMenu, setActiveMenu] = useState('Person');   // เมนูที่เลือกในเมนูซ้าย

  // === State สำหรับข้อมูลพนักงาน ===
  const [employees, setEmployees] = useState([]); // รายการพนักงานทั้งหมด - ดึงจาก API
  const [form, setForm] = useState({ 
    personId: '',
    username: '',
    password: '',
    name: '', 
    // เก็บเป็นรหัส (ID) เพื่อยิง API ได้ตรง
    position: '', // rankId
    department: '', // departmentId
    systemPermis: 'U',
    isActive: 1
  }); // ข้อมูลในฟอร์ม
  const [editingId, setEditingId] = useState(null); // ID ของพนักงานที่กำลังแก้ไข

  // === State สำหรับการค้นหาและกรอง ===
  const [search, setSearch] = useState('');      // คำค้นหา
  const [filter, setFilter] = useState('All');   // (legacy, ไม่ใช้แล้วหลังย้ายไป Advanced Filter)
  // Advanced search state
  const [advOpen, setAdvOpen] = useState(false);
  const [advFilters, setAdvFilters] = useState({
    departmentId: '',
    positionId: '',
    systemPermis: '',
    isActive: ''
  });

  // === State สำหรับ Modal/Dialog ===
  const [showForm, setShowForm] = useState(false);     // แสดงฟอร์มเพิ่ม/แก้ไข
  const [showDetail, setShowDetail] = useState(false); // แสดงรายละเอียดพนักงาน
  const [detailEmp, setDetailEmp] = useState(null);    // ข้อมูลพนักงานที่แสดงรายละเอียด

  // === ข้อมูลตายตัว ===
  // ตัวเลือก Filter: ใช้แผนกแทน (All + departmentId)
  // จะสร้าง option จาก deptOptions ภายหลัง
  // ตัวเลือกที่ดึงจาก API
  const [rankOptions, setRankOptions] = useState([]);           // [{rankId, name, isActive}]
  const [deptOptions, setDeptOptions] = useState([]);           // [{departmentId, name, isActive}]
  const [formErrors, setFormErrors] = useState({             // ข้อผิดพลาดในฟอร์ม
    personId: '', username: '', password: '', name: '', 
    position: '', department: '', systemPermis: '', isActive: '' 
  });

  // === ดึงข้อมูลจาก API ===
  useEffect(() => {
    const load = async () => {
      try {
        // ดึงบุคคล
        const res = await fetch(`${API_BASE_URL}/persons`);
        const json = await res.json();
        if (json.success) {
          // แปลงข้อมูลให้เข้ากับโครงสร้างเดิมของตารางนี้
          const mapped = (json.data || []).map(p => {
            const deptName = p.DEPARTMENT_NAME ?? p.departmentName;
            const rankName = p.RANK_NAME ?? p.rankName;
            return {
              id: p.PERSONID ?? p.personId ?? crypto.randomUUID?.() ?? Math.random(),
              personId: p.PERSONID ?? p.personId ?? undefined,
              username: p.USERNAME ?? p.username ?? '',
              name: p.NAME ?? p.name ?? '',
              // เก็บรหัสไว้สำหรับ CRUD
              department: p.DEPARTMENTID ?? p.departmentId ?? '', // departmentId
              position: p.RANKID ?? p.rankId ?? '', // rankId
              // เก็บรหัสผ่านจาก API (ถ้าส่งมา) เพื่อแสดงใน modal ตามที่ผู้ใช้ร้องขอ
              password: p.PASSWORD ?? p.password ?? '',
              // เพิ่มสิทธิ์และสถานะสำหรับการแสดงผลในตาราง/โมดอล
              systemPermis: p.SYSTEMPERMIS ?? p.systemPermis ?? 'U',
              isActive: (p.IS_ACTIVE === 1 || p.IS_ACTIVE === '1' || p.IS_ACTIVE === true) ? 1 : 0,
              // เก็บชื่อเดิมไว้เผื่อใช้ต่อ
              rankName: rankName,
              departmentName: deptName
            };
          });
          setEmployees(mapped);
          console.log('EmployeeManager: loaded persons from API ->', mapped);
        } else {
          console.warn('EmployeeManager: persons API failed:', json.message);
        }

        // ดึงตัวเลือกตำแหน่ง
        const rRes = await fetch(`${API_BASE_URL}/ranks`);
        const rJson = await rRes.json();
        if (rJson.success) {
          const ranks = (rJson.data || []).map(r => ({
            rankId: r.RANKID ?? r.rankId,
            name: r.NAME ?? r.name,
            isActive: (r.IS_ACTIVE === 1 || r.IS_ACTIVE === '1' || r.IS_ACTIVE === true) ? 1 : 0
          }));
          setRankOptions(ranks);
        }

        // ดึงตัวเลือกแผนก
        const dRes = await fetch(`${API_BASE_URL}/departments`);
        const dJson = await dRes.json();
        if (dJson.success) {
          const depts = (dJson.data || []).map(d => ({
            departmentId: d.DEPARTMENTID ?? d.departmentId,
            name: d.NAME ?? d.name,
            isActive: (d.IS_ACTIVE === 1 || d.IS_ACTIVE === '1' || d.IS_ACTIVE === true) ? 1 : 0
          }));
          setDeptOptions(depts);
        }
      } catch (e) {
        console.error('EmployeeManager: fetch persons error', e);
      }
    };
    load();
  }, []);

  // Helper: แปลง id -> ชื่อ สำหรับแสดงผล
  const getRankNameById = (rankId, fallbackName) => {
    if (fallbackName) return fallbackName;
    const r = rankId && rankOptions.find(x => x.rankId === rankId);
    return r ? r.name : (rankId || '-');
  };
  const getDeptNameById = (deptId, fallbackName) => {
    if (fallbackName) return fallbackName;
    const d = deptId && deptOptions.find(x => x.departmentId === deptId);
    return d ? d.name : (deptId || '-');
  };

  // === ฟังก์ชันจัดการฟอร์ม ===
  // อัปเดตข้อมูลในฟอร์ม
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // === ฟังก์ชันตรวจสอบข้อมูล ===
  // ตรวจสอบความถูกต้องของฟอร์มทั้งหมด
  const validateForm = () => {
    const errors = { 
      personId: '', username: '', password: '', name: '', 
      position: '', department: '', systemPermis: '', isActive: '' 
    };
    
    // ตรวจสอบแต่ละฟิลด์
    // เว้นว่างได้ (จะ generate อัตโนมัติ) หากกรอกมาก็ไม่ต้องตรวจอะไรเพิ่มที่นี่
    if (!form.username || form.username.trim().length < 3) {
      errors.username = 'โปรดระบุ Username อย่างน้อย 3 ตัวอักษร';
    }
    if (!form.password || form.password.length < 6) {
      errors.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    }
    if (!form.name || form.name.trim() === '') {
      errors.name = 'โปรดระบุชื่อ';
    }
    if (!form.position || form.position === '') {
      errors.position = 'โปรดเลือกตำแหน่ง';
    }
    if (!form.department || form.department === '') {
      errors.department = 'โปรดเลือกแผนก';
    }
    if (!['A','U'].includes(form.systemPermis)) {
      errors.systemPermis = 'โปรดเลือกสิทธิ์ระบบ';
    }
    if (!(String(form.isActive) === '1' || String(form.isActive) === '0')) {
      errors.isActive = 'โปรดเลือกสถานะ';
    }
    
    setFormErrors(errors);
    return Object.values(errors).every(v => !v);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      // ใช้ PERSONID จากฟอร์ม ถ้าไม่กรอกจะ generate ให้
      let finalPersonId = form.personId;
      if (!finalPersonId) {
        const idRes = await fetch(`${API_BASE_URL}/persons/next-id/generate`);
        const idJson = await idRes.json();
        if (!idJson.success || !idJson.data?.personId) throw new Error('Generate ID failed');
        finalPersonId = idJson.data.personId;
      }

      const payload = {
        personId: finalPersonId,
        name: form.name,
        username: form.username,
        password: form.password,
        systemPermis: form.systemPermis,
        rankId: form.position || null,
        departmentId: form.department || null,
        isActive: parseInt(form.isActive)
      };

      const res = await fetch(`${API_BASE_URL}/persons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Create failed');

      // refresh list
      const listRes = await fetch(`${API_BASE_URL}/persons`);
      const listJson = await listRes.json();
      if (listJson.success) {
        const mapped = (listJson.data || []).map(p => ({
          id: p.PERSONID,
          personId: p.PERSONID,
          username: p.USERNAME,
          name: p.NAME,
          department: p.DEPARTMENTID,
          position: p.RANKID,
          password: p.PASSWORD,
          systemPermis: p.SYSTEMPERMIS,
          isActive: (p.IS_ACTIVE === 1 || p.IS_ACTIVE === '1' || p.IS_ACTIVE === true) ? 1 : 0,
          rankName: p.RANK_NAME,
          departmentName: p.DEPARTMENT_NAME
        }));
        setEmployees(mapped);
      }

      setForm({ personId: '', username: '', password: '', name: '', position: '', department: '', systemPermis: 'U', isActive: 1 });
      setShowForm(false);
    } catch (err) {
      console.error('Create person failed:', err);
      alert('สร้างบุคคลไม่สำเร็จ: ' + (err.message || err));
    }
  };

  const handleEdit = (emp) => {
    // เก็บเป็น PERSONID สำหรับยิง PUT/DELETE
    setEditingId(emp.personId || emp.id);
    setForm({
      personId: emp.personId || emp.id || '',
      username: emp.username || '',
      password: emp.password || '',
      name: emp.name || '',
      // เก็บเป็น id
      position: emp.position || emp.rankId || '',
      department: emp.department || emp.departmentId || '',
      systemPermis: emp.systemPermis || 'U',
      isActive: emp.isActive ?? 1
    });
    setShowForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const payload = {
        name: form.name,
        username: form.username,
        password: form.password,
        systemPermis: form.systemPermis,
        rankId: form.position || null,
        departmentId: form.department || null,
        isActive: parseInt(form.isActive)
      };
      const res = await fetch(`${API_BASE_URL}/persons/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Update failed');

      // refresh list
      const listRes = await fetch(`${API_BASE_URL}/persons`);
      const listJson = await listRes.json();
      if (listJson.success) {
        const mapped = (listJson.data || []).map(p => ({
          id: p.PERSONID,
          personId: p.PERSONID,
          username: p.USERNAME,
          name: p.NAME,
          department: p.DEPARTMENTID,
          position: p.RANKID,
          password: p.PASSWORD,
          systemPermis: p.SYSTEMPERMIS,
          isActive: (p.IS_ACTIVE === 1 || p.IS_ACTIVE === '1' || p.IS_ACTIVE === true) ? 1 : 0,
          rankName: p.RANK_NAME,
          departmentName: p.DEPARTMENT_NAME
        }));
        setEmployees(mapped);
      }

      setEditingId(null);
      setForm({ personId: '', username: '', password: '', name: '', position: '', department: '', systemPermis: 'U', isActive: 1 });
      setShowForm(false);
    } catch (err) {
      console.error('Update person failed:', err);
      alert('แก้ไขไม่สำเร็จ: ' + (err.message || err));
    }
  };

  const handleDelete = async (id) => {
    const personId = id;
    if (!window.confirm('ยืนยันการลบพนักงานนี้?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/persons/${personId}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Delete failed');
      // refresh list
      const listRes = await fetch(`${API_BASE_URL}/persons`);
      const listJson = await listRes.json();
      if (listJson.success) {
        const mapped = (listJson.data || []).map(p => ({
          id: p.PERSONID,
          personId: p.PERSONID,
          username: p.USERNAME,
          name: p.NAME,
          department: p.DEPARTMENTID,
          position: p.RANKID,
          password: p.PASSWORD,
          systemPermis: p.SYSTEMPERMIS,
          isActive: (p.IS_ACTIVE === 1 || p.IS_ACTIVE === '1' || p.IS_ACTIVE === true) ? 1 : 0,
          rankName: p.RANK_NAME,
          departmentName: p.DEPARTMENT_NAME
        }));
        setEmployees(mapped);
      }
    } catch (err) {
      console.error('Delete person failed:', err);
      alert('ลบไม่สำเร็จ: ' + (err.message || err));
    }
  };

  // exportCSV removed per request

  // ฟังก์ชันช่วยตรวจว่าเป็น Manager หรือ Staff จากชื่อ/รหัสตำแหน่ง
  const isManagerTitle = (rankName = '') => /manager|หัวหน้า|mgr/i.test(rankName);

  const filteredEmployees = employees.filter((emp) => {
    const q = (search || '').trim().toLowerCase();
    const username = (emp.username || '').toLowerCase();
    const name = (emp.name || '').toLowerCase();
    const personId = (emp.personId || emp.id || '').toLowerCase();
    const deptId = (emp.department || '').toLowerCase();
    const deptName = (getDeptNameById(emp.department, emp.departmentName) || '').toLowerCase();
    const rankName = (getRankNameById(emp.position, emp.rankName) || '').toLowerCase();

    // การค้นหา: username / name / personId / ชื่อแผนก / ชื่อตำแหน่ง
    const matchSearch = !q || [username, name, personId, deptName, rankName].some(v => v.includes(q));

    // การกรองตามแผนก: filter เก็บ departmentId หรือ 'All'
  // ยกเลิก dropdown เดิม ใช้เฉพาะ advanced filters
  const matchDept = true;

  // Advanced filters (AND logic)
    const advDeptOk = !advFilters.departmentId || deptId === advFilters.departmentId.toLowerCase();
    const advRankOk = !advFilters.positionId || (emp.position || '').toLowerCase() === advFilters.positionId.toLowerCase();
    const advPermOk = !advFilters.systemPermis || emp.systemPermis === advFilters.systemPermis;
    const advActiveOk = !advFilters.isActive || String(emp.isActive) === advFilters.isActive;

    return matchSearch && matchDept && advDeptOk && advRankOk && advPermOk && advActiveOk;
  });

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
            <img src={logoImg} alt="logo" className="em-logo-img" />
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
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setEditingId(null);
                      setForm({
                        personId: '',
                        username: '',
                        password: '',
                        name: '',
                        position: '',
                        department: '',
                        systemPermis: 'U',
                        isActive: 1
                      });
                    }}
                    className="em-btn primary"
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <span style={{ fontSize: 20 }}>+</span> เพิ่มบุคคล
                  </button>
                  <input
                    type="text"
                    placeholder="ค้นหา"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="em-search"
                  />
                  <button
                    type="button"
                    className="em-btn"
                    style={{ display:'flex', alignItems:'center', gap:6, background: advOpen ? '#0E4A35' : '#23252B' }}
                    onClick={() => setAdvOpen(o => !o)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h18l-7 8v6l-4 2v-8z"/></svg>
                    Filter
                  </button>
                </>
              )}
            </div>

            {activePage === 'employee' && advOpen && (
              <div className="em-adv-panel">
                <div className="em-adv-row">
                  <div className="em-adv-group">
                    <label>แผนก</label>
                    <select
                      value={advFilters.departmentId}
                      onChange={e => setAdvFilters(f => ({ ...f, departmentId: e.target.value }))}
                    >
                      <option value="">-- ทั้งหมด --</option>
                      {deptOptions.filter(d => d.isActive === 1).map(d => (
                        <option key={d.departmentId} value={d.departmentId}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="em-adv-group">
                    <label>ตำแหน่ง</label>
                    <select
                      value={advFilters.positionId}
                      onChange={e => setAdvFilters(f => ({ ...f, positionId: e.target.value }))}
                    >
                      <option value="">-- ทั้งหมด --</option>
                      {rankOptions.filter(r => r.isActive === 1).map(r => (
                        <option key={r.rankId} value={r.rankId}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="em-adv-group">
                    <label>สิทธิ์ระบบ</label>
                    <select
                      value={advFilters.systemPermis}
                      onChange={e => setAdvFilters(f => ({ ...f, systemPermis: e.target.value }))}
                    >
                      <option value="">-- ทั้งหมด --</option>
                      <option value="A">Admin</option>
                      <option value="U">User</option>
                    </select>
                  </div>
                  <div className="em-adv-group">
                    <label>สถานะ</label>
                    <select
                      value={advFilters.isActive}
                      onChange={e => setAdvFilters(f => ({ ...f, isActive: e.target.value }))}
                    >
                      <option value="">-- ทั้งหมด --</option>
                      <option value="1">ใช้งาน</option>
                      <option value="0">ไม่ใช้งาน</option>
                    </select>
                  </div>
                </div>
                <div className="em-adv-actions">
                  <button
                    type="button"
                    className="em-btn"
                    onClick={() => setAdvFilters({ departmentId:'', positionId:'', systemPermis:'', isActive:'' })}
                  >รีเซ็ต</button>
                  <button
                    type="button"
                    className="em-btn primary"
                    onClick={() => setAdvOpen(false)}
                  >ปิด</button>
                </div>
              </div>
            )}

            {activePage === 'employee' && (
              <div className="em-table-wrap">
                <table className="em-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>ชื่อ</th>
                      <th>ตำแหน่ง</th>
                      <th>แผนก</th>
                      <th>สถานะ</th>
                      <th className="center">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map(emp => (
                      <tr key={emp.id}>
                        <td>{emp.username}</td>
                        <td>{emp.name}</td>
                        <td>{getRankNameById(emp.position, emp.rankName)}</td>
                        <td>{getDeptNameById(emp.department, emp.departmentName)}</td>
                        <td>
                          <span style={{
                            /* ปรับสีให้ตรงกับแผนกและตำแหน่ง (#4CAF50 / #F44336) */
                            background: emp.isActive === 1 ? '#4CAF50' : '#F44336',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {emp.isActive === 1 ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                          </span>
                        </td>
                        <td className="center">
                          <button className="em-action-btn" onClick={() => handleEdit(emp)}>แก้ไข</button>
                          <button className="em-action-btn view" onClick={() => { setDetailEmp(emp); setShowDetail(true); }}>ดูข้อมูล</button>
                          <button className="em-action-btn delete" onClick={() => handleDelete(emp.personId || emp.id)}>ลบ</button>
                        </td>
                      </tr>
                    ))}
                    {filteredEmployees.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '24px 0', color: '#888' }}>ไม่มีข้อมูลพนักงาน</td>
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
                  <label className="em-input-label">PERSONID</label>
                  <input name="personId" placeholder={editingId ? 'แก้ไขไม่ได้' : 'เช่น P000000001 (ว่าง = สร้างอัตโนมัติ)'} value={form.personId} onChange={handleChange} className="em-modal-input" disabled={!!editingId} />
                  {formErrors.personId && <div className="em-error">{formErrors.personId}</div>}

                  <label className="em-input-label">Username</label>
                  <input name="username" placeholder="Username" value={form.username} onChange={handleChange} className="em-modal-input" required />
                  {formErrors.username && <div className="em-error">{formErrors.username}</div>}

                  <label className="em-input-label">ชื่อ</label>
                  <input name="name" placeholder="ชื่อ" value={form.name} onChange={handleChange} className="em-modal-input" required />
                  {formErrors.name && <div className="em-error">{formErrors.name}</div>}
                </div>

                <div className="em-modal-col">
                  <label className="em-input-label">รหัสผ่าน</label>
                  <input name="password" placeholder="Password" value={form.password} onChange={handleChange} className="em-modal-input" required />
                  {formErrors.password && <div className="em-error">{formErrors.password}</div>}

                  <label className="em-input-label">ตำแหน่ง</label>
                  <select name="position" value={form.position} onChange={handleChange} className="em-modal-select" required>
                    <option value="">เลือกตำแหน่ง</option>
                    {rankOptions.filter(r => r.isActive === 1).map(r => (
                      <option key={r.rankId} value={r.rankId}>{r.name} ({r.rankId})</option>
                    ))}
                  </select>
                  {formErrors.position && <div className="em-error">{formErrors.position}</div>}

                  <label className="em-input-label">แผนก</label>
                  <select name="department" value={form.department} onChange={handleChange} className="em-modal-select" required>
                    <option value="">เลือกแผนก</option>
                    {deptOptions.filter(d => d.isActive === 1).map(d => (
                      <option key={d.departmentId} value={d.departmentId}>{d.name} ({d.departmentId})</option>
                    ))}
                  </select>
                  {formErrors.department && <div className="em-error">{formErrors.department}</div>}

                  <label className="em-input-label">สิทธิ์ระบบ</label>
                  <select name="systemPermis" value={form.systemPermis} onChange={handleChange} className="em-modal-select" required>
                    <option value="U">ผู้ใช้งาน (User)</option>
                    <option value="A">ผู้ดูแลระบบ (Admin)</option>
                  </select>
                  {formErrors.systemPermis && <div className="em-error">{formErrors.systemPermis}</div>}

                  <label className="em-input-label">สถานะ</label>
                  <select name="isActive" value={form.isActive} onChange={handleChange} className="em-modal-select" required>
                    <option value={1}>ใช้งาน</option>
                    <option value={0}>ไม่ใช้งาน</option>
                  </select>
                  {formErrors.isActive && <div className="em-error">{formErrors.isActive}</div>}

                  {/* additional phones can be edited below if present */}
                </div>
              </div>

              <div className="em-modal-btns">
                <button type="submit" className="em-modal-btn">{editingId ? 'บันทึก' : 'เพิ่ม'}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm({ personId: '', username: '', password: '', name: '', position: '', department: '', systemPermis: 'U', isActive: 1 }); }} className="em-modal-btn cancel">ยกเลิก</button>
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
                  <div><b>PERSONID:</b> {detailEmp.personId || detailEmp.id || '-'}</div>
                  <div><b>Username:</b> {detailEmp.username}</div>
                  <div><b>ชื่อ:</b> {detailEmp.name}</div>
                </div>
                <div className="em-modal-col">
                  <div><b>ตำแหน่ง:</b> {getRankNameById(detailEmp.position, detailEmp.rankName)}</div>
                  <div><b>แผนก:</b> {getDeptNameById(detailEmp.department, detailEmp.departmentName)}</div>
                  <div><b>สิทธิ์ระบบ:</b> {detailEmp.systemPermis === 'A' ? 'Admin' : 'User'}</div>
                  <div>
                    <b>สถานะ:</b> {' '}
                    <span style={{
                      /* ปรับสีให้ตรงกับแผนกและตำแหน่ง (#4CAF50 / #F44336) */
                      background: detailEmp.isActive === 1 ? '#4CAF50' : '#F44336',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {detailEmp.isActive === 1 ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                    </span>
                  </div>
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
