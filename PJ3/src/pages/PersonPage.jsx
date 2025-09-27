// === IMPORTS ===
import React, { useState, useEffect } from 'react';
import DepartmentManager from '../components/DepartmentManager';
import PositionManager from '../components/PositionManager';
import './PersonPage.css';

// === API CONFIGURATION ===
const API_BASE_URL = 'http://localhost:3001/api';

function PersonPage() {
  // === NAVIGATION STATE ===
  const [activePage, setActivePage] = useState('employee');

  // === EMPLOYEE DATA STATE ===
  const [employees, setEmployees] = useState([]);
  const [ranks, setRanks] = useState([]);
  const [departments, setDepartments] = useState([]);
  
  const [form, setForm] = useState({
    personId: '',
    name: '', 
    username: '',
    password: '',
    systemPermis: 'U', // Default to User
    rankId: '', 
    departmentId: '',
    isActive: 1
  });
  const [editingId, setEditingId] = useState(null);

  // === SEARCH & FILTER STATE ===
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  // === MODAL STATE ===
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [detailEmp, setDetailEmp] = useState(null);

  // === UX STATE ===
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // === API FUNCTIONS ===
  const fetchPersons = async () => {
    try {
      console.log('Fetching persons from:', `${API_BASE_URL}/persons`);
      const response = await fetch(`${API_BASE_URL}/persons`);
      const data = await response.json();
      console.log('Persons API response:', data);
      if (data.success) {
        setEmployees(data.data || []);
        console.log('Set employees to:', data.data);
      } else {
        console.error('Failed to fetch persons:', data.message);
      }
    } catch (error) {
      console.error('Error fetching persons:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      console.log('Fetching departments from:', `${API_BASE_URL}/departments`);
      const response = await fetch(`${API_BASE_URL}/departments`);
      const data = await response.json();
      console.log('Departments API response:', data);
      if (data.success) {
        setDepartments(data.data || []);
      } else {
        console.error('Failed to fetch departments:', data.message);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchRanks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/ranks`);
      const data = await response.json();
      if (data.success) {
        setRanks(data.data || []);
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
      await Promise.all([
        fetchPersons(),
        fetchDepartments(),
        fetchRanks()
      ]);
      setDataLoading(false);
    };

    loadData();
  }, []);
  const [toast, setToast] = useState(null);
  const [formErrors, setFormErrors] = useState({
    personId: '',
    name: '', 
    username: '', 
    password: '', 
    rankId: '', 
    departmentId: ''
  });

  // === UTILITY FUNCTIONS ===
  const getRankName = (rankId) => {
    if (!rankId) return 'ไม่ระบุ';
    const rank = ranks.find(r => r.rankId === rankId);
    return rank ? rank.name : 'ไม่ระบุ';
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find(d => d.departmentId === departmentId);
    return department ? department.name : 'ไม่ระบุ';
  };

  const getSystemPermissionText = (systemPermis) => {
    return systemPermis === 'A' ? 'ผู้ดูแลระบบ (Admin)' : 'ผู้ใช้งาน (User)';
  };

  const generatePersonId = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/persons/next-id/generate`);
      const data = await response.json();
      if (data.success && data.data) {
        return data.data.personId;
      } else {
        // Fallback to client-side generation if API fails
        const maxId = Math.max(...employees.map(emp => parseInt(emp.personId.substring(1))));
        const nextId = maxId + 1;
        return 'P' + nextId.toString().padStart(9, '0');
      }
    } catch (error) {
      console.error('Error generating person ID:', error);
      // Fallback to client-side generation
      const maxId = Math.max(...employees.map(emp => parseInt(emp.personId.substring(1))));
      const nextId = maxId + 1;
      return 'P' + nextId.toString().padStart(9, '0');
    }
  };

  // === FORM HANDLERS ===
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // === VALIDATION FUNCTIONS ===
  const validateForm = () => {
    const errors = { 
      personId: '', name: '', username: '', password: '', 
      rankId: '', departmentId: '' 
    };
    
    if (!form.personId || form.personId.trim() === '') {
      errors.personId = 'โปรดระบุรหัสบุคคล';
    } else if (employees.find(emp => emp.personId === form.personId && emp.personId !== editingId)) {
      errors.personId = 'รหัสบุคคลนี้มีอยู่แล้ว';
    }
    if (!form.name || form.name.trim() === '') {
      errors.name = 'โปรดระบุชื่อ';
    }
    if (!form.username || form.username.trim().length < 3) {
      errors.username = 'โปรดระบุ Username อย่างน้อย 3 ตัวอักษร';
    }
    if (!form.password || form.password.length < 4) {
      errors.password = 'รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร';
    }
    
    setFormErrors(errors);
    return Object.values(errors).every(v => !v);
  };

  // === UTILITY FUNCTIONS ===
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // === CRUD OPERATIONS ===
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const newPersonId = form.personId || await generatePersonId();
      
      const newEmployee = {
        personId: newPersonId,
        name: form.name,
        username: form.username,
        password: form.password,
        systemPermis: form.systemPermis,
        rankId: form.rankId || null,
        departmentId: form.departmentId || null,
        isActive: parseInt(form.isActive)
      };
      
      const response = await fetch(`${API_BASE_URL}/persons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee)
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchPersons(); // Refresh data from server
        setForm({ 
          personId: '', name: '', username: '', password: '', 
          systemPermis: 'U', rankId: '', departmentId: '', isActive: 1 
        });
        setShowForm(false);
        showToast('เพิ่มพนักงานเรียบร้อยแล้ว');
      } else {
        showToast(data.message || 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล', 'error');
      }
    } catch (error) {
      console.error('Error adding person:', error);
      showToast('เกิดข้อผิดพลาดในการเพิ่มข้อมูล', 'error');
    }
    
    setLoading(false);
  };

  const handleEdit = (emp) => {
    setEditingId(emp.personId);
    setForm({ 
      personId: emp.personId,
      name: emp.name || '', 
      username: emp.username || '',
      password: emp.password || '',
      systemPermis: emp.systemPermis || 'U',
      rankId: emp.rankId || '', 
      departmentId: emp.departmentId || '',
      isActive: emp.isActive
    });
    setShowForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const updatedEmployee = {
        name: form.name,
        username: form.username,
        password: form.password,
        systemPermis: form.systemPermis,
        rankId: form.rankId || null,
        departmentId: form.departmentId || null,
        isActive: parseInt(form.isActive)
      };
      
      const response = await fetch(`${API_BASE_URL}/persons/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEmployee)
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchPersons(); // Refresh data from server
        setEditingId(null);
        setForm({ 
          personId: '', name: '', username: '', password: '', 
          systemPermis: 'U', rankId: '', departmentId: '', isActive: 1 
        });
        setShowForm(false);
        showToast('แก้ไขข้อมูลเรียบร้อยแล้ว');
      } else {
        showToast(data.message || 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล', 'error');
      }
    } catch (error) {
      console.error('Error updating person:', error);
      showToast('เกิดข้อผิดพลาดในการแก้ไขข้อมูล', 'error');
    }
    
    setLoading(false);
  };

  const handleDelete = async (personId) => {
    if (!window.confirm('ลบพนักงานคนนี้?')) return;
    
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/persons/${personId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchPersons(); // Refresh data from server
        showToast('ลบข้อมูลเรียบร้อยแล้ว');
      } else {
        showToast(data.message || 'เกิดข้อผิดพลาดในการลบข้อมูล', 'error');
      }
    } catch (error) {
      console.error('Error deleting person:', error);
      showToast('เกิดข้อผิดพลาดในการลบข้อมูล', 'error');
    }
    
    setLoading(false);
  };

  const handleDetail = (emp) => {
    setDetailEmp(emp);
    setShowDetail(true);
  };

  // === FILTER & SEARCH ===
  const filteredEmployees = employees.filter(emp => {
    const name = emp.NAME || emp.name || '';
    const username = emp.USERNAME || emp.username || '';
    const personId = emp.PERSONID || emp.personId || '';
    const isActive = emp.IS_ACTIVE !== undefined ? emp.IS_ACTIVE : emp.isActive;
    const systemPermis = emp.SYSTEMPERMIS || emp.systemPermis;
    
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || 
                         username.toLowerCase().includes(search.toLowerCase()) ||
                         personId.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filter === 'All' || 
                         (filter === 'Active' && isActive === 1) || 
                         (filter === 'Inactive' && isActive === 0) ||
                         (filter === 'Admin' && systemPermis === 'A') ||
                         (filter === 'User' && systemPermis === 'U');
    
    return matchesSearch && matchesFilter;
  });

  console.log('Current employees:', employees);
  console.log('Filtered employees:', filteredEmployees);
  console.log('Search:', search, 'Filter:', filter);

  // === RENDER ===

  if (dataLoading) {
    return (
      <div className="em-root" style={{ background: '#1A1D23', minHeight: '100vh', color: '#fff' }}>
        <div className="em-container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '50vh',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ fontSize: '18px' }}>กำลังโหลดข้อมูล...</div>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #333', 
              borderTop: '4px solid #4A90E2', 
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="em-root" style={{ background: '#1A1D23', minHeight: '100vh', color: '#fff' }}>
      <div className="em-container">
        <div className="em-nav" style={{ marginBottom: 24 }}>
          <button 
            className={activePage === 'employee' ? 'em-nav-btn active' : 'em-nav-btn'}
            onClick={() => setActivePage('employee')}
          >
            บุคคล
          </button>
          <button 
            className={activePage === 'department' ? 'em-nav-btn active' : 'em-nav-btn'}
            onClick={() => setActivePage('department')}
          >
            แผนก
          </button>
          <button 
            className={activePage === 'position' ? 'em-nav-btn active' : 'em-nav-btn'}
            onClick={() => setActivePage('position')}
          >
            ตำแหน่ง
          </button>
        </div>

        {/* Main Content */}
        {activePage === 'employee' && (
          <div>
            {/* Controls */}
            <div className="em-controls">
              <button 
                className="em-btn primary" 
                onClick={() => {
                  setForm({ 
                    personId: '', name: '', username: '', password: '', 
                    systemPermis: 'U', rankId: '', departmentId: '', isActive: 1 
                  });
                  setEditingId(null);
                  setShowForm(true);
                }}
              >
                <span style={{ fontSize: 16 }}>+</span> เพิ่มบุคคล
              </button>
              
              <input
                type="text"
                placeholder="ค้นหา ชื่อ, ชื่อผู้ใช้, รหัสบุคคล..."
                className="em-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              
              <select 
                className="em-select" 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">ทั้งหมด</option>
                <option value="Active">ใช้งาน</option>
                <option value="Inactive">ไม่ใช้งาน</option>
                <option value="Admin">ผู้ดูแลระบบ</option>
                <option value="User">ผู้ใช้งาน</option>
              </select>
            </div>

            {/* Employee Table */}
            <div className="em-table-wrap">
              <table className="em-table">
                <thead>
                  <tr>
                    <th>รหัสบุคคล</th>
                    <th>ชื่อ</th>
                    <th>ชื่อผู้ใช้</th>
                    <th>สิทธิ์ระบบ</th>
                    <th>ตำแหน่ง</th>
                    <th>แผนก</th>
                    <th>สถานะ</th>
                    <th className="center">การจัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map(emp => (
                    <tr key={emp.PERSONID || emp.personId}>
                      <td style={{fontFamily: 'monospace', fontWeight: 'bold'}}>{emp.PERSONID || emp.personId}</td>
                      <td>{emp.NAME || emp.name}</td>
                      <td style={{fontFamily: 'monospace'}}>{emp.USERNAME || emp.username}</td>
                      <td>
                        <span style={{
                          background: (emp.SYSTEMPERMIS || emp.systemPermis) === 'A' ? '#FF5722' : '#2196F3',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {(emp.SYSTEMPERMIS || emp.systemPermis) === 'A' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td>{getRankName(emp.RANKID || emp.rankId)}</td>
                      <td>{getDepartmentName(emp.DEPARTMENTID || emp.departmentId)}</td>
                      <td>
                        <span style={{
                          background: (emp.IS_ACTIVE || emp.isActive) === 1 ? '#4CAF50' : '#F44336',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {(emp.IS_ACTIVE || emp.isActive) === 1 ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                        </span>
                      </td>
                      <td className="center">
                        <button className="em-action-btn" onClick={() => handleDetail(emp)}>ดู</button>
                        <button className="em-action-btn" onClick={() => handleEdit(emp)}>แก้ไข</button>
                        <button className="em-action-btn delete" onClick={() => handleDelete(emp.PERSONID || emp.personId)}>ลบ</button>
                      </td>
                    </tr>
                  ))}
                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan={8}>
                        <div className="em-empty-state">
                          <h3>ไม่พบข้อมูลบุคคล</h3>
                          <p>ไม่มีข้อมูลที่ตรงกับการค้นหา</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Department Management */}
        {activePage === 'department' && <DepartmentManager />}

        {/* Position Management */}
        {activePage === 'position' && <PositionManager />}

        {/* Employee Form Modal */}
        {showForm && (
          <div className="em-modal-overlay">
            <div className="em-modal">
              <div className="em-modal-header">
                <h2>{editingId ? 'แก้ไขข้อมูลบุคคล' : 'เพิ่มบุคคลใหม่'}</h2>
                <button 
                  className="em-modal-close" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormErrors({});
                  }}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={editingId ? handleUpdate : handleAdd}>
                <div className="em-modal-body">
                  <div className="em-form-row">
                    <div className="em-form-group">
                      <label className="em-input-label">รหัสบุคคล</label>
                      <input 
                        name="personId"
                        value={form.personId} 
                        onChange={handleChange}
                        placeholder={editingId ? "ไม่สามารถแก้ไขได้" : "เช่น P000000009 (ว่างเปล่า = สร้างอัตโนมัติ)"}
                        className={`em-modal-input ${formErrors.personId ? 'error' : ''}`}
                        maxLength={10}
                        disabled={editingId !== null}
                      />
                      {formErrors.personId && <span className="em-error">{formErrors.personId}</span>}
                    </div>
                  </div>

                  <div className="em-form-row">
                    <div className="em-form-group">
                      <label className="em-input-label">ชื่อ-นามสกุล</label>
                      <input 
                        name="name"
                        value={form.name} 
                        onChange={handleChange}
                        placeholder="ชื่อ-นามสกุล" 
                        className={`em-modal-input ${formErrors.name ? 'error' : ''}`}
                        maxLength={50}
                      />
                      {formErrors.name && <span className="em-error">{formErrors.name}</span>}
                    </div>
                  </div>

                  <div className="em-form-row">
                    <div className="em-form-group">
                      <label className="em-input-label">ชื่อผู้ใช้</label>
                      <input 
                        name="username"
                        value={form.username} 
                        onChange={handleChange}
                        placeholder="ชื่อผู้ใช้" 
                        className={`em-modal-input ${formErrors.username ? 'error' : ''}`}
                        maxLength={30}
                      />
                      {formErrors.username && <span className="em-error">{formErrors.username}</span>}
                    </div>
                    <div className="em-form-group">
                      <label className="em-input-label">รหัสผ่าน</label>
                      <input 
                        name="password"
                        type="password"
                        value={form.password} 
                        onChange={handleChange}
                        placeholder="รหัสผ่าน" 
                        className={`em-modal-input ${formErrors.password ? 'error' : ''}`}
                        maxLength={30}
                      />
                      {formErrors.password && <span className="em-error">{formErrors.password}</span>}
                    </div>
                  </div>

                  <div className="em-form-row">
                    <div className="em-form-group">
                      <label className="em-input-label">สิทธิ์ระบบ</label>
                      <select 
                        name="systemPermis"
                        value={form.systemPermis} 
                        onChange={handleChange}
                        className="em-modal-input"
                      >
                        <option value="U">ผู้ใช้งาน (User)</option>
                        <option value="A">ผู้ดูแลระบบ (Admin)</option>
                      </select>
                    </div>
                    <div className="em-form-group">
                      <label className="em-input-label">สถานะ</label>
                      <select 
                        name="isActive"
                        value={form.isActive} 
                        onChange={handleChange}
                        className="em-modal-input"
                      >
                        <option value={1}>ใช้งาน</option>
                        <option value={0}>ไม่ใช้งาน</option>
                      </select>
                    </div>
                  </div>

                  <div className="em-form-row">
                    <div className="em-form-group">
                      <label className="em-input-label">ตำแหน่ง</label>
                      <select 
                        name="rankId"
                        value={form.rankId} 
                        onChange={handleChange}
                        className="em-modal-input"
                      >
                        <option value="">-- เลือกตำแหน่ง --</option>
                        {ranks.filter(r => r.isActive === 1).map(rank => (
                          <option key={rank.rankId} value={rank.rankId}>
                            {rank.name} ({rank.rankId})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="em-form-group">
                      <label className="em-input-label">แผนก</label>
                      <select 
                        name="departmentId"
                        value={form.departmentId} 
                        onChange={handleChange}
                        className="em-modal-input"
                      >
                        <option value="">-- เลือกแผนก --</option>
                        {departments.filter(d => d.isActive === 1).map(dept => (
                          <option key={dept.departmentId} value={dept.departmentId}>
                            {dept.name} ({dept.departmentId})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="em-modal-footer">
                  <button type="submit" className="em-modal-btn" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="em-loading"></span>
                        {editingId ? 'กำลังบันทึก...' : 'กำลังเพิ่ม...'}
                      </>
                    ) : (
                      editingId ? 'บันทึก' : 'เพิ่ม'
                    )}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormErrors({});
                    }}
                    className="em-modal-btn cancel"
                    disabled={loading}
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Employee Detail Modal */}
        {showDetail && detailEmp && (
          <div className="em-modal-overlay">
            <div className="em-modal">
              <div className="em-modal-header">
                <h2>รายละเอียดบุคคล</h2>
                <button 
                  className="em-modal-close" 
                  onClick={() => {
                    setShowDetail(false);
                    setDetailEmp(null);
                  }}
                >
                  ×
                </button>
              </div>
              
              <div className="em-modal-body">
                <div className="em-detail-grid">
                  <div className="em-detail-item">
                    <span className="em-detail-label">รหัสบุคคล:</span>
                    <span className="em-detail-value" style={{fontFamily: 'monospace', fontWeight: 'bold'}}>
                      {detailEmp.personId}
                    </span>
                  </div>
                  <div className="em-detail-item">
                    <span className="em-detail-label">ชื่อ-นามสกุล:</span>
                    <span className="em-detail-value">{detailEmp.name}</span>
                  </div>
                  <div className="em-detail-item">
                    <span className="em-detail-label">ชื่อผู้ใช้:</span>
                    <span className="em-detail-value" style={{fontFamily: 'monospace'}}>
                      {detailEmp.username}
                    </span>
                  </div>
                  <div className="em-detail-item">
                    <span className="em-detail-label">สิทธิ์ระบบ:</span>
                    <span className="em-detail-value">
                      <span style={{
                        background: detailEmp.systemPermis === 'A' ? '#FF5722' : '#2196F3',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {getSystemPermissionText(detailEmp.systemPermis)}
                      </span>
                    </span>
                  </div>
                  <div className="em-detail-item">
                    <span className="em-detail-label">ตำแหน่ง:</span>
                    <span className="em-detail-value">
                      {getRankName(detailEmp.rankId)} 
                      {detailEmp.rankId && <span style={{color: '#888', marginLeft: 8}}>({detailEmp.rankId})</span>}
                    </span>
                  </div>
                  <div className="em-detail-item">
                    <span className="em-detail-label">แผนก:</span>
                    <span className="em-detail-value">
                      {getDepartmentName(detailEmp.departmentId)} 
                      {detailEmp.departmentId && <span style={{color: '#888', marginLeft: 8}}>({detailEmp.departmentId})</span>}
                    </span>
                  </div>
                  <div className="em-detail-item">
                    <span className="em-detail-label">สถานะ:</span>
                    <span className="em-detail-value">
                      <span style={{
                        background: detailEmp.isActive === 1 ? '#4CAF50' : '#F44336',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {detailEmp.isActive === 1 ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="em-modal-footer">
                <button 
                  className="em-modal-btn"
                  onClick={() => {
                    setShowDetail(false);
                    setDetailEmp(null);
                  }}
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toast && (
          <div className={`em-toast ${toast.type}`}>
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}

export default PersonPage;