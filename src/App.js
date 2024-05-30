import './App.css';
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './home/Home';
import Login from './login/Login';
import Registro from './registro/Registro';
import ActualizarServicio from './ServicIioA/ServicioActualizar';
import Reservar from './reservas/Reservar';
import HorarioActualizar from './reservas/HorarioActualizar';
import ReservasPendientes from './reservaP/ReservasPendientes';


const App = () => {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/actualizar-servicio/:id" element={<ActualizarServicio />} />
              <Route path="/reservar/:servicioId" element={<Reservar />} />
              <Route path="/actualizarHorario-reserva/:servicioId" element={<HorarioActualizar />} />
              <Route path="/reservasPendientes" element={<ReservasPendientes />} />
    
          </Routes>
      </Router>
  );
};

export default App;

