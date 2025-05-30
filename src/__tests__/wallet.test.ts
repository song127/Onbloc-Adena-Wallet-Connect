// === src/store/__tests__/wallet.test.ts ===
import { act } from "@testing-library/react";

import { useWalletStore } from "@/store/wallet";

describe("useWalletStore", () => {
  beforeEach(() => {
    act(() => {
      useWalletStore.getState().reset();
    });
  });

  it("초기 상태 점검", () => {
    const state = useWalletStore.getState();
    expect(state.isWalletConnected).toBe(false);
    expect(state.address).toBeNull();
    expect(state.balance).toBeNull();
    expect(state.error).toBeNull();
    expect(state.isLoadingAddress).toBe(false);
    expect(state.isLoadingBalance).toBe(false);
  });

  it("setIsWalletConnected 동작", () => {
    act(() => {
      useWalletStore.getState().setIsWalletConnected(true);
    });
    expect(useWalletStore.getState().isWalletConnected).toBe(true);
  });

  it("setAddress 동작", () => {
    act(() => {
      useWalletStore.getState().setAddress("g1abc");
    });
    expect(useWalletStore.getState().address).toBe("g1abc");
  });

  it("setBalance 동작", () => {
    act(() => {
      useWalletStore.getState().setBalance("1000");
    });
    expect(useWalletStore.getState().balance).toBe("1000");
  });

  it("setError 동작", () => {
    act(() => {
      useWalletStore.getState().setError("err");
    });
    expect(useWalletStore.getState().error).toBe("err");
  });

  it("reset 동작", () => {
    act(() => {
      useWalletStore.getState().setIsWalletConnected(true);
      useWalletStore.getState().setAddress("g1abc");
      useWalletStore.getState().setBalance("1000");
      useWalletStore.getState().setError("err");
      useWalletStore.getState().reset();
    });
    const state = useWalletStore.getState();
    expect(state.isWalletConnected).toBe(false);
    expect(state.address).toBeNull();
    expect(state.balance).toBeNull();
    expect(state.error).toBeNull();
  });
});
