/**
 * @file ReacButton.tsx
 * @desc 공통 버튼 컴포넌트(상태/이벤트/children)
 */
import type { ReactNode, ReactElement } from "react";
import { clsx } from "clsx";

/**
 * ReactButtonProps - 버튼 props
 * @property {boolean} disabled - 비활성화 여부
 * @property {() => void} onClick - 클릭 이벤트
 * @property {ReactNode} children - 버튼 내용
 */
interface ReactButtonProps {
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}

/**
 * ReactButton - 공통 버튼
 * @param {ReactButtonProps} props
 */
const ReactButton = ({ disabled, onClick, children }: ReactButtonProps): ReactElement => (
  <button
    className={clsx("w-full py-3 font-semibold text-white text-button rounded-button", {
      "bg-primary": !disabled,
      "bg-disabled cursor-not-allowed": disabled,
    })}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);

export default ReactButton;
