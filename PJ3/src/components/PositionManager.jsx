import React, { useState } from 'react';
import '../pages/PersonPage.css';

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
    const deptId = form.departmentId ? parseInt(form.departmentId) : 1;
    setPositions([...positions, { id: newId, name: form.name, departmentId: deptId, permissions: form.permissions }]);
    setForm({ id: '', name: '', departmentId: '', permissions: [] });
    setEditingId(null);
    setLoading(false);
    showToast('เพิ่มตำแหน่งเรียบร้อยแล้ว');
  };

  const handleEdit = (pos) => {
    setEditingId(pos.id);
    setForm({ id: pos.id, name: pos.name, departmentId: pos.departmentId, permissions: pos.permissions });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const updatedId = form.id ? parseInt(form.id) : editingId;
    const deptId = form.departmentId ? parseInt(form.departmentId) : 1;
    setPositions(positions.map(pos => pos.id === editingId ? { ...pos, id: updatedId, name: form.name, departmentId: deptId, permissions: form.permissions } : pos));
    setEditingId(null);
    setForm({ id: '', name: '', departmentId: '', permissions: [] });
    setLoading(false);
    showToast('แก้ไขข้อมูลเรียบร้อยแล้ว');
  };

  const handleDelete = (id) => {
    if (!window.confirm('ลบตำแหน่งนี้?')) return;
    setPositions(positions.filter(pos => pos.id !== id));
    showToast('ลบข้อมูลเรียบร้อยแล้ว');
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
    <div style={{ padding: '0 16px' }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 'bold' }}>จัดการตำแหน่ง</h3>
      </div>

      {/* Top row with add button, search and filter */}
      <div style={{ marginBottom: 16 }}>
        {!editingId && (
          <>
            <button type="button" className="em-btn primary" onClick={() => setEditingId('new')}>
              <span style={{ fontSize: 16 }}>+</span> เพิ่มตำแหน่ง
            </button>
            <input
              type="text"
              placeholder="ค้นหาตำแหน่ง..."
              className="em-search"
              onChange={(e) => {
                // TODO: Implement search functionality
              }}
            />
            <select className="em-select">
              <option value="">ทุกแผนก</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
            </select>
          </>
        )}
      </div>
      
      {/* Keep existing add button structure for backward compatibility */}
      {!editingId && false && (
        <div style={{ marginBottom: 16 }}>
          <button type="button" className="em-btn primary" onClick={() => setEditingId('new')}>
            <span style={{ fontSize: 16 }}>+</span> เพิ่มตำแหน่ง
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
              <label className="em-input-label">ชื่อตำแหน่ง</label>
              <input 
                value={form.name} 
                onChange={e => setForm({ ...form, name: e.target.value })} 
                placeholder="ชื่อตำแหน่ง" 
                className="em-modal-input" 
                style={{ width: '300px' }} 
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="em-input-label">รหัสแผนก (departmentId)</label>
              <input 
                value={form.departmentId} 
                onChange={e => setForm({ ...form, departmentId: e.target.value })} 
                placeholder="รหัสแผนก" 
                className="em-modal-input" 
                style={{ width: '180px' }} 
                type="number" 
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="em-input-label">สิทธิ์:</label>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 8 }}>
                {allPermissions.map(perm => (
                  <label key={perm} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff' }}>
                    <input 
                      type="checkbox" 
                      checked={form.permissions.includes(perm)} 
                      onChange={() => togglePermission(perm)} 
                    /> 
                    {perm}
                  </label>
                ))}
              </div>
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
                onClick={() => { setEditingId(null); setForm({ id: '', name: '', departmentId: '', permissions: [] }); }} 
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
              <th style={{textAlign:'center'}}>ชื่อตำแหน่ง</th>
              <th style={{textAlign:'center'}}>แผนก (departmentId)</th>
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
                <td className="center">
                  <button className="em-action-btn" onClick={() => handleEdit(pos)}>แก้ไข</button>
                  <button className="em-action-btn delete" onClick={() => handleDelete(pos.id)}>ลบ</button>
                </td>
              </tr>
            ))}
            {positions.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <div className="em-empty-state">
                    <h3>ไม่มีข้อมูลตำแหน่ง</h3>
                    <p>เพิ่มตำแหน่งใหม่เพื่อเริ่มต้นการจัดการ</p>
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

export default PositionManager;
