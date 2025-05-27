import React, { useState } from "react";
import { avengers } from "../data/avengers";

function RegistroVenta() {
  const [vendedor, setVendedor] = useState("");
  const [productos, setProductos] = useState([{ nombre: "", cantidad: 1, precio: 0 }]);
  const [total, setTotal] = useState(0);

  const handleProductoChange = (index, field, value) => {
    const nuevosProductos = [...productos];
    nuevosProductos[index][field] = field === "nombre" ? value : parseFloat(value);
    setProductos(nuevosProductos);
    calcularTotal(nuevosProductos);
  };

  const agregarProducto = () => {
    setProductos([...productos, { nombre: "", cantidad: 1, precio: 0 }]);
  };

  const calcularTotal = (productosActuales) => {
    const nuevoTotal = productosActuales.reduce(
      (acc, prod) => acc + prod.cantidad * prod.precio,
      0
    );
    setTotal(nuevoTotal);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const venta = {
      vendedor,
      productos,
      total,
      fecha: new Date().toISOString(),
    };
    console.log("Venta registrada:", venta);
    alert("Venta registrada correctamente");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrar Venta</h2>

      <label>Vendedor (Avenger):</label>
      <select value={vendedor} onChange={(e) => setVendedor(e.target.value)} required>
        <option value="">Seleccionar</option>
        {avengers.map((a, i) => (
          <option key={i} value={a.nombre}>
            {a.alias}
          </option>
        ))}
      </select>

      <h3>Productos:</h3>
      {productos.map((prod, i) => (
        <div key={i} style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Nombre del producto"
            value={prod.nombre}
            onChange={(e) => handleProductoChange(i, "nombre", e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Cantidad"
            min="1"
            value={prod.cantidad}
            onChange={(e) => handleProductoChange(i, "cantidad", e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Precio"
            min="0"
            step="0.01"
            value={prod.precio}
            onChange={(e) => handleProductoChange(i, "precio", e.target.value)}
            required
          />
        </div>
      ))}

      <button type="button" onClick={agregarProducto}>
        Agregar otro producto
      </button>

      <p><strong>Total:</strong> ${total.toFixed(2)}</p>

      <button type="submit">Registrar Venta</button>
    </form>
  );
}

export default RegistroVenta;
