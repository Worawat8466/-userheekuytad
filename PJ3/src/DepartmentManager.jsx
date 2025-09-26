import React, { useState } from 'react';

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
    <div style={{ padding: 32 }}>
      <h2>แผนก</h2>
      <form onSubmit={editingId ? handleUpdate : handleAdd} style={{ marginBottom: 16 }}>
        <input value={form.name} onChange={e => setForm({ name: e.target.value })} placeholder="ชื่อแผนก" style={{ padding: 8, borderRadius: 8, marginRight: 8 }} />
        <button type="submit">{editingId ? 'บันทึก' : 'เพิ่ม'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '' }); }}>ยกเลิก</button>}
      </form>
      <table style={{ width: '100%', background: '#23252B', color: '#fff', borderRadius: 8 }}>
        <thead>
          <tr>
            <th className="center">ID</th>
            <th className="center">ชื่อแผนก</th>
            <th className="center">การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {departments.map(dep => (
            <tr key={dep.id}>
              <td style={{textAlign:'center'}}>{dep.id}</td>
              <td className="center">{dep.name}</td>
              <td className="center" style={{display:'flex',justifyContent:'center',alignItems:'center',gap:8}}>
                <button className="em-action-btn" style={{whiteSpace:'nowrap'}} onClick={() => handleEdit(dep)}>แก้ไข</button>
                <button className="em-action-btn delete" style={{whiteSpace:'nowrap'}} onClick={() => handleDelete(dep.id)}>ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DepartmentManager;
