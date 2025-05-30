/**
 * @file useAdenaSDK.ts
 * @desc Adena Wallet SDK 연동 커스텀 훅 (@adena-wallet/sdk 기반)
 */
import { useState, useCallback } from "react";
// import { AdenaSDK } from "@adena-wallet/sdk";
// import { makeMsgSendMessage, TransactionBuilder, BroadcastType } from "@adena-wallet/sdk";

// AdenaAccount 타입 정의 (기존과 동일)
export interface AdenaAccountSDK {
  address: string;
  coins: string;
}

// 훅 구현
export function useAdenaSDK() {
  // SDK 인스턴스 (싱글턴)
  // const [adenaSDK] = useState(() => AdenaSDK.createAdenaWallet());

  // 상태
  const [isInstalled, setIsInstalled] = useState(true); // SDK는 설치만 하면 true
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState<AdenaAccountSDK | null>(null);
  const [network, setNetwork] = useState<{ chainId: string } | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  /**
   * Adena Wallet 연결
   */
  // const connect = useCallback(async () => {
  //   setIsLoading(true);
  //   try {
  //     await adenaSDK.connectWallet();
  //     setIsConnected(true);
  //     // 연결 후 계정 동기화
  //     const res = await adenaSDK.getAccount();
  //     if (!res.data) throw new Error(res.message || "No account data");
  //     setAccount(res.data);
  //     setAddress(res.data.address);
  //     setBalance(res.data.coins.replace("ugnot", ""));
  //     setNetwork({ chainId: res.data.chainId });
  //     return { code: 0 };
  //   } catch (e: any) {
  //     setIsConnected(false);
  //     setAccount(null);
  //     setAddress(null);
  //     setBalance(null);
  //     setNetwork(null);
  //     return { code: 1, message: e?.message || "Connection failed" };
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [adenaSDK]);

  // /**
  //  * 계정 정보 조회
  //  */
  // const getAccount = useCallback(async (): Promise<AdenaAccountSDK> => {
  //   setIsLoading(true);
  //   try {
  //     const res = await adenaSDK.getAccount();
  //     if (!res.data) throw new Error(res.message || "No account data");
  //     setAccount(res.data);
  //     setAddress(res.data.address);
  //     setBalance(res.data.coins.replace("ugnot", ""));
  //     return { address: res.data.address, coins: res.data.coins.replace("ugnot", "") };
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [adenaSDK]);

  /**
   * 주소 조회
   */
  // const getAddress = useCallback(async (): Promise<string> => {
  //   const acc = await getAccount();
  //   return acc.address;
  // }, [getAccount]);

  // /**
  //  * 잔고 조회
  //  */
  // const getBalance = useCallback(async (): Promise<string> => {
  //   const acc = await getAccount();
  //   return acc.coins;
  // }, [getAccount]);

  /**
   * GNOT 전송
   */
  // const sendTokens = useCallback(
  //   async (from: string, to: string, amount: string | number): Promise<{ txHash: string }> => {
  //     setIsLoading(true);
  //     try {
  //       // 1. 트랜잭션 메시지 생성
  //       const microAmount = Math.floor(Number(amount) * 1_000_000).toString();
  //       const msgSend = makeMsgSendMessage({
  //         from_address: from,
  //         to_address: to,
  //         amount: `${microAmount}ugnot`,
  //       });
  //       // 2. 트랜잭션 빌드
  //       const tx = TransactionBuilder.create()
  //         .messages(msgSend)
  //         .fee(1000, "ugnot") // 기본값, 필요시 조정
  //         .gasWanted(200000) // 기본값, 필요시 조정
  //         .build();
  //       // 3. 서명
  //       const signRes = await adenaSDK.signTransaction({ tx });
  //       if (!signRes.data || !signRes.data.encodedTransaction) throw new Error("Sign failed");
  //       // 4. 브로드캐스트
  //       const broadcastRes = await adenaSDK.broadcastTransaction({ tx, broadcastType: BroadcastType.SYNC });
  //       // hash 추출
  //       let txHash = "";
  //       if (broadcastRes.data && "hash" in broadcastRes.data) {
  //         txHash = broadcastRes.data.hash;
  //       }
  //       if (broadcastRes.code === 0 && txHash) {
  //         return { txHash };
  //       }
  //       throw new Error(broadcastRes.message || "Transaction failed");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   },
  //   [adenaSDK],
  // );

  // /**
  //  * 네트워크 정보 조회
  //  */
  // const getNetwork = useCallback(async (): Promise<{ chainId: string }> => {
  //   setIsLoading(true);
  //   try {
  //     const res = await adenaSDK.getAccount();
  //     if (!res.data) throw new Error(res.message || "No account data");
  //     setNetwork({ chainId: res.data.chainId });
  //     return { chainId: res.data.chainId };
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [adenaSDK]);

  // /**
  //  * 네트워크 전환 (옵션)
  //  */
  // const switchNetwork = useCallback(
  //   async (chainId: string): Promise<void> => {
  //     setIsLoading(true);
  //     try {
  //       await adenaSDK.switchNetwork({ chainId });
  //       await getNetwork();
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   },
  //   [adenaSDK, getNetwork],
  // );

  // /**
  //  * 네트워크 추가 (옵션)
  //  */
  // const addNetwork = useCallback(
  //   async (chainId: string, chainName: string, rpcUrl: string): Promise<void> => {
  //     setIsLoading(true);
  //     try {
  //       await adenaSDK.addNetwork({ chainId, chainName, rpcUrl });
  //       await getNetwork();
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   },
  //   [adenaSDK, getNetwork],
  // );

  return {
    isInstalled,
    isConnected,
    isLoading,
    account,
    network,
    address,
    balance,
    // connect,
    // getAccount,
    // getAddress,
    // getBalance,
    // sendTokens,
    // getNetwork,
    // switchNetwork,
    // addNetwork,
  };
}
