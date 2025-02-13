import { logoImg } from "./logo.js";
let db;
const estado = "pendiente";

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

function cargarDatosIniciales() {
  configurarFormularios();
  cargarCategorias();
  cargarClientes();
  cargarPensiones();
  cargarServicios();
}

// Función para configurar los formularios
function configurarFormularios() {
  // Formulario de Estacionamiento
  document
    .getElementById("formEstacionamiento")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      let fecha = new Date();

      let fechaLocal = fecha.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      let horaLocal = fecha.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      const placa = document.getElementById("placaE").value;
      const categoria = document.getElementById("categoria").value;
      const marca = document.getElementById("marcaE").value;
      const color = document.getElementById("colorE").value;
      const registros = await obtenerRegistrosEstacionamiento();
      const folio = generarFolio(registros);
      agregarRegistro("estacionamiento", {
        placa,
        categoria,
        marca,
        color,
        fechaLocal,
        horaLocal,
        estado,
        folio,
      });
    });

  //---------------------------------------------------------------------------//

  // Formulario de Pensión
  document.getElementById("formPension").addEventListener("submit", (event) => {
    event.preventDefault();
    const cliente = document.getElementById("cliente").value;
    const tipo = document.getElementById("tipo").value;
    const marca = document.getElementById("marca").value;
    const color = document.getElementById("color").value;
    agregarRegistro("pension", { cliente, tipo, marca, color });
  });

  //---------------------------------------------------------------------------//

  // Formulario Tipo Pensión
  document
    .getElementById("formTipoPension")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const pension = document.getElementById("tipoPension").value;
      const precio = document.getElementById("precioPension").value;
      agregarRegistro("tipopension", { pension, precio });
      cargarPensiones();
    });

  //---------------------------------------------------------------------------//

  // Formulario Tipo Servicios
  document
    .getElementById("formTipoServicios")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const tipoServicio = document.getElementById("tipoServicio").value;
      const precioServicio = document.getElementById("precioServicio").value;
      agregarRegistro("tiposervicios", { tipoServicio, precioServicio });
      cargarServicios();
    });

  //---------------------------------------------------------------------------//

  // Formulario de Clientes
  document
    .getElementById("formClientes")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const nombre = document.getElementById("nombreC").value;
      const telefono = document.getElementById("telefonoC").value;
      agregarRegistro("clientes", { nombre, telefono });
      cargarClientes();
    });

  //---------------------------------------------------------------------------//

  // Formulario venta Servicios
  document
    .getElementById("formServicios")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const nombre = document.getElementById("servicio").value;
      const costo = document.getElementById("costoServicio").value;
      agregarRegistro("tiposervicios", { nombre, costo });
    });

  //---------------------------------------------------------------------------//

  // Formulario de Gastos
  document.getElementById("formGastos").addEventListener("submit", (event) => {
    event.preventDefault();
    const concepto = document.getElementById("concepto").value;
    const cantidad = document.getElementById("cantidadGasto").value;
    agregarRegistro("gastos", { concepto, cantidad });
  });

  //---------------------------------------------------------------------------//

  // Formulario de Precios
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

  //---------------------------------------------------------------------------//

  // Formulario de Usuarios
  document
    .getElementById("formUsuarios")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const nombre = document.getElementById("nombre").value;
      const perfil = document.getElementById("perfil").value;
      const password = document.getElementById("password").value;
      agregarRegistro("usuarios", { nombre, perfil, password });
    });

  //---------------------------------------------------------------------------//

  // Formulario de Configuracion Sistema
  document
    .getElementById("formConfiguracion")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const negocio = document.getElementById("negocio").value;
      const direccion = document.getElementById("direccion").value;
      const telefono = document.getElementById("telefono").value;
      agregarRegistro("sistema", { nombre, direccion, telefono });
    });

  //---------------------------------------------------------------------------//
}

// Función para agregar un registro a IndexedDB
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

//------------------------------- CARGANDO LOS SELECTS -----------------------------//

