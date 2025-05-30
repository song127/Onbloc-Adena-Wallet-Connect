/**
 * @file Home.tsx
 * @desc Adena Wallet 연동 및 Gno.land 토큰 전송 메인 페이지
 */
import { useCallback, type ReactElement } from "react";

import { useToastStore } from "@/store/toast";
import TitleCard from "@/components/common/TitleCard";
import ReactButton from "@/components/common/ReacButton";
import { useWalletStore } from "@/store/wallet";
import { useTransferStore } from "@/store/transfer";
import { useAdena } from "@/hooks/useAdena";
import Gap from "@/components/util/Gap";
import BasicInput from "@/components/common/BasicInput";
import Spinner from "@/components/common/Spinner";
import { ErrorCode, type AppError } from "@/types/AppError";
import { MSG } from "@/constants/messages";

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
  const toastDesign = useToastStore((s) => s.toastDesign);
  const setToastDesign = useToastStore((s) => s.setToastDesign);
  const { connect, getAddress, getBalance, sendTokens, isLoading } = useAdena();

  /**
   * 잔고 포맷팅 (gnot 단위)
   */
  // const formattedBalance = useMemo((): string => {
  //   if (!balance) return "-";
  //   // TODO: BigNumber.js 적용 권장
  //   const float = Number(balance) / 1_000_000;
  //   return `${float.toFixed(4)} gnot`;
  // }, [balance]);

  /**
   * Adena Wallet 연결 핸들러
   */
  const handleConnect = useCallback(async (): Promise<void> => {
    try {
      const res = await connect();
      if (res && res.code === 0) {
        addToast({ type: "success", message: MSG.SUCCESS.WALLET_CONNECTED });
      } else if (res && typeof res.message === "string" && res.message.toLowerCase().includes("already")) {
        return;
      } else {
        addToast({ type: "failed", message: MSG.ERROR.CONNECTION_FAILED });
      }
    } catch (e: any) {
      setAddress(null);
      const err = e as AppError;
      setError(err.userMessage || e.message || MSG.ERROR.UNKNOWN);
      addToast({ type: "failed", message: err.userMessage || e.message || MSG.ERROR.UNKNOWN });
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
      addToast({ type: "success", message: MSG.SUCCESS.ADDRESS_LOADED });
    } catch (e: any) {
      setAddress(null);
      const err = e as AppError;
      setError(err.userMessage || e.message || MSG.ERROR.UNKNOWN);
      addToast({ type: "failed", message: err.userMessage || e.message || MSG.ERROR.UNKNOWN });
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
      addToast({ type: "success", message: MSG.SUCCESS.BALANCE_LOADED });
    } catch (e: any) {
      setBalance(null);
      const err = e as AppError;
      addToast({ type: "failed", message: err.userMessage || e.message || MSG.ERROR.UNKNOWN });
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
        addToast({ type: "failed", message: MSG.ERROR.FIELDS_REQUIRED });
        return;
      }
      const res = await sendTokens(address, recipient, sendAmount);
      addToast({ type: "success", title: MSG.SUCCESS.TX_SUCCESS, message: `${MSG.UI.TX_HASH} ${res.txHash}` });
    } catch (e: any) {
      const err = e as AppError;
      addToast({
        type: "failed",
        title: err.code === ErrorCode.TX_FAILED ? MSG.ERROR.TX_FAILED : undefined,
        message: err.userMessage || e.message || MSG.ERROR.UNKNOWN,
      });
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

  // Toast 디자인 토글 핸들러
  const handleToggleToastDesign = useCallback(() => {
    setToastDesign(toastDesign === "basic" ? "custom" : "basic");
  }, [toastDesign, setToastDesign]);

  if (isLoading) {
    return (
      <main className="flex flex-col items-center min-h-screen bg-white">
        <Spinner />
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center min-h-screen bg-white">
      {/* Toast 디자인 토글 버튼 */}
      <div className="flex justify-end w-full pr-8 mt-4">
        <button
          className="px-4 py-2 mr-2 font-semibold text-white transition border rounded bg-success border-success hover:opacity-50"
          onClick={handleToggleToastDesign}
        >
          Toast 디자인: {toastDesign === "basic" ? "Basic" : "Custom"}
        </button>
      </div>
      <h1 className="mt-8 mb-8 font-bold text-center text-header">Request to Gno.land via Adena wallet</h1>
      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
        {/* Card 1: Wallet 연결 */}
        <TitleCard title={MSG.UI.CONNECT_WALLET}>
          <ReactButton disabled={isWalletConnected} onClick={handleConnect}>
            {isWalletConnected ? MSG.UI.CONNECTED : MSG.UI.CONNECT}
          </ReactButton>
        </TitleCard>

        {/* Card 2: 주소 조회 */}
        <TitleCard title={MSG.UI.GET_ADDRESS_TITLE}>
          <ReactButton disabled={!isWalletConnected || isLoadingAddress} onClick={handleGetAddress}>
            {isLoadingAddress ? MSG.UI.LOADING : MSG.UI.GET_ADDRESS_BUTTON}
          </ReactButton>
          <div className="mt-2 font-semibold text-left text-body">
            {MSG.UI.ADDRESS} {address || "-"}
          </div>
        </TitleCard>

        {/* Card 3: 잔고 조회 */}
        <TitleCard title={MSG.UI.GET_BALANCE}>
          <ReactButton disabled={!isWalletConnected || isLoadingBalance} onClick={handleGetBalance}>
            {isLoadingBalance ? MSG.UI.LOADING : MSG.UI.GET_BALANCE}
          </ReactButton>
          <div className="mt-2 font-semibold text-left text-body">
            {MSG.UI.BALANCE} {balance} {balance ? "ugnot" : ""}
          </div>
        </TitleCard>

        {/* Card 4: GNOT 전송 */}
        <TitleCard title={MSG.UI.SEND_TITLE}>
          <label className="block mb-1 font-semibold text-left text-body">{MSG.UI.RECIPIENT}</label>
          <BasicInput placeholder="" disabled={!isWalletConnected} value={recipient} onChange={handleRecipientChange} />

          <Gap h={2} />
          <label className="block mb-1 font-semibold text-left text-body">{MSG.UI.AMOUNT}</label>
          <BasicInput
            placeholder=""
            disabled={!isWalletConnected}
            value={sendAmount}
            onChange={handleAmountChange}
            type="number"
          />

          <Gap h={4} />
          <ReactButton disabled={!isWalletConnected || isSending} onClick={handleSend}>
            {isSending ? MSG.UI.SENDING : MSG.UI.SEND_BUTTON}
          </ReactButton>
        </TitleCard>
      </div>
    </main>
  );
};

export default Home;
