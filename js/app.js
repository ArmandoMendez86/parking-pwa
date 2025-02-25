import { logoImg } from "./logo.js";
let db;
const estado = "pendiente";
const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);

// Abrir o crear la base de datos
const request = indexedDB.open("Parking", 4);

request.onupgradeneeded = (event) => {
  db = event.target.result;
  if (!db.objectStoreNames.contains("estacionamiento")) {
    db.createObjectStore("estacionamiento", {
      keyPath: "id",
      autoIncrement: true,
    });
  }
  if (!db.objectStoreNames.contains("pension")) {
    db.createObjectStore("pension", { keyPath: "id", autoIncrement: true });
  }
  if (!db.objectStoreNames.contains("clientes")) {
    db.createObjectStore("clientes", { keyPath: "id", autoIncrement: true });
  }
  if (!db.objectStoreNames.contains("servicios")) {
    db.createObjectStore("servicios", { keyPath: "id", autoIncrement: true });
  }
  if (!db.objectStoreNames.contains("usuarios")) {
    db.createObjectStore("usuarios", { keyPath: "id", autoIncrement: true });
  }
  if (!db.objectStoreNames.contains("sistema")) {
    db.createObjectStore("sistema", { keyPath: "id", autoIncrement: true });
  }
  if (!db.objectStoreNames.contains("precios")) {
    db.createObjectStore("precios", { keyPath: "id", autoIncrement: true });
  }
  if (!db.objectStoreNames.contains("gastos")) {
    db.createObjectStore("gastos", { keyPath: "id", autoIncrement: true });
  }
  if (!db.objectStoreNames.contains("tipopension")) {
    db.createObjectStore("tipopension", { keyPath: "id", autoIncrement: true });
  }
  if (!db.objectStoreNames.contains("tipoServicios")) {
    db.createObjectStore("tiposervicios", {
      keyPath: "id",
      autoIncrement: true,
    });
  }
  // Agrega más objectStores según sea necesario
};

request.onsuccess = (event) => {
  db = event.target.result;
  console.log("Base de datos abierta con éxito");
  cargarDatosIniciales();
};

request.onerror = (event) => {
  console.error("Error al abrir la base de datos:", event.target.error);
};

async function cargarDatosIniciales() {
  await configurarFormularios();
  await cargarCategorias();
  await cargarClientes();
  await cargarPensiones();
  await cargarServicios();
  await configuracionSistema();
}

async function configurarFormularios() {
  //------------------------------- FORMULARIO ESTACIONAMIENTO -----------------------------//
  document
    .getElementById("formEstacionamiento")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      let fechaEntrada = moment().format("YYYY-MM-DD HH:mm:ss");

      const placa = document.getElementById("placaE").value;
      const categoria = document.getElementById("categoria").value;
      const marca = document.getElementById("marcaE").value;
      const color = document.getElementById("colorE").value;
      const registros = await obtenerRegistrosEstacionamiento();
      const folio = generarFolio(registros);

      if (marca == "" || color == "") return;

      agregarRegistro("estacionamiento", {
        placa,
        categoria,
        marca,
        color,
        fechaEntrada,
        estado,
        folio,
      });
    });

  //------------------------------- FORMULARIO PENSION -----------------------------//
  document.getElementById("formPension").addEventListener("submit", (event) => {
    event.preventDefault();
    const cliente = document.getElementById("cliente").value;
    const tipo = document.getElementById("tipo").value;
    const marca = document.getElementById("marca").value;
    const color = document.getElementById("color").value;
    agregarRegistro("pension", { cliente, tipo, marca, color });
  });

  //------------------------------- FORMULARIO TIPO PENSION -----------------------------//
  document
    .getElementById("formTipoPension")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const pension = document.getElementById("tipoPension").value;
      const precio = document.getElementById("precioPension").value;
      agregarRegistro("tipopension", { pension, precio });
      cargarPensiones();
    });

  //------------------------------- FORMULARIO TIPO SERVICIO -----------------------------//
  document
    .getElementById("formTipoServicios")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const tipoServicio = document.getElementById("tipoServicio").value;
      const precioServicio = document.getElementById("precioServicio").value;
      agregarRegistro("tiposervicios", { tipoServicio, precioServicio });
      cargarServicios();
    });

  //------------------------------- FORMULARIO CLIENTES -----------------------------//
  document
    .getElementById("formClientes")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const nombre = document.getElementById("nombreC").value;
      const telefono = document.getElementById("telefonoC").value;
      agregarRegistro("clientes", { nombre, telefono });
      cargarClientes();
    });

  //------------------------------- FORMULARIO SERVICIOS -----------------------------//
  document
    .getElementById("formServicios")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const nombre = document.getElementById("servicio").value;
      const cantidad = document.getElementById("cantidadServicio").value;
      agregarRegistro("servicios", { nombre, cantidad });
    });

  //------------------------------- FORMULARIO GASTOS -----------------------------//
  document.getElementById("formGastos").addEventListener("submit", (event) => {
    event.preventDefault();
    const concepto = document.getElementById("concepto").value;
    const cantidad = document.getElementById("cantidadGasto").value;
    agregarRegistro("gastos", { concepto, cantidad });
  });

  //------------------------------- FORMULARIO PRECIOS -----------------------------//
  document.getElementById("formPrecios").addEventListener("submit", (event) => {
    event.preventDefault();
    const categoria = document.getElementById("categoriaP").value;
    const precioHora = document.getElementById("precioHora").value;
    const precioFraccion = document.getElementById("precioFraccion").value;
    const minimo = document.getElementById("minimo").value;
    const maximo = document.getElementById("maximo").value;
    agregarRegistro("precios", {
      categoria,
      precioHora,
      precioFraccion,
      minimo,
      maximo,
    });
    cargarCategorias();
  });

  //------------------------------- FORMULARIO USUARIOS -----------------------------//
  document
    .getElementById("formUsuarios")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const nombre = document.getElementById("nombre").value;
      const perfil = document.getElementById("perfil").value;
      const password = document.getElementById("password").value;
      agregarRegistro("usuarios", { nombre, perfil, password });
    });

  //------------------------------- FORMULARIO CONFIGURACION SISTEMA -----------------------------//
  document
    .getElementById("formConfiguracion")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const negocio = document.getElementById("nombreNegocio").value;
      const direccion = document.getElementById("direccionNegocio").value;
      const telefono = document.getElementById("telefonoNegocio").value;
      const mensaje = document.getElementById("mensajeNegocio").value;
      agregarRegistro("sistema", { negocio, direccion, telefono, mensaje });
    });
}

//------------------------------- METODOS GENERICOS -----------------------------//
function agregarRegistro(storeName, data) {
  const transaction = db.transaction(storeName, "readwrite");
  const store = transaction.objectStore(storeName);
  const request = store.add(data);

  request.onsuccess = () => {
    console.log("Registro agregado con éxito");
    document.querySelectorAll("form").forEach((element) => {
      element.reset();
    });
    alert("Registro guardado correctamente");
  };

  request.onerror = (event) => {
    console.error("Error al agregar el registro:", event.target.error);
    alert("Error al guardar el registro");
  };
}

function eliminarRegistro(storeName, data) {
  const transaction = db.transaction(storeName, "readwrite");
  const store = transaction.objectStore(storeName);
  const request = store.delete(data);

  request.onsuccess = () => {
    console.log("Registro eliminado con éxito");

    alert("Registro eliminado correctamente");
  };
  request.onerror = (event) => {
    console.error("Error al eliminar el registro:", event.target.error);
    alert("Error al eliminar el registro");
  };
}

//------------------------------- CARGANDO LOS SELECTS -----------------------------//

async function cargarCategorias() {
  const transaction = db.transaction("precios", "readonly");
  const store = transaction.objectStore("precios");
  const request = store.getAll();

  request.onsuccess = () => {
    const categoriaEstacionamiento = document.getElementById("categoria");

    categoriaEstacionamiento.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Selecciona una categoria";
    categoriaEstacionamiento.appendChild(defaultOption);

    request.result.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.text = item.categoria;
      categoriaEstacionamiento.appendChild(option);
    });
  };
}

