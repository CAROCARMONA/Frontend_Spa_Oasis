import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ServiciosSection from '../servicios/ServiciosSection';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';


import ubicacion from '../assets/ubicacion.jpg';

import masaje1 from '../assets/masaje1.jpg';
import masaje2 from '../assets/masaje2.jpg';
import masaje3 from '../assets/masaje3.jpg';

import baño1 from '../assets/baño1.jpg';
import baño2 from '../assets/baño2.jpg';
import baño3 from '../assets/baño3.jpg';


import terapia1 from '../assets/chocoterapia.jpg';
import terapia2 from '../assets/lodoterapia.jpg';
import terapia3 from '../assets/frutoterapia.jpeg';
import terapia4 from '../assets/esencia.jpg';



function Home() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userReservations, setUserReservations] = useState([]);
  const [showReservationsModal, setShowReservationsModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        // Aquí podrías verificar el token y obtener el nombre del usuario, por simplicidad, asumiremos que el nombre se almacena en localStorage
        const storedUserName = localStorage.getItem('nombre'); // Suponiendo que guardas el nombre del usuario en localStorage
        if (storedUserName) {
            setUserName(storedUserName);
            setIsAuthenticated(true);
        }
    }
}, []);


    const handleLoginClick = () => {
        navigate('/login');
    };
    const handleRegisterClick = () => {
      navigate('/registro');
  };
  const handleLogoutClick = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    localStorage.removeItem('rol');
    localStorage.removeItem('usuarioId');

    setIsAuthenticated(false);
    setUserName('');
    navigate('/');
    

};
const isAdmin = () => {
  const userRole = localStorage.getItem('rol'); // Assuming the role is stored in localStorage
  return userRole === 'Administrador'; // Check if the user role is 'admin'
};


const fetchUserReservations = async () => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`http://localhost:8552/api/reserva/obtenerPorUsuario/${localStorage.getItem('usuarioId')}`, config);
    setUserReservations(response.data);
    console.error(userReservations);

  } catch (error) {
    console.error('Error al obtener las reservas:', error);
  }
};

const handleOpenReservationsModal = () => {
  fetchUserReservations();
  setShowReservationsModal(true);
};

const handleCloseReservationsModal = () => {
  setShowReservationsModal(false);
};

