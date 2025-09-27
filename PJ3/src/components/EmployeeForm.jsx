import React from 'react';
import { positions, departments } from './constants';

// ฟอร์มเพิ่ม/แก้ไขพนักงาน
const EmployeeForm = ({
  form,
  formErrors,
  editingId,
  onSubmit,
  onCancel,
  onFormChange,
  onPhoneChange
}) => (
  <div className="em-modal-bg">
    <form onSubmit={onSubmit} className="em-modal em-modal--wide">
      <div className="em-modal-title">
        {editingId ? 'แก้ไขข้อมูลบุคคล' : 'เพิ่มบุคคล'}
      </div>
      
      <div className="em-modal-grid">
        {/* คอลัมน์ซ้าย */}
        <div className="em-modal-col">
          <label className="em-input-label">Username</label>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={onFormChange}
            className="em-modal-input"
            required
          />
          {formErrors.username && <div className="em-error">{formErrors.username}</div>}

          <label className="em-input-label">ชื่อ</label>
          <input
            name="name"
            placeholder="ชื่อ"
            value={form.name}
            onChange={onFormChange}
            className="em-modal-input"
            required
          />
          {formErrors.name && <div className="em-error">{formErrors.name}</div>}

          <label className="em-input-label">เบอร์โทร</label>
          <input
            placeholder="เบอร์โทร"
            value={form.phones[0]}
            onChange={(e) => onPhoneChange(0, e.target.value)}
            className="em-modal-input"
            required
          />
          {formErrors.phone && <div className="em-error">{formErrors.phone}</div>}

          <label className="em-input-label">อีเมล</label>
          <input
            name="email"
            placeholder="อีเมล"
            value={form.email}
            onChange={onFormChange}
            className="em-modal-input"
            required
          />
          {formErrors.email && <div className="em-error">{formErrors.email}</div>}
        </div>

        {/* คอลัมน์ขวา */}
        <div className="em-modal-col">
          <label className="em-input-label">รหัสผ่าน</label>
          <input
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={onFormChange}
            className="em-modal-input"
            required
          />
          {formErrors.password && <div className="em-error">{formErrors.password}</div>}

          <label className="em-input-label">ตำแหน่ง</label>
          <select
            name="position"
            value={form.position}
            onChange={onFormChange}
            className="em-modal-select"
            required
          >
            <option value="">เลือกตำแหน่ง</option>
            {positions.filter(p => p !== 'All').map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {formErrors.position && <div className="em-error">{formErrors.position}</div>}

          <label className="em-input-label">แผนก</label>
          <select
            name="department"
            value={form.department}
            onChange={onFormChange}
            className="em-modal-select"
            required
          >
            <option value="">เลือกแผนก</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {formErrors.department && <div className="em-error">{formErrors.department}</div>}
        </div>
      </div>

      <div className="em-modal-btns">
        <button type="submit" className="em-modal-btn">
          {editingId ? 'บันทึก' : 'เพิ่ม'}
        </button>
        <button type="button" onClick={onCancel} className="em-modal-btn cancel">
          ยกเลิก
        </button>
      </div>
    </form>
  </div>
);

export default EmployeeForm;