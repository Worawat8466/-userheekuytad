import React from 'react';

// ส่วน Header ของตาราง
const EmployeeTableHeader = () => (
  <thead>
    <tr>
      <th>Username</th>
      <th>ชื่อ</th>
      <th>แผนก</th>
      <th className="center">การจัดการ</th>
    </tr>
  </thead>
);

// แถวของตาราง
const EmployeeTableRow = ({ employee, onEdit, onView, onDelete }) => (
  <tr key={employee.id}>
    <td>{employee.username}</td>
    <td>{employee.name}</td>
    <td>{employee.department || '-'}</td>
    <td className="center">
      <button className="em-action-btn" onClick={() => onEdit(employee)}>
        แก้ไข
      </button>
      <button className="em-action-btn view" onClick={() => onView(employee)}>
        ดูข้อมูล
      </button>
      <button className="em-action-btn delete" onClick={() => onDelete(employee.id)}>
        ลบ
      </button>
    </td>
  </tr>
);

// แถวเมื่อไม่มีข้อมูล
const EmptyTableRow = () => (
  <tr>
    <td colSpan={4} style={{ textAlign: 'center', padding: '24px 0', color: '#888' }}>
      ไม่มีข้อมูลพนักงาน
    </td>
  </tr>
);

// ตารางพนักงานแบบครบชุด
const EmployeeTable = ({ employees, onEdit, onView, onDelete }) => (
  <div className="em-table-wrap">
    <table className="em-table">
      <EmployeeTableHeader />
      <tbody>
        {employees.length > 0 ? (
          employees.map(emp => (
            <EmployeeTableRow
              key={emp.id}
              employee={emp}
              onEdit={onEdit}
              onView={onView}
              onDelete={onDelete}
            />
          ))
        ) : (
          <EmptyTableRow />
        )}
      </tbody>
    </table>
  </div>
);

export default EmployeeTable;