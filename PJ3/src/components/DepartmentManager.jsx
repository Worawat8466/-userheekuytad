import React, { useState } from 'react';
import './DepartmentManager.css';

const initialDepartments = [
  { id: 1, name: 'ฝ่ายปฏิบัติการ' },
  { id: 2, name: 'ฝ่ายบุคคล' },
  { id: 3, name: 'ฝ่ายการเงิน' },
];

function DepartmentManager() {
  const [departments, setDepartments] = useState(initialDepartments);
  const [form, setForm] = useState({ id: '', name: '' });
  const [editingId, setEditingId] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const newId = form.id ? parseInt(form.id) : Date.now();
    setDepartments([...departments, { id: newId, name: form.name }]);
    setForm({ id: '', name: '' });
    setEditingId(null);
  };

  const handleEdit = (dep) => {
    setEditingId(dep.id);
    setForm({ id: dep.id, name: dep.name });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedId = form.id ? parseInt(form.id) : editingId;
    setDepartments(departments.map(dep => dep.id === editingId ? { ...dep, id: updatedId, name: form.name } : dep));
    setEditingId(null);
    setForm({ id: '', name: '' });
  };

  const handleDelete = (id) => {
    if (!window.confirm('ลบแผนกนี้?')) return;
    setDepartments(departments.filter(dep => dep.id !== id));
  };

  return (
    <div className="dm-container">
      <h2 className="dm-title">แผนก</h2>
      
      {/* Add button */}
      {!editingId && (
        <div style={{ marginBottom: 16 }}>
          <button type="button" className="dm-btn" onClick={() => setEditingId('new')}>
            + เพิ่มแผนก
          </button>
        </div>
      )}

      {/* Form for adding/editing */}
      {(editingId === 'new' || editingId) && (
        <form onSubmit={editingId === 'new' ? handleAdd : handleUpdate} className="dm-form" style={{ marginBottom: 24, padding: 16, background: '#2a2c32', borderRadius: 8 }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ color: '#ccc', fontSize: 12, marginBottom: 6, display: 'block' }}>ID (ถ้าไม่ระบุจะ auto generate)</label>
            <input value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} placeholder="ID" className="dm-input" style={{ width: '100px' }} type="number" />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ color: '#ccc', fontSize: 12, marginBottom: 6, display: 'block' }}>ชื่อแผนก</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="ชื่อแผนก" className="dm-input" style={{ width: '300px' }} />
          </div>
          <div>
            <button type="submit" className="dm-btn">{editingId === 'new' ? 'เพิ่ม' : 'บันทึก'}</button>
            <button type="button" onClick={() => { setEditingId(null); setForm({ id: '', name: '' }); }} className="dm-btn cancel">ยกเลิก</button>
          </div>
        </form>
      )}

      <table className="dm-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>ชื่อแผนก</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {departments.map(dep => (
            <tr key={dep.id}>
              <td style={{textAlign:'center'}}>{dep.id}</td>
              <td style={{textAlign:'center'}}>{dep.name}</td>
              <td className="dm-action-cell">
                <button className="dm-action-btn" onClick={() => handleEdit(dep)}>แก้ไข</button>
                <button className="dm-action-btn delete" onClick={() => handleDelete(dep.id)}>ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DepartmentManager;