const handleNavigateToPendingReservations = () => {
  navigate('/reservasPendientes');
};
  return (
   
    <div>
      <nav className="navbar navbar-expand-lg navbar-light fixed-top py-3" id="mainNav">
        <div className="container px-4 px-lg-5">
          <a className="navbar-brand" href="#page-top">Oasis Spa</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>


          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ms-auto my-2 my-lg-0">
                
              
                <li className="nav-item"><a className="nav-link" href="#masajes">Masajes</a></li>
                <li className="nav-item"><a className="nav-link" href="#baños">Baños</a></li>
                <li className="nav-item"><a className="nav-link" href="#terapias">Terapias</a></li>
                <li className="nav-item"><a className="nav-link" href="#ubicacion">Ubicación</a></li>
              
              
            </ul>
            <ul className="navbar-nav">
                {isAuthenticated ? (
                    <>
                        <li className="nav-item">
                            <span className="nav-link">Hola, {userName}</span>
                        </li>

                        {isAdmin() && ( // Check if the user is  an administrator
                          <>
                             <li className="nav-item">
                              <button className="nav-link btn-link" onClick={handleNavigateToPendingReservations}>
                                  Rvas pendientes
                              </button>
                            </li>
                          </>
                       )}
                        {!isAdmin() && ( // Check if the user is not an administrator
                          <>
                             <li className="nav-item">
                              <button className="nav-link btn-link" onClick={handleOpenReservationsModal}>
                                  Mis reservas
                              </button>
                            </li>
                          </>
                       )}



                        <li className="nav-item">
                            <button className="nav-link btn-link " onClick={handleLogoutClick}>
                                Cerrar sesión
                            </button>
                        </li>
                        <li className="nav-item"><a className="nav-link" href="#"></a></li>
                    </>
                ) : (
                    <>
                        <li className="nav-item">
                            <button className="nav-link btn-link " onClick={handleLoginClick}>
                                Inicio de sesión
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link btn-link " onClick={handleRegisterClick}>
                                Registrarse
                            </button>
                        </li>
                        <li className="nav-item"><a className="nav-link" href="#"></a></li>
                    </>
                )}
            </ul>
        </div>






        </div> 
      </nav>
      <header className="masthead">
        <div className="container px-4 px-lg-5 h-100">
          <div className="row gx-4 gx-lg-5 h-100 align-items-center justify-content-center text-center">
            <div className="col-lg-8 align-self-end">
              <h1 className="text-white font-weight-bold">Bienvenidos a Oasis Spa, tu refugio de bienestar.</h1>
              <hr className="divider" />
            </div>
            <div className="col-lg-8 align-self-baseline">
              <p className="text-white-75 mb-5">Aquí, cada detalle está pensado con cuidado para ofrecerte una experiencia de relajación y rejuvenecimiento. Nuestro equipo de profesionales utiliza técnicas delicadas y productos naturales para asegurar que cada visita sea un momento especial.</p>
              <a className="btn btn-primary btn-xl" href="#services">Saber más</a>
            </div>
          </div>
        </div>
      </header>
      


      <section class="page-section" id="services">
            <div class="container px-4 px-lg-5">
                <h2 class="text-center mt-0">Nuestros servicios</h2>
                <hr class="divider" />
            </div>
        <div id="portfolio">
            <div class="container-fluid p-0">
                <div class="row g-0">
                    <div class="col-lg-4 col-sm-4">
                        <a class="portfolio-box" href={masaje1}title="Project Name">
                            <img class="img-fluid" src={masaje1} alt="sauna" />
                            <div class="portfolio-box-caption">
                                <div class="project-name">Masajes: </div>
                                <div class="project-name">Relajantes, terapéuticos y revitalizantes.</div>
                            </div>
                        </a>
                    </div>
                    <div class="col-lg-4 col-sm-4">
                        <a class="portfolio-box" href={baño1}title="Project Name">
                            <img class="img-fluid" src={baño1} alt="sauna" />
                            <div class="portfolio-box-caption">
                               <div class="project-name">Baños: </div>
                                <div class="project-name">Rejuvenecedores, desintoxicantes y reconfortantes.</div>
                            </div>
                        </a>
                    </div>
                    <div class="col-lg-4 col-sm-4">
                        <a class="portfolio-box" href={terapia4}title="Project Name">
                            <img class="img-fluid" src={terapia4} alt="sauna" />
                            <div class="portfolio-box-caption">
                                <div class="project-name">Terapias:</div>
                                <div class="project-name">Curativas, restaurativas y equilibrantes.</div>
                            </div>
                        </a>
                    </div>
                    
                   
                   
                </div>
            </div>
        </div>
      </section>



      
      <div>
      <ServiciosSection
        title="Masajes"
        endpoint="Masajes"
        defaultImages={[masaje1, masaje2, masaje3]}
      />
      <ServiciosSection
        title="Baños"
        endpoint="Baños"
        defaultImages={[baño1, baño2, baño3]}
      />
      <ServiciosSection
        title="Terapias"
        endpoint="Terapias"
        defaultImages={[terapia1, terapia2, terapia3,terapia4]}
      />
    </div>







  <section className="page-section bg-primary" id="ubicacion">
  <div className="container px-4 px-lg-5">
    <h2 className="text-white mt-0 text-center">Ubicacion</h2>
    <hr className="divider" />
    <div className="row align-items-center">
      <div className="col-lg-6 col-md-6 text-center">
        <p className="text-white-75 mb-4">Correo: oasisspa@gmail.com</p>
        <p className="text-white-75 mb-4">Telefono: 300 987 9898</p>
        <p className="text-white-75 mb-4">Ubicación: Calle sur 130# 68 </p>
        <p className="text-white-75 mb-4">Poblado Medellin Colombia </p>
      </div>
      <div className="col-lg-6 col-md-6 text-center">
        <div className="mb-2">
          <img className="img-mediana" src={ubicacion} alt="ubicacion" />
        </div>
      </div>
    </div>
  </div>
</section>
{showReservationsModal && (
  <div className="modal">
    <div className="wrapper bg-white">
      <div className="h2 text-center">Mis Reservas</div>
      <div className="pt-3">
        {Array.isArray(userReservations) && userReservations.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {userReservations.map((reservation) => (
                <tr key={reservation._id}>
                  <td>{reservation.nombreServicio}</td>
                  <td>{new Date(reservation.fecha).toLocaleString()}</td>
                  <td>{reservation.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No tienes reservas actualmente.</p>
        )}
        <div className="d-flex justify-content-center align-items-center">
          <button
            onClick={handleCloseReservationsModal}
            className="btn btn-block btn-primary"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
)}



</div>

  );
}

export default Home;
