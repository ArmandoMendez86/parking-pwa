import { logoImg } from "./logo.js";
let db;
const estado = "pendiente";
const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);

document.querySelector(".navbar").addEventListener("dblclick", () => {
  document.querySelector("#reporte").removeAttribute("disabled");
});

// Abrir o crear la base de datos
const request = indexedDB.open("Parking", 1);

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
      let fechaInicio = moment(fechaEntrada);
      const placa = document.getElementById("placaE").value;
      const categoria = document.getElementById("categoria").value;
      const marca = document.getElementById("marcaE").value;
      const color = document.getElementById("colorE").value;
      const registros = await obtenerRegistrosEstacionamiento();
      const folio = generarFolio(registros);

      if (marca == "" || color == "") return;

      await agregarRegistro("estacionamiento", {
        placa,
        categoria,
        marca,
        color,
        fechaEntrada,
        estado,
        folio,
      });

      const infoSistema = await configuracionSistema();
      //console.log(infoSistema);
      imprimirPlantilla(
        infoSistema.negocio,
        infoSistema.direccion,
        fechaInicio,
        "",
        "",
        "",
        folio,
        infoSistema.mensaje,
        placa,
        color
      );
    });

  //------------------------------- FORMULARIO PENSION -----------------------------//
  document
    .getElementById("formPension")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      let fechaEntrada = moment().format("YYYY-MM-DD HH:mm:ss");
      const cliente = document.getElementById("cliente").value;
      const tipo = document.getElementById("tipo").value;
      const marca = document.getElementById("marca").value;
      const color = document.getElementById("color").value;
      const registros = await obtenerRegistrosPension();
      const folio = generarFolio(registros);
      agregarRegistro("pension", {
        cliente,
        tipo,
        marca,
        color,
        folio,
        fechaEntrada,
      });
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
      const fecha = moment().format("YYYY-MM-DD HH:mm:ss");
      const tipo = document.getElementById("servicio").value;
      const cantidad = document.getElementById("cantidadServicio").value;
      agregarRegistro("servicios", { tipo, cantidad, fecha });
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
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const usuario = document.getElementById("nombre").value;
      const password = document.getElementById("password").value;
      const perfil = document.getElementById("perfil").value;
      //agregarRegistro("usuarios", { usuario, password, perfil });
      const resultado = await guardarUsuario({ usuario, password, perfil });
      if (resultado.success) {
        alert("Usuario guardado!");
        document.getElementById("formUsuarios").reset();
      }
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
async function agregarRegistro(storeName, data) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.add(data);

    request.onsuccess = () => {
      console.log("Registro agregado con éxito");

      // Excluir el formulario con id "formConfiguracion"
      document.querySelectorAll("form").forEach((element) => {
        if (element.id !== "formConfiguracion") {
          element.reset();
        }
      });

      alert("Registro guardado correctamente");
      resolve(request.result); // Resuelve la promesa con el ID del nuevo registro
    };

    request.onerror = (event) => {
      console.error("Error al agregar el registro:", event.target.error);
      alert("Error al guardar el registro");
      reject(event.target.error); // Rechaza la promesa con el error
    };
  });
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
function actualizarRegistro(storeName, data) {
  const transaction = db.transaction(storeName, "readwrite");
  const store = transaction.objectStore(storeName);
  const request = store.put(data);

  request.onsuccess = () => {
    console.log("Registro actualizado con éxito:", data);
    alert("Registro actualizado correctamente");
  };

  request.onerror = (event) => {
    console.error("Error al actualizar el registro:", event.target.error);
    alert("Error al actualizar el registro");
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
  return informacion;
}

//--------------------------------- GENERAR NUMERO DE FOLIO --------------------------------//

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

async function obtenerRegistroPorIdEstacionamiento(id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("estacionamiento", "readonly");
    const store = transaction.objectStore("estacionamiento");
    const request = store.get(id); // Aquí se hace la consulta por el ID

    request.onsuccess = () => {
      resolve(request.result); // Resuelve con el registro encontrado
    };

    request.onerror = () => {
      reject(request.error); // Rechaza en caso de error
    };
  });
}

async function obtenerRegistrosPension() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("pension", "readonly");
    const store = transaction.objectStore("pension");
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}
async function obtenerRegistrosServicios() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("servicios", "readonly");
    const store = transaction.objectStore("servicios");
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}
async function obtenerRegistrosGastos() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("gastos", "readonly");
    const store = transaction.objectStore("gastos");
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}
async function datosClientes() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("clientes", "readonly");
    const store = transaction.objectStore("clientes");
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
async function datosTipoPension() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("tipopension", "readonly");
    const store = transaction.objectStore("tipopension");
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}
async function datosTipoServicio() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("tiposervicios", "readonly");
    const store = transaction.objectStore("tiposervicios");
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