// Función para cargar datos de categorias
function cargarCategorias() {
  const transaction = db.transaction("precios", "readonly");
  const store = transaction.objectStore("precios");
  const request = store.getAll();

  request.onsuccess = () => {
    const categoriaEstacionamiento = document.getElementById("categoria"); // Obtén el elemento select

    // Limpia las opciones existentes (si las hay)
    categoriaEstacionamiento.innerHTML = "";

    // Crea la opción por defecto (opcional)
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Selecciona una categoria";
    categoriaEstacionamiento.appendChild(defaultOption);

    request.result.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id; // Usa el ID como valor de la opción
      option.text = item.categoria; // Usa el nombre como texto de la opción
      categoriaEstacionamiento.appendChild(option);
    });
  };
}
// Función para cargar datos de clientes
function cargarClientes() {
  const transaction = db.transaction("clientes", "readonly");
  const store = transaction.objectStore("clientes");
  const request = store.getAll();

  request.onsuccess = () => {
    const selectClientes = document.getElementById("cliente"); // Obtén el elemento select

    // Limpia las opciones existentes (si las hay)
    selectClientes.innerHTML = "";

    // Crea la opción por defecto (opcional)
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Selecciona un cliente";
    selectClientes.appendChild(defaultOption);

    request.result.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id; // Usa el ID como valor de la opción
      option.text = item.nombre; // Usa el nombre como texto de la opción
      selectClientes.appendChild(option);
    });
  };
}
// Función para cargar datos de pesiones
function cargarPensiones() {
  const transaction = db.transaction("tipopension", "readonly");
  const store = transaction.objectStore("tipopension");
  const request = store.getAll();

  request.onsuccess = () => {
    const selectPensiones = document.getElementById("tipo"); // Obtén el elemento select

    // Limpia las opciones existentes (si las hay)
    selectPensiones.innerHTML = "";

    // Crea la opción por defecto (opcional)
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Selecciona tipo de pension";
    selectPensiones.appendChild(defaultOption);

    request.result.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id; // Usa el ID como valor de la opción
      option.text = item.pension; // Usa el nombre como texto de la opción
      selectPensiones.appendChild(option);
    });
  };
}

function cargarServicios() {
  const transaction = db.transaction("tiposervicios", "readonly");
  const store = transaction.objectStore("tiposervicios");
  const request = store.getAll();

  request.onsuccess = () => {
    const selectServicios = document.getElementById("servicio"); // Obtén el elemento select

    // Limpia las opciones existentes (si las hay)
    selectServicios.innerHTML = "";

    // Crea la opción por defecto (opcional)
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Selecciona tipo de servicio";
    selectServicios.appendChild(defaultOption);

    request.result.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id; // Usa el ID como valor de la opción
      option.text = item.tipoServicio; // Usa el nombre como texto de la opción
      selectServicios.appendChild(option);
    });
  };
}

//---------------------------------------------------------------------------//

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

//---------------------------------------------------------------------------//

document.querySelector("#folio").addEventListener("input", async function (e) {
  const folio = this.value.trim();
  const registros = await obtenerRegistrosEstacionamiento();

  const fechaActual = new Date();
  const mesActual = fechaActual
    .toLocaleString("default", { month: "short" })
    .toUpperCase();

  const foliosMesActual = registros.filter((folio) => {
    return folio && folio.folio && folio.folio.startsWith(mesActual);
  });

  const existe = foliosMesActual.filter((registro) => registro.folio == folio);

  let horaSalida = fechaActual.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  if (existe.length > 0) {
    const [existe] = foliosMesActual.filter(
      (registro) => registro.folio == folio
    );
    const categorias = await datosCategorias();
    const [isCategoria] = categorias.filter(
      (categoria) => categoria.id == existe.categoria
    );

    const monto = calcularCostoTotal(existe.horaLocal, isCategoria);

    const [horasInicio, minutosInicio] = existe.horaLocal
      .split(":")
      .map(Number);
    const fechaInicio = new Date();
    fechaInicio.setHours(horasInicio);
    fechaInicio.setMinutes(minutosInicio);
    fechaInicio.setSeconds(0);

    const diferenciaMilisegundos =
      fechaActual.getTime() - fechaInicio.getTime();
    let minutosTranscurridos = Math.floor(diferenciaMilisegundos / (1000 * 60));

    document.querySelector("#negocio").textContent = "AUTOCARS";
    document.querySelector("#logoEstacionamiento").src = `${logoImg}`;
    document.querySelector("#fechaEntrada").textContent = existe.fechaLocal;
    document.querySelector(
      "#horaEntrada"
    ).textContent = `Entrada: ${existe.horaLocal}`;
    document.querySelector("#horaSalida").textContent = `Salida: ${horaSalida}`;
    document.querySelector(
      "#tiempo"
    ).textContent = `Tiempo: ${minutosTranscurridos} minutos`;
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
        existe.horaLocal,
        horaSalida,
        minutosTranscurridos,
        monto,
        existe.folio
      );
    }, 1000);
  } else {
    document.querySelector(".ticket").classList.add("d-none");
  }
});

