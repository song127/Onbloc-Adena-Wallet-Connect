/**
 * @file BasicInput.tsx
 * @desc 공통 인풋 컴포넌트(상태/이벤트/placeholder)
 */
import type { ReactElement, ChangeEvent } from "react";
import { useRef, useLayoutEffect, useState } from "react";

/**
 * BasicInputProps - 인풋 props
 * @property {string} placeholder - placeholder 텍스트
 * @property {boolean} disabled - 비활성화 여부
 * @property {string} value - 입력값
 * @property {(e: ChangeEvent<HTMLInputElement>) => void} onChange - 입력 이벤트
 * @property {string} type - 입력 타입
 */
interface BasicInputProps {
  placeholder: string;
  disabled: boolean;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: "string" | "number";
}

/**
 * BasicInput - 공통 인풋
 * @param {BasicInputProps} props
 */
const BasicInput = ({ placeholder, disabled, value, onChange, type = "string" }: BasicInputProps): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);
  const mirrorRef = useRef<HTMLSpanElement>(null);
  const unitRef = useRef<HTMLSpanElement>(null);
  const [valueWidth, setValueWidth] = useState(0);
  const [unitWidth, setUnitWidth] = useState(0);
  const [inputWidth, setInputWidth] = useState(0);

  useLayoutEffect(() => {
    if (mirrorRef.current) {
      setValueWidth(mirrorRef.current.offsetWidth);
    }
    if (unitRef.current) {
      setUnitWidth(unitRef.current.offsetWidth);
    }
    if (inputRef.current) {
      setInputWidth(inputRef.current.offsetWidth);
    }
  }, [value, placeholder]);

  // input padding left/right (px-2 = 0.5rem = 8px)
  const paddingRight = type === "number" ? 64 : 8; // pr-16 = 4rem = 64px, else px-2 = 8px
  const minUnitGap = 0; // 또는 -1, -2 등
  const unitLeft = 24 + valueWidth + minUnitGap;
  const shouldFixRight = type === "number" && unitLeft + unitWidth + paddingRight > inputWidth;

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        className={`w-full px-2 py-3 font-semibold text-black border-2 border-black border-solid rounded-input text-input ${type === "number" ? "pr-16" : ""}`}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
        type={type === "number" ? "number" : "text"}
        inputMode={type === "number" ? "numeric" : undefined}
        autoComplete="off"
        style={{ position: "relative", background: "transparent" }}
      />
      {/* mirror span: padding/border 없이 value만 측정 */}
      {type === "number" && (
        <span
          ref={mirrorRef}
          className="absolute invisible whitespace-pre"
          aria-hidden="true"
          style={{
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: "inherit",
            left: 0,
            top: 0,
            pointerEvents: "none",
          }}
        >
          {value}
        </span>
      )}
      {/* 단위 표시 */}
      {type === "number" && value && (
        <span
          ref={unitRef}
          className="absolute font-semibold text-black bg-white pointer-events-none select-none top-1/2 text-input"
          style={
            shouldFixRight
              ? { right: 12, transform: "translateY(-50%)" }
              : { left: unitLeft, transform: "translateY(-50%)" }
          }
          aria-hidden="true"
        >
          ugnot
        </span>
      )}
    </div>
  );
};

export default BasicInput;
