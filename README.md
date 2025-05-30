# Gno.land Simple DApp (과제 제출용)

## 1. 프로젝트 개요

- Gno.land 네트워크 기반 MVP SPA
- Adena Wallet 연동, 주소/잔액 조회, GNOT 전송, Toast 알림 등 주요 기능 제공
- React + TypeScript + Zustand + TailwindCSS + Vite 기반
- **과제 제출용**: 리뷰어가 빠르게 구조/품질/기능을 파악할 수 있도록 설계

## 2. 기술 스택 및 주요 라이브러리

- **프론트엔드**: React 19, TypeScript, Vite
- **상태관리**: Zustand
- **스타일링**: TailwindCSS, tailwind-merge, tailwind-variants
- **라우팅**: react-router-dom
- **품질 도구**: ESLint, Prettier, Jest, Testing Library
- **기타**: Adena Wallet(window.adena), clsx

## 3. 폴더 구조 및 역할

```
src/
  components/   # 공통 UI 컴포넌트, Toast, Util 등
  hooks/        # 커스텀 훅 (Adena Wallet 연동)
  pages/        # SPA 페이지 (Home, Dashboard)
  store/        # Zustand 상태관리 (wallet, transfer, toast)
  theme/        # 디자인 토큰/테마
  types/        # 글로벌 타입 정의
  __tests__/    # 단위 테스트
  App.tsx       # 라우팅/SPA 엔트리
  main.tsx      # React 엔트리
  index.css     # TailwindCSS 엔트리
  reset.css     # CSS 리셋
```

## 4. 주요 기능 요약

- **Adena Wallet 연결/해제**: 브라우저 확장 Adena 지갑 연동
- **주소/잔액 조회**: Gno.land 계정 주소 및 GNOT 잔액 조회
- **GNOT 전송**: 지정 주소로 GNOT 송금
- **Toast 알림**: 성공/실패 등 주요 이벤트 알림
- **SPA 구조**: Home(메인), Dashboard(서브) 페이지

## 5. 실행 및 테스트 방법

```bash
pnpm install
pnpm dev         # 개발 서버 실행
pnpm build       # 프로덕션 빌드
pnpm test        # 테스트 실행
pnpm lint        # 린트 검사
pnpm format      # 포맷 검사
```

## 6. 코드 품질/설계 특징

- **타입 안정성**: TypeScript strict mode, 글로벌 타입 분리
- **상태관리**: 단일 책임 원칙, 상태/액션 분리(Zustand)
- **컴포넌트화**: 재사용성 높은 UI 컴포넌트 구조
- **테스트**: 핵심 로직 단위 테스트(커스텀 훅, 상태, Toast 등)
- **코드 스타일**: ESLint, Prettier, TailwindCSS 일관성
- **주석/문서화**: 함수/모듈별 Docstring, 주요 로직 설명
- **최신 React 패턴**: useCallback, useMemo, 함수형 컴포넌트, 불필요한 re-render 방지
