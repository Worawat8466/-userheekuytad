// === IMPORTS ===
import React, { useState } from 'react';

// === INITIAL DATA ===
const initialSchedules = [
  {
    id: 1,
    routeId: 1,
    driverId: 1,
    vehicleId: 1,
    departureTime: '08:00',
    arrivalTime: '08:45',
    operationDate: '2024-01-15',
    availableSeats: 32,
    totalSeats: 40,
    status: 'SCHEDULED'
  },
  {
    id: 2,
    routeId: 2,
    driverId: 2,
    vehicleId: 2,
    departureTime: '09:30',
    arrivalTime: '10:35',
    operationDate: '2024-01-15',
    availableSeats: 28,
    totalSeats: 40,
    status: 'SCHEDULED'
  },
  {
    id: 3,
    routeId: 1,
    driverId: 1,
    vehicleId: 1,
    departureTime: '14:00',
    arrivalTime: '14:45',
    operationDate: '2024-01-15',
    availableSeats: 35,
    totalSeats: 40,
    status: 'SCHEDULED'
  },
  {
    id: 4,
    routeId: 3,
    driverId: 2,
    vehicleId: 3,
    departureTime: '16:15',
    arrivalTime: '16:40',
    operationDate: '2024-01-15',
    availableSeats: 0,
    totalSeats: 30,
    status: 'CANCELLED'
  }
];

const initialRoutes = [
  { id: 1, routeName: 'สาย A1 - มหาวิทยาลัย-เซ็นทรัล' },
  { id: 2, routeName: 'สาย B2 - มหาวิทยาลัย-สนามบิน' },
  { id: 3, routeName: 'สาย C3 - มหาวิทยาลัย-ห้าง' }
];

const initialDrivers = [
  { id: 1, name: 'สมชาย ใจดี' },
  { id: 2, name: 'สุดา สวยงาม' }
];

const initialVehicles = [
  { id: 1, plateNumber: 'กข-1234', model: 'Toyota Commuter' },
  { id: 2, plateNumber: 'กข-5678', model: 'Isuzu ELF' },
  { id: 3, plateNumber: 'กข-9012', model: 'Toyota Hiace' }
];