async function cargarClientes() {
  const transaction = db.transaction("clientes", "readonly");
  const store = transaction.objectStore("clientes");
  const request = store.getAll();

  request.onsuccess = () => {
    const selectClientes = document.getElementById("cliente");

    selectClientes.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Selecciona un cliente";
    selectClientes.appendChild(defaultOption);

    request.result.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.text = item.nombre;
      selectClientes.appendChild(option);
    });
  };
}

async function cargarPensiones() {
  const transaction = db.transaction("tipopension", "readonly");
  const store = transaction.objectStore("tipopension");
  const request = store.getAll();

  request.onsuccess = () => {
    const selectPensiones = document.getElementById("tipo");

    selectPensiones.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Selecciona tipo de pension";
    selectPensiones.appendChild(defaultOption);

    request.result.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.text = item.pension;
      selectPensiones.appendChild(option);
    });
  };
}

async function cargarServicios() {
  const transaction = db.transaction("tiposervicios", "readonly");
  const store = transaction.objectStore("tiposervicios");
  const request = store.getAll();

  request.onsuccess = () => {
    const selectServicios = document.getElementById("servicio");

    selectServicios.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Selecciona tipo de servicio";
    selectServicios.appendChild(defaultOption);

    request.result.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.text = item.tipoServicio;
      selectServicios.appendChild(option);
    });
  };
}

async function configuracionSistema() {
  const datos = await cargarDatosSistema();
  const informacion = datos[datos.length - 1];
  document.querySelector("#nombreNegocio").value = informacion.negocio;
  document.querySelector("#direccionNegocio").value = informacion.direccion;
  document.querySelector("#telefonoNegocio").value = informacion.telefono;
  document.querySelector("#mensajeNegocio").value = informacion.mensaje;
}

//--------------------------------- NUMERO DE FOLIO --------------------------------//

function generarFolio(ultimosFolios) {
  const fechaActual = new Date();
  const mesActual = fechaActual
    .toLocaleString("default", { month: "short" })
    .toUpperCase();

  const foliosMesActual = ultimosFolios.filter((folio) => {
    return folio && folio.folio && folio.folio.startsWith(mesActual);
  });

  if (foliosMesActual.length === 0) {
    return `${mesActual}-0001`;
  }

  const ultimoFolio = foliosMesActual.reduce((maxFolio, folio) => {
    const numFolio = parseInt(folio.folio.split("-")[1]);
    const maxNum = parseInt(maxFolio.folio.split("-")[1]);
    return numFolio > maxNum ? folio : maxFolio;
  });

  const ultimoNumero = parseInt(ultimoFolio.folio.split("-")[1]);
  const numeroConsecutivo = ultimoNumero + 1;
  const numeroFormateado = numeroConsecutivo.toString().padStart(4, "0");
  return `${mesActual}-${numeroFormateado}`;
}

//--------------------------------- OBTENCION DE DATOS --------------------------------//

async function obtenerRegistrosEstacionamiento() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("estacionamiento", "readonly");
    const store = transaction.objectStore("estacionamiento");
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}
async function datosCategorias() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("precios", "readonly");
    const store = transaction.objectStore("precios");
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

async function cargarDatosSistema() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("sistema", "readonly");
    const store = transaction.objectStore("sistema");
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