document
  .querySelector("#buscarFolio")
  .addEventListener("input", async function (e) {
    const folio = this.value.trim();
    const registros = await obtenerRegistrosEstacionamiento();

    const fechaActual = new Date();

    const mesActual = fechaActual
      .toLocaleString("default", { month: "short" })
      .toUpperCase();

    const foliosMesActual = registros.filter((folio) => {
      return folio && folio.folio && folio.folio.startsWith(mesActual);
    });

    const existe = foliosMesActual.filter(
      (registro) => registro.folio == folio
    );

    let horaSalida = fechaActual.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    if (existe.length > 0) {
      const [existe] = foliosMesActual.filter(
        (registro) => registro.folio == folio
      );
      const categorias = await datosCategorias();
      const [isCategoria] = categorias.filter(
        (categoria) => categoria.id == existe.categoria
      );

      const monto = calcularCostoTotal(existe.horaLocal, isCategoria);

      const [horasInicio, minutosInicio] = existe.horaLocal
        .split(":")
        .map(Number);

      // Crear fecha de inicio con la misma fecha de hoy
      const fechaInicio = new Date();
      fechaInicio.setHours(horasInicio, minutosInicio, 0, 0); // Establecer solo la hora, minuto, segundos y milisegundos

      // Crear fecha actual con la misma fecha de hoy
      fechaActual.setSeconds(0);
      fechaActual.setMilliseconds(0);

      // Comprobar las fechas antes de calcular la diferencia
      console.log("Fecha de inicio:", fechaInicio);
      console.log("Fecha actual:", fechaActual);

      // Calcular la diferencia en milisegundos
      const diferenciaMilisegundos =
        fechaActual.getTime() - fechaInicio.getTime();
      console.log("Diferencia en milisegundos:", diferenciaMilisegundos);

      // Calcular los minutos transcurridos
      let minutosTranscurridos = Math.floor(
        diferenciaMilisegundos / (1000 * 60)
      );
      console.log("Minutos transcurridos:", minutosTranscurridos);

      document.querySelector("#negocio-dos").textContent = "AUTOCARS";
      document.querySelector("#logoEstacionamiento-dos").src = `${logoImg}`;
      document.querySelector("#fechaEntrada-dos").textContent =
        existe.fechaLocal;
      document.querySelector(
        "#horaEntrada-dos"
      ).textContent = `Entrada: ${existe.horaLocal}`;
      document.querySelector(
        "#horaSalida-dos"
      ).textContent = `Salida: ${horaSalida}`;
      document.querySelector(
        "#tiempo-dos"
      ).textContent = `Tiempo: ${minutosTranscurridos} minutos`;
      document.querySelector("#total-dos").textContent = `Monto: $${monto}`;
      document.querySelector(".ticketDetalle").classList.remove("d-none");
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

//---------------------------------------------------------------------------//

function calcularCostoTotal(inicio, datos) {
  const ahora = new Date();
  const [horasInicio, minutosInicio] = inicio.split(":").map(Number);
  const fechaInicio = new Date();
  fechaInicio.setHours(horasInicio);
  fechaInicio.setMinutes(minutosInicio);
  fechaInicio.setSeconds(0);

  const diferenciaMilisegundos = ahora.getTime() - fechaInicio.getTime();
  let minutosTranscurridos = Math.floor(diferenciaMilisegundos / (1000 * 60));

  if (minutosTranscurridos < 0) {
    minutosTranscurridos = 0;
  }

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

function imprimirPlantilla(entrada, salida, tiempo, total, folio) {
  const nuevaVentana = window.open("", "_blank");
  nuevaVentana.document.write(`
      <html>
      <head>
          <title>Recibo de Estacionamiento</title>
          <style>
              .ticket {
                  width: 300px;
                  margin: 20px auto;
                  border: 1px dashed #ccc;
                  padding: 20px;
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
      width: 1.5, // Ajusta el grosor de las líneas
      height: 40, // Ajusta la altura del código de barras
      displayValue: false,
      margin: 0, // Elimina los márgenes internos del código de barras
    });

    nuevaVentana.print();

    setTimeout(() => {
      nuevaVentana.close();
    }, 500);
  };
}

// Escuchar cambios en las pestañas
/* document.querySelectorAll(".nav-link").forEach((enlace) => {
  enlace.addEventListener("click", () => {
    const target = enlace.getAttribute("data-bs-target");
    window.history.pushState({ target: target }, "", `#${target}`);
  });
}); */
