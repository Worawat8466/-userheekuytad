import React, { useState, useEffect } from 'react';
import '../pages/PersonPage.css';

// === API CONFIGURATION ===
const API_BASE_URL = '/api';

const normalizeIsActive = (v) => {
  if (v === 1 || v === '1' || v === true) return 1;
  if (typeof v === 'string') {
    const s = v.toLowerCase();
    if (s === 'y' || s === 't' || s === 'true') return 1;
  }
  return 0;
};

const normalizeRank = (r) => ({
  rankId: r.RANKID ?? r.rankId ?? '',
  name: r.NAME ?? r.name ?? '',
  isActive: normalizeIsActive(r.IS_ACTIVE ?? r.isActive),
});

function PositionManager() {
  const [positions, setPositions] = useState([]);
  const [form, setForm] = useState({ rankId: '', name: '', isActive: 1 });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // === API FUNCTIONS ===
  const fetchRanks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/ranks`);
      const data = await response.json();
      if (data.success) {
        const normalized = (data.data || []).map(normalizeRank);
        setPositions(normalized);
      } else {
        console.error('Failed to fetch ranks:', data.message);
      }
    } catch (error) {
      console.error('Error fetching ranks:', error);
    }
  };

  // === LOAD DATA ON COMPONENT MOUNT ===
  useEffect(() => {
    const loadData = async () => {
      setDataLoading(true);
      await fetchRanks();
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
    if (!form.rankId.trim() || !form.name.trim()) return;
    
    setLoading(true);
    
    try {
      const newPosition = {
        rankId: form.rankId,
        name: form.name,
        isActive: parseInt(form.isActive)
      };
      
      const response = await fetch(`${API_BASE_URL}/ranks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPosition)
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchRanks(); // Refresh data from server
        setForm({ rankId: '', name: '', isActive: 1 });
        setEditingId(null);
        showToast('เพิ่มตำแหน่งเรียบร้อยแล้ว');
      } else {
        showToast(data.message || 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล', 'error');
      }
    } catch (error) {
      console.error('Error adding rank:', error);
      showToast('เกิดข้อผิดพลาดในการเพิ่มข้อมูล', 'error');
    }
    
    setLoading(false);
  };

  const handleEdit = (pos) => {
    setEditingId(pos.rankId);
    setForm({ rankId: pos.rankId, name: pos.name, isActive: pos.isActive });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      const updatedPosition = {
        name: form.name,
        isActive: parseInt(form.isActive)
      };
      
      const response = await fetch(`${API_BASE_URL}/ranks/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPosition)
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchRanks(); // Refresh data from server
        setEditingId(null);
        setForm({ rankId: '', name: '', isActive: 1 });
        showToast('แก้ไขข้อมูลเรียบร้อยแล้ว');
      } else {
        showToast(data.message || 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล', 'error');
      }
    } catch (error) {
      console.error('Error updating rank:', error);
      showToast('เกิดข้อผิดพลาดในการแก้ไขข้อมูล', 'error');
    }
    
    setLoading(false);
  };

  const handleDelete = async (rankId) => {
    if (!window.confirm('ลบตำแหน่งนี้?')) return;
    
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/ranks/${rankId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchRanks(); // Refresh data from server
        showToast('ลบข้อมูลเรียบร้อยแล้ว');
      } else {
        showToast(data.message || 'เกิดข้อผิดพลาดในการลบข้อมูล', 'error');
      }
    } catch (error) {
      console.error('Error deleting rank:', error);
      showToast('เกิดข้อผิดพลาดในการลบข้อมูล', 'error');
    }
    
    setLoading(false);
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 'bold' }}>จัดการตำแหน่ง</h3>
      </div>

      {/* Top row with add button and search */}
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
          </>
        )}
      </div>
      
      {/* Form for adding/editing */}
      {(editingId === 'new' || editingId) && (
        <div style={{ marginBottom: 24, padding: 16, background: '#23252B', borderRadius: 8 }}>
          <form onSubmit={editingId === 'new' ? handleAdd : handleUpdate}>
            <div style={{ marginBottom: 12 }}>
              <label className="em-input-label">รหัสตำแหน่ง (RANK1, RANK2, ฯลฯ)</label>
              <input 
                value={form.rankId} 
                onChange={e => setForm({ ...form, rankId: e.target.value.toUpperCase() })} 
                placeholder="เช่น RANK6" 
                className="em-modal-input" 
                style={{ width: '200px' }} 
                maxLength={5}
                disabled={editingId !== 'new'}
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
                onClick={() => { setEditingId(null); setForm({ rankId: '', name: '', isActive: 1 }); }} 
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
              <th style={{textAlign:'center'}}>รหัสตำแหน่ง</th>
              <th style={{textAlign:'center'}}>ชื่อตำแหน่ง</th>
              <th style={{textAlign:'center'}}>สถานะ</th>
              <th className="center">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {positions.map(pos => (
              <tr key={pos.rankId}>
                <td style={{textAlign:'center', fontFamily: 'monospace', fontWeight: 'bold'}}>{pos.rankId}</td>
                <td style={{textAlign:'center'}}>{pos.name}</td>
                <td style={{textAlign:'center'}}>
                  <span style={{
                    background: pos.isActive === 1 ? '#4CAF50' : '#F44336',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {pos.isActive === 1 ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                  </span>
                </td>
                <td className="center">
                  <button className="em-action-btn" onClick={() => handleEdit(pos)}>แก้ไข</button>
                  <button className="em-action-btn delete" onClick={() => handleDelete(pos.rankId)}>ลบ</button>
                </td>
              </tr>
            ))}
            {positions.length === 0 && (
              <tr>
                <td colSpan={4}>
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
