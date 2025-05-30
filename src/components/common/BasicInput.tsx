/**
 * @file BasicInput.tsx
 * @desc 공통 인풋 컴포넌트(상태/이벤트/placeholder)
 */
import type { ReactElement, ChangeEvent } from "react";
import { useRef, useLayoutEffect, useState, useCallback } from "react";
import { tv } from "tailwind-variants";
import { twMerge } from "tailwind-merge";

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

// tailwind-variants: 스타일 분리
const inputVariants = tv({
  base: "font-semibold text-black bg-transparent border-none outline-none text-input",
  variants: {
    type: {
      string: "w-full px-2 py-3 border-2 border-black border-solid rounded-input text-input",
      number: "flex-shrink-0 p-0 m-0",
    },
    disabled: {
      true: "opacity-disabled cursor-not-allowed",
      false: "",
    },
  },
  defaultVariants: {
    type: "string",
    disabled: false,
  },
});

const backboardVariants = tv({
  base: "flex items-center w-full px-2 py-3 transition-none bg-white border-2 border-black border-solid rounded-input cursor-text min-h-[40px] overflow-hidden",
  variants: {
    disabled: {
      true: "opacity-disabled cursor-not-allowed",
      false: "",
    },
  },
  defaultVariants: {
    disabled: false,
  },
});

/**
 * BasicInput - 공통 인풋
 * @param {BasicInputProps} props
 */
const BasicInput = ({ placeholder, disabled, value, onChange, type = "string" }: BasicInputProps): ReactElement => {
  const backboardRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mirrorRef = useRef<HTMLSpanElement>(null);
  const unitRef = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState<number>(0);
  const [unitWidth, setUnitWidth] = useState<number>(0);
  const [backboardWidth, setBackboardWidth] = useState<number>(0);

  // width 측정 최적화
  useLayoutEffect(() => {
    if (type !== "number") return;
    if (mirrorRef.current) setInputWidth(value ? mirrorRef.current.offsetWidth : 2);
    if (unitRef.current) setUnitWidth(unitRef.current.offsetWidth);
    if (backboardRef.current) setBackboardWidth(backboardRef.current.offsetWidth);
  }, [value, placeholder, type]);

  // backboard 클릭 시 input 맨 뒤로 포커스
  const handleBackboardClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, []);

  // number 타입: width clamp, 단위 표시
  if (type === "number") {
    const maxInputWidth = backboardWidth && unitWidth ? Math.max(backboardWidth - unitWidth - 40, 20) : 240;
    return (
      <div ref={backboardRef} className={twMerge(backboardVariants({ disabled }))} onClick={handleBackboardClick}>
        <input
          ref={inputRef}
          className={twMerge(inputVariants({ type: "number", disabled }))}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={onChange}
          type="number"
          inputMode="numeric"
          autoComplete="off"
          style={{
            width: inputWidth,
            minWidth: 0,
            maxWidth: maxInputWidth,
            color: "black",
            background: "transparent",
          }}
        />
        {value && (
          <span
            ref={unitRef}
            className="flex-shrink-0 ml-2 font-semibold text-black pointer-events-none select-none text-input"
            aria-hidden="true"
          >
            ugnot
          </span>
        )}
        {/* mirror span: value width 측정용, 숨김 */}
        <span
          ref={mirrorRef}
          className="absolute invisible p-0 m-0 font-semibold whitespace-pre border-none outline-none text-input"
          aria-hidden="true"
          style={{
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: "bold",
            left: 0,
            top: 0,
            pointerEvents: "none",
            boxSizing: "border-box",
            padding: 0,
            margin: 0,
            border: "none",
            outline: "none",
          }}
        >
          {value || placeholder || "0"}
        </span>
      </div>
    );
  }

  // string 타입 등 기존 100% width
  return (
    <input
      ref={inputRef}
      className={twMerge(inputVariants({ type: "string", disabled }))}
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      onChange={onChange}
      type="text"
      autoComplete="off"
      style={{ background: "transparent", position: "relative" }}
    />
  );
};

export default BasicInput;
