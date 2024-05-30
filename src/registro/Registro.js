import React, { useState } from 'react';
import './Registro.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import {  faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Registro = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setContrasena] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
  }

  const handleSubmit = async (event) => {
    event.preventDefault(); // Evita el comportamiento por defecto del formulario

    // Define el rol del usuario
    const rol = 'Usuario';
    console.error({ nombre, apellidos, email, rol, password  });
    // Aquí puedes agregar la lógica para enviar la solicitud al backend
    try {
      // Realiza la solicitud al backend
      const response = await fetch('http://localhost:8552/api/usuario/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, apellidos, email, rol, password }), // Incluye el rol en los datos del formulario
      });

      // Maneja la respuesta del backend
      if (response.ok) {
        
        setShowModal(true);
      } else {
        // Si la solicitud no fue exitosa, maneja el error
        console.error('Error al registrarse:', response.statusText);
        setError('La contraseña no cumple con los parámetros de seguridad. Debe contener al menos una letra mayúscula, un carácter especial, un número y tener al menos 8 caracteres. Por favor, inténtelo de nuevo."');
        // Puedes mostrar un mensaje de error al usuario
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
     
      // Puedes mostrar un mensaje de error al usuario
    }

   
  };
  const handleModalClose = () => {
    setShowModal(false);
     
      navigate('/login');
    
  }
  return (
    <div className="wrapper bg-white">
      <div className="h2 text-center">Oasis Spa</div>
     
      <div className="h4 text-muted text-center pt-2">Ingrese sus datos</div>
      {error && <div className="alert alert-danger">{error}</div>}
      <form className="pt-3" onSubmit={handleSubmit}>
        <div className="form-group py-2">
          <div className="input-field d-flex align-items-center">
            <FontAwesomeIcon icon={faUser} className="p-2" />
            <input type="text" placeholder="Ingrese su nombre" required className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
        </div>
        <div className="form-group py-2">
          <div className="input-field d-flex align-items-center">
            <FontAwesomeIcon icon={faUser} className="p-2" />
            <input type="text" placeholder="Ingrese su apellido" required className="form-control" value={apellidos} onChange={(e) => setApellidos(e.target.value)} />
          </div>
        </div>
        <div className="form-group py-2">
          <div className="input-field d-flex align-items-center">
            <FontAwesomeIcon icon={faUser} className="p-2" />
            <input type="text" placeholder="Ingrese su correo" required className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <div className="form-group py-1 pb-2">
          <div className="input-field d-flex align-items-center">
            <FontAwesomeIcon icon={faLock} className="p-2" />
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Ingrese su contraseña"
              required
              className="form-control"
              value={password} 
              onChange={(e) => setContrasena(e.target.value)} 
            />
            <button type="button" className="btn bg-white text-muted" onClick={togglePasswordVisibility}>
              <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>

        <div className="d-flex justify-content-center align-items-center">
          <button type="submit" className="btn btn-block btn-primary">Registrarse</button>
        </div>
        {showModal && (
        <div className="modal" onClick={handleModalClose}>
          <div className="wrapper bg-white">
            <p>Se ha registrado correctamente.</p>
            <button onClick={handleModalClose} className="btn btn-primary">
              Aceptar
            </button>
          </div>
        </div>
      )}
      
      </form>
    </div>
  );
};

export default Registro;
