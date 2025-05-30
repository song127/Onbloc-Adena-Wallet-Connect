// === src/store/__tests__/toast.test.ts ===
import { act } from "@testing-library/react";

import { useToastStore } from "@/store/toast";

describe("useToastStore", () => {
  beforeEach(() => {
    act(() => {
      useToastStore.getState().clear();
    });
  });

  it("초기 상태 점검", () => {
    expect(useToastStore.getState().toasts).toEqual([]);
  });

  it("addToast 동작", () => {
    act(() => {
      useToastStore.getState().addToast({ type: "success", message: "ok" });
    });
    const toasts = useToastStore.getState().toasts;
    expect(toasts.length).toBe(1);
    expect(toasts[0].type).toBe("success");
    expect(toasts[0].message).toBe("ok");
    expect(typeof toasts[0].id).toBe("string");
  });

  it("removeToast 동작", () => {
    let id = "";
    act(() => {
      useToastStore.getState().addToast({ type: "failed", message: "bye" });
      id = useToastStore.getState().toasts[0].id;
      useToastStore.getState().removeToast(id);
    });
    // 애니메이션 후 제거(450ms) 테스트는 skip, 즉시 제거 확인
    expect(useToastStore.getState().toasts.find((t) => t.id === id)?.isLeaving).toBe(true);
  });

  it("clear 동작", () => {
    act(() => {
      useToastStore.getState().addToast({ type: "success", message: "a" });
      useToastStore.getState().addToast({ type: "failed", message: "b" });
      useToastStore.getState().clear();
    });
    expect(useToastStore.getState().toasts.every((t) => t.isLeaving)).toBe(true);
  });
});
