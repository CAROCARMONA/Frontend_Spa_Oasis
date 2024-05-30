import '../home/Home.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ServiciosSection = ({ title, endpoint, defaultImages }) => {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await axios.get(`http://localhost:8552/api/servicio/buscarPorClasificacion/${endpoint}`);
        setServicios(response.data);
       
      } catch (error) {
        console.error(`Error al obtener los servicios de ${title.toLowerCase()}:`, error);
      }
    };

    fetchServicios();
  }, [endpoint]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    return token !== null && token !== '';
  };

  const isAdmin = () => {
    const rol = localStorage.getItem('rol');
    return rol && rol === 'Administrador';
  };

  const handleActualizar = (servicioId,) => {
   
    navigate(`/actualizar-servicio/${servicioId}`);
  };

  const handleReservar = (servicioId,monto,titulo) => {
    if (isLoggedIn()) {
      navigate(`/reservar/${servicioId}?monto=${monto}&tituloservicio=${encodeURIComponent(titulo)}`);
    } else {
      navigate('/login');
    }
  };
  const handleHorarioActualizar = (servicioId) => {
    
    navigate(`/actualizarHorario-reserva/${servicioId}`);
  };
  
  return (
    <section className="page-section" id={title.toLowerCase()}>
      <h2 className="text-center mt-0">{title}</h2>
      <hr className="divider" />
      <Slider {...settings}>
        {servicios.map((servicio, index) => (
          <div key={servicio._id} className="col-lg-4 col-md-4 text-center">
            <div className="mt-5">
              <div className="mb-2 d-flex justify-content-center align-items-center">
                <img
                  className="img-small"
                  src={servicio.imagen || defaultImages[index % defaultImages.length]}
                  alt={servicio.titulo}
                />
              </div>
              <h3 className="h4 mb-2">{servicio.titulo}</h3>
              <p className="text-muted mb-0">{servicio.descripcion}</p>
              <p className="text-muted mb-0">{servicio.duracion} por tan solo {servicio.precio}</p>
              <div>
                {isAdmin() && (
                  <div>
                  <a className="btn btn-primary btn-ss" onClick={() => handleActualizar(servicio._id)}>
                    Actualizar servicio
                  </a>
                  <a className="btn btn-primary btn-ss" onClick={() => handleHorarioActualizar(servicio._id)}>
                  Actualizar horario
                </a>
                </div>
                  
                )}
                {!isAdmin() && (
                <a className="btn btn-primary btn-ss" onClick={() => handleReservar(servicio._id,servicio.precio, servicio.titulo)}>
                  Reservar
                </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}

export default ServiciosSection;
