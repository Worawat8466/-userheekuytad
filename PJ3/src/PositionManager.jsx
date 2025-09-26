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
  const [form, setForm] = useState({ id: '', name: '', departmentId: '', permissions: [] });
  const [editingId, setEditingId] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const newId = form.id ? parseInt(form.id) : Date.now();
    const deptId = form.departmentId ? parseInt(form.departmentId) : 1;
    setPositions([...positions, { id: newId, name: form.name, departmentId: deptId, permissions: form.permissions }]);
    setForm({ id: '', name: '', departmentId: '', permissions: [] });
    setEditingId(null);
  };

  const handleEdit = (pos) => {
    setEditingId(pos.id);
    setForm({ id: pos.id, name: pos.name, departmentId: pos.departmentId, permissions: pos.permissions });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedId = form.id ? parseInt(form.id) : editingId;
    const deptId = form.departmentId ? parseInt(form.departmentId) : 1;
    setPositions(positions.map(pos => pos.id === editingId ? { ...pos, id: updatedId, name: form.name, departmentId: deptId, permissions: form.permissions } : pos));
    setEditingId(null);
    setForm({ id: '', name: '', departmentId: '', permissions: [] });
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
      
      {/* Add button */}
      {!editingId && (
        <div style={{ marginBottom: 16 }}>
          <button type="button" className="pm-btn" onClick={() => setEditingId('new')}>
            + เพิ่มตำแหน่ง
          </button>
        </div>
      )}

      {/* Form for adding/editing */}
      {(editingId === 'new' || editingId) && (
        <form onSubmit={editingId === 'new' ? handleAdd : handleUpdate} className="pm-form" style={{ marginBottom: 24, padding: 16, background: '#2a2c32', borderRadius: 8 }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ color: '#ccc', fontSize: 12, marginBottom: 6, display: 'block' }}>ID (ถ้าไม่ระบุจะ auto generate)</label>
            <input value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} placeholder="ID" className="pm-input" style={{ width: '100px' }} type="number" />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ color: '#ccc', fontSize: 12, marginBottom: 6, display: 'block' }}>ชื่อตำแหน่ง</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="ชื่อตำแหน่ง" className="pm-input" style={{ width: '300px' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ color: '#ccc', fontSize: 12, marginBottom: 6, display: 'block' }}>รหัสแผนก (departmentId)</label>
            <input value={form.departmentId} onChange={e => setForm({ ...form, departmentId: e.target.value })} placeholder="รหัสแผนก" className="pm-input" style={{ width: '150px' }} type="number" />
          </div>
          <div style={{ marginBottom: 12 }}>
            <span className="pm-permissions-label" style={{ display: 'block', marginBottom: 8 }}>สิทธิ์:</span>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {allPermissions.map(perm => (
                <label key={perm} className="pm-permission-item">
                  <input type="checkbox" checked={form.permissions.includes(perm)} onChange={() => togglePermission(perm)} /> {perm}
                </label>
              ))}
            </div>
          </div>
          <div>
            <button type="submit" className="pm-btn">{editingId === 'new' ? 'เพิ่ม' : 'บันทึก'}</button>
            <button type="button" onClick={() => { setEditingId(null); setForm({ id: '', name: '', departmentId: '', permissions: [] }); }} className="pm-btn cancel">ยกเลิก</button>
          </div>
        </form>
      )}

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
