import React, { useState } from 'react';
import './DepartmentManager.css';

const initialDepartments = [
  { id: 1, name: 'ฝ่ายปฏิบัติการ' },
  { id: 2, name: 'ฝ่ายบุคคล' },
  { id: 3, name: 'ฝ่ายการเงิน' },
];

function DepartmentManager() {
  const [departments, setDepartments] = useState(initialDepartments);
  const [form, setForm] = useState({ name: '' });
  const [editingId, setEditingId] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setDepartments([...departments, { id: Date.now(), name: form.name }]);
    setForm({ name: '' });
  };

  const handleEdit = (dep) => {
    setEditingId(dep.id);
    setForm({ name: dep.name });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setDepartments(departments.map(dep => dep.id === editingId ? { ...dep, name: form.name } : dep));
    setEditingId(null);
    setForm({ name: '' });
  };

  const handleDelete = (id) => {
    if (!window.confirm('ลบแผนกนี้?')) return;
    setDepartments(departments.filter(dep => dep.id !== id));
  };

  return (
    <div className="dm-container">
      <h2 className="dm-title">แผนก</h2>
      <form onSubmit={editingId ? handleUpdate : handleAdd} className="dm-form">
        <input value={form.name} onChange={e => setForm({ name: e.target.value })} placeholder="ชื่อแผนก" className="dm-input" />
        <button type="submit" className="dm-btn">{editingId ? 'บันทึก' : 'เพิ่ม'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '' }); }} className="dm-btn cancel">ยกเลิก</button>}
      </form>
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
