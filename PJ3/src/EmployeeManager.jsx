

import React, { useState } from 'react';
import './EmployeeManager.css';

const sidebarMenu = [
  'Schedule',
  'Routes',
  'Person',
  'Booking',
  'Driver',
];

const initialEmployees = [
  { id: 1, username: '6611130011', name: 'A', position: 'Admin' },
  { id: 2, username: '6611130012', name: 'B', position: 'Manager' },
  { id: 3, username: '6611130013', name: 'C', position: 'Staff' },
];

function EmployeeManager() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [form, setForm] = useState({ username: '', name: '', position: '' });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);

  const positions = ['All', 'Admin', 'Manager', 'Staff'];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.username || !form.name || !form.position) return;
    setEmployees([
      ...employees,
      {
        id: Date.now(),
        username: form.username,
        name: form.name,
        position: form.position,
      },
    ]);
    setForm({ username: '', name: '', position: '' });
    setShowForm(false);
  };

  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setForm({ username: emp.username, name: emp.name, position: emp.position });
    setShowForm(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setEmployees(
      employees.map((emp) =>
        emp.id === editingId
          ? { ...emp, ...form }
          : emp
      )
    );
    setEditingId(null);
    setForm({ username: '', name: '', position: '' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      (filter === 'All' || emp.position === filter) &&
      (emp.username.includes(search) || emp.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="em-root">
      {/* Sidebar */}
      <div className="em-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
          <div className="em-sidebar-logo">
            <span role="img" aria-label="bus" style={{ fontSize: 24 }}>🚌</span>
          </div>
          <div className="em-sidebar-title">Admin Panel</div>
        </div>
        {sidebarMenu.map((menu) => (
          <div key={menu} className={menu === 'Person' ? 'em-sidebar-menu active' : 'em-sidebar-menu'}>{menu}</div>
        ))}
      </div>

      {/* Main Content */}
      <div className="em-main">
        <div className="em-title">Person</div>
        {/* Top Buttons */}
        <div className="em-top-btns">
          <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ username: '', name: '', position: '' }); }} className="em-btn primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>+</span> เพิ่มบุคคล
          </button>
          <button className="em-btn">ตำแหน่ง</button>
          <button className="em-btn">สิทธิ์</button>
          <button className="em-btn">แผนก</button>
          <div style={{ flex: 1 }} />
          {/* Search & Filter */}
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
        </div>

        {/* Table */}
        <div className="em-table-wrap">
          <table className="em-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>ชื่อ</th>
                <th>ตำแหน่ง</th>
                <th className="center">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => (
                <tr key={emp.id}>
                  <td>{emp.username}</td>
                  <td>{emp.name}</td>
                  <td>{emp.position}</td>
                  <td className="center">
                    <button onClick={() => handleEdit(emp)} className="em-action-btn">แก้ไข</button>
                    <button className="em-action-btn view">ดูข้อมูล</button>
                    <button onClick={() => handleDelete(emp.id)} className="em-action-btn delete">ลบ</button>
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

        {/* Form Modal */}
        {showForm && (
          <div className="em-modal-bg">
            <form onSubmit={editingId ? handleUpdate : handleAdd} className="em-modal">
              <div className="em-modal-title">{editingId ? 'แก้ไขข้อมูลบุคคล' : 'เพิ่มบุคคล'}</div>
              <input
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className="em-modal-input"
                required
              />
              <input
                name="name"
                placeholder="ชื่อ"
                value={form.name}
                onChange={handleChange}
                className="em-modal-input"
                required
              />
              <select
                name="position"
                value={form.position}
                onChange={handleChange}
                className="em-modal-select"
                required
              >
                <option value="">เลือกตำแหน่ง</option>
                {positions.filter(pos => pos !== 'All').map(pos => <option key={pos} value={pos}>{pos}</option>)}
              </select>
              <div className="em-modal-btns">
                <button type="submit" className="em-modal-btn">{editingId ? 'บันทึก' : 'เพิ่ม'}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm({ username: '', name: '', position: '' }); }} className="em-modal-btn cancel">ยกเลิก</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeManager;
