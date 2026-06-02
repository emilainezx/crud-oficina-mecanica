import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.jsx'
import { Clientes } from './pages/Clientes.jsx'
import { Veiculos } from './pages/Veiculos.jsx'
import { Funcionarios } from './pages/Funcionarios.jsx'
import { Itens } from './pages/Itens.jsx'
import { OrdemServicos } from './pages/OrdemServicos.jsx'
import { Dashboard } from './pages/Dashboard.jsx' // <-- Garanta que essa linha existe
import './global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} /> 
          <Route path="clientes" element={<Clientes />} />
          <Route path="veiculos" element={<Veiculos />} />
          <Route path="funcionarios" element={<Funcionarios />} />
          <Route path="itens" element={<Itens />} />
          <Route path="ordens" element={<OrdemServicos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)