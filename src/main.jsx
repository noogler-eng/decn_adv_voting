import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThirdwebProvider } from "@thirdweb-dev/react";

import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThirdwebProvider clientId='fbbbd2edde9aa214f9355632e24386d6' activeChain={'sepolia'}>
    <App />
  </ThirdwebProvider>
)
