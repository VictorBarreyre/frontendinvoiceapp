import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { InvoiceDataProvider } from './context/InvoiceDataContext';

ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <InvoiceDataProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </InvoiceDataProvider>
  </React.StrictMode>,
)
