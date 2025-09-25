import React, { useState } from 'react';

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
    <div style={{ padding: 32 }}>
      <h2>ตำแหน่ง</h2>
      <form onSubmit={editingId ? handleUpdate : handleAdd} style={{ marginBottom: 16 }}>
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="ชื่อตำแหน่ง" style={{ padding: 8, borderRadius: 8, marginRight: 8 }} />
        <span style={{ marginRight: 8 }}>สิทธิ์:</span>
        {allPermissions.map(perm => (
          <label key={perm} style={{ marginRight: 8 }}>
            <input type="checkbox" checked={form.permissions.includes(perm)} onChange={() => togglePermission(perm)} /> {perm}
          </label>
        ))}
        <button type="submit">{editingId ? 'บันทึก' : 'เพิ่ม'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', permissions: [] }); }}>ยกเลิก</button>}
      </form>
      <table style={{ width: '100%', background: '#23252B', color: '#fff', borderRadius: 8 }}>
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
              <td className="center">{pos.id}</td>
              <td className="center">{pos.name}</td>
              <td className="center">{pos.departmentId}</td>
              <td>{pos.permissions.join(', ')}</td>
              <td className="center" style={{display:'flex',justifyContent:'center',alignItems:'center',gap:8}}>
                <button className="em-action-btn" style={{whiteSpace:'nowrap'}} onClick={() => handleEdit(pos)}>แก้ไข</button>
                <button className="em-action-btn delete" style={{whiteSpace:'nowrap'}} onClick={() => handleDelete(pos.id)}>ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PositionManager;
