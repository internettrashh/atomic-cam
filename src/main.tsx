import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ArweaveWalletKit } from "@arweave-wallet-kit/react";
import ArConnectStrategy from "@arweave-wallet-kit/arconnect-strategy";

createRoot(document.getElementById('root')!).render(
  <ArweaveWalletKit
    config={{
      permissions: ["ACCESS_ADDRESS", "SIGN_TRANSACTION"],
      ensurePermissions: true,
      strategies: [new ArConnectStrategy()],
    }}
  >
    <App />
  </ArweaveWalletKit >
)
