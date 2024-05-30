
import '../login/Login.css';
import axios from 'axios';

import React, { useEffect, useState } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import {  useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Reservar = () => {
   
    const { servicioId } = useParams();
    const [searchParams] = useSearchParams();
    const monto = searchParams.get('monto');
    const tituloservicio = searchParams.get('tituloservicio');
    
    const navigate = useNavigate();
    const [disponibilidad, setDisponibilidad] = useState([]);
    const [selectedHorario, setSelectedHorario] = useState(null);
    const [metodoPago, setMetodoPago] = useState('Tarjeta');
    const [telefono, setTelefono] = useState('');
    const [showModal, setShowModal] = useState(false);
     // Puedes obtener el monto desde algún otro lugar, aquí es solo un ejemplo

    useEffect(() => {
        const fetchDisponibilidad = async () => {
            try {
                const response = await axios.get(`http://localhost:8552/api/disponibilidad/obtenerPorServicio/${servicioId}`);
                setDisponibilidad(response.data);
            } catch (error) {
                console.error('Error al obtener la disponibilidad:', error);
            }
        };

        fetchDisponibilidad();
    }, [servicioId]);

    const handleReservar = async () => {
        try {
            const token = localStorage.getItem('token'); // Obtener el token de localStorage
            const nombreusuario = localStorage.getItem('nombre');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}` // Añadir el token al encabezado de autorización
                }
            };
           
                   // Obtener y formatear la fecha actual
                  const fechaActual = new Date();
             
                  
         
                  
            const reservaResponse = await axios.post('http://localhost:8552/api/reserva/crear', {
                servicioId,
                usuarioId: localStorage.getItem('usuarioId'), // Asegúrate de manejar la autenticación y obtén el usuario ID correctamente
                disponibilidadId:selectedHorario,
                nombreUsuario:nombreusuario,
                nombreServicio:tituloservicio,
                fecha: fechaActual,
                estado: 'Pendiente'
            }, config);
    
            console.log('Reserva creada exitosamente:');
    
            const pagoResponse = await axios.post('http://localhost:8552/api/pagos/crear', {
                reservaId: reservaResponse.data.reservaCreada._id,
                monto,
                fecha: fechaActual, // Fecha en formato ISO
                telefono,
                metodo: metodoPago,
                estado: 'Pendiente'
            }, config);
    
           
           
            // Realizar la solicitud PUT con el token de autorización
            const disponibilidadResponse = await axios.put(`http://localhost:8552/api/disponibilidad/actualizar/${selectedHorario}`, 
            { estado: 'Inactivo' }, config);
    
            console.log('Disponibilidad actualizada exitosamente:');
    
            
            setShowModal(true);

        } catch (error) {
            console.error('Error al crear la reserva, el pago o actualizar la disponibilidad:', error);
        }
    };
    
    const handleModalClose = (event) => {
      if (event.target === event.currentTarget) {
        setShowModal(false);
        navigate('/');
      }
    }
  return (
    
    <div className="wrapper bg-white">
    
      <div className="h2 text-center">Oasis Spa</div>
    <div className="pt-3">
    
        <h2 className="text-center ">Disponibilidad de Horarios</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Día de la Semana</th>
              <th>Hora de Inicio</th>
              <th>Hora de Fin</th>
              <th>Seleccionar</th>
            </tr>
          </thead>
          <tbody>
            {disponibilidad.map((dispo) => (
              <tr key={dispo._id}>
                <td>{dispo.diaSemana}</td>
                <td>{dispo.horaInicio}</td>
                <td>{dispo.horaFin}</td>
                <td>

                  <button
                        className={`btn btn-primary ${selectedHorario === dispo._id ? 'selected' : ''}`}
                        onClick={() => setSelectedHorario(dispo._id)}
                        >
                        Seleccionar
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedHorario && (
          <div className="pt-3">
            <h3>Selecciona el método de pago</h3>
            <div className="form-group py-2">
              <div className="input-field d-flex align-items-center">
                <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} className="form-control">
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Pago en linea">Pago en línea</option>
                </select>
              </div>
            </div>
            <div className="form-group py-2">
              <div className="input-field d-flex align-items-center">
                <FontAwesomeIcon icon={faUser} className="p-2" />
                <span>Monto a pagar: {monto}</span>
              </div>
            </div>
            <div className="form-group py-2">
              <div className="input-field d-flex align-items-center">
                <FontAwesomeIcon icon={faUser} className="p-2" />
                <input
                  type="text"
                  placeholder="Ingrese su número de teléfono"
                  required
                  className="form-control"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <button onClick={handleReservar} className="btn btn-block btn-primary">
                Reservar
              </button>
              
            </div>
        
          </div>
        )}
      
      {showModal && (
  <div className="modal"onClick={handleModalClose}>
    <div className="wrapper bg-white">
      <div className="">
        <div className="text-center">
          <h2>¡Reserva Exitosa! .Nos pondremos en contacto contigo para finalizar el proceso de pago.</h2>

          <button onClick={handleModalClose} className="btn btn-primary">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
    

    
  );
};
export default Reservar;

