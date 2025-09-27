import React, { useState } from 'react';

// === INITIAL DATA ===
const initialBookings = [
  {
    id: 1,
    customerId: 1,
    scheduleId: 1,
    bookingDate: '2024-01-15',
    seatNumber: 'A12',
    fare: 25,
    status: 'CONFIRMED',
    paymentStatus: 'PAID'
  },
  {
    id: 2,
    customerId: 2,
    scheduleId: 2,
    bookingDate: '2024-01-15',
    seatNumber: 'B05',
    fare: 35,
    status: 'PENDING',
    paymentStatus: 'PENDING'
  },
  {
    id: 3,
    customerId: 3,
    scheduleId: 1,
    bookingDate: '2024-01-14',
    seatNumber: 'A08',
    fare: 25,
    status: 'COMPLETED',
    paymentStatus: 'PAID'
  }
];

const initialCustomers = [
  { id: 1, name: 'นายสมชาย ใจดี', studentId: '6611130011' },
  { id: 2, name: 'นางสาวสุดา สวยงาม', studentId: '6611130012' },
  { id: 3, name: 'นายประยุทธ์ ขยัน', studentId: '6611130013' }
];

const initialSchedules = [
  { id: 1, routeName: 'สาย A1 - มหาวิทยาลัย-เซ็นทรัล', departureTime: '08:00', fare: 25 },
  { id: 2, routeName: 'สาย B2 - มหาวิทยาลัย-สนามบิน', departureTime: '09:30', fare: 35 },
  { id: 3, routeName: 'สาย C3 - มหาวิทยาลัย-ห้าง', departureTime: '10:15', fare: 15 }
];

// หน้า Booking - การจอง
function BookingPage() {
  const [bookings, setBookings] = useState(initialBookings);
  const [customers, setCustomers] = useState(initialCustomers);
  const [schedules, setSchedules] = useState(initialSchedules);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'ไม่ระบุ';
  };

  const getScheduleName = (scheduleId) => {
    const schedule = schedules.find(s => s.id === scheduleId);
    return schedule ? schedule.routeName : 'ไม่ระบุ';
  };

  const getScheduleTime = (scheduleId) => {
    const schedule = schedules.find(s => s.id === scheduleId);
    return schedule ? schedule.departureTime : 'ไม่ระบุ';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return '#4CAF50';
      case 'PENDING': return '#FFA726';
      case 'COMPLETED': return '#2196F3';
      case 'CANCELLED': return '#F44336';
      default: return '#888';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'ยืนยันแล้ว';
      case 'PENDING': return 'รอยืนยัน';
      case 'COMPLETED': return 'เสร็จสิ้น';
      case 'CANCELLED': return 'ยกเลิก';
      default: return 'ไม่ทราบ';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'ALL') return true;
    return booking.status === filter;
  });

  return (
    <div style={{ padding: 32, color: '#fff' }}>
      <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 'bold' }}>
        การจอง (Booking)
      </h2>
      
      {/* Filter Bar */}
      <div style={{ marginBottom: 24, display: 'flex', gap: 12 }}>
        {['ALL', 'CONFIRMED', 'PENDING', 'COMPLETED'].map(status => (
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
        {/* Bookings List */}
        <div style={{ background: '#23252B', padding: 24, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16, fontSize: 18 }}>รายการจอง</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredBookings.map(booking => (
              <div 
                key={booking.id}
                style={{
                  background: selectedBooking?.id === booking.id ? '#2A4A6B' : '#1A1D23',
                  padding: 16,
                  borderRadius: 8,
                  cursor: 'pointer',
                  border: selectedBooking?.id === booking.id ? '2px solid #FFD600' : '1px solid #333'
                }}
                onClick={() => setSelectedBooking(booking)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                      {getCustomerName(booking.customerId)}
                    </div>
                    <div style={{ color: '#888', fontSize: 14, marginBottom: 2 }}>
                      🚌 {getScheduleName(booking.scheduleId)}
                    </div>
                    <div style={{ color: '#888', fontSize: 14, marginBottom: 2 }}>
                      ⏰ {getScheduleTime(booking.scheduleId)} | 💺 {booking.seatNumber}
                    </div>
                    <div style={{ color: '#888', fontSize: 14 }}>
                      📅 {booking.bookingDate}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      color: getStatusColor(booking.status),
                      fontSize: 12,
                      fontWeight: 'bold',
                      marginBottom: 4
                    }}>
                      {getStatusText(booking.status)}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                      {booking.fare} บาท
                    </div>
                    <div style={{ 
                      fontSize: 11,
                      color: booking.paymentStatus === 'PAID' ? '#4CAF50' : '#FFA726'
                    }}>
                      {booking.paymentStatus === 'PAID' ? '💳 ชำระแล้ว' : '⏳ รอชำระ'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Details */}
        <div style={{ background: '#23252B', padding: 24, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16, fontSize: 18 }}>รายละเอียดการจอง</h3>
          {selectedBooking ? (
            <div>
              <div style={{ marginBottom: 12 }}>
                <strong>รหัสจอง:</strong> #{selectedBooking.id.toString().padStart(6, '0')}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>ผู้โดยสาร:</strong> {getCustomerName(selectedBooking.customerId)}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>เส้นทาง:</strong> {getScheduleName(selectedBooking.scheduleId)}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>เวลาออกรถ:</strong> {getScheduleTime(selectedBooking.scheduleId)}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>วันที่จอง:</strong> {selectedBooking.bookingDate}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>หมายเลขที่นั่ง:</strong> {selectedBooking.seatNumber}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>ค่าโดยสาร:</strong> {selectedBooking.fare} บาท
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>สถานะการจอง:</strong>
                <span style={{ 
                  color: getStatusColor(selectedBooking.status),
                  marginLeft: 8,
                  fontWeight: 'bold'
                }}>
                  {getStatusText(selectedBooking.status)}
                </span>
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>สถานะการชำระเงิน:</strong>
                <span style={{ 
                  color: selectedBooking.paymentStatus === 'PAID' ? '#4CAF50' : '#FFA726',
                  marginLeft: 8,
                  fontWeight: 'bold'
                }}>
                  {selectedBooking.paymentStatus === 'PAID' ? 'ชำระแล้ว' : 'รอชำระ'}
                </span>
              </div>
            </div>
          ) : (
            <p style={{ color: '#888' }}>เลือกการจองเพื่อดูรายละเอียด</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingPage;