/**
 * @file Home.tsx
 * @desc Adena Wallet 연동 및 Gno.land 토큰 전송 메인 페이지
 */
import { useMemo, useCallback, type ReactElement } from "react";

import TitleCard from "@/components/common/TitleCard";
import ReactButton from "@/components/common/ReacButton";
import { useWalletStore } from "@/store/wallet";
import { useTransferStore } from "@/store/transfer";
import { useToastStore } from "@/store/toast";
import { useAdena } from "@/hooks/useAdena";
import Gap from "@/components/util/Gap";
import BasicInput from "@/components/common/BasicInput";
import Spinner from "@/components/common/Spinner";

/**
 * Home - Adena Wallet 연동 및 Gno.land 토큰 전송 메인 페이지
 */
const Home = (): ReactElement => {
  const {
    isWalletConnected,
    address,
    setAddress,
    balance,
    setBalance,
    setError,
    isLoadingAddress,
    isLoadingBalance,
    setIsLoadingAddress,
    setIsLoadingBalance,
  } = useWalletStore();
  const {
    recipient,
    amount: sendAmount,
    setRecipient,
    setAmount: setSendAmount,
    sending: isSending,
    setSending: setIsSending,
  } = useTransferStore();
  const { addToast } = useToastStore();
  const { connect, getAddress, getBalance, sendTokens, isLoading } = useAdena();

  /**
   * 잔고 포맷팅 (gnot 단위)
   */
  const formattedBalance = useMemo((): string => {
    if (!balance) return "-";
    // TODO: BigNumber.js 적용 권장
    const float = Number(balance) / 1_000_000;
    return `${float.toFixed(4)} gnot`;
  }, [balance]);

  /**
   * Adena Wallet 연결 핸들러
   */
  const handleConnect = useCallback(async (): Promise<void> => {
    try {
      const res = await connect();
      if (res && res.code === 0) {
        addToast({ type: "success", message: "Wallet connected" });
      } else if (res && typeof res.message === "string" && res.message.toLowerCase().includes("already")) {
        return;
      } else {
        throw new Error(res?.message || "Adena connection failed");
      }
    } catch (e: any) {
      setAddress(null);
      setError(e.message);
      addToast({ type: "failed", message: e.message });
    }
  }, [connect, addToast, setAddress, setError]);

  /**
   * 주소 조회 핸들러
   */
  const handleGetAddress = useCallback(async (): Promise<void> => {
    setIsLoadingAddress(true);
    try {
      const addr = await getAddress();
      setAddress(addr);
      addToast({ type: "success", message: "Address loaded" });
    } catch (e: any) {
      setAddress(null);
      setError(e.message);
      addToast({ type: "failed", message: e.message });
    } finally {
      setIsLoadingAddress(false);
    }
  }, [getAddress, setAddress, setError, setIsLoadingAddress, addToast]);

  /**
   * 잔고 조회 핸들러
   */
  const handleGetBalance = useCallback(async (): Promise<void> => {
    setIsLoadingBalance(true);
    try {
      const amount = await getBalance();
      setBalance(amount);
      addToast({ type: "success", message: "Balance loaded" });
    } catch (e: any) {
      setBalance(null);
      addToast({ type: "failed", message: e.message });
    } finally {
      setIsLoadingBalance(false);
    }
  }, [getBalance, setBalance, setIsLoadingBalance, addToast]);

  /**
   * GNOT 전송 핸들러
   */
  const handleSend = useCallback(async (): Promise<void> => {
    setIsSending(true);
    try {
      if (!address || !recipient || !sendAmount) {
        addToast({ type: "failed", message: "All fields are required." });
        return;
      }
      const res = await sendTokens(address, recipient, sendAmount);
      addToast({ type: "success", title: "Transaction Success", message: `txHash: ${res.txHash}` });
    } catch (e: any) {
      console.error(e);
      addToast({ type: "failed", message: e.message });
    } finally {
      setIsSending(false);
    }
  }, [address, recipient, sendAmount, sendTokens, setIsSending, addToast]);

  /**
   * Recipient 입력 핸들러
   */
  const handleRecipientChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setRecipient(e.target.value);
    },
    [setRecipient],
  );

  /**
   * Amount 입력 핸들러
   */
  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setSendAmount(e.target.value);
    },
    [setSendAmount],
  );

  if (isLoading) {
    return (
      <main className="flex flex-col items-center min-h-screen bg-white">
        <Spinner />
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center min-h-screen bg-white">
      <h1 className="mt-8 mb-8 font-bold text-center text-header">Request to Gno.land via Adena wallet</h1>
      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
        {/* Card 1: Wallet 연결 */}
        <TitleCard title="Connect Adena Wallet">
          <ReactButton disabled={isWalletConnected} onClick={handleConnect}>
            {isWalletConnected ? "Connected" : "Connect"}
          </ReactButton>
        </TitleCard>

        {/* Card 2: 주소 조회 */}
        <TitleCard title="Get Gno.land Address">
          <ReactButton disabled={!isWalletConnected || isLoadingAddress} onClick={handleGetAddress}>
            {isLoadingAddress ? "Loading..." : "Get Address"}
          </ReactButton>
          <div className="mt-2 font-semibold text-left text-body">Address: {address || "-"}</div>
        </TitleCard>

        {/* Card 3: 잔고 조회 */}
        <TitleCard title="Get Balance">
          <ReactButton disabled={!isWalletConnected || isLoadingBalance} onClick={handleGetBalance}>
            {isLoadingBalance ? "Loading..." : "Get Balance"}
          </ReactButton>
          <div className="mt-2 font-semibold text-left text-body">Balance: {formattedBalance}</div>
        </TitleCard>

        {/* Card 4: GNOT 전송 */}
        <TitleCard title="Send GNOT">
          <label className="block mb-1 font-semibold text-left text-body">Recipient:</label>
          <BasicInput
            placeholder="g1..."
            disabled={!isWalletConnected}
            value={recipient}
            onChange={handleRecipientChange}
          />

          <Gap h={2} />
          <label className="block mb-1 font-semibold text-left text-body">Amount:</label>
          <BasicInput
            placeholder="1000000"
            disabled={!isWalletConnected}
            value={sendAmount}
            onChange={handleAmountChange}
          />

          <Gap h={4} />
          <ReactButton disabled={!isWalletConnected || isSending} onClick={handleSend}>
            {isSending ? "Sending..." : "Send"}
          </ReactButton>
        </TitleCard>
      </div>
    </main>
  );
};

export default Home;
