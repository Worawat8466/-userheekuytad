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

  // === FORM HANDLERS ===
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // === UTILITY FUNCTIONS ===
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // === CRUD OPERATIONS ===
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.username || !form.rankId || !form.departmentId) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/persons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          username: form.username,
          rankId: parseInt(form.rankId),
          departmentId: parseInt(form.departmentId)
        }),
      });
      
      if (response.ok) {
        await fetchPersons();
        setForm({ id: '', name: '', rankId: '', departmentId: '', username: '' });
        setShowForm(false);
        showToast('เพิ่มพนักงานเรียบร้อยแล้ว');
      } else {
        showToast('เกิดข้อผิดพลาดในการเพิ่มข้อมูล');
      }
    } catch (error) {
      console.error('Error adding person:', error);
      showToast('เกิดข้อผิดพลาดในการเพิ่มข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (person) => {
    setEditingId(person.personId || person.id);
    setForm({ 
      id: person.personId || person.id,
      name: person.name || '', 
      rankId: person.rankId || '', 
      departmentId: person.departmentId || '',
      username: person.username || ''
    });
    setShowForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.username || !form.rankId || !form.departmentId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/persons/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          username: form.username,
          rankId: parseInt(form.rankId),
          departmentId: parseInt(form.departmentId)
        }),
      });
      
      if (response.ok) {
        await fetchPersons();
        setEditingId(null);
        setForm({ id: '', name: '', rankId: '', departmentId: '', username: '' });
        setShowForm(false);
        showToast('แก้ไขข้อมูลเรียบร้อยแล้ว');
      } else {
        showToast('เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
      }
    } catch (error) {
      console.error('Error updating person:', error);
      showToast('เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('ยืนยันการลบพนักงานนี้?')) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/persons/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await fetchPersons();
        showToast('ลบข้อมูลเรียบร้อยแล้ว');
      } else {
        showToast('เกิดข้อผิดพลาดในการลบข้อมูล');
      }
    } catch (error) {
      console.error('Error deleting person:', error);
      showToast('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  // === DATA FILTERING ===
  const filteredEmployees = persons.filter((person) => {
    const rankName = getRankName(person.rankId || person.RANKID);
    const username = person.username || person.USERNAME || '';
    
    const matchesFilter = filter === 'All' || rankName === filter;
    const matchesSearch = 
      username.toLowerCase().includes(search.toLowerCase()) || 
      (person.name || person.NAME || '').toLowerCase().includes(search.toLowerCase());
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
                  id: '',
                  name: '', 
                  username: '',
                  rankId: '', 
                  departmentId: ''
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
              {ranks.map(rank => (
                <option key={rank.rankId} value={rank.name}>{rank.name}</option>
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
                <th>ยศ</th>
                <th>แผนก</th>
                <th className="center">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(person => {
                return (
                  <tr key={person.personId || person.id}>
                    <td>{person.username || person.USERNAME}</td>
                    <td>{person.name || person.NAME}</td>
                    <td>{getRankName(person.rankId || person.RANKID)}</td>
                    <td>{getDepartmentName(person.departmentId || person.DEPARTMENTID)}</td>
                    <td className="center">
                      <button 
                        className="em-action-btn" 
                        onClick={() => handleEdit(person)}
                      >
                        แก้ไข
                      </button>
                      <button 
                        className="em-action-btn view" 
                        onClick={() => { 
                          setDetailEmp(person); 
                          setShowDetail(true); 
                        }}
                      >
                        ดูข้อมูล
                      </button>
                      <button 
                        className="em-action-btn delete" 
                        onClick={() => handleDelete(person.personId || person.id)}
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={5}>
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

                  <label className="em-input-label">Username</label>
                  <input 
                    name="username" 
                    placeholder="Username" 
                    value={form.username} 
                    onChange={handleChange} 
                    className="em-modal-input" 
                    required 
                  />
                </div>

                {/* Right Column */}
                <div className="em-modal-col">
                  <label className="em-input-label">ยศ</label>
                  <select 
                    name="rankId" 
                    value={form.rankId} 
                    onChange={handleChange} 
                    className="em-modal-select" 
                    required
                  >
                    <option value="">เลือกยศ</option>
                    {ranks.map(r => (
                      <option key={r.rankId} value={r.rankId}>{r.name}</option>
                    ))}
                  </select>

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
                      <option key={d.departmentId} value={d.departmentId}>{d.name}</option>
                    ))}
                  </select>
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
                      rankId: '', 
                      departmentId: '', 
                      username: ''
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
        {showDetail && detailEmp && (
          <div className="em-modal-bg">
            <div className="em-modal em-modal--wide">
              <div className="em-modal-title">ข้อมูลบุคคล</div>
              
              <div className="em-modal-grid">
                <div className="em-modal-col">
                  <div><b>ID:</b> {detailEmp.personId || detailEmp.id}</div>
                  <div><b>ชื่อ-นามสกุล:</b> {detailEmp.name || detailEmp.NAME}</div>
                  <div><b>Username:</b> {detailEmp.username || detailEmp.USERNAME || 'ไม่ข้อมูล'}</div>
                </div>
                <div className="em-modal-col">
                  <div><b>ยศ:</b> {getRankName(detailEmp.rankId || detailEmp.RANKID)}</div>
                  <div><b>แผนก:</b> {getDepartmentName(detailEmp.departmentId || detailEmp.DEPARTMENTID)}</div>
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
        )}

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