//------------------------------- COBRO DE FOLIO -----------------------------//
document.querySelector("#folio").addEventListener("input", async function (e) {
  const folio = this.value.trim();
  const registros = await obtenerRegistrosEstacionamiento();

  const fechaActual = moment();

  const mesActual = fechaActual.format("MMM").toUpperCase();

  const foliosMesActual = registros.filter((folio) => {
    return folio && folio.folio && folio.folio.startsWith(mesActual);
  });

  const existe = foliosMesActual.filter((registro) => registro.folio == folio);

  if (existe.length > 0) {
    const [existe] = foliosMesActual.filter(
      (registro) => registro.folio == folio
    );
    const categorias = await datosCategorias();
    const [isCategoria] = categorias.filter(
      (categoria) => categoria.id == existe.categoria
    );

    const monto = calcularCostoTotal(existe.fechaEntrada, isCategoria);
    const fechaInicio = moment(existe.fechaEntrada);

    const minutosTranscurridos = moment
      .duration(fechaActual.diff(fechaInicio))
      .asMinutes();

    const redondearMinutos = Math.ceil(minutosTranscurridos);

    document.querySelector("#negocio").textContent = "AUTOCARS";
    document.querySelector("#logoEstacionamiento").src = `${logoImg}`;
    document.querySelector("#fechaEntrada").textContent = existe.fechaLocal;
    document.querySelector(
      "#horaEntrada"
    ).textContent = `Entrada: ${fechaInicio.format("hh:mm A")}`;
    document.querySelector(
      "#horaSalida"
    ).textContent = `Salida: ${fechaActual.format("hh:mm A")}`;
    document.querySelector("#tiempo").textContent = `Tiempo: ${Math.ceil(
      minutosTranscurridos
    )} minutos`;
    document.querySelector("#total").textContent = `Monto: $${monto}`;
    document.querySelector(".ticket").classList.remove("d-none");
    JsBarcode(document.querySelector("#codigoBarras"), existe.folio, {
      format: "CODE128",
      lineColor: "#000",
      width: 2,
      height: 50,
      displayValue: false,
    });

    setTimeout(() => {
      imprimirPlantilla(
        fechaInicio.format("hh:mm A"),
        fechaActual.format("hh:mm A"),
        redondearMinutos,
        monto,
        existe.folio
      );
    }, 1000);
  } else {
    document.querySelector(".ticket").classList.add("d-none");
  }
});

//------------------------------- CONSULTA DE FOLIO -----------------------------//
document
  .querySelector("#buscarFolio")
  .addEventListener("input", async function (e) {
    const folio = this.value.trim();
    const registros = await obtenerRegistrosEstacionamiento();

    const fechaActual = moment();

    const mesActual = fechaActual.format("MMM").toUpperCase();

    const foliosMesActual = registros.filter((folio) => {
      return folio && folio.folio && folio.folio.startsWith(mesActual);
    });

    const existe = foliosMesActual.filter(
      (registro) => registro.folio == folio
    );

    if (existe.length > 0) {
      const [existe] = foliosMesActual.filter(
        (registro) => registro.folio == folio
      );
      const categorias = await datosCategorias();
      const datosSistema = await cargarDatosSistema();
      const [infoSistema] = datosSistema.slice(-1);

      const [isCategoria] = categorias.filter(
        (categoria) => categoria.id == existe.categoria
      );

      const monto = calcularCostoTotal(existe.fechaEntrada, isCategoria);
      const fechaInicio = moment(existe.fechaEntrada);

      const minutosTranscurridos = moment
        .duration(fechaActual.diff(fechaInicio))
        .asMinutes();

      document
        .querySelector("#deleteTicket")
        .setAttribute("ticketNum", existe.id);
      document.querySelector("#folioNum").textContent = existe.folio;
      document.querySelector("#negocio-dos").textContent = infoSistema.negocio;
      document.querySelector("#logoEstacionamiento-dos").src = `${logoImg}`;
      document.querySelector("#fechaEntrada-dos").textContent =
        existe.fechaLocal;
      document.querySelector(
        "#horaEntrada-dos"
      ).textContent = `Entrada: ${fechaInicio.format("hh:mm A")}`;
      document.querySelector(
        "#horaSalida-dos"
      ).textContent = `Salida: ${fechaActual.format("hh:mm A")}`;
      document.querySelector("#tiempo-dos").textContent = `Tiempo: ${Math.ceil(
        minutosTranscurridos
      )} minutos`;
      document.querySelector("#total-dos").textContent = `Monto: $${monto}`;
      document.querySelector(".ticketDetalle").classList.remove("d-none");
      document.querySelector("#mensajeBoleto").textContent =
        infoSistema.mensaje;
      JsBarcode(document.querySelector("#codigoBarras-dos"), existe.folio, {
        format: "CODE128",
        lineColor: "#000",
        width: 2,
        height: 50,
        displayValue: false,
      });
    } else {
      document.querySelector(".ticketDetalle").classList.add("d-none");
    }
  });

//------------------------------- COSTO TOTAL -----------------------------//

