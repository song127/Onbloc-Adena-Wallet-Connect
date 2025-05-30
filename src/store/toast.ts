// === src/store/toast.ts ===
/**
 * @file toast.ts
 * @desc 전역 토스트(알림) 상태(Zustand slice, selector/미들웨어/분리 패턴 적용)
 */
import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

import { TOAST_CONFIG } from "@/constants/config";

/**
 * ToastType - 토스트 타입(성공/실패)
 */
export type ToastType = "success" | "failed";

/**
 * Toast - 단일 토스트 객체
 * @property {string} id - 고유 ID
 * @property {ToastType} type - 토스트 타입
 * @property {string=} title - 토스트 제목
 * @property {string} message - 메시지
 * @property {boolean=} isLeaving - 퇴장 애니메이션 여부
 */
export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  isLeaving?: boolean;
}

/**
 * ToastState - 토스트 상태 및 조작 함수
 * @property {Toast[]} toasts - 현재 표시 중인 토스트 배열
 * @property {function} addToast - 토스트 추가(자동 ID, 3초 후 자동 퇴장)
 * @property {function} removeToast - 토스트 퇴장(애니메이션 후 제거)
 * @property {function} clear - 모든 토스트 일괄 퇴장
 */
interface ToastState {
  toasts: Toast[];
}

/**
 * ToastActions - 토스트 조작 함수
 */
interface ToastActions {
  addToast: (toast: Omit<Toast, "id" | "isLeaving">) => void;
  removeToast: (id: string) => void;
  clear: () => void;
}

/**
 * toastSlice - 토스트 상태/액션 훅
 */
const toastSlice: StateCreator<ToastState & ToastActions> = (set, get) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).slice(2, 10);
    const newToast = { ...toast, id, isLeaving: false };
    const toasts = [...get().toasts, newToast].slice(-TOAST_CONFIG.MAX_TOASTS);
    set({ toasts });
    setTimeout(() => {
      get().removeToast(id);
    }, TOAST_CONFIG.TOAST_DURATION);
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.map((t) => (t.id === id ? { ...t, isLeaving: true } : t)),
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, TOAST_CONFIG.TOAST_ANIMATION_DURATION);
  },
  clear: () => {
    set((state) => ({
      toasts: state.toasts.map((t) => ({ ...t, isLeaving: true })),
    }));
    setTimeout(() => {
      set({ toasts: [] });
    }, TOAST_CONFIG.TOAST_ANIMATION_DURATION);
  },
});

export const useToastStore = create<ToastState & ToastActions>()(devtools(toastSlice));
