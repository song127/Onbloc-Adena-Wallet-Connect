/**
 * @file Toast.tsx
 * @desc
 *  - 단일 토스트(알림) UI 컴포넌트
 *  - 등장/퇴장 애니메이션 지원(슬라이드+opacity+height)
 *  - type, message, txHash, isLeaving prop 사용
 */
import { tv } from "tailwind-variants";
import { twMerge } from "tailwind-merge";
import { useToastStore } from "@/store/toast";
import type { Toast as ToastType } from "@/store/toast";

const toastContainer = tv({
  base: "flex flex-col items-start gap-2 px-4 py-3 rounded shadow-toast mb-2 min-w-[250px] max-w-fit transition-all duration-300 max-h-[120px] overflow-hidden font-medium",
  variants: {
    design: {
      basic: "bg-white border-2 border-borderCard border-solid",
      custom: "",
    },
    type: {
      success: "bg-success text-white",
      failed: "bg-error text-white",
    },
  },
  compoundVariants: [{ design: "basic", class: "bg-white border border-black" }],
});

const toastTitle = tv({
  base: "font-bold capitalize",
  variants: {
    design: {
      basic: "",
      custom: "text-white",
    },
    type: {
      success: "",
      failed: "",
    },
  },
  compoundVariants: [
    { design: "basic", type: "success", class: "text-success" },
    { design: "basic", type: "failed", class: "text-error" },
    { design: "custom", class: "text-white" },
  ],
});

const toastContent = tv({
  base: "flex-1",
  variants: {
    design: {
      basic: "text-black",
      custom: "text-white",
    },
  },
});

/**
 * Toast
 * @desc 단일 토스트 렌더링 및 애니메이션 적용
 * @param {object} props
 * @param {ToastType & { isLeaving?: boolean }} props.toast - 토스트 데이터
 */
export function Toast({ toast }: { toast: ToastType & { isLeaving?: boolean } }) {
  const toastDesign = useToastStore((s) => s.toastDesign);

  return (
    <div
      className={twMerge(
        toastContainer({ design: toastDesign, type: toast.type }),
        toast.isLeaving ? "animate-toastOut" : "animate-toastIn",
      )}
    >
      <span className={toastTitle({ design: toastDesign, type: toast.type })}>{toast.title || toast.type}</span>
      <span className={toastContent({ design: toastDesign })}>{toast.message}</span>
    </div>
  );
}
