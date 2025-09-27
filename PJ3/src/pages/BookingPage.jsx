import React from 'react';

// หน้า Booking - การจอง
function BookingPage() {
  return (
    <div style={{ padding: 32, color: '#fff' }}>
      <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 'bold' }}>
        การจอง (Booking)
      </h2>
      <div style={{ 
        background: '#23252B', 
        padding: 24, 
        borderRadius: 12,
        textAlign: 'center' 
      }}>
        <p style={{ fontSize: 18, marginBottom: 16 }}>
          🎫 ระบบจองตั้วรถ
        </p>
        <p style={{ color: '#888' }}>
          ฟีเจอร์นี้กำลังพัฒนา - Coming Soon
        </p>
      </div>
    </div>
  );
}

export default BookingPage;