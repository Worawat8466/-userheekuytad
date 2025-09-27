import React, { useState } from 'react';

// === INITIAL DATA ===
const initialRoutes = [
  {
    id: 1,
    routeName: 'สาย A1 - มหาวิทยาลัย-เซ็นทรัล',
    startPoint: 'มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน',
    endPoint: 'เซ็นทรัลพลาซา นครราชสีมา',
    distance: 15.2,
    estimatedTime: 45,
    fare: 25,
    status: 'ACTIVE'
  },
  {
    id: 2,
    routeName: 'สาย B2 - มหาวิทยาลัย-สนามบิน',
    startPoint: 'มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน',
    endPoint: 'สนามบินนครราชสีมา',
    distance: 22.8,
    estimatedTime: 65,
    fare: 35,
    status: 'ACTIVE'
  },
  {
    id: 3,
    routeName: 'สาย C3 - มหาวิทยาลัย-ห้าง',
    startPoint: 'มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน',
    endPoint: 'ห้างเทสโก้ โลตัส',
    distance: 8.5,
    estimatedTime: 25,
    fare: 15,
    status: 'MAINTENANCE'
  }
];

const initialStops = [
  { id: 1, routeId: 1, stopName: 'มหาวิทยาลัยฯ ประตูหลัก', orderSequence: 1 },
  { id: 2, routeId: 1, stopName: 'แยกสี่แยกใหม่', orderSequence: 2 },
  { id: 3, routeId: 1, stopName: 'เซ็นทรัลพลาซา', orderSequence: 3 },
  { id: 4, routeId: 2, stopName: 'มหาวิทยาลัยฯ ประตูหลัก', orderSequence: 1 },
  { id: 5, routeId: 2, stopName: 'แยกมิตรภาพ', orderSequence: 2 },
  { id: 6, routeId: 2, stopName: 'สนามบินนครราชสีมา', orderSequence: 3 }
];

// หน้า Routes - เส้นทาง
function RoutesPage() {
  const [routes, setRoutes] = useState(initialRoutes);
  const [stops, setStops] = useState(initialStops);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const getRouteStops = (routeId) => {
    return stops.filter(stop => stop.routeId === routeId)
                .sort((a, b) => a.orderSequence - b.orderSequence);
  };

  return (
    <div style={{ padding: 32, color: '#fff' }}>
      <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 'bold' }}>
        เส้นทาง (Routes)
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Routes List */}
        <div style={{ background: '#23252B', padding: 24, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16, fontSize: 18 }}>รายการเส้นทาง</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {routes.map(route => (
              <div 
                key={route.id}
                style={{
                  background: selectedRoute?.id === route.id ? '#2A4A6B' : '#1A1D23',
                  padding: 16,
                  borderRadius: 8,
                  cursor: 'pointer',
                  border: selectedRoute?.id === route.id ? '2px solid #FFD600' : '1px solid #333'
                }}
                onClick={() => setSelectedRoute(route)}
              >
                <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
                  {route.routeName}
                </div>
                <div style={{ color: '#888', fontSize: 14, marginBottom: 4 }}>
                  🚩 {route.startPoint}
                </div>
                <div style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>
                  🏁 {route.endPoint}
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                  <span>📏 {route.distance} กม.</span>
                  <span>⏱️ {route.estimatedTime} นาที</span>
                  <span>💰 {route.fare} บาท</span>
                  <span style={{ 
                    color: route.status === 'ACTIVE' ? '#4CAF50' : '#FFA726',
                    fontWeight: 'bold'
                  }}>
                    {route.status === 'ACTIVE' ? '✅ ใช้งาน' : '🔧 ปรับปรุง'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Route Details */}
        <div style={{ background: '#23252B', padding: 24, borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16, fontSize: 18 }}>รายละเอียดเส้นทาง</h3>
          {selectedRoute ? (
            <div>
              <div style={{ marginBottom: 12 }}>
                <strong>ชื่อเส้นทาง:</strong> {selectedRoute.routeName}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>จุดเริ่มต้น:</strong> {selectedRoute.startPoint}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>จุดสิ้นสุด:</strong> {selectedRoute.endPoint}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>ระยะทาง:</strong> {selectedRoute.distance} กิโลเมตร
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>เวลาโดยประมาณ:</strong> {selectedRoute.estimatedTime} นาที
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>ค่าโดยสาร:</strong> {selectedRoute.fare} บาท
              </div>
              <div style={{ marginBottom: 16 }}>
                <strong>สถานะ:</strong>
                <span style={{ 
                  color: selectedRoute.status === 'ACTIVE' ? '#4CAF50' : '#FFA726',
                  marginLeft: 8,
                  fontWeight: 'bold'
                }}>
                  {selectedRoute.status === 'ACTIVE' ? 'ใช้งาน' : 'ปรับปรุง'}
                </span>
              </div>
              
              <div>
                <strong>จุดจอด:</strong>
                <div style={{ marginTop: 8 }}>
                  {getRouteStops(selectedRoute.id).map(stop => (
                    <div key={stop.id} style={{ 
                      background: '#1A1D23',
                      padding: 8,
                      margin: '4px 0',
                      borderRadius: 4,
                      fontSize: 14
                    }}>
                      {stop.orderSequence}. {stop.stopName}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p style={{ color: '#888' }}>เลือกเส้นทางเพื่อดูรายละเอียด</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoutesPage;