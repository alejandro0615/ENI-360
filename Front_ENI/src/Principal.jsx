import React from "react";
import { Container, Row, Col, Button, Navbar } from "react-bootstrap";
import { Facebook, Twitter, Instagram, Linkedin } from "react-bootstrap-icons";
import logoEni from "./assets/logo-eni.png";
import { useNavigate } from "react-router-dom";


const Principal = () => {
  const navigate = useNavigate();

  return (
    <div className="principal-page">
      <Navbar expand="lg" className="principal-navbar px-4 py-3">
        <div className="d-flex align-items-center">
          <img src={logoEni} alt="ENI Logo" width="50" height="50" className="me-2" />
          <span className="fw-bold fs-5 text-light">Escuela Nacional de Instructores</span>
        </div>
      </Navbar>
      <Container fluid className="principal-content text-center text-white d-flex flex-column justify-content-center align-items-center">
        <h1 className="fw-bold mb-3 display-5">Bienvenido a la Plataforma ENI 360°</h1>
        <p className="lead mb-4" style={{ maxWidth: "700px" }}>
          Aquí podrás gestionar tus notificaciones, postulaciones y evidencias de tus programas de formación.
        </p>
        <div className="d-flex gap-3 flex-wrap justify-content-center">
          <Button
            variant="light"
            size="lg"
            className="fw-bold btn-ingresar"
            onClick={() => navigate("/login")}
          >
            Entrar al sistema
          </Button>
        </div>
      </Container>
      <footer className="principal-footer text-white py-4">
        <Container>
          <Row className="gy-4 text-center text-md-start">
            <Col md={4}>
              <div className="d-flex align-items-center justify-content-center justify-content-md-start">
                <img src={logoEni} alt="ENI Logo" width="40" height="40" className="me-2" />
                <span className="fw-bold">Escuela Nacional de Instructores</span>
              </div>
              <p className="mt-2 small">© 2025 ENI | Todos los derechos reservados</p>
            </Col>

            <Col md={4}>
              <h6 className="fw-bold mb-2">Dirección General</h6>
              <p className="mb-1">Calle 57 No. 8 - 69 Bogotá D.C.</p>
              <p className="small">
                Atención presencial en las 33 Regionales y 118 Centros de Formación.
              </p>
            </Col>

            <Col md={4}>
              <h6 className="fw-bold mb-2">Líneas de atención</h6>
              <p className="mb-1 small"><strong>Bogotá:</strong> +57 601 736 6060</p>
              <p className="mb-1 small"><strong>WhatsApp:</strong> 312 545 0288</p>
              <p className="small">
                Lunes a viernes: 7:00 a.m. - 7:00 p.m.<br />
                Sábados: 8:00 a.m. - 1:00 p.m.
              </p>
              <div className="social-icons mt-2">
                <a href="#" className="text-white me-2"><Facebook size={20} /></a>
                <a href="#" className="text-white me-2"><Twitter size={20} /></a>
                <a href="#" className="text-white me-2"><Instagram size={20} /></a>
                <a href="#" className="text-white me-2"><Linkedin size={20} /></a>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Principal;
