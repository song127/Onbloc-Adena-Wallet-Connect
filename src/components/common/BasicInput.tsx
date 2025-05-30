/**
 * @file BasicInput.tsx
 * @desc 공통 인풋 컴포넌트(상태/이벤트/placeholder)
 */
import type { ReactElement, ChangeEvent } from "react";

/**
 * BasicInputProps - 인풋 props
 * @property {string} placeholder - placeholder 텍스트
 * @property {boolean} disabled - 비활성화 여부
 * @property {string} value - 입력값
 * @property {(e: ChangeEvent<HTMLInputElement>) => void} onChange - 입력 이벤트
 */
interface BasicInputProps {
  placeholder: string;
  disabled: boolean;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * BasicInput - 공통 인풋
 * @param {BasicInputProps} props
 */
const BasicInput = ({ placeholder, disabled, value, onChange }: BasicInputProps): ReactElement => (
  <input
    className="w-full px-2 py-3 border-2 border-black border-solid rounded-input text-input"
    placeholder={placeholder}
    disabled={disabled}
    value={value}
    onChange={onChange}
  />
);

export default BasicInput;
