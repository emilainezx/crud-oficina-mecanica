import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.jsx'
import { Clientes } from './pages/Clientes.jsx'
import './global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<h2 className="text-2xl text-slate-500">Bem-vindo ao Dashboard. Selecione uma opção no menu.</h2>} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="veiculos" element={<h2 className="text-2xl text-slate-500">Tela de veículos em construção...</h2>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)