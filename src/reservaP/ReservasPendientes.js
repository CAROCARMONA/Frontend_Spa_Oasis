import '../login/Login.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReservasPendientes = () => {
  const [reservas, setReservas] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [disponibilidades, setDisponibilidades] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      };
  
      const reservasResponse = await axios.get(`http://localhost:8552/api/reserva/obtenerTodas`, config);
      setReservas(reservasResponse.data);
  
      const pagosResponse = await axios.get(`http://localhost:8552/api/pagos/obtenerTodos`, config);
      setPagos(pagosResponse.data);
  
      // Obtener la disponibilidad para cada reserva
      const disponibilidadPromises = reservasResponse.data.map(async (reserva) => {
        const disponibilidadResponse = await axios.get(`http://localhost:8552/api/disponibilidad/obtenerPorId/${reserva.disponibilidadId}`, config);
        return [reserva._id, disponibilidadResponse.data];
      });
  
      const disponibilidadMap = Object.fromEntries(await Promise.all(disponibilidadPromises));
      setDisponibilidades(disponibilidadMap);
    } catch (error) {
      console.error('Error al obtener las reservas, pagos y disponibilidades:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [token]);

  const handleVolver = () => {
    navigate('/'); // Navegar a la página de inicio
  };
  const handleConfirmar = async (reservaId, pagoId) => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      };
  
      // Actualizar el estado de la reserva a "Confirmada"
      await axios.put(`http://localhost:8552/api/reserva/actualizar/${reservaId}`, { estado: 'Confirmada' }, config);
  
      // Actualizar el estado del pago a "Aprobado"
      await axios.put(`http://localhost:8552/api/pagos/actualizar/${pagoId}`, { estado: 'Aprobado' }, config);
  
      // Recargar los datos después de la actualización
      fetchData();
    } catch (error) {
      console.error('Error al confirmar la reserva y el pago:', error);
    }
  };
  return (
    <div className="reservasp bg-white">
      <div className="h2 text-center">Oasis Spa</div>
      <div className="pt-3">
        <h2 className="text-center">Reservas Pendientes</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Nombre del Usuario</th>
              <th>Nombre del Servicio</th>
              <th>Fecha de Reserva</th>
              <th>Día de la Semana</th>
              <th>Hora de Inicio</th>
              <th>Hora de Fin</th>
              <th>Valor a pagar</th>
              <th>Método</th>
              <th>Teléfono</th>
              <th>Estado</th>
              
              
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva) => {
              const pagoAsociado = pagos.find((pago) => pago.reservaId === reserva._id);
              const disponibilidad = disponibilidades[reserva._id];
              return (
                <tr key={reserva._id}>
                  <td>{reserva.nombreUsuario}</td>
                  <td>{reserva.nombreServicio}</td>
                  <td>{new Date(reserva.fecha).toLocaleDateString()}</td>
                  <td>{disponibilidad ? disponibilidad.diaSemana : '-'}</td>
                  <td>{disponibilidad ? disponibilidad.horaInicio : '-'}</td>
                  <td>{disponibilidad ? disponibilidad.horaFin : '-'}</td>
                  <td>{pagoAsociado ? pagoAsociado.monto : '-'}</td>
                  <td>{pagoAsociado ? pagoAsociado.metodo : '-'}</td>
                  <td>{pagoAsociado ? pagoAsociado.telefono : '-'}</td>
                  <td>{reserva.estado}</td>
                  {reserva.estado === 'Pendiente' ? (
                    <td>
                        <button onClick={() => handleConfirmar(reserva._id, pagoAsociado._id)} className="btn btn-primary">
                        Confirmar
                        </button>
                    </td>
                    ) : (
                    <td>
                        <button disabled className="btn btn-primary selected">
                        <span className="text-success">✓</span>
                        </button>
                        
                    </td>
                    )}
                 
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="d-flex justify-content-center align-items-center mt-2">
          <button onClick={handleVolver} className="btn btn-primary">
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservasPendientes;