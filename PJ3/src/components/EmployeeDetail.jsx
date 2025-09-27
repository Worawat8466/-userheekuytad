import React from 'react';

// รายละเอียดพนักงาน
const EmployeeDetail = ({ employee, onClose }) => (
  <div className="em-modal-bg">
    <div className="em-modal em-modal--wide">
      <div className="em-modal-title">ข้อมูลบุคคล</div>
      
      <div className="em-modal-grid">
        <div className="em-modal-col">
          <div><b>Username:</b> {employee.username}</div>
          <div><b>ชื่อ:</b> {employee.name}</div>
        </div>
        <div className="em-modal-col">
          <div><b>ตำแหน่ง:</b> {employee.position}</div>
          <div><b>แผนก:</b> {employee.department}</div>
          <div><b>รหัสผ่าน:</b> {employee.password}</div>
        </div>
      </div>
      
      <div className="em-modal-btns">
        <button type="button" onClick={onClose} className="em-modal-btn cancel">
          ปิด
        </button>
      </div>
    </div>
  </div>
);

export default EmployeeDetail;