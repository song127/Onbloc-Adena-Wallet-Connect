// === src/store/__tests__/transfer.test.ts ===
import { act } from "@testing-library/react";

import { useTransferStore } from "@/store/transfer";

describe("useTransferStore", () => {
  beforeEach(() => {
    act(() => {
      useTransferStore.getState().reset();
    });
  });

  it("초기 상태 점검", () => {
    const state = useTransferStore.getState();
    expect(state.recipient).toBe("");
    expect(state.amount).toBe("");
    expect(state.sending).toBe(false);
    expect(state.error).toBeNull();
    expect(state.txHash).toBeNull();
  });

  it("setRecipient 동작", () => {
    act(() => {
      useTransferStore.getState().setRecipient("g1xyz");
    });
    expect(useTransferStore.getState().recipient).toBe("g1xyz");
  });

  it("setAmount 동작", () => {
    act(() => {
      useTransferStore.getState().setAmount("123");
    });
    expect(useTransferStore.getState().amount).toBe("123");
  });

  it("setSending 동작", () => {
    act(() => {
      useTransferStore.getState().setSending(true);
    });
    expect(useTransferStore.getState().sending).toBe(true);
  });

  it("setError 동작", () => {
    act(() => {
      useTransferStore.getState().setError("err");
    });
    expect(useTransferStore.getState().error).toBe("err");
  });

  it("setTxHash 동작", () => {
    act(() => {
      useTransferStore.getState().setTxHash("tx123");
    });
    expect(useTransferStore.getState().txHash).toBe("tx123");
  });

  it("reset 동작", () => {
    act(() => {
      useTransferStore.getState().setRecipient("g1xyz");
      useTransferStore.getState().setAmount("123");
      useTransferStore.getState().setSending(true);
      useTransferStore.getState().setError("err");
      useTransferStore.getState().setTxHash("tx123");
      useTransferStore.getState().reset();
    });
    const state = useTransferStore.getState();
    expect(state.recipient).toBe("");
    expect(state.amount).toBe("");
    expect(state.sending).toBe(false);
    expect(state.error).toBeNull();
    expect(state.txHash).toBeNull();
  });
});
