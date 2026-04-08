export const notices = [
  { id: 1, title: '2026 대동제 일정 안내', content: '올해 대동제는 5월 14일~16일에 진행됩니다.', views: 342, createdAt: '2026-04-01' },
  { id: 2, title: '부스 운영 가이드라인', content: '부스 운영 시 주의사항을 확인해주세요.', views: 156, createdAt: '2026-04-03' },
  { id: 3, title: '분실물 접수 안내', content: '분실물은 총학생회 부스에서 접수합니다.', views: 89, createdAt: '2026-04-05' },
  { id: 4, title: '우천 시 대체 프로그램 안내', content: '우천 시 실내 프로그램으로 전환됩니다.', views: 201, createdAt: '2026-04-07' },
]

export const booths = [
  { id: 1, name: '떡볶이 천국', department: '컴퓨터공학과', location: 'A-1', menus: [
    { id: 1, name: '떡볶이', price: 4000, soldOut: false },
    { id: 2, name: '순대', price: 3000, soldOut: false },
    { id: 3, name: '어묵', price: 2000, soldOut: true },
  ]},
  { id: 2, name: '치킨 파티', department: '전자공학과', location: 'A-2', menus: [
    { id: 4, name: '후라이드', price: 8000, soldOut: false },
    { id: 5, name: '양념치킨', price: 9000, soldOut: false },
  ]},
  { id: 3, name: '타코야키 하우스', department: '경영학과', location: 'B-1', menus: [
    { id: 6, name: '타코야키 6개', price: 3500, soldOut: false },
    { id: 7, name: '타코야키 12개', price: 6000, soldOut: false },
  ]},
]

export const lostItems = [
  { id: 1, name: '에어팟 프로', description: '흰색 케이스, 이름 스티커 부착', location: '무대 앞 잔디밭', status: 'waiting', createdAt: '2026-04-07' },
  { id: 2, name: '학생증', description: '홍길동, 컴퓨터공학과', location: 'A구역 부스', status: 'collected', createdAt: '2026-04-07' },
  { id: 3, name: '검정 우산', description: '접이식, 자동', location: 'B구역 화장실 앞', status: 'waiting', createdAt: '2026-04-08' },
]
