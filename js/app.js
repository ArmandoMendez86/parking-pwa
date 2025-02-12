// app.js

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

      let horaLocal = fecha.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
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
// Función para cargar datos de servicios
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

function generarFolio(ultimosFolios) {
  const fechaActual = new Date();
  const mesActual = fechaActual
    .toLocaleString("default", { month: "short" })
    .toUpperCase();

  // 2. Filtrado y manejo de mes sin folios:
  const foliosMesActual = ultimosFolios.filter((folio) => {
    return folio && folio.folio && folio.folio.startsWith(mesActual);
  });

  if (foliosMesActual.length === 0) {
    return `${mesActual}-0001`; // Retorna el primer folio si no hay registros para el mes actual
  }

  // 3. Encontrar el último folio y generar el siguiente (versión corregida):
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

// Función para obtener registros de estacionamiento
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

  if (existe) {
    document.querySelector(".ticket").classList.remove("d-none");
  }
});

// Escuchar cambios en las pestañas
/* document.querySelectorAll(".nav-link").forEach((enlace) => {
  enlace.addEventListener("click", () => {
    const target = enlace.getAttribute("data-bs-target");
    window.history.pushState({ target: target }, "", `#${target}`);
  });
}); */
