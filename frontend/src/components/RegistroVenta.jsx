import React, { useState, useEffect } from "react";
import { avengers } from "../data/avengers";

function RegistroVenta() {
  const [vendedor, setVendedor] = useState("");
  const [productos, setProductos] = useState([{ nombre: "", cantidad: 1, precio: 0 }]);
  const [descuento, setDescuento] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [ventas, setVentas] = useState([]);

  // Traer ventas desde backend al montar componente
  useEffect(() => {
    fetch("http://localhost:3001/ventas")
      .then((res) => res.json())
      .then((data) => setVentas(data))
      .catch(() => alert("Error al cargar las ventas desde el servidor"));
  }, []);

  const handleProductoChange = (index, field, value) => {
    const nuevosProductos = [...productos];
    nuevosProductos[index][field] = field === "nombre" ? value : parseFloat(value);
    setProductos(nuevosProductos);
    calcularTotal(nuevosProductos, descuento);
  };

  const agregarProducto = () => {
    setProductos([...productos, { nombre: "", cantidad: 1, precio: 0 }]);
  };

  const eliminarProducto = (index) => {
    const nuevosProductos = productos.filter((_, i) => i !== index);
    setProductos(nuevosProductos);
    calcularTotal(nuevosProductos, descuento);
  };

  const calcularTotal = (productosActuales, desc) => {
    const suma = productosActuales.reduce(
      (acc, prod) => acc + prod.cantidad * prod.precio,
      0
    );
    const totalConDesc = suma * (1 - desc / 100);
    setTotal(totalConDesc);
  };

  useEffect(() => {
    calcularTotal(productos, descuento);
  }, [descuento]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!vendedor) {
      alert("Selecciona un vendedor");
      return;
    }
    if (productos.some(p => !p.nombre || p.cantidad <= 0 || p.precio <= 0)) {
      alert("Completa todos los productos correctamente");
      return;
    }

    setLoading(true);

    // Armar objeto venta para enviar al backend
    const venta = {
      vendedor,
      producto: JSON.stringify(productos), // Guardamos productos como JSON string
      cantidad: productos.reduce((acc, p) => acc + p.cantidad, 0), // suma total de cantidades
      fecha: new Date().toISOString(),
    };

    fetch("http://localhost:3001/ventas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(venta),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al registrar venta");
        return res.json();
      })
      .then(() => {
        alert("Venta registrada correctamente");
        setVentas([...ventas, { ...venta, total }]);
        setVendedor("");
        setProductos([{ nombre: "", cantidad: 1, precio: 0 }]);
        setDescuento(0);
        setLoading(false);
      })
      .catch(() => {
        alert("Error al registrar la venta");
        setLoading(false);
      });
  };

  const avengerSeleccionado = avengers.find(a => a.nombre === vendedor);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 600,
          margin: "auto",
          background: "white",
          padding: 20,
          borderRadius: 10,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)"
        }}
      >
        <h2>Registrar Venta</h2>

        <label>Vendedor (Avenger):</label>
        <select
          value={vendedor}
          onChange={(e) => setVendedor(e.target.value)}
          required
        >
          <option value="">Seleccionar</option>
          {avengers.map((a, i) => (
            <option key={i} value={a.nombre}>
              {a.alias}
            </option>
          ))}
        </select>

        {avengerSeleccionado && (
          <div
            style={{
              margin: "10px 0",
              padding: 10,
              border: "1px solid #ccc",
              borderRadius: 6,
              background: "#f9f9f9"
            }}
          >
            <h4>
              {avengerSeleccionado.alias} ({avengerSeleccionado.nombre})
            </h4>
            <p>
              <strong>Habilidades:</strong>{" "}
              {avengerSeleccionado.habilidades.join(", ")}
            </p>
            <p>
              <strong>Actor:</strong> {avengerSeleccionado.actor}
            </p>
          </div>
        )}

        <h3>Productos:</h3>
        {productos.map((prod, i) => (
          <div
            key={i}
            style={{
              marginBottom: "10px",
              display: "flex",
              gap: 10,
              alignItems: "center"
            }}
          >
            <input
              type="text"
              placeholder="Nombre del producto"
              value={prod.nombre}
              onChange={(e) =>
                handleProductoChange(i, "nombre", e.target.value)
              }
              required
              style={{ flex: 3 }}
            />
            <input
              type="number"
              placeholder="Cantidad"
              min="1"
              value={prod.cantidad}
              onChange={(e) =>
                handleProductoChange(i, "cantidad", e.target.value)
              }
              required
              style={{ flex: 1 }}
            />
            <input
              type="number"
              placeholder="Precio"
              min="0"
              step="0.01"
              value={prod.precio}
              onChange={(e) =>
                handleProductoChange(i, "precio", e.target.value)
              }
              required
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => eliminarProducto(i)}
              style={{
                flex: "0 0 auto",
                backgroundColor: "#e63946",
                color: "white",
                border: "none",
                borderRadius: 6,
                padding: "6px 12px",
                cursor: "pointer"
              }}
            >
              X
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={agregarProducto}
          style={{ marginBottom: 10 }}
        >
          Agregar otro producto
        </button>

        <label>Descuento (%) (opcional):</label>
        <input
          type="number"
          min="0"
          max="100"
          value={descuento}
          onChange={(e) => setDescuento(Number(e.target.value))}
          style={{ width: "100%", marginBottom: 10 }}
        />

        <p>
          <strong>Total:</strong> ${total.toFixed(2)}
        </p>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer"
          }}
        >
          {loading ? "Registrando..." : "Registrar Venta"}
        </button>
      </form>

      {ventas.length > 0 && (
        <div
          style={{
            maxWidth: 600,
            margin: "20px auto",
            background: "white",
            padding: 20,
            borderRadius: 10,
            boxShadow: "0 0 10px rgba(0,0,0,0.1)"
          }}
        >
          <h3>Ventas registradas</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {ventas.map((v, i) => {
              const productosVenta = JSON.parse(v.producto || "[]");
              return (
                <li
                  key={i}
                  style={{
                    marginBottom: 15,
                    borderBottom: "1px solid #ddd",
                    paddingBottom: 10
                  }}
                >
                  <p>
                    <strong>Vendedor:</strong> {v.vendedor}
                  </p>
                  <p>
                    <strong>Productos:</strong>
                  </p>
                  <ul>
                    {productosVenta.map((p, idx) => (
                      <li key={idx}>
                        {p.nombre} - Cantidad: {p.cantidad} - Precio: $
                        {p.precio.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                  <p>
                    <strong>Total:</strong> $
                    {v.total ? v.total.toFixed(2) : total.toFixed(2)}
                  </p>
                  <p>
                    <small>
                      Fecha: {new Date(v.fecha).toLocaleString()}
                    </small>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}

export default RegistroVenta;
