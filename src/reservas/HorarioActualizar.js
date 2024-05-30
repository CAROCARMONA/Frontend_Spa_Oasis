import '../login/Login.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const HorarioActualizar = () => {
    const { servicioId } = useParams();
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); 
    const [disponibilidad, setDisponibilidad] = useState([]);
    
    const [nuevoDiaSemana, setNuevoDiaSemana] = useState('');
    const [nuevaHoraInicio, setNuevaHoraInicio] = useState('');
    const [nuevaHoraFin, setNuevaHoraFin] = useState('');
   
    const fetchDisponibilidad = async () => {
      try {
        const response = await axios.get(`http://localhost:8552/api/disponibilidad/obtenerPorServicio/${servicioId}`);
        setDisponibilidad(response.data);
      } catch (error) {
        console.error('Error al obtener la disponibilidad:', error);
      }
    };
  
    useEffect(() => {
      fetchDisponibilidad();
    }, [servicioId]);
  
   
    const handleCrearDisponibilidad = async () => {
      try {
        const authToken = localStorage.getItem('token');
    
        // Crear un objeto Date a partir de la hora de inicio y fin
        const horaInicioDate = new Date(`2023-01-01T${nuevaHoraInicio}:00`);
        const horaFinDate = new Date(`2023-01-01T${nuevaHoraFin}:00`);
    
        // Obtener la hora en formato AM/PM
        const horaInicioAMPM = horaInicioDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        const horaFinAMPM = horaFinDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    
        const nuevaDisponibilidad = {
          diaSemana: nuevoDiaSemana,
          horaInicio: horaInicioAMPM,
          horaFin: horaFinAMPM,
          servicioId,
        };
    
        const config = {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        };
    
        const response = await axios.post(`http://localhost:8552/api/disponibilidad/crear`, nuevaDisponibilidad, config);
        setDisponibilidad([...disponibilidad, response.data]);
    
        setNuevoDiaSemana('');
        setNuevaHoraInicio('');
        setNuevaHoraFin('');
        
        // Muestra el modal
        setShowModal(true);

        fetchDisponibilidad();
       
      } catch (error) {
        console.error('Error al crear la disponibilidad:', error);
      }
    };

    const handleEliminarDisponibilidad = async (id) => {
      try {
       
    
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        };
    
        await axios.delete(`http://localhost:8552/api/disponibilidad/eliminar/${id}`, config);
        setDisponibilidad(disponibilidad.filter(dispo => dispo._id !== id));
      } catch (error) {
        console.error('Error al eliminar la disponibilidad:', error);
      }
    };
   
    const handleModalClose = (event) => {
      if (event.target === event.currentTarget) {
        setShowModal(false);
       
      }
    }
    const handleVolver = () => {
   
      navigate('/'); // Navegar a la página de inicio
    };
    return (
        <div className="wrapper bg-white">
            <div className="h2 text-center">Oasis Spa</div>
            <div className="pt-3">
                <h2 className="text-center">Disponibilidad de Horarios</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Día de la Semana</th>
                            <th>Hora de Inicio</th>
                            <th>Hora de Fin</th>
                           
                            <th>Eliminar</th>
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
                                        className="btn btn-danger"
                                        onClick={() => handleEliminarDisponibilidad(dispo._id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="d-flex justify-content-center align-items-center mt-2">
                <button onClick={handleVolver} className="btn btn-primary">
                                Volver
                            </button>
                </div>
                <div className="mt-3">
                    <h3 className='text-center'>Crear Nueva Disponibilidad</h3>
                    <form>
                        <div className="form-group">
                            <label htmlFor="diaSemana">Día de la Semana</label>
                            <input
                                type="text"
                                className="form-control"
                                id="diaSemana"
                                value={nuevoDiaSemana}
                                onChange={(e) => setNuevoDiaSemana(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="horaInicio">Hora de Inicio</label>
                            <input
                                type="time"
                                className="form-control"
                                id="horaInicio"
                                value={nuevaHoraInicio}
                                onChange={(e) => setNuevaHoraInicio(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="horaFin">Hora de Fin</label>
                            <input
                                type="time"
                                className="form-control"
                                id="horaFin"
                                value={nuevaHoraFin}
                                onChange={(e) => setNuevaHoraFin(e.target.value)}
                            />
                        </div>
                        <div className="d-flex justify-content-center align-items-center mt-2">
                            <button type="button" className="btn btn-primary mr-5" onClick={handleCrearDisponibilidad}>
                                Crear
                            </button>
                            
                        </div>
                    </form>
                    {showModal && (
                      <div className="modal" onClick={handleModalClose}>
                        <div className="wrapper bg-white ">
                          
                          <p>Se creo el horario correctamente.</p>
                          <div className="d-flex justify-content-center align-items-center">
                          <button onClick={handleModalClose} className="btn btn-block btn-primary">
                            Aceptar
                          </button>
                          
                          </div>
                          
                        </div>
                      </div>
                    )}



                </div>
            </div>
        </div>
    );
};

export default HorarioActualizar;
