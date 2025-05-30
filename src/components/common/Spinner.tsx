/**
 * @file Spinner.tsx
 * @desc 로딩 인디케이터 컴포넌트(접근성/애니메이션)
 */
import type { ReactElement } from "react";

/**
 * Spinner - 로딩 인디케이터
 */
const Spinner = (): ReactElement => (
  <div className="flex flex-col items-center justify-center min-h-[200px]" role="status" aria-live="polite">
    <svg className="animate-spinnerSpin h-spinner w-spinner text-spinner" viewBox="0 0 50 50" fill="none">
      {/* 바깥 원 (연한 색) */}
      <circle className="opacity-25" cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="5" />
      {/* 일부만 보이는 원 (진한 색, 회전) */}
      <circle
        className="opacity-100"
        cx="25"
        cy="25"
        r="20"
        stroke="currentColor"
        strokeWidth="5"
        strokeDasharray="90"
        strokeDashoffset="60"
        strokeLinecap="round"
      />
    </svg>
    <span className="mt-4 text-gray-500 text-body">Loading...</span>
  </div>
);

export default Spinner;
