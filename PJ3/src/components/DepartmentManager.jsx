import React, { useState, useEffect } from 'react';
import '../pages/PersonPage.css';

// === API CONFIGURATION ===
const API_BASE_URL = 'http://localhost:3001/api';

function DepartmentManager() {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ departmentId: '', name: '', isActive: 1 });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // === API FUNCTIONS ===
  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/departments`);
      const data = await response.json();
      if (data.success) {
        setDepartments(data.data || []);
      } else {
        console.error('Failed to fetch departments:', data.message);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  // === LOAD DATA ON COMPONENT MOUNT ===
  useEffect(() => {
    const loadData = async () => {
      setDataLoading(true);
      await fetchDepartments();
      setDataLoading(false);
    };

    loadData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.departmentId.trim() || !form.name.trim()) return;
    
    setLoading(true);
    
    try {
      const newDepartment = {
        departmentId: form.departmentId,
        name: form.name,
        isActive: parseInt(form.isActive)
      };
      
      const response = await fetch(`${API_BASE_URL}/departments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDepartment)
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchDepartments(); // Refresh data from server
        setForm({ departmentId: '', name: '', isActive: 1 });
        setEditingId(null);
        showToast('เพิ่มแผนกเรียบร้อยแล้ว');
      } else {
        showToast(data.message || 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล', 'error');
      }
    } catch (error) {
      console.error('Error adding department:', error);
      showToast('เกิดข้อผิดพลาดในการเพิ่มข้อมูล', 'error');
    }
    
    setLoading(false);
  };

  const handleEdit = (dep) => {
    setEditingId(dep.departmentId);
    setForm({ departmentId: dep.departmentId, name: dep.name, isActive: dep.isActive });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      const updatedDepartment = {
        name: form.name,
        isActive: parseInt(form.isActive)
      };
      
      const response = await fetch(`${API_BASE_URL}/departments/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDepartment)
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchDepartments(); // Refresh data from server
        setEditingId(null);
        setForm({ departmentId: '', name: '', isActive: 1 });
        showToast('แก้ไขข้อมูลเรียบร้อยแล้ว');
      } else {
        showToast(data.message || 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล', 'error');
      }
    } catch (error) {
      console.error('Error updating department:', error);
      showToast('เกิดข้อผิดพลาดในการแก้ไขข้อมูล', 'error');
    }
    
    setLoading(false);
  };

  const handleDelete = async (departmentId) => {
    if (!window.confirm('ลบแผนกนี้?')) return;
    
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/departments/${departmentId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchDepartments(); // Refresh data from server
        showToast('ลบข้อมูลเรียบร้อยแล้ว');
      } else {
        showToast(data.message || 'เกิดข้อผิดพลาดในการลบข้อมูล', 'error');
      }
    } catch (error) {
      console.error('Error deleting department:', error);
      showToast('เกิดข้อผิดพลาดในการลบข้อมูล', 'error');
    }
    
    setLoading(false);
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

      {/* Form for adding/editing */}
      {(editingId === 'new' || editingId) && (
        <div style={{ marginBottom: 24, padding: 16, background: '#23252B', borderRadius: 8 }}>
          <form onSubmit={editingId === 'new' ? handleAdd : handleUpdate}>
            <div style={{ marginBottom: 12 }}>
              <label className="em-input-label">รหัสแผนก (DEPT1, DEPT2, ฯลฯ)</label>
              <input 
                value={form.departmentId} 
                onChange={e => setForm({ ...form, departmentId: e.target.value.toUpperCase() })} 
                placeholder="เช่น DEPT5" 
                className="em-modal-input" 
                style={{ width: '200px' }} 
                maxLength={5}
                disabled={editingId !== 'new'}
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
                maxLength={20}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="em-input-label">สถานะ</label>
              <select 
                value={form.isActive} 
                onChange={e => setForm({ ...form, isActive: parseInt(e.target.value) })} 
                className="em-modal-input" 
                style={{ width: '150px' }}
              >
                <option value={1}>ใช้งาน (1)</option>
                <option value={0}>ไม่ใช้งาน (0)</option>
              </select>
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
                onClick={() => { setEditingId(null); setForm({ departmentId: '', name: '', isActive: 1 }); }} 
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
              <th style={{textAlign:'center'}}>รหัสแผนก</th>
              <th style={{textAlign:'center'}}>ชื่อแผนก</th>
              <th style={{textAlign:'center'}}>สถานะ</th>
              <th className="center">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {departments.map(dep => (
              <tr key={dep.departmentId}>
                <td style={{textAlign:'center', fontFamily: 'monospace', fontWeight: 'bold'}}>{dep.departmentId}</td>
                <td style={{textAlign:'center'}}>{dep.name}</td>
                <td style={{textAlign:'center'}}>
                  <span style={{
                    background: dep.isActive === 1 ? '#4CAF50' : '#F44336',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {dep.isActive === 1 ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                  </span>
                </td>
                <td className="center">
                  <button className="em-action-btn" onClick={() => handleEdit(dep)}>แก้ไข</button>
                  <button className="em-action-btn delete" onClick={() => handleDelete(dep.departmentId)}>ลบ</button>
                </td>
              </tr>
            ))}
            {departments.length === 0 && (
              <tr>
                <td colSpan={4}>
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
