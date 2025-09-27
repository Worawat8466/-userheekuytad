// === IMPORTS ===
import React, { useState } from 'react';
import DepartmentManager from '../components/DepartmentManager';
import PositionManager from '../components/PositionManager';
import './PersonPage.css';

// === CONSTANTS & INITIAL DATA ===

// Person data matching database structure
const initialEmployees = [
  {
    personId: 'P000000001',
    name: 'Alice Johnson',
    username: 'ajohnson',
    password: 'pass123',
    systemPermis: 'A', // A = Admin, U = User
    rankId: 'RANK4',
    departmentId: 'DEPT2',
    isActive: 1
  },
  {
    personId: 'P000000002',
    name: 'Bob Smith',
    username: 'bsmith',
    password: 'securepwd',
    systemPermis: 'U',
    rankId: 'RANK3',
    departmentId: 'DEPT1',
    isActive: 1
  },
  {
    personId: 'P000000003',
    name: 'Charlie Brown',
    username: 'cbrown',
    password: 'charlie1',
    systemPermis: 'U',
    rankId: 'RANK2',
    departmentId: 'DEPT3',
    isActive: 1
  },
  {
    personId: 'P000000004',
    name: 'Dana Scully',
    username: 'dscully',
    password: 'trustno1',
    systemPermis: 'U',
    rankId: 'RANK1',
    departmentId: 'DEPT4',
    isActive: 1
  },
  {
    personId: 'P000000005',
    name: 'Eve Adams',
    username: 'eadams',
    password: 'secret00',
    systemPermis: 'U',
    rankId: 'RANK1',
    departmentId: 'DEPT1',
    isActive: 0
  },
  {
    personId: 'P000000006',
    name: 'Frank Martin',
    username: 'fmartin',
    password: 'delivery',
    systemPermis: 'U',
    rankId: 'RANK4',
    departmentId: 'DEPT1',
    isActive: 1
  },
  {
    personId: 'P000000007',
    name: 'Grace Hopper',
    username: 'ghopper',
    password: 'bugless',
    systemPermis: 'U',
    rankId: 'RANK2',
    departmentId: 'DEPT2',
    isActive: 1
  },
  {
    personId: 'P000000008',
    name: 'Heidi Klum',
    username: 'hklum',
    password: 'modelpw',
    systemPermis: 'U',
    rankId: null, // null value as shown in database
    departmentId: 'DEPT3',
    isActive: 1
  }
];

// Reference data from related tables
const initialRanks = [
  { rankId: 'RANK1', name: 'Entry Level', isActive: 1 },
  { rankId: 'RANK2', name: 'Senior Staff', isActive: 1 },
  { rankId: 'RANK3', name: 'Manager', isActive: 1 },
  { rankId: 'RANK4', name: 'Director', isActive: 1 },
  { rankId: 'RANK5', name: 'Intern', isActive: 0 }
];

const initialDepartments = [
  { departmentId: 'DEPT1', name: 'Sales', isActive: 1 },
  { departmentId: 'DEPT2', name: 'IT', isActive: 1 },
  { departmentId: 'DEPT3', name: 'Human Resources', isActive: 1 },
  { departmentId: 'DEPT4', name: 'Finance', isActive: 1 }
];

