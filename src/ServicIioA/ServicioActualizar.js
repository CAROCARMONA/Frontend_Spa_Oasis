import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../login/Login.css';

const ActualizarServicio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const [servicio, setServicio] = useState({
    titulo: '',
    descripcion: '',
    
    precio: '',
    duracion: ''
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Obtener el token del localStorage
      const token = localStorage.getItem('token');
     console.error(id,servicio)
      // Enviar la solicitud de actualización al backend
      await axios.put(`http://localhost:8552/api/servicio/actualizar/${id}`, servicio, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      // Redirigir al usuario a la página de inicio
      navigate('/');
    } catch (error) {
      console.error('Error al actualizar el servicio:', error);
      setError('No se pudo actualizar el servicio. Inténtalo de nuevo más tarde.');
      setTimeout(() => {
        setError('');
      }, 3000); // Limpiar el mensaje de error después de 3 segundos
    }
  };
  

  const handleInputChange = (e) => {
    setServicio({ ...servicio, [e.target.name]: e.target.value });
  };

 

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
            <div className="h2 text-center">Oasis Spa</div>
            <div className="h4 text-muted text-center pt-2">Actulizar información</div>
            {error && <div className="alert alert-danger">{error}</div>}
              <form >
                <div className="mb-3  ">
                  <label htmlFor="titulo  " className="form-label color ">
                    Título
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="titulo"
                    name="titulo"
                    value={servicio.titulo}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="descripcion" className="form-label pt-2 color">
                    Descripción
                  </label>
                  <textarea
                    className="form-control"
                    id="descripcion"
                    name="descripcion"
                    rows="3"
                    value={servicio.descripcion}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="precio" className="form-label color">
                    Precio
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="precio"
                    name="precio"
                    value={servicio.precio}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="duracion" className="form-label color ">
                    Duración
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="duracion"
                    name="duracion"
                    value={servicio.duracion}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="d-flex justify-content-center align-items-center">
                <button type="button" className="btn btn-block btn-primary" onClick={handleSubmit}>
                   Actualizar
                </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ActualizarServicio;