# USW Fesival 2026 관리자 페이지 (festival-admin)
데이터 관리 및 운영 전용 어드민 웹사이트입니다.


## 📅 프로젝트 정보
- **담당 파트**: 프론트엔드 (관리자 페이지)
- **주요 스택**: HTML5, CSS3, JavaScript
- **배포**: Vercel
- **형태**: Responsive Web Design (데스크톱, 태블릿, 모바일 대응)

## 🏗️ 폴더 구조

```

festival-admin/
├── assets/              # 정적 리소스 (공통)
│   ├── images/          # 로고, 메인 포스터 등
│   ├── icons/           # 메뉴용 아이콘 (반응형 햄버거 메뉴 포함)
│   └── fonts/           # 폰트 파일
├── css/                 # 스타일시트 (반응형 설계 포함)
│   ├── style.css        # 메인 레이아웃 (사이드바, 반응형 미디어쿼리)
│   └── components.css   # 공통 UI (버튼, 모달, 입력창, 테이블 스타일)
├── js/                  # 자바스크립트 로직 (기능별 분리)
│   ├── api.js           # Axios 인스턴스 (withCredentials: true ⭐)
│   ├── auth.js          # 로그인 상태 및 권한(Role) 체크 로직
│   ├── utils.js         # 이미지 미리보기, 날짜 변환 등 유틸리티
│   └── services/        # API 명세서 카테고리별 통신 함수
│       ├── notice.js    # 공지사항 API (GET, POST, PATCH, DELETE)
│       ├── booth.js     # 부스 및 메뉴 관리 API
│       └── lost.js      # 분실물 관리 API
├── pages/               # 기능별 독립 페이지 (HTML)
│   ├── login.html       # 로그인 화면
│   ├── notice.html      # 공지사항 관리 (총학 권한)
│   ├── booth.html       # 부스/메뉴 관리 (과학생회 권한)
│   └── lost.html        # 분실물 관리 (총학 권한)
├── .env                 # API 주소 등 환경 변수 (GitHub 제외)
├── index.html           # 대시보드 메인 (반응형 메인 화면)
└── README.md            # 프로젝트 최종 명세 및 가이드

```

## ✨ Key Features

- **인증(Auth)**: 세션 쿠키 기반 로그인/로그아웃 (`withCredentials: true`)
- **총학생회 권한**: 
  - 축제 공지사항 등록/수정/삭제 (CRUD)
  - 분실물 등록 및 수거 상태 변경
- **부스 관리자 권한**:
  - 부스 상세 설명 및 이미지 관리
  - 메뉴 추가/수정 및 품절
- **공통**: 유저 역할(Role)에 따른 사이드바 메뉴 분기 처리