function PersonPage() {
  // === NAVIGATION STATE ===
  const [activePage, setActivePage] = useState('employee');

  // === EMPLOYEE DATA STATE ===
  const [employees, setEmployees] = useState(initialEmployees);
  const [ranks, setRanks] = useState(initialRanks);
  const [departments, setDepartments] = useState(initialDepartments);
  
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

  const generatePersonId = () => {
    const maxId = Math.max(...employees.map(emp => parseInt(emp.personId.substring(1))));
    const nextId = maxId + 1;
    return 'P' + nextId.toString().padStart(9, '0');
  };

  // === FORM HANDLERS ===
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (index, value) => {
    const phones = [...form.phones];
    phones[index] = value;
    setForm({ ...form, phones });
  };

  const addPhone = () => {
    setForm({ ...form, phones: [...form.phones, ''] });
  };

  const removePhone = (index) => {
    const phones = form.phones.filter((_, i) => i !== index);
    setForm({ ...form, phones: phones.length ? phones : [''] });
  };

  // === VALIDATION FUNCTIONS ===
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    const digits = (phone || '').replace(/[^0-9]/g, '');
    return digits.length >= 7;
  };

  const validateForm = () => {
    const errors = { 
      name: '', username: '', password: '', 
      positionId: '', departmentId: '' 
    };
    
    if (!form.name || form.name.trim() === '') {
      errors.name = 'โปรดระบุชื่อ';
    }
    if (!form.username || form.username.trim().length < 3) {
      errors.username = 'โปรดระบุ Username อย่างน้อย 3 ตัวอักษร';
    }
    if (!form.password || form.password.length < 6) {
      errors.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    }
    if (!form.positionId) {
      errors.positionId = 'โปรดเลือกตำแหน่ง';
    }
    if (!form.departmentId) {
      errors.departmentId = 'โปรดเลือกแผนก';
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
    if (!form.name || !form.username || !form.password || !form.positionId || !form.departmentId) return;
    if (!validateForm()) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newPersonId = Date.now();
    const newAuthId = Date.now() + 1;
    
    // เพิ่มข้อมูลบุคคล
    const newEmployee = {
      id: newPersonId,
      name: form.name,
      positionId: parseInt(form.positionId),
      departmentId: parseInt(form.departmentId),
      authenticationId: newAuthId,
    };
    
    // เพิ่มข้อมูลการอนุญาตใช้งาน
    const newAuth = {
      id: newAuthId,
      username: form.username,
      password: form.password,
      personId: newPersonId,
    };
    
    setEmployees([...employees, newEmployee]);
    setAuthentications([...authentications, newAuth]);
    
    setForm({ id: '', name: '', positionId: '', departmentId: '', username: '', password: '' });
    setShowForm(false);
    setLoading(false);
    showToast('เพิ่มพนักงานเรียบร้อยแล้ว');
  };

  const handleEdit = (emp) => {
    setEditingId(emp.id);
    const auth = getAuthentication(emp.authenticationId);
    setForm({ 
      id: emp.id,
      name: emp.name || '', 
      positionId: emp.positionId || '', 
      departmentId: emp.departmentId || '',
      username: auth ? auth.username : '',
      password: auth ? auth.password : ''
    });
    setShowForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // อัปเดตข้อมูลบุคคล
    setEmployees(employees.map((emp) =>
      emp.id === editingId
        ? { 
            ...emp, 
            name: form.name,
            positionId: parseInt(form.positionId),
            departmentId: parseInt(form.departmentId)
          }
        : emp
    ));
    
    // อัปเดตข้อมูลการอนุญาตใช้งาน
    const currentEmp = employees.find(emp => emp.id === editingId);
    if (currentEmp) {
      setAuthentications(authentications.map((auth) =>
        auth.id === currentEmp.authenticationId
          ? {
              ...auth,
              username: form.username,
              password: form.password
            }
          : auth
      ));
    }
    
    setEditingId(null);
    setForm({ id: '', name: '', positionId: '', departmentId: '', username: '', password: '' });
    setShowForm(false);
    setLoading(false);
    showToast('แก้ไขข้อมูลเรียบร้อยแล้ว');
  };

  const handleDelete = (id) => {
    if (!window.confirm('ยืนยันการลบพนักงานนี้?')) return;
    
    // หาข้อมูลการอนุญาตที่เกี่ยวข้อง
    const empToDelete = employees.find(emp => emp.id === id);
    
    // ลบข้อมูลบุคคล
    setEmployees(employees.filter((emp) => emp.id !== id));
    
    // ลบข้อมูลการอนุญาตที่เกี่ยวข้อง
    if (empToDelete) {
      setAuthentications(authentications.filter(auth => auth.id !== empToDelete.authenticationId));
    }
    
    showToast('ลบข้อมูลเรียบร้อยแล้ว');
  };

  // === DATA FILTERING ===
  const filteredEmployees = employees.filter((emp) => {
    const positionName = getPositionName(emp.positionId);
    const auth = getAuthentication(emp.authenticationId);
    const username = auth ? auth.username : '';
    
    const matchesFilter = filter === 'All' || positionName === filter;
    const matchesSearch = 
      username.includes(search) || 
      emp.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });



  // === RENDER ===
  return (
    <>
      {/* Navigation Tabs */}
      <div className="em-top-btns">
        <button 
          onClick={() => setActivePage('employee')} 
          className={`em-btn${activePage === 'employee' ? ' primary' : ''}`}
        >
          Person
        </button>
        <button 
          onClick={() => setActivePage('department')} 
          className={`em-btn${activePage === 'department' ? ' primary' : ''}`}
        >
          Department
        </button>
        <button 
          onClick={() => setActivePage('position')} 
          className={`em-btn${activePage === 'position' ? ' primary' : ''}`}
        >
          Position
        </button>
        
        {/* Employee Page Controls */}
        {activePage === 'employee' && (
          <>
            <div style={{ flex: 1 }} />
            <button 
              onClick={() => { 
                setShowForm(true); 
                setEditingId(null); 
                setForm({ 
                  username: '', 
                  password: '', 
                  name: '', 
                  phones: [''], 
                  email: '', 
                  position: '', 
                  department: '' 
                }); 
              }} 
              className="em-btn primary" 
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <span style={{ fontSize: 20 }}>+</span> Add Person
            </button>
            <input
              type="text"
              placeholder="ค้นหา"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="em-search"
            />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)} 
              className="em-select"
            >
              <option value="All">All</option>
              {positions.map(pos => (
                <option key={pos.id} value={pos.name}>{pos.name}</option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* Employee Table */}
      {activePage === 'employee' && (
        <div className="em-table-wrap">
          <table className="em-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>ชื่อ</th>
                <th>แผนก</th>
                <th className="center">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => {
                const auth = getAuthentication(emp.authenticationId);
                return (
                  <tr key={emp.id}>
                    <td>{auth ? auth.username : 'ไม่ข้อมูล'}</td>
                    <td>{emp.name}</td>
                    <td>{getDepartmentName(emp.departmentId)}</td>
                    <td className="center">
                      <button 
                        className="em-action-btn" 
                        onClick={() => handleEdit(emp)}
                      >
                        แก้ไข
                      </button>
                      <button 
                        className="em-action-btn view" 
                        onClick={() => { 
                          setDetailEmp(emp); 
                          setShowDetail(true); 
                        }}
                      >
                        ดูข้อมูล
                      </button>
                      <button 
                        className="em-action-btn delete" 
                        onClick={() => handleDelete(emp.id)}
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={4}>
                    <div className="em-empty-state">
                      <h3>ไม่พบข้อมูลพนักงาน</h3>
                      <p>ลองปรับเปลี่ยนคำค้นหาหรือตัวกรอง หรือเพิ่มพนักงานใหม่</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Department & Position Management */}
      {activePage === 'department' && <DepartmentManager />}
      {activePage === 'position' && <PositionManager />}

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="em-modal-bg">
            <form 
              onSubmit={editingId ? handleUpdate : handleAdd} 
              className="em-modal em-modal--wide"
            >
              <div className="em-modal-title">
                {editingId ? 'แก้ไขข้อมูลบุคคล' : 'เพิ่มบุคคล'}
              </div>
              
              <div className="em-modal-grid">
                {/* Left Column */}
                <div className="em-modal-col">
                  <label className="em-input-label">ชื่อ-นามสกุล</label>
                  <input 
                    name="name" 
                    placeholder="ชื่อ-นามสกุล" 
                    value={form.name} 
                    onChange={handleChange} 
                    className="em-modal-input" 
                    required 
                  />
                  {formErrors.name && (
                    <div className="em-error">{formErrors.name}</div>
                  )}

                  <label className="em-input-label">Username</label>
                  <input 
                    name="username" 
                    placeholder="Username" 
                    value={form.username} 
                    onChange={handleChange} 
                    className="em-modal-input" 
                    required 
                  />
                  {formErrors.username && (
                    <div className="em-error">{formErrors.username}</div>
                  )}

                  <label className="em-input-label">รหัสผ่าน</label>
                  <input 
                    name="password" 
                    type="password"
                    placeholder="Password" 
                    value={form.password} 
                    onChange={handleChange} 
                    className="em-modal-input" 
                    required 
                  />
                  {formErrors.password && (
                    <div className="em-error">{formErrors.password}</div>
                  )}
                </div>

                {/* Right Column */}
                <div className="em-modal-col">
                  <label className="em-input-label">ตำแหน่ง</label>
                  <select 
                    name="positionId" 
                    value={form.positionId} 
                    onChange={handleChange} 
                    className="em-modal-select" 
                    required
                  >
                    <option value="">เลือกตำแหน่ง</option>
                    {positions.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  {formErrors.positionId && (
                    <div className="em-error">{formErrors.positionId}</div>
                  )}

                  <label className="em-input-label">แผนก</label>
                  <select 
                    name="departmentId" 
                    value={form.departmentId} 
                    onChange={handleChange} 
                    className="em-modal-select" 
                    required
                  >
                    <option value="">เลือกแผนก</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  {formErrors.departmentId && (
                    <div className="em-error">{formErrors.departmentId}</div>
                  )}

                  {/* แสดงสิทธิ์ของตำแหน่ง */}
                  {form.positionId && (
                    <div>
                      <label className="em-input-label">สิทธิ์ของตำแหน่ง</label>
                      <div style={{ 
                        background: '#181A20', 
                        padding: 8, 
                        borderRadius: 4, 
                        fontSize: 12 
                      }}>
                        {getPersonPermissions(parseInt(form.positionId)).map(perm => (
                          <div key={perm.id} style={{ marginBottom: 4 }}>
                            • {perm.name}: {perm.description}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="em-modal-btns">
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
                    setForm({ 
                      id: '', 
                      name: '', 
                      positionId: '', 
                      departmentId: '', 
                      username: '', 
                      password: '' 
                    }); 
                  }} 
                  className="em-modal-btn cancel" 
                  disabled={loading}
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Employee Detail Modal */}
        {showDetail && detailEmp && (() => {
          const auth = getAuthentication(detailEmp.authenticationId);
          const permissions = getPersonPermissions(detailEmp.positionId);
          
          return (
            <div className="em-modal-bg">
              <div className="em-modal em-modal--wide">
                <div className="em-modal-title">ข้อมูลบุคคล</div>
                
                <div className="em-modal-grid">
                  <div className="em-modal-col">
                    <div><b>ID:</b> {detailEmp.id}</div>
                    <div><b>ชื่อ-นามสกุล:</b> {detailEmp.name}</div>
                    <div><b>Username:</b> {auth ? auth.username : 'ไม่ข้อมูล'}</div>
                    <div><b>รหัสผ่าน:</b> {auth ? auth.password : 'ไม่ข้อมูล'}</div>
                  </div>
                  <div className="em-modal-col">
                    <div><b>ตำแหน่ง:</b> {getPositionName(detailEmp.positionId)}</div>
                    <div><b>แผนก:</b> {getDepartmentName(detailEmp.departmentId)}</div>
                    <div>
                      <b>สิทธิ์:</b>
                      <div style={{ marginTop: 8, fontSize: 14 }}>
                        {permissions.map(perm => (
                          <div key={perm.id} style={{ 
                            background: '#0A3D2E', 
                            padding: '4px 8px', 
                            borderRadius: 4, 
                            marginBottom: 4, 
                            display: 'inline-block',
                            marginRight: 8
                          }}>
                            {perm.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="em-modal-btns">
                  <button 
                    type="button" 
                    onClick={() => { 
                      setShowDetail(false); 
                      setDetailEmp(null); 
                    }} 
                    className="em-modal-btn cancel"
                  >
                    ปิด
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Toast Notification */}
        {toast && (
          <div className={`em-toast ${toast.type}`}>
            {toast.message}
          </div>
        )}
    </>
  );
}

export default PersonPage;
