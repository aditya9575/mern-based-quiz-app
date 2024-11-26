import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from "react-router-dom"

import { GoogleOAuthProvider } from "@react-oauth/google"


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId='242565866867-sfpafatv1q6mp34sosgihmhrdtsh5l2j.apps.googleusercontent.com'>
        <App />
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)



// 321 effect link -> https://codepen.io/asdraban/pen/BaKoMeE