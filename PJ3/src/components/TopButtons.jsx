import React from 'react';
import { positions } from './constants';

// ปุ่มส่วนบน
const TopButtons = ({
  activePage,
  setActivePage,
  onAddEmployee,
  search,
  setSearch,
  filter,
  setFilter
}) => (
  <div className="em-top-btns">
    <button
      onClick={() => setActivePage('employee')}
      className={`em-btn${activePage === 'employee' ? ' primary' : ''}`}
    >
      บุคคล
    </button>
    <button
      onClick={() => setActivePage('department')}
      className={`em-btn${activePage === 'department' ? ' primary' : ''}`}
    >
      แผนก
    </button>
    <button
      onClick={() => setActivePage('position')}
      className={`em-btn${activePage === 'position' ? ' primary' : ''}`}
    >
      ตำแหน่ง
    </button>

    {activePage === 'employee' && (
      <>
        <div style={{ flex: 1 }} />
        <button
          onClick={onAddEmployee}
          className="em-btn primary"
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <span style={{ fontSize: 20 }}>+</span> เพิ่มบุคคล
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
          {positions.map(pos => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
        </select>
      </>
    )}
  </div>
);

export default TopButtons;