//------------------------------- COBRO DE FOLIO ESTACIONAMIENTO -----------------------------//
document.querySelector("#folio").addEventListener("input", async function (e) {
  const folio = this.value.trim();
  const registros = await obtenerRegistrosEstacionamiento();

  const fechaActual = moment();
  const mesActual = fechaActual.format("MMM").toUpperCase();

  const foliosMesActual = registros.filter((registro) => {
    return registro && registro.folio && registro.folio.startsWith(mesActual);
  });

  const existe = foliosMesActual.find((registro) => registro.folio == folio);

  if (existe) {
    const categorias = await datosCategorias();
    const isCategoria = categorias.find(
      (categoria) => categoria.id == existe.categoria
    );

    const datosSistema = await cargarDatosSistema();
    const infoSistema = datosSistema.slice(-1)[0];

    const monto = calcularCostoTotal(existe.fechaEntrada, isCategoria);
    const fechaInicio = moment(existe.fechaEntrada);
    const minutosTranscurridos = moment
      .duration(fechaActual.diff(fechaInicio))
      .asMinutes();
    const redondearMinutos = Math.ceil(minutosTranscurridos);

    if (existe.estado == "pagado") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `El folio ${existe.folio} ya está pagado!`,
        footer:
          '<a href="#!" id="cerrarAlerta">¿Quieres imprimir ticket de cobro?</a>',
        didOpen: () => {
          document
            .getElementById("cerrarAlerta")
            .addEventListener("click", function () {
              Swal.close();
              const fechaActual = moment(existe.fechaSalida);
              const minutosTranscurridos = moment
                .duration(fechaActual.diff(fechaInicio))
                .asMinutes();
              const redondearMinutos = Math.ceil(minutosTranscurridos);
              setTimeout(() => {
                imprimirPlantilla(
                  infoSistema.negocio,
                  infoSistema.direccion,
                  fechaInicio,
                  fechaActual.format("hh:mm A"),
                  redondearMinutos,
                  existe.monto,
                  existe.folio,
                  "Gracias por su preferencia!",
                  existe.placa,
                  existe.color
                );
              }, 1000);
            });
        },
      });
      return;
    }

    if (existe.estado == "cancelado") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `El folio ${existe.folio} esta cancelado!`,
      });
      return;
    }

    // Agregar fecha de salida y monto al registro
    existe.fechaSalida = fechaActual.format("YYYY-MM-DD HH:mm:ss");
    existe.monto = monto;
    existe.estado = "pagado";

    actualizarRegistro("estacionamiento", existe);

    document
      .querySelector("#deleteTicket")
      .setAttribute("ticketNum", existe.id);
    document.querySelector("#folioNum").textContent = existe.folio;
    document.querySelector("#negocioEstacionamiento").textContent =
      infoSistema.negocio.toUpperCase();
    document.querySelector("#logoEstacionamiento").src = `${logoImg}`;
    document.querySelector("#fechaEntrada").textContent = `${fechaInicio.format(
      "DD/MM/YYYY"
    )}`;
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
        infoSistema.negocio,
        infoSistema.direccion,
        fechaInicio,
        fechaActual.format("hh:mm A"),
        redondearMinutos,
        monto,
        existe.folio,
        "Gracias por su preferencia!",
        existe.placa,
        existe.color
      );
    }, 1000);
  } else {
    document.querySelector(".ticket").classList.add("d-none");
  }
});

//------------------------------- CONSULTA DE FOLIO ESTACIONAMIENTO -----------------------------//
document
  .querySelector("#buscarFolio")
  .addEventListener("input", async function (e) {
    const folio = this.value.trim();
    const registros = await obtenerRegistrosEstacionamiento();

    let fechaActual = moment();

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

      let monto = calcularCostoTotal(existe.fechaEntrada, isCategoria);
      const fechaInicio = moment(existe.fechaEntrada);

      let minutosTranscurridos = moment
        .duration(fechaActual.diff(fechaInicio))
        .asMinutes();

      if (existe.estado === "pagado" || existe.estado === "cancelado") {
        fechaActual = moment(existe.fechaSalida);
        monto = existe.monto;
        minutosTranscurridos = moment
          .duration(fechaActual.diff(fechaInicio))
          .asMinutes();

        document.querySelector("#estadoPago").classList.remove("d-none");
        document.querySelector("#estadoPago").textContent = existe.estado;
      } else {
        document.querySelector("#estadoPago").classList.add("d-none");
      }

      document
        .querySelector("#deleteTicket")
        .setAttribute("ticketNum", existe.id);
      document.querySelector("#folioNum-dos").textContent = existe.folio;
      document.querySelector("#negocio-dos").textContent =
        infoSistema.negocio.toUpperCase();
      document.querySelector("#logoEstacionamiento-dos").src = `${logoImg}`;
      document.querySelector(
        "#fechaEntrada-dos"
      ).textContent = `${fechaInicio.format("DD/MM/YYYY")}`;
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

//------------------------------- IMPRIMIR TICKET DE COBRO ESTACIONAMIENTO -----------------------------//

function imprimirPlantilla(
  negocio,
  direccion,
  entrada,
  salida,
  tiempo,
  total,
  folio,
  mensaje = "Gracias por su preferencia!",
  placa = "",
  color = ""
) {
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

              .logo p{
                padding:0;
                margin:0;
                margin-top:20px;
                text-transform:uppercase;
              }

              .logo small{
                padding:0;          
              }
              .details {
                  margin-bottom: 20px;
                  text-align: center;
              }
              .barcode {
                  text-align: center;
                  margin-top: 10px; 
              }
              .barcode svg {
                  width: 100%; /* O un ancho fijo si lo prefieres */
                  max-width: 280px; /* Ancho máximo para evitar que se salga del ticket */
                  height: auto; /* Altura automática para mantener la proporción */
              }
              .horasC{
                display:flex;
                justify-content: center;
              }
              .horasJ{
                display:flex;
                justify-content: space-between;
              }
              .horas > p {
                  font-size: 14px;
              }

              .mensajeC{
                font-size:12px;
                text-align:center;
                text-transform:uppercase;
              }
              .mensajeJ{
                font-size:12px;
                text-align:justify;
                text-transform:uppercase;
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
                  <p>${negocio}</p>
                  <small id="direccion">${direccion}</small>
              </div>
              <div class="details">
                  <h5>RECIBO DE ESTACIONAMIENTO</h5>
                  <p>${entrada.format("DD/MM/YYYY")}</p>
                  <div class="${salida != "" ? "horasJ" : "horasC"}">
                      <p>Entrada: ${entrada.format("hh:mm A")}</p>
                      <p>${salida != "" ? `Salida: ${salida}` : ""}</p>
                  </div>
                  <div class="horasJ">
                      <p>${placa != "" ? `Placa: ${placa}` : ""}</p>
                      <p>${color != "" ? `Color: ${color}` : ""}</p>
                  </div>
                  <p>${tiempo != "" ? `Tiempo: ${tiempo} minutos` : ""}</p>
                  <p>${total != "" ? `Monto: $${total}` : ""}</p>
              </div>
              <div class="barcode">
                  <svg id="codigoBarras"></svg>
              </div>
              <p class=" ${
                salida != "" ? "mensajeC" : "mensajeJ"
              } ">${mensaje}</p>
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

//------------------------------- CANCELAR, ELIMINAR, FOLIO ESTACIONAMIENTO -----------------------------//
document.querySelector(".bloque-dos").addEventListener("click", async (e) => {
  let btnCancelar = e.target.closest(".cancelarTicket");
  let btnEliminar = e.target.closest(".deletTicket");
  if (btnCancelar) {
    const id = parseInt(
      document.querySelector("#deleteTicket").getAttribute("ticketNum")
    );
    const registro = await obtenerRegistroPorIdEstacionamiento(id);
    registro.estado = "cancelado";
    actualizarRegistro("estacionamiento", registro);
  }

  if (btnEliminar) {
    const id = parseInt(
      document.querySelector("#deleteTicket").getAttribute("ticketNum")
    );
    eliminarRegistro("estacionamiento", id);
  }
});

//------------------------------- REIMPRIMIR TICKET ESTACIONAMIENTO -----------------------------//
document
  .querySelector(".ticketDetalle")
  .addEventListener("click", async (e) => {
    const btnImprimir = e.target.closest(".reimprimir");
    if (btnImprimir) {
      const datosSistema = await cargarDatosSistema();
      const [infoSistema] = datosSistema.slice(-1);

      const id = parseInt(
        document.querySelector("#deleteTicket").getAttribute("ticketNum")
      );
      const registro = await obtenerRegistroPorIdEstacionamiento(id);

      const fechaInicio = moment(registro.fechaEntrada);

      imprimirPlantilla(
        infoSistema.negocio,
        infoSistema.direccion,
        fechaInicio,
        "",
        "",
        "",
        registro.folio,
        infoSistema.mensaje,
        registro.marca,
        registro.color
      );
    }
  });

//------------------------------- COBRO DE FOLIO PENSION -----------------------------//
document
  .querySelector("#folioPension")
  .addEventListener("input", async function (e) {
    const folio = this.value.trim();
    const registros = await obtenerRegistrosPension();
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
      const pensiones = await datosTipoPension();
      const [isPension] = pensiones.filter(
        (pension) => pension.id == existe.tipo
      );
      const datosSistema = await cargarDatosSistema();
      const [infoSistema] = datosSistema.slice(-1);

      const monto = isPension.precio;
      const fechaInicio = moment(existe.fechaEntrada);

      document.querySelector("#folioNumPension").textContent = existe.folio;
      document.querySelector("#negocioPension").textContent =
        infoSistema.negocio.toUpperCase();
      document.querySelector("#direccion").textContent = infoSistema.direccion;
      document.querySelector("#logoPension").src = `${logoImg}`;
      document.querySelector("#entradaPension").textContent =
        fechaInicio.format("DD/MM/YYYY h:mm:ss");

      document.querySelector("#totalPension").textContent = `Monto: $${monto}`;
      document.querySelector(".ticketPension").classList.remove("d-none");
      JsBarcode(document.querySelector("#codigoBarrasPension"), existe.folio, {
        format: "CODE128",
        lineColor: "#000",
        width: 2,
        height: 50,
        displayValue: false,
      });

      //------------------------------- IMPRIMIR FOLIO PENSION -----------------------------//
      document
        .querySelector(".impresionTicket")
        .addEventListener("click", (e) => {
          const btnImprimir = e.target.closest(".btn-light");
          if (btnImprimir) {
            imprimirPlantillaPension(
              infoSistema.negocio,
              infoSistema.direccion,
              fechaInicio.format("DD/MM/YYYY hh:mm"),
              moment().format("DD/MM/YYYY hh:mm"),
              monto,
              existe.folio,
              infoSistema.mensaje,
              existe.marca,
              existe.color
            );
          }
        });
    } else {
      document.querySelector(".ticketPension").classList.add("d-none");
    }
  });

//------------------------------- IMPRIMIR TICKET DE COBRO ESTACIONAMIENTO -----------------------------//

function imprimirPlantillaPension(
  negocio,
  direccion,
  entrada,
  salida,
  total,
  folio,
  mensaje,
  marca,
  color
) {
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
              .logo > p{
                text-transform:uppercase;
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
              .mensaje{
                font-size:12px;
                text-align:center;
                text-transform:uppercase;
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
              <div>${folio}</div>
              <div class="logo">
                  <img src="${logoImg}" alt="" />
                  <p>${negocio}</p>
                  <small id="direccion">${direccion}</small>
              </div>
              <div class="details">
                  <h5>RECIBO DE PENSIÓN</h5>
                  <div class="horas"">
                      <p>Entrada: ${entrada}</p>
                      <p>Salida: ${salida}</p>
                  </div>
                  <div class="horas"">
                      <p>Placa: ${marca}</p>
                      <p>Color: ${color}</p>
                  </div>
                  <p>Monto: $${total}</p>
              </div>
              <div class="barcode">
                  <svg id="codigoBarras"></svg>
              </div>
              <p class="mensaje">${mensaje}</p>
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

//------------------------------- GENERAR REPORTE Y BACKUP -----------------------------//

document.querySelector("#reporte").addEventListener("click", async () => {
  const registrosEstacionamiento = await obtenerRegistrosEstacionamiento();
  const registrosPensiones = await obtenerRegistrosPension();
  const tipoPensiones = await datosTipoPension();
  const registrosServicios = await obtenerRegistrosServicios();
  const tipoServicios = await datosTipoServicio();
  const registrosGastos = await obtenerRegistrosGastos();

  const categorias = await datosCategorias();
  const clientes = await datosClientes();

  const estacionamientoBackup = registrosEstacionamiento.map((item) => {
    const auto = categorias.find((categoria) => categoria.id == item.categoria);
    return {
      categoria: auto.categoria,
      placa: item.placa,
      color: item.color,
      marca: item.marca,
      estado: item.estado,
      folio: item.folio,
      fechaEntrada: item.fechaEntrada,
      fechaSalida: item.fechaSalida,
      monto: item.monto,
    };
  });
  const pensionBackup = registrosPensiones.map((item) => {
    const cliente = clientes.find((cliente) => cliente.id == item.cliente);
    const pension = tipoPensiones.find((pension) => pension.id == item.tipo);
    return {
      cliente: cliente.nombre,
      pension: pension.pension,
      color: item.color,
      marca: item.marca,
      precio: pension.precio,
      folio: item.folio,
      fechaEntrada: item.fechaEntrada,
    };
  });

  const serviciosBackup = registrosServicios.map((item) => {
    const tipo = tipoServicios.find((servicio) => servicio.id == item.tipo);
    return {
      servicio: tipo.tipoServicio,
      cantidad: item.cantidad,
      fecha: item.fecha,
    };
  });


  const totalEstacionamiento = registrosEstacionamiento.reduce(
    (total, item) =>
      item.estado === "pagado" ? total + (item.monto || 0) : total,
    0
  );

  const totalPension = registrosPensiones.reduce((acc, registro) => {
    const pension = tipoPensiones.find(
      (pension) => pension.id == registro.tipo
    );
    if (pension) {
      acc += parseFloat(pension.precio);
    }

    return acc;
  }, 0);

  const totalServicio = registrosServicios.reduce((acc, registro) => {
    const servicio = tipoServicios.find(
      (servicio) => servicio.id == registro.tipo
    );
    if (servicio) {
      acc +=
        parseFloat(servicio.precioServicio) * parseFloat(registro.cantidad);
    }

    return acc;
  }, 0);

  const totalGastos = registrosGastos.reduce(
    (total, item) => total + (parseFloat(item.cantidad) || 0),
    0
  );

  if (navigator.onLine) {
    const respaldo = await backup(
      estacionamientoBackup,
      pensionBackup,
      serviciosBackup,
      registrosGastos
    );

    if (respaldo.success) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Respaldo Guardado!",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        abrirVentanaReporte(
          totalEstacionamiento,
          totalGastos,
          totalPension,
          totalServicio
        );
      }, 2000);
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No tienes conexión a internet, intentalo mas tarde!",
    });
  }
});

//------------------------------- VENTANA DE REPORTE -----------------------------//
function abrirVentanaReporte(
  totalEstacionamiento,
  totalGastos,
  totalPensiones,
  totalServicios
) {
  const ventana = window.open("", "_blank", "width=800,height=600");
  ventana.document.write(`
    <html>
      <head>
        <title>Reporte de Estacionamiento</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f9;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 80%;
            margin: 30px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
          }
          .header {
            font-size: 24px;
            color: #ff8c00;
            font-weight: bold;
            margin-bottom: 20px;
            border-bottom: 2px solid #ff8c00;
            padding-bottom: 10px;
          }
          .list-item {
            background-color: #f9f9f9;
            border-radius: 5px;
            margin: 10px 0;
            padding: 15px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 18px;
          }
          .list-item span {
            font-weight: bold;
            color: #333;
          }
          .total {
            background-color: #28a745;
            color: white;
            font-size: 20px;
            font-weight: bold;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
          }
          .total .value {
            color: #ffdd57;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">Reporte General</div>

          <div class="list-item">
            <span>Total Estacionamiento:</span>
            <span>$${totalEstacionamiento}</span>
          </div>

          <div class="list-item">
            <span>Total Gastos:</span>
            <span>$${totalGastos}</span>
          </div>

          <div class="list-item">
            <span>Total Pensiones:</span>
            <span>$${totalPensiones}</span>
          </div>

          <div class="list-item">
            <span>Total Servicios:</span>
            <span>$${totalServicios}</span>
          </div>

          <div class="total">
            <span>Total General: </span>
            <span class="value">$${
              totalEstacionamiento +
              totalPensiones +
              totalServicios -
              totalGastos
            }</span>
          </div>
        </div>
      </body>
    </html>
  `);
  ventana.document.close();
  ventana.print();
}

//------------------------------- REALIZAR RESPALDO -----------------------------//
async function backup(
  registrosEstacionamiento,
  registrosPensiones,
  registrosServicios,
  registrosGastos
) {
  try {
    const respuesta = await fetch(
      "app/controladores/ParkingController.php?action=guardar",
      {
        method: "POST",
        body: JSON.stringify({
          estacionamiento: registrosEstacionamiento,
          pensiones: registrosPensiones,
          servicios: registrosServicios,
          gastos: registrosGastos,
        }),

        headers: { "Content-Type": "application/json" },
      }
    );

    return await respuesta.json();
  } catch (error) {
    console.log("Error en la peticion: " + error);
  }
}

//------------------------------- GUARDAR USUARIO -----------------------------//

async function guardarUsuario(usuario) {
  try {
    const respuesta = await fetch(
      "app/controladores/UsuarioController.php?action=guardar",
      {
        method: "POST",
        body: JSON.stringify(usuario),
        headers: { "Content-Type": "application/json" },
      }
    );
    return await respuesta.json();
  } catch (error) {
    console.log("Error en la peticion: " + error);
  }
}
