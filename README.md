# USW Festival 2026 관리자 페이지 (festival-admin)

데이터 관리 및 운영 전용 어드민 웹사이트입니다.

## 📅 프로젝트 정보

- **담당 파트**: 프론트엔드 (관리자 페이지)
- **주요 스택**: React 18, TypeScript, Vite, React Router v6
- **배포**: Cloudflare Pages
- **디자인**: Figma (대동제 TF 피그마)

## 🏗️ 폴더 구조

```
festival-admin/
├── src/
│   ├── components/          # 공통 UI 컴포넌트
│   │   ├── Layout.tsx       # 사이드바 + 탑바 래퍼
│   │   ├── Sidebar.tsx      # 좌측 네비게이션
│   │   ├── TopBar.tsx       # 상단 헤더 (검색창, 프로필)
│   │   └── Modal.tsx        # 공통 모달
│   ├── pages/               # 라우트별 페이지
│   │   ├── Dashboard.tsx    # 메인 화면 (비로그인 공개)
│   │   ├── Login.tsx        # 로그인 화면
│   │   ├── General.tsx      # 총학생회 관리 (general 권한)
│   │   └── Booth.tsx        # 과학생회 관리 (booth 권한)
│   ├── context/
│   │   └── AuthContext.tsx  # 로그인 상태 및 role 관리
│   ├── services/            # API 통신 함수
│   │   ├── api.ts           # Axios 인스턴스
│   │   ├── notice.ts        # 공지사항 API
│   │   ├── booth.ts         # 부스/메뉴 API
│   │   └── lost.ts          # 분실물 API
│   ├── styles/
│   │   └── global.css       # 전역 스타일
│   ├── App.tsx              # 라우터 설정
│   └── main.tsx             # 앱 진입점
├── index.html
├── vite.config.ts
└── README.md
```

## ✨ 주요 기능

- **인증(Auth)**: role 기반 로그인/로그아웃
  - 로그인 후 권한에 따라 자동 분기 (`general` → 총학, `booth` → 과학생회)
  - 대시보드는 비로그인 상태에서도 접근 가능
- **총학생회 권한 (`general`)**:
  - 축제 공지사항 등록/수정/삭제
  - 분실물 등록 및 수거 상태 변경
  - 이벤트 관리
- **과학생회 권한 (`booth`)**:
  - 부스 상세 설명 및 이미지 관리
  - 메뉴 추가/수정 및 품절(Sold-out) 토글
- **공통**: 사이드바 대시보드 클릭 시 메인 화면으로 복귀

## 🚀 실행 방법

```bash
npm install
npm run dev
```

## 🔐 로그인 (임시)

> 백엔드 API 연동 전 임시 계정입니다.

| 아이디 | 비밀번호 | 권한 |
|--------|----------|------|
| `general` | 아무거나 | 총학생회 |
| `booth` | 아무거나 | 과학생회 |

## 🔗 API 연동

`src/context/AuthContext.tsx`의 `login()` 함수에서 실제 API로 교체합니다.

```ts
// 현재 (임시)
const role: UserRole = id === 'booth' ? 'booth' : 'general'

// 교체 예시
const res = await api.post('/auth/login', { id, password: pw })
const role: UserRole = res.data.role
```
