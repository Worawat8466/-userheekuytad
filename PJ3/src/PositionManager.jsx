import React, { useState } from 'react';
import './PositionManager.css';

const initialPositions = [
  { id: 1, name: 'หัวหน้า', departmentId: 1, permissions: ['ดู', 'เพิ่ม', 'แก้ไข', 'ลบ'] },
  { id: 2, name: 'ผู้จัดการ', departmentId: 2, permissions: ['ดู', 'แก้ไข'] },
  { id: 3, name: 'พนักงาน', departmentId: 3, permissions: ['ดู'] },
];

const allPermissions = ['ดู', 'เพิ่ม', 'แก้ไข', 'ลบ'];

function PositionManager() {
  const [positions, setPositions] = useState(initialPositions);
  const [form, setForm] = useState({ name: '', permissions: [] });
  const [editingId, setEditingId] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setPositions([...positions, { id: Date.now(), name: form.name, permissions: form.permissions }]);
    setForm({ name: '', permissions: [] });
  };

  const handleEdit = (pos) => {
    setEditingId(pos.id);
    setForm({ name: pos.name, permissions: pos.permissions });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setPositions(positions.map(pos => pos.id === editingId ? { ...pos, name: form.name, permissions: form.permissions } : pos));
    setEditingId(null);
    setForm({ name: '', permissions: [] });
  };

  const handleDelete = (id) => {
    if (!window.confirm('ลบตำแหน่งนี้?')) return;
    setPositions(positions.filter(pos => pos.id !== id));
  };

  const togglePermission = (perm) => {
    setForm(form => ({
      ...form,
      permissions: form.permissions.includes(perm)
        ? form.permissions.filter(p => p !== perm)
        : [...form.permissions, perm]
    }));
  };

  return (
    <div className="pm-container">
      <h2 className="pm-title">ตำแหน่ง</h2>
      <form onSubmit={editingId ? handleUpdate : handleAdd} className="pm-form">
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="ชื่อตำแหน่ง" className="pm-input" />
        <span className="pm-permissions-label">สิทธิ์:</span>
        {allPermissions.map(perm => (
          <label key={perm} className="pm-permission-item">
            <input type="checkbox" checked={form.permissions.includes(perm)} onChange={() => togglePermission(perm)} /> {perm}
          </label>
        ))}
        <button type="submit" className="pm-btn">{editingId ? 'บันทึก' : 'เพิ่ม'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', permissions: [] }); }} className="pm-btn cancel">ยกเลิก</button>}
      </form>
      <table className="pm-table">
        <thead>
          <tr>
            <th className="center">ID</th>
            <th className="center">ชื่อตำแหน่ง</th>
            <th className="center">แผนก (departmentId)</th>
            <th>สิทธิ์</th>
            <th className="center">การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {positions.map(pos => (
            <tr key={pos.id}>
              <td style={{textAlign:'center'}}>{pos.id}</td>
              <td style={{textAlign:'center'}}>{pos.name}</td>
              <td style={{textAlign:'center'}}>{pos.departmentId}</td>
              <td>{pos.permissions.join(', ')}</td>
              <td className="pm-action-cell">
                <button className="pm-action-btn" onClick={() => handleEdit(pos)}>แก้ไข</button>
                <button className="pm-action-btn delete" onClick={() => handleDelete(pos.id)}>ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PositionManager;
