// === IMPORTS ===
import React from 'react';

// === SCHEDULE PAGE COMPONENT ===
function SchedulePage() {
  // === RENDER ===
  return (
    <div style={{ padding: 32, color: '#fff' }}>
      {/* Page Header */}
      <h2 style={{ 
        marginBottom: 24, 
        fontSize: 24, 
        fontWeight: 'bold' 
      }}>
        ตารางเวลา (Schedule)
      </h2>
      
      {/* Content Area */}
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