// === src/constants/messages.ts ===
export const MSG = {
  ERROR: {
    ADENA_NOT_INSTALLED: "Adena Wallet is not installed",
    NETWORK_FETCH_FAILED: "Failed to fetch network information",
    ACCOUNT_FETCH_FAILED: "Failed to fetch account information",
    SEND_FAILED: "Failed to send GNOT",
    TX_FAILED: "Transaction Failed",
    UNKNOWN: "An unknown error occurred",
    FIELDS_REQUIRED: "All fields are required",
    CONNECTION_FAILED: "Failed to connect to Adena Wallet",
  },
  SUCCESS: {
    WALLET_CONNECTED: "Wallet connected",
    ADDRESS_LOADED: "Address loaded",
    BALANCE_LOADED: "Balance loaded",
    TX_SUCCESS: "Transaction Success",
  },
  UI: {
    CONNECT: "Connect",
    CONNECTED: "Connected",
    GET_ADDRESS: "Get Address",
    GET_BALANCE: "Get Balance",
    SEND: "Send",
    SENDING: "Sending...",
    RECIPIENT: "Recipient:",
    AMOUNT: "Amount:",
    ADDRESS: "Address:",
    BALANCE: "Balance:",
    TX_HASH: "txHash:",
    CONNECT_WALLET: "Connect Adena Wallet",
  },
} as const;
