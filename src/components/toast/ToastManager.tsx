/**
 * @file ToastManager.tsx
 * @desc
 *  - Toast(알림) 리스트를 화면 우측 상단에 렌더링하는 컨테이너
 *  - 등장/퇴장/이동 애니메이션 지원
 *  - useToastStore의 toasts 상태를 구독
 */
import type { ReactElement } from "react";

import { useToastStore } from "@/store/toast";
import { Toast } from "@/components/toast/Toast";

/**
 * ToastManager
 * @desc 토스트 리스트 렌더링 및 이동 애니메이션 적용
 */
export function ToastManager(): ReactElement {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed flex flex-col items-end space-y-2 transition-all duration-300 top-4 right-4 z-toast">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
