// === src/hooks/useAdena.ts ===
/**
 * @file useAdena.ts
 * @desc Adena Wallet 연동 커스텀 훅 (window.adena 래핑)
 */
import { useState, useEffect, useCallback } from "react";

import { useWalletStore } from "@/store/wallet";
import { PORTAL_LOOP_NETWORK_CONFIG } from "@/constants/config";
import { ErrorCode, createAppError } from "@/types/AppError";
import { MSG } from "@/constants/messages";

/**
 * AdenaAccount - Adena 계정 정보
 * @property {string} address - 계정 주소
 * @property {string} coins - 보유 코인(잔고)
 */
export interface AdenaAccount {
  address: string;
  coins: string;
}

/**
 * Adena Wallet 응답 유효성 검사
 * @param res - Adena 응답 객체
 * @returns {boolean}
 */
const checkResponseSuccess = (res: any): boolean => {
  return res && res.data && res.code === 0;
};

/**
 * useAdena - Adena Wallet 연동 및 상태 관리 커스텀 훅
 */
export function useAdena() {
  // Adena 설치 여부
  const [isInstalled, setIsInstalled] = useState(false);
  // Adena 연결 여부
  const [isConnected, setIsConnected] = useState(false);
  // 상태 로딩 여부
  const [isLoading, setIsLoading] = useState(true);
  // 현재 계정 정보
  const [account, setAccount] = useState<AdenaAccount | null>(null);
  // 현재 네트워크 정보
  const [network, setNetwork] = useState<{ chainId: string } | null>(null);
  // Wallet Store 액션
  const { setAddress, setBalance, setIsWalletConnected } = useWalletStore();

  /**
   * window.adena 객체 반환
   */
  const getAdena = () => {
    if (!window.adena)
      throw createAppError(ErrorCode.ADENA_NOT_INSTALLED, MSG.ERROR.ADENA_NOT_INSTALLED, MSG.ERROR.ADENA_NOT_INSTALLED);
    return window.adena;
  };

  /**
   * 네트워크 정보 조회
   * @returns {Promise<{ chainId: string }>}
   * @throws {Error} Adena Wallet 미설치 또는 네트워크 정보 조회 실패 시
   */
  const getNetwork = useCallback(async (): Promise<{ chainId: string }> => {
    const adena = getAdena();
    const res = await adena.GetNetwork();
    if (!checkResponseSuccess(res) || !res.data.chainId)
      throw createAppError(ErrorCode.NETWORK_ERROR, MSG.ERROR.NETWORK_FETCH_FAILED, MSG.ERROR.NETWORK_FETCH_FAILED);
    return { chainId: res.data.chainId };
  }, []);

  /**
   * 네트워크 전환
   * @param {string} chainId - 전환할 체인 ID
   * @returns {Promise<void>}
   * @throws {Error} Adena Wallet 미설치 시
   */
  const switchNetwork = useCallback(async (chainId: string): Promise<void> => {
    const adena = getAdena();
    if (!adena)
      throw createAppError(ErrorCode.ADENA_NOT_INSTALLED, MSG.ERROR.ADENA_NOT_INSTALLED, MSG.ERROR.ADENA_NOT_INSTALLED);
    await adena.SwitchNetwork({ chainId });
  }, []);

  /**
   * 네트워크 추가
   * @returns {Promise<void>}
   * @throws {Error} Adena Wallet 미설치 시
   */
  const addNetwork = useCallback(async (): Promise<void> => {
    const adena = getAdena();
    if (!adena)
      throw createAppError(ErrorCode.ADENA_NOT_INSTALLED, MSG.ERROR.ADENA_NOT_INSTALLED, MSG.ERROR.ADENA_NOT_INSTALLED);
    await adena.AddNetwork({
      chainId: PORTAL_LOOP_NETWORK_CONFIG.CHAIN_ID,
      chainName: PORTAL_LOOP_NETWORK_CONFIG.CHAIN_NAME,
      rpcUrl: PORTAL_LOOP_NETWORK_CONFIG.RPC_URL,
    });
  }, []);

  /**
   * Adena 연결 요청 (Portal Loop 네트워크만 허용)
   * @returns {Promise<any>} Establish 결과
   * @throws {Error} Adena Wallet 미설치 시
   */
  const connect = useCallback(async () => {
    const adena = getAdena();
    // 1. Establish
    const establishRes = await adena.AddEstablish("Adena");
    if (checkResponseSuccess(establishRes)) {
      setIsConnected(true);
      setIsWalletConnected(true);
    } else if (typeof establishRes.message === "string" && establishRes.message.toLowerCase().includes("already")) {
      setIsConnected(true);
      setIsWalletConnected(true);
    } else {
      setIsConnected(false);
      throw createAppError(
        ErrorCode.ADENA_NOT_INSTALLED,
        MSG.ERROR.CONNECTION_FAILED,
        establishRes?.message || MSG.ERROR.CONNECTION_FAILED,
      );
    }
    // 2. 네트워크 확인/전환
    const network = await getNetwork();
    if (network.chainId !== PORTAL_LOOP_NETWORK_CONFIG.CHAIN_ID) {
      try {
        await switchNetwork(PORTAL_LOOP_NETWORK_CONFIG.CHAIN_ID);
      } catch (_) {
        await addNetwork();
        await switchNetwork(PORTAL_LOOP_NETWORK_CONFIG.CHAIN_ID);
      }
    }
    return establishRes;
  }, [getNetwork, switchNetwork, addNetwork, setIsWalletConnected]);

  /**
   * 계정 정보 조회
   * @returns {Promise<AdenaAccount>}
   * @throws {Error} Adena Wallet 미설치 또는 계정 정보 조회 실패 시
   */
  const getAccount = useCallback(async (): Promise<AdenaAccount> => {
    const adena = getAdena();
    const res = await adena.GetAccount();
    if (!checkResponseSuccess(res) || !res.data.address || !res.data.coins)
      throw createAppError(ErrorCode.NETWORK_ERROR, MSG.ERROR.ACCOUNT_FETCH_FAILED, MSG.ERROR.ACCOUNT_FETCH_FAILED);
    return { address: res.data.address, coins: res.data.coins.replace("ugnot", "") };
  }, []);

  /**
   * 계정 주소 조회
   * @returns {Promise<string>}
   */
  const getAddress = useCallback(async (): Promise<string> => {
    const data = await getAccount();
    return data.address;
  }, [getAccount]);

  /**
   * 잔액 조회
   * @returns {Promise<string>}
   */
  const getBalance = useCallback(async (): Promise<string> => {
    const data = await getAccount();
    return data.coins;
  }, [getAccount]);

  /**
   * GNOT 전송 (Adena DoContract 사용)
   * @param {string} from - 보내는 주소
   * @param {string} to - 받는 주소
   * @param {string | number} amount - 전송할 GNOT (정수, 소수점 가능)
   * @returns {Promise<{ txHash: string }>}
   * @throws {Error} Adena Wallet 미설치 또는 전송 실패 시
   */
  const sendTokens = useCallback(
    async (from: string, to: string, amount: string | number): Promise<{ txHash: string }> => {
      const adena = getAdena();
      const microAmount = Math.floor(Number(amount) * 1_000_000).toString();
      try {
        const res = await adena.DoContract({
          messages: [
            {
              type: "/bank.MsgSend",
              value: {
                from_address: from,
                to_address: to,
                amount: `${microAmount}ugnot`,
              },
            },
          ],
        });

        // 성공: code === 0 && hash 있음
        if (checkResponseSuccess(res) && res.data.hash) {
          return { txHash: res.data.hash };
        }

        // TX 실패: code !== 0 && hash 있음
        if (!checkResponseSuccess(res) && res.data.hash) {
          throw createAppError(
            ErrorCode.TX_FAILED,
            `${MSG.UI.TX_HASH} ${res.data.hash}`,
            res?.message || MSG.ERROR.TX_FAILED,
          );
        }

        // 일반 실패: code !== 0 && hash 없음
        throw createAppError(ErrorCode.SEND_FAILED, MSG.ERROR.SEND_FAILED, res?.message || MSG.ERROR.SEND_FAILED);
      } catch (e: any) {
        if (e.code === ErrorCode.TX_FAILED) {
          throw createAppError(ErrorCode.TX_FAILED, MSG.ERROR.TX_FAILED, e?.message || MSG.ERROR.TX_FAILED, e);
        } else {
          throw createAppError(ErrorCode.SEND_FAILED, MSG.ERROR.SEND_FAILED, e?.message || MSG.ERROR.SEND_FAILED, e);
        }
      }
    },
    [],
  );

  // Adena 설치 여부 감지
  useEffect(() => {
    let tries = 0;
    const interval = setInterval(() => {
      if (typeof window !== "undefined" && !!window.adena) {
        setIsInstalled(true);
        clearInterval(interval);
      } else {
        tries++;
        if (tries > 5) {
          clearInterval(interval);
          setIsLoading(false);
          alert(MSG.ERROR.ADENA_NOT_INSTALLED);
        }
      }
    }, 10);
    return () => clearInterval(interval);
  }, []);

  // 연결/계정/네트워크 상태 자동 감지 및 실시간 반영
  useEffect(() => {
    if (!isInstalled) return;

    let cancelled = false;
    const adena = window.adena;
    if (!adena) {
      return;
    }

    // 연결/계정/네트워크 정보 동기화
    const checkAll = async () => {
      try {
        // 연결 상태 확인 (계정 정보가 있으면 연결로 간주)
        let connected = false;
        let acc: AdenaAccount | null = null;
        try {
          acc = await getAccount();
          connected = !!acc;
        } catch (_) {
          connected = false;
          acc = null;
        }

        // 네트워크 정보 확인
        let net = null;
        try {
          net = await getNetwork();
        } catch (_) {
          net = null;
        }

        if (!cancelled) {
          setNetwork(net);
          setIsConnected(connected);
          setIsWalletConnected(connected);

          if (connected && net && net.chainId === PORTAL_LOOP_NETWORK_CONFIG.CHAIN_ID) {
            setAccount(acc);
            setAddress(acc?.address ?? null);
            setBalance(acc?.coins ?? null);
          } else {
            setAccount(null);
            setAddress(null);
            setBalance(null);
          }
        }
      } catch (_) {
        if (!cancelled) {
          setIsConnected(false);
          setIsWalletConnected(false);
          setAccount(null);
          setAddress(null);
          setBalance(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    checkAll();

    // 계정 변경 이벤트 핸들러
    const accountHandler = async () => {
      try {
        setIsLoading(true);
        const acc = await getAccount();
        setIsConnected(!!acc);
        setAccount(acc);
        setIsWalletConnected(true);
        setAddress(acc?.address ?? null);
        setBalance(acc?.coins ?? null);
      } catch (_) {
        // ignore
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    let offAccount: (() => void) | undefined;
    if (typeof adena.On === "function") {
      offAccount = adena.On("changedAccount", accountHandler);
    }

    // 네트워크 변경 이벤트 핸들러
    const networkHandler = async () => {
      try {
        setIsLoading(true);
        const net = await getNetwork();
        setNetwork(net);
        if (net.chainId === PORTAL_LOOP_NETWORK_CONFIG.CHAIN_ID) {
          setIsConnected(true);
          const acc = await getAccount();
          setAddress(acc?.address ?? null);
          setBalance(acc?.coins ?? null);
        } else {
          setIsConnected(false);
          setAddress(null);
          setBalance(null);
        }
        setIsLoading(false);
      } catch (_) {
        // ignore
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    let offNetwork: (() => void) | undefined;
    if (typeof adena.On === "function") {
      offNetwork = adena.On("changedNetwork", networkHandler);
    }

    // cleanup
    return () => {
      cancelled = true;
      if (typeof offAccount === "function") offAccount();
      if (typeof offNetwork === "function") offNetwork();
    };
  }, [isInstalled, getAccount, getNetwork, setIsWalletConnected, setAddress, setBalance]);

  return {
    isInstalled,
    isConnected,
    isLoading,
    account,
    network,
    connect,
    getAccount,
    getAddress,
    getBalance,
    sendTokens,
    getNetwork,
    switchNetwork,
    addNetwork,
  };
}
