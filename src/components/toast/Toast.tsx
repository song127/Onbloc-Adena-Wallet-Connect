/**
 * @file Toast.tsx
 * @desc
 *  - 단일 토스트(알림) UI 컴포넌트
 *  - 등장/퇴장 애니메이션 지원(슬라이드+opacity+height)
 *  - type, message, txHash, isLeaving prop 사용
 */
import clsx from "clsx";

import type { Toast as ToastType } from "@/store/toast";

/**
 * Toast
 * @desc 단일 토스트 렌더링 및 애니메이션 적용
 * @param {object} props
 * @param {ToastType & { isLeaving?: boolean }} props.toast - 토스트 데이터
 */
export function Toast({ toast }: { toast: ToastType & { isLeaving?: boolean } }) {
  return (
    <div
      className={clsx(
        "flex flex-col items-start gap-2 px-4 py-3 rounded shadow-toast mb-2 min-w-[250px] max-w-fit transition-all duration-300",
        "max-h-[120px] overflow-hidden",
        toast.type === "success" && "bg-success text-white",
        toast.type === "failed" && "bg-error text-white",
        toast.isLeaving ? "animate-toastOut" : "animate-toastIn",
      )}
    >
      <span className="font-bold capitalize">{toast.title || toast.type}</span>
      <span className="flex-1">{toast.message}</span>
    </div>
  );
}
