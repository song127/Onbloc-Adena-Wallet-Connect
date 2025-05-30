// === src/__tests__/useAdena.test.ts ===
import { renderHook, act } from "@testing-library/react";

import { useAdena } from "@/hooks/useAdena";

describe("useAdena", () => {
  const mockAdena = {
    AddEstablish: jest.fn(),
    GetAccount: jest.fn(),
    GetNetwork: jest.fn(),
    SwitchNetwork: jest.fn(),
    AddNetwork: jest.fn(),
    DoContract: jest.fn(),
    On: jest.fn(() => jest.fn()),
  };

  beforeEach(() => {
    global.window.adena = mockAdena;
    jest.clearAllMocks();
  });

  it("connect: 정상 연결", async () => {
    mockAdena.AddEstablish.mockResolvedValue({ code: 0, data: {} });
    mockAdena.GetNetwork.mockResolvedValue({ code: 0, data: { chainId: "portal-loop" } });
    const { result } = renderHook(() => useAdena());
    await act(async () => {
      const res = await result.current.connect();
      expect(res.code).toBe(0);
    });
  });

  it("getAccount: 계정 정보 반환", async () => {
    mockAdena.GetAccount.mockResolvedValue({ code: 0, data: { address: "g1abc", coins: "1000ugnot" } });
    const { result } = renderHook(() => useAdena());
    await act(async () => {
      const acc = await result.current.getAccount();
      expect(acc.address).toBe("g1abc");
      expect(acc.coins).toBe("1000");
    });
  });

  it("getAddress: 주소 반환", async () => {
    mockAdena.GetAccount.mockResolvedValue({ code: 0, data: { address: "g1xyz", coins: "0ugnot" } });
    const { result } = renderHook(() => useAdena());
    await act(async () => {
      const addr = await result.current.getAddress();
      expect(addr).toBe("g1xyz");
    });
  });

  it("getBalance: 잔고 반환", async () => {
    mockAdena.GetAccount.mockResolvedValue({ code: 0, data: { address: "g1xyz", coins: "1234ugnot" } });
    const { result } = renderHook(() => useAdena());
    await act(async () => {
      const bal = await result.current.getBalance();
      expect(bal).toBe("1234");
    });
  });

  it("sendTokens: 정상 전송", async () => {
    mockAdena.DoContract.mockResolvedValue({ code: 0, data: { hash: "txhash" } });
    const { result } = renderHook(() => useAdena());
    await act(async () => {
      const res = await result.current.sendTokens("g1a", "g1b", 1);
      expect(res.txHash).toBe("txhash");
    });
  });
});