// === SCHEDULE PAGE COMPONENT ===
function SchedulePage() {
  // === STATE MANAGEMENT ===
  const [schedules, setSchedules] = useState(initialSchedules);
  const [routes, setRoutes] = useState(initialRoutes);
  const [drivers, setDrivers] = useState(initialDrivers);
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [filter, setFilter] = useState('ALL');

  // === UTILITY FUNCTIONS ===
  const getRouteName = (routeId) => {
    const route = routes.find(r => r.id === routeId);
    return route ? route.routeName : 'ไม่ระบุ';
  };

  const getDriverName = (driverId) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver ? driver.name : 'ไม่ระบุ';
  };

  const getVehicleInfo = (vehicleId) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.plateNumber} (${vehicle.model})` : 'ไม่ระบุ';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED': return '#4CAF50';
      case 'DEPARTED': return '#2196F3';
      case 'ARRIVED': return '#9C27B0';
      case 'CANCELLED': return '#F44336';
      case 'DELAYED': return '#FFA726';
      default: return '#888';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'SCHEDULED': return 'กำหนดการ';
      case 'DEPARTED': return 'ออกเดินทาง';
      case 'ARRIVED': return 'มาถึงแล้ว';
      case 'CANCELLED': return 'ยกเลิก';
      case 'DELAYED': return 'เลื่อนเวลา';
      default: return 'ไม่ทราบ';
    }
  };

  const filteredSchedules = schedules.filter(schedule => {
    if (filter === 'ALL') return true;
    return schedule.status === filter;
  });

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
      
      {/* Filter Bar */}
      <div style={{ marginBottom: 24, display: 'flex', gap: 12 }}>
        {['ALL', 'SCHEDULED', 'DEPARTED', 'ARRIVED', 'CANCELLED'].map(status => (
          <button
            key={status}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 'bold',
              background: filter === status ? '#FFD600' : '#333',
              color: filter === status ? '#000' : '#fff'
            }}
            onClick={() => setFilter(status)}
          >
            {status === 'ALL' ? 'ทั้งหมด' : getStatusText(status)}
          </button>
        ))}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Schedules List */}
        <div style={{ background: '#23252B', padding: 24, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16, fontSize: 18 }}>ตารางเดินรถประจำวัน</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredSchedules.map(schedule => (
              <div 
                key={schedule.id}
                style={{
                  background: selectedSchedule?.id === schedule.id ? '#2A4A6B' : '#1A1D23',
                  padding: 16,
                  borderRadius: 8,
                  cursor: 'pointer',
                  border: selectedSchedule?.id === schedule.id ? '2px solid #FFD600' : '1px solid #333'
                }}
                onClick={() => setSelectedSchedule(schedule)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                      {getRouteName(schedule.routeId)}
                    </div>
                    <div style={{ color: '#888', fontSize: 14, marginBottom: 2 }}>
                      ⏰ {schedule.departureTime} - {schedule.arrivalTime}
                    </div>
                    <div style={{ color: '#888', fontSize: 14, marginBottom: 2 }}>
                      👨‍✈️ {getDriverName(schedule.driverId)}
                    </div>
                    <div style={{ color: '#888', fontSize: 14 }}>
                      🚐 {getVehicleInfo(schedule.vehicleId)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      color: getStatusColor(schedule.status),
                      fontSize: 12,
                      fontWeight: 'bold',
                      marginBottom: 4
                    }}>
                      {getStatusText(schedule.status)}
                    </div>
                    <div style={{ fontSize: 12, color: '#888' }}>
                      💺 {schedule.availableSeats}/{schedule.totalSeats}
                    </div>
                    <div style={{ fontSize: 11, color: '#666' }}>
                      � {schedule.operationDate}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Details */}
        <div style={{ background: '#23252B', padding: 24, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16, fontSize: 18 }}>รายละเอียดเที่ยวรถ</h3>
          {selectedSchedule ? (
            <div>
              <div style={{ marginBottom: 12 }}>
                <strong>รหัสเที่ยว:</strong> SCH{selectedSchedule.id.toString().padStart(3, '0')}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>เส้นทาง:</strong> {getRouteName(selectedSchedule.routeId)}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>คนขับ:</strong> {getDriverName(selectedSchedule.driverId)}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>ยานพาหนะ:</strong> {getVehicleInfo(selectedSchedule.vehicleId)}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>เวลาออก:</strong> {selectedSchedule.departureTime}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>เวลาถึง:</strong> {selectedSchedule.arrivalTime}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>วันที่ปฏิบัติการ:</strong> {selectedSchedule.operationDate}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>ที่นั่งว่าง:</strong> {selectedSchedule.availableSeats}/{selectedSchedule.totalSeats}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>สถานะ:</strong>
                <span style={{ 
                  color: getStatusColor(selectedSchedule.status),
                  marginLeft: 8,
                  fontWeight: 'bold'
                }}>
                  {getStatusText(selectedSchedule.status)}
                </span>
              </div>
              
              {/* Seat Occupancy Bar */}
              <div style={{ marginTop: 16 }}>
                <strong>อัตราการใช้งานที่นั่ง:</strong>
                <div style={{ 
                  width: '100%', 
                  height: 20, 
                  background: '#1A1D23', 
                  borderRadius: 10, 
                  marginTop: 8,
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${((selectedSchedule.totalSeats - selectedSchedule.availableSeats) / selectedSchedule.totalSeats) * 100}%`,
                    background: selectedSchedule.availableSeats === 0 ? '#F44336' : 
                               selectedSchedule.availableSeats < 10 ? '#FFA726' : '#4CAF50',
                    borderRadius: 10,
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                  {Math.round(((selectedSchedule.totalSeats - selectedSchedule.availableSeats) / selectedSchedule.totalSeats) * 100)}% ที่นั่งถูกจอง
                </div>
              </div>
            </div>
          ) : (
            <p style={{ color: '#888' }}>เลือกเที่ยวรถเพื่อดูรายละเอียด</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SchedulePage;