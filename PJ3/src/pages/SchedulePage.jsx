import React from 'react';

// หน้า Schedule - ตารางเวลา
function SchedulePage() {
  return (
    <div style={{ padding: 32, color: '#fff' }}>
      <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 'bold' }}>
        ตารางเวลา (Schedule)
      </h2>
      <div style={{ 
        background: '#23252B', 
        padding: 24, 
        borderRadius: 12,
        textAlign: 'center' 
      }}>
        <p style={{ fontSize: 18, marginBottom: 16 }}>
          🚌 ระบบจัดการตารางเวลารถ
        </p>
        <p style={{ color: '#888' }}>
          ฟีเจอร์นี้กำลังพัฒนา - Coming Soon
        </p>
      </div>
    </div>
  );
}

export default SchedulePage;