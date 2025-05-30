/**
 * @file SDK.tsx
 * @desc Adena Wallet SDK 연동 및 Gno.land 토큰 전송 메인 페이지 (SDK 기반)
 */
import { useMemo, useCallback, type ReactElement, useState } from "react";
import TitleCard from "@/components/common/TitleCard";
import ReactButton from "@/components/common/ReacButton";
import Gap from "@/components/util/Gap";
import BasicInput from "@/components/common/BasicInput";
import Spinner from "@/components/common/Spinner";
import { MSG } from "@/constants/messages";
import { useAdenaSDK } from "@/hooks/useAdenaSDK";

const SDK = (): ReactElement => {
  const { isConnected, address, balance, isLoading } = useAdenaSDK();

  // 입력 상태 (store 사용 X)
  const [recipient, setRecipient] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // 잔고 포맷팅
  const formattedBalance = useMemo((): string => {
    if (!balance) return "-";
    const float = Number(balance) / 1_000_000;
    return `${float.toFixed(4)} gnot`;
  }, [balance]);

  // // Adena Wallet 연결
  // const handleConnect = useCallback(async () => {
  //   const res = await connect();
  //   if (res && res.code === 0) {
  //     alert(MSG.SUCCESS.WALLET_CONNECTED);
  //   } else {
  //     alert(MSG.ERROR.CONNECTION_FAILED);
  //   }
  // }, [connect]);

  // // 주소 조회
  // const handleGetAddress = useCallback(async () => {
  //   setIsLoadingAddress(true);
  //   try {
  //     const addr = await getAddress();
  //     alert(MSG.SUCCESS.ADDRESS_LOADED);
  //   } catch (e: any) {
  //     alert(e?.message || MSG.ERROR.UNKNOWN);
  //   } finally {
  //     setIsLoadingAddress(false);
  //   }
  // }, [getAddress]);

  // // 잔고 조회
  // const handleGetBalance = useCallback(async () => {
  //   setIsLoadingBalance(true);
  //   try {
  //     const amount = await getBalance();
  //     alert(MSG.SUCCESS.BALANCE_LOADED);
  //   } catch (e: any) {
  //     alert(e?.message || MSG.ERROR.UNKNOWN);
  //   } finally {
  //     setIsLoadingBalance(false);
  //   }
  // }, [getBalance]);

  // // GNOT 전송
  // const handleSend = useCallback(async () => {
  //   setIsSending(true);
  //   try {
  //     if (!address || !recipient || !sendAmount) {
  //       alert(MSG.ERROR.FIELDS_REQUIRED);
  //       return;
  //     }
  //     const res = await sendTokens(address, recipient, sendAmount);
  //     alert(`${MSG.SUCCESS.TX_SUCCESS}\n${MSG.UI.TX_HASH} ${res.txHash}`);
  //   } catch (e: any) {
  //     alert(e?.message || MSG.ERROR.UNKNOWN);
  //   } finally {
  //     setIsSending(false);
  //   }
  // }, [address, recipient, sendAmount, sendTokens]);

  // 입력 핸들러
  const handleRecipientChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipient(e.target.value);
  }, []);
  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSendAmount(e.target.value);
  }, []);

  if (isLoading) {
    return (
      <main className="flex flex-col items-center min-h-screen bg-white">
        <Spinner />
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center min-h-screen bg-white">
      <h1 className="mt-8 mb-8 font-bold text-center text-header">Request to Gno.land via Adena wallet (SDK)</h1>
      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
        {/* Card 1: Wallet 연결 */}
        <TitleCard title={MSG.UI.CONNECT_WALLET}>
          {/* <ReactButton disabled={isConnected} onClick={handleConnect}> */}
          <ReactButton disabled={isConnected} onClick={() => {}}>
            {isConnected ? MSG.UI.CONNECTED : MSG.UI.CONNECT}
          </ReactButton>
        </TitleCard>

        {/* Card 2: 주소 조회 */}
        <TitleCard title={MSG.UI.GET_ADDRESS}>
          {/* <ReactButton disabled={!isConnected || isLoadingAddress} onClick={handleGetAddress}> */}
          <ReactButton disabled={!isConnected || isLoadingAddress} onClick={() => {}}>
            {isLoadingAddress ? MSG.UI.SENDING : MSG.UI.GET_ADDRESS}
          </ReactButton>
          <div className="mt-2 font-semibold text-left text-body">
            {MSG.UI.ADDRESS} {address || "-"}
          </div>
        </TitleCard>

        {/* Card 3: 잔고 조회 */}
        <TitleCard title={MSG.UI.GET_BALANCE}>
          {/* <ReactButton disabled={!isConnected || isLoadingBalance} onClick={handleGetBalance}> */}
          <ReactButton disabled={!isConnected || isLoadingBalance} onClick={() => {}}>
            {isLoadingBalance ? MSG.UI.SENDING : MSG.UI.GET_BALANCE}
          </ReactButton>
          <div className="mt-2 font-semibold text-left text-body">
            {MSG.UI.BALANCE} {formattedBalance}
          </div>
        </TitleCard>

        {/* Card 4: GNOT 전송 */}
        <TitleCard title={MSG.UI.SEND}>
          <label className="block mb-1 font-semibold text-left text-body">{MSG.UI.RECIPIENT}</label>
          <BasicInput placeholder="g1..." disabled={!isConnected} value={recipient} onChange={handleRecipientChange} />

          <Gap h={2} />
          <label className="block mb-1 font-semibold text-left text-body">{MSG.UI.AMOUNT}</label>
          <BasicInput placeholder="1000000" disabled={!isConnected} value={sendAmount} onChange={handleAmountChange} />

          <Gap h={4} />
          {/* <ReactButton disabled={!isConnected || isSending} onClick={handleSend}> */}
          <ReactButton disabled={!isConnected || isSending} onClick={() => {}}>
            {isSending ? MSG.UI.SENDING : MSG.UI.SEND}
          </ReactButton>
        </TitleCard>
      </div>
    </main>
  );
};

export default SDK;
