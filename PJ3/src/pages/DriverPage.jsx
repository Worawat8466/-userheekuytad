import React, { useState } from 'react';

// === INITIAL DATA ===
const initialDrivers = [
  {
    id: 1,
    personId: 1, // Foreign Key to Person entity
    licenseNumber: 'DL123456789',
    licenseType: 'PUBLIC_TRANSPORT',
    experienceYears: 5,
    status: 'ACTIVE'
  },
  {
    id: 2,
    personId: 2,
    licenseNumber: 'DL987654321',
    licenseType: 'COMMERCIAL',
    experienceYears: 8,
    status: 'ACTIVE'
  }
];

const initialPersons = [
  { id: 1, name: 'สมชาย ใจดี' },
  { id: 2, name: 'สุดา สวยงาม' }
];

// หน้า Driver - คนขับ
function DriverPage() {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [persons, setPersons] = useState(initialPersons);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const getPersonName = (personId) => {
    const person = persons.find(p => p.id === personId);
    return person ? person.name : 'ไม่ระบุ';
  };

  return (
    <div style={{ padding: 32, color: '#fff' }}>
      <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 'bold' }}>
        คนขับ (Driver)
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Driver List */}
        <div style={{ background: '#23252B', padding: 24, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16, fontSize: 18 }}>รายการคนขับ</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {drivers.map(driver => (
              <div 
                key={driver.id}
                style={{
                  background: selectedDriver?.id === driver.id ? '#2A4A6B' : '#1A1D23',
                  padding: 16,
                  borderRadius: 8,
                  cursor: 'pointer',
                  border: selectedDriver?.id === driver.id ? '2px solid #FFD600' : '1px solid #333'
                }}
                onClick={() => setSelectedDriver(driver)}
              >
                <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
                  {getPersonName(driver.personId)}
                </div>
                <div style={{ color: '#888', fontSize: 14 }}>
                  ใบขับขี่: {driver.licenseNumber}
                </div>
                <div style={{ color: '#888', fontSize: 14 }}>
                  ประสบการณ์: {driver.experienceYears} ปี
                </div>
                <div style={{ 
                  color: driver.status === 'ACTIVE' ? '#4CAF50' : '#F44336', 
                  fontSize: 12,
                  fontWeight: 'bold'
                }}>
                  {driver.status === 'ACTIVE' ? 'พร้อมขับ' : 'ไม่พร้อม'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Driver Details */}
        <div style={{ background: '#23252B', padding: 24, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16, fontSize: 18 }}>รายละเอียดคนขับ</h3>
          {selectedDriver ? (
            <div>
              <div style={{ marginBottom: 12 }}>
                <strong>ชื่อ:</strong> {getPersonName(selectedDriver.personId)}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>เลขใบขับขี่:</strong> {selectedDriver.licenseNumber}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>ประเภทใบขับขี่:</strong> {selectedDriver.licenseType}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>ประสบการณ์:</strong> {selectedDriver.experienceYears} ปี
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>สถานะ:</strong> 
                <span style={{ 
                  color: selectedDriver.status === 'ACTIVE' ? '#4CAF50' : '#F44336',
                  marginLeft: 8,
                  fontWeight: 'bold'
                }}>
                  {selectedDriver.status === 'ACTIVE' ? 'พร้อมขับ' : 'ไม่พร้อม'}
                </span>
              </div>
            </div>
          ) : (
            <p style={{ color: '#888' }}>เลือกคนขับเพื่อดูรายละเอียด</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DriverPage;