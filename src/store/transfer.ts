// === src/store/transfer.ts ===
/**
 * @file transfer.ts
 * @desc GNOT 전송 상태(Zustand slice, selector/미들웨어/분리 패턴 적용)
 */
import { create } from "zustand";
import type { StateCreator } from "zustand";
import { persist, devtools } from "zustand/middleware";

/**
 * TransferState - GNOT 전송 상태
 */
interface TransferState {
  recipient: string;
  amount: string;
  sending: boolean;
  error: string | null;
  txHash: string | null;
}

/**
 * TransferActions - 상태 조작 함수
 */
interface TransferActions {
  setRecipient: (recipient: string) => void;
  setAmount: (amount: string) => void;
  setSending: (sending: boolean) => void;
  setError: (error: string | null) => void;
  setTxHash: (txHash: string | null) => void;
  reset: () => void;
}

/**
 * useTransferStore - GNOT 전송 상태/액션 훅 (selector 패턴)
 */
const transferSlice: StateCreator<TransferState & TransferActions> = (set) => ({
  recipient: "",
  amount: "",
  sending: false,
  error: null,
  txHash: null,
  setRecipient: (recipient: string) => set({ recipient }),
  setAmount: (amount: string) => set({ amount }),
  setSending: (sending: boolean) => set({ sending }),
  setError: (error: string | null) => set({ error }),
  setTxHash: (txHash: string | null) => set({ txHash }),
  reset: () => set({ recipient: "", amount: "", sending: false, error: null, txHash: null }),
});

export const useTransferStore = create<TransferState & TransferActions>()(
  devtools(
    persist(transferSlice, {
      name: "transfer-storage",
      partialize: (state) => ({ recipient: state.recipient, amount: state.amount }),
    }),
  ),
);
