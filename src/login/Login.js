import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setUseremail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8552/api/usuario/iniciarsesion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // Guarda el token en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('nombre', data.nombre);
        localStorage.setItem('rol', data.rol);
        localStorage.setItem('usuarioId', data._id);

        // Muestra el modal
        setShowModal(true);

       
      } else {
        console.error('la contraseña o correo es incorrecta. Vuelve a realizar el inicio de sesión.');
        setError('La contraseña o correo es incorrecto. Vuelve a realizar el inicio de sesión.');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setError('La contraseña o correo es incorrecto. Vuelve a realizar el inicio de sesión.');
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
      <div className="h4 text-muted text-center pt-2">Ingrese sus datos</div>
     
      {error && <div className="alert alert-danger">{error}</div>}
   
      <form className="pt-3" onSubmit={handleSubmit}>
        <div className="form-group py-2">
          <div className="input-field d-flex align-items-center">
            <FontAwesomeIcon icon={faUser} className="p-2" />
            <input
              type="text"
              placeholder="Ingrese su correo"
              required
              className="form-control"
              value={email}
              onChange={(e) => setUseremail(e.target.value)}
            />
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
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" className="btn bg-white text-muted" onClick={togglePasswordVisibility}>
              <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between">
          <div className="remember">
            <label className="option text-muted">
              Recordarme
              <input type="checkbox" name="remember" />
              <span className="checkmark"></span>
            </label>
          </div>
          <div>
            <a href="#" id="forgot">Olvidaste tu contraseña?</a>
          </div>
        </div>

        <div className="d-flex justify-content-center align-items-center">
          <button type="submit" className="btn btn-block btn-primary">Acceder</button>
        </div>
      </form>

      {showModal && (
        <div className="modal" onClick={handleModalClose}>
          <div className="wrapper bg-white ">
            
            <p>Se ha iniciado sesión correctamente.</p>
            <div className="d-flex justify-content-center align-items-center">
             <button onClick={handleModalClose} className="btn btn-block btn-primary">
              Aceptar
            </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;