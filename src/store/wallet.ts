// === src/store/wallet.ts ===
/**
 * @file wallet.ts
 * @desc Adena Wallet 상태(Zustand slice, selector/미들웨어/분리 패턴 적용)
 */
import { create } from "zustand";
import type { StateCreator } from "zustand";
import { persist, devtools } from "zustand/middleware";

/**
 * WalletState - Adena Wallet 상태
 */
interface WalletState {
  isWalletConnected: boolean;
  address: string | null;
  isLoadingAddress: boolean;
  balance: string | null;
  isLoadingBalance: boolean;
  error: string | null;
}

/**
 * WalletActions - 상태 조작 함수
 */
interface WalletActions {
  setIsWalletConnected: (connected: boolean) => void;
  setAddress: (address: string | null) => void;
  setIsLoadingAddress: (loading: boolean) => void;
  setBalance: (amount: string | null) => void;
  setIsLoadingBalance: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

/**
 * useWalletStore - Adena Wallet 상태/액션 훅 (selector 패턴)
 */
const walletSlice: StateCreator<WalletState & WalletActions> = (set) => ({
  // 상태
  isWalletConnected: false,
  address: null,
  isLoadingAddress: false,
  isLoadingBalance: false,
  error: null,
  balance: null,
  // 액션
  setIsWalletConnected: (isWalletConnected: boolean) => set({ isWalletConnected }),
  setAddress: (address: string | null) => set({ address }),
  setIsLoadingAddress: (isLoadingAddress: boolean) => set({ isLoadingAddress }),
  setBalance: (balance: string | null) => set({ balance }),
  setIsLoadingBalance: (isLoadingBalance: boolean) => set({ isLoadingBalance }),
  setError: (error: string | null) => set({ error }),
  reset: () =>
    set({
      isWalletConnected: false,
      address: null,
      balance: null,
      error: null,
      isLoadingAddress: false,
      isLoadingBalance: false,
    }),
});

export const useWalletStore = create<WalletState & WalletActions>()(
  devtools(
    persist(walletSlice, {
      name: "wallet-storage",
      partialize: (state) => ({ isWalletConnected: state.isWalletConnected, address: state.address }),
    }),
  ),
);
