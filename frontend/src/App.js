import React from "react";
import RegistroVenta from "./components/RegistroVenta";
import fondo from "./assets/fondo.jpg";

function App() {
  return (
        <div
      style={{
        margin: 0,
        padding: 0,
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{ color: "white", marginBottom: "5px" }}>Gestión de Ventas Avengers</h1>
      <RegistroVenta />
    </div>  
  );
}

export default App;