function calcularCostoTotal(inicio, datos) {
  const ahora = moment();
  const minutosTranscurridos = moment.duration(ahora.diff(inicio)).asMinutes();

  let costo = 0;
  let tiempo_minimo = parseFloat(datos.minimo);
  let tiempo_maximo = parseFloat(datos.maximo);
  let cuota_fraccion = parseFloat(datos.precioFraccion);
  let precio_hora = parseFloat(datos.precioHora);

  if (minutosTranscurridos <= 60) {
    costo += precio_hora;
  } else {
    costo += precio_hora;

    let tiempoRestante = minutosTranscurridos - 60;

    while (tiempoRestante > 0) {
      if (tiempoRestante >= tiempo_minimo) {
        costo += cuota_fraccion;
        tiempoRestante -= tiempo_maximo;
      } else {
        break;
      }
    }
  }

  return costo;
}

//------------------------------- IMPRIMIR TICKET DE COBRO -----------------------------//

function imprimirPlantilla(entrada, salida, tiempo, total, folio) {
  const nuevaVentana = window.open("", "_blank");
  nuevaVentana.document.write(`
      <html>
      <head>
          <title>Recibo de Estacionamiento</title>
          <style>
              .ticket {
                  position:relative;
                  width: 300px;
                  margin: 20px auto;
                  border: 1px dashed #ccc;
                  padding: 20px;
              }

              #folioNum{
                  position:absolute;
                  right:0;
                  top:0;
                  padding: 0.5rem;
              }
              .logo {
                  text-align: center;
                  margin-bottom: 10px;
              }
              .logo img {
                  max-width: 130px;
              }
              .details {
                  margin-bottom: 20px;
                  text-align: center;
              }
              .barcode {
                  text-align: center;
                  margin-top: 10px; /* Espacio arriba del código de barras */
              }
              .barcode svg {
                  width: 100%; /* O un ancho fijo si lo prefieres */
                  max-width: 280px; /* Ancho máximo para evitar que se salga del ticket */
                  height: auto; /* Altura automática para mantener la proporción */
              }
              .horas{
                display:flex;
                justify-content: space-between;
              }
              .horas > p {
                  font-size: 12px;
              }
              @media print {
                  .barcode svg {
                      width: 100%; /* Asegura el ancho completo en la impresión */
                      max-width: 280px; /* Ancho máximo para evitar que se salga del ticket */
                      height: auto; /* Altura automática para mantener la proporción */
                  }
              }
          </style>
      </head>
      <body>
          <div class="ticket">
              
              <div id="folioNum">${folio}</div>
              <div class="logo">
                  <img src="${logoImg}" alt="" />
                  <p class="mt-2" id="negocio">Nombre de la Empresa<br>Dirección</p>
              </div>
              <div class="details">
                  <h6 class="text-center">RECIBO DE ESTACIONAMIENTO</h6>
                  <p id="fechaEntrada" class="text-center"></p>
                  <div class="horas"">
                      <p id="horaEntrada">Entrada: ${entrada}</p>
                      <p id="horaSalida">Salida: ${salida}</p>
                  </div>
                  <p id="tiempo" class="text-center">Tiempo: ${tiempo} minutos</p>
                  <p id="total" class="text-center">Monto: $${total}</p>
              </div>
              <div class="barcode">
                  <svg id="codigoBarras"></svg>
              </div>
          </div>
      </body>
      </html>
  `);

  nuevaVentana.document.close();
  nuevaVentana.onload = function () {
    JsBarcode(nuevaVentana.document.querySelector("#codigoBarras"), folio, {
      format: "CODE128",
      lineColor: "#808080",
      width: 1.5,
      height: 40,
      displayValue: false,
      margin: 0,
    });

    nuevaVentana.print();

    setTimeout(() => {
      nuevaVentana.close();
    }, 500);
  };
}

//------------------------------- ELIMINAR FOLIO -----------------------------//
document.querySelector(".bloque-dos").addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-danger")) {
    const id = parseInt(
      document.querySelector("#deleteTicket").getAttribute("ticketNum")
    );
    eliminarRegistro("estacionamiento", id);
  }
});
