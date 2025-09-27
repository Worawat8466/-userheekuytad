import React, { useState } from 'react';
import '../pages/PersonPage.css';

const initialDepartments = [
  { id: 1, name: 'ฝ่ายปฏิบัติการ' },
  { id: 2, name: 'ฝ่ายบุคคล' },
  { id: 3, name: 'ฝ่ายการเงิน' },
];

function DepartmentManager() {
  const [departments, setDepartments] = useState(initialDepartments);
  const [form, setForm] = useState({ id: '', name: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newId = form.id ? parseInt(form.id) : Date.now();
    setDepartments([...departments, { id: newId, name: form.name }]);
    setForm({ id: '', name: '' });
    setEditingId(null);
    setLoading(false);
    showToast('เพิ่มแผนกเรียบร้อยแล้ว');
  };

  const handleEdit = (dep) => {
    setEditingId(dep.id);
    setForm({ id: dep.id, name: dep.name });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const updatedId = form.id ? parseInt(form.id) : editingId;
    setDepartments(departments.map(dep => dep.id === editingId ? { ...dep, id: updatedId, name: form.name } : dep));
    setEditingId(null);
    setForm({ id: '', name: '' });
    setLoading(false);
    showToast('แก้ไขข้อมูลเรียบร้อยแล้ว');
  };

  const handleDelete = (id) => {
    if (!window.confirm('ลบแผนกนี้?')) return;
    setDepartments(departments.filter(dep => dep.id !== id));
    showToast('ลบข้อมูลเรียบร้อยแล้ว');
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 'bold' }}>จัดการแผนก</h3>
      </div>

      {/* Top row with add button and search */}
      <div style={{ marginBottom: 16 }}>
        {!editingId && (
          <>
            <button type="button" className="em-btn primary" onClick={() => setEditingId('new')}>
              <span style={{ fontSize: 16 }}>+</span> เพิ่มแผนก
            </button>
            <input
              type="text"
              placeholder="ค้นหาแผนก..."
              className="em-search"
              onChange={(e) => {
                // TODO: Implement search functionality
              }}
            />
          </>
        )}
      </div>
      
      {/* Keep existing add button structure for backward compatibility */}
      {!editingId && false && (
        <div style={{ marginBottom: 16 }}>
          <button type="button" className="em-btn primary" onClick={() => setEditingId('new')}>
            <span style={{ fontSize: 16 }}>+</span> เพิ่มแผนก
          </button>
        </div>
      )}

      {/* Form for adding/editing */}
      {(editingId === 'new' || editingId) && (
        <div style={{ marginBottom: 24, padding: 16, background: '#23252B', borderRadius: 8 }}>
          <form onSubmit={editingId === 'new' ? handleAdd : handleUpdate}>
            <div style={{ marginBottom: 12 }}>
              <label className="em-input-label">ID (ถ้าไม่ระบุจะ auto generate)</label>
              <input 
                value={form.id} 
                onChange={e => setForm({ ...form, id: e.target.value })} 
                placeholder="ID" 
                className="em-modal-input" 
                style={{ width: '120px' }} 
                type="number" 
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="em-input-label">ชื่อแผนก</label>
              <input 
                value={form.name} 
                onChange={e => setForm({ ...form, name: e.target.value })} 
                placeholder="ชื่อแผนก" 
                className="em-modal-input" 
                style={{ width: '300px' }} 
              />
            </div>
            <div>
              <button type="submit" className="em-modal-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="em-loading"></span>
                    {editingId === 'new' ? 'กำลังเพิ่ม...' : 'กำลังบันทึก...'}
                  </>
                ) : (
                  editingId === 'new' ? 'เพิ่ม' : 'บันทึก'
                )}
              </button>
              <button 
                type="button" 
                onClick={() => { setEditingId(null); setForm({ id: '', name: '' }); }} 
                className="em-modal-btn cancel"
                disabled={loading}
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="em-table-wrap">
        <table className="em-table">
          <thead>
            <tr>
              <th style={{textAlign:'center'}}>ID</th>
              <th style={{textAlign:'center'}}>ชื่อแผนก</th>
              <th className="center">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {departments.map(dep => (
              <tr key={dep.id}>
                <td style={{textAlign:'center'}}>{dep.id}</td>
                <td style={{textAlign:'center'}}>{dep.name}</td>
                <td className="center">
                  <button className="em-action-btn" onClick={() => handleEdit(dep)}>แก้ไข</button>
                  <button className="em-action-btn delete" onClick={() => handleDelete(dep.id)}>ลบ</button>
                </td>
              </tr>
            ))}
            {departments.length === 0 && (
              <tr>
                <td colSpan={3}>
                  <div className="em-empty-state">
                    <h3>ไม่มีข้อมูลแผนก</h3>
                    <p>เพิ่มแผนกใหม่เพื่อเริ่มต้นการจัดการ</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`em-toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default DepartmentManager;
