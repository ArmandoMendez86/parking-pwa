<?php
session_start();
if (!$_SESSION['iniciarSesion'])
  header("Location: login.html");
?>

<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Sistema estacionamiento</title>
  <link rel="manifest" href="./manifest.json">

  <link rel="stylesheet" href="js/lib/boostrap.css">
  <link rel="stylesheet" href="js/lib/awesome.css">
  <link rel="stylesheet" href="js/lib/sweetalert.css" />
  <link rel="stylesheet" href="css/ticket.css" />
  <link rel="stylesheet" href="css/styles.css" />

</head>

<body>
  <!-- NAVBAR -->
  <nav class="navbar w-100">
    <div class="container-fluid">
      <a class="navbar-brand text-white" href="#">
        <img
          src="img/logo.jpg"
          alt="Logo"
          width="80"
          height="80"
          class="d-inline-block align-text-center rounded-circle" />
        SOFT PARKING V.1
      </a>
      <div class="d-flex gap-3">
        <P><?php echo $_SESSION['nombre'];  ?></P>
        <a href="app/controladores/logout.php" data-bs-toggle="tooltip"
          data-bs-placement="top"
          data-bs-title="Salir del sistema"
          class="text-white">
          <i class="fa fa-2x fa-sign-out" aria-hidden="true"></i>
        </a>
      </div>
    </div>
  </nav>
  <!-- CONTENIDO -->
  <div class="d-flex" id="contenedor-principal">
    <div
      class="nav flex-column nav-pills me-1 align-items-center mt-1 p-2"
      id="v-pills-tab"
      role="tablist"
      aria-orientation="vertical"
      style="width: 300px">
      <button
        class="nav-link active w-100"
        id="v-pills-home-tab"
        data-bs-toggle="pill"
        data-bs-target="#v-pills-home"
        type="button"
        role="tab"
        aria-controls="v-pills-home"
        aria-selected="true">
        ESTACIONAR
      </button>
      <button
        class="nav-link w-100"
        id="v-pills-profile-tab"
        data-bs-toggle="pill"
        data-bs-target="#v-pills-profile"
        type="button"
        role="tab"
        aria-controls="v-pills-profile"
        aria-selected="false">
        PENSIÓN
      </button>
      <button
        class="nav-link w-100"
        id="v-pills-disabled-tab"
        data-bs-toggle="pill"
        data-bs-target="#v-pills-disabled"
        type="button"
        role="tab"
        aria-controls="v-pills-disabled"
        aria-selected="false">
        CLIENTE
      </button>
      <button
        class="nav-link w-100"
        id="v-pills-messages-tab"
        data-bs-toggle="pill"
        data-bs-target="#v-pills-messages"
        type="button"
        role="tab"
        aria-controls="v-pills-messages"
        aria-selected="false">
        SERVICIO
      </button>
      <button
        class="nav-link w-100"
        id="v-pills-settings-tab"
        data-bs-toggle="pill"
        data-bs-target="#v-pills-settings"
        type="button"
        role="tab"
        aria-controls="v-pills-settings"
        aria-selected="false">
        GASTO
      </button>
      <!-- <button
          class="nav-link w-100"
          id="v-pills-panel-tab"
          data-bs-toggle="pill"
          data-bs-target="#v-pills-panel"
          type="button"
          role="tab"
          aria-controls="v-pills-panel"
          aria-selected="false"
        >
          Panel
        </button> -->
      <?php if ($_SESSION['perfil'] == 'admin') : ?>
        <button
          class="nav-link w-100"
          id="v-pills-precios-tab"
          data-bs-toggle="pill"
          data-bs-target="#v-pills-precios"
          type="button"
          role="tab"
          aria-controls="v-pills-precios"
          aria-selected="false">
          PRECIO
        </button>
        <button
          class="nav-link w-100"
          id="v-pills-usuarios-tab"
          data-bs-toggle="pill"
          data-bs-target="#v-pills-usuarios"
          type="button"
          role="tab"
          aria-controls="v-pills-usuarios"
          aria-selected="false">
          USUARIO
        </button>
      <?php endif   ?>

      <button
        class="nav-link w-100"
        id="v-pills-sistema-tab"
        data-bs-toggle="pill"
        data-bs-target="#v-pills-sistema"
        type="button"
        role="tab"
        aria-controls="v-pills-sistema"
        aria-selected="false">
        CONFIGURACIÓN
      </button>

      <button id="reporte"
        class="btn btn-light mt-auto"
        disabled
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-title="Generar reporte"><i class="fa fa-book" aria-hidden="true"></i></button>
    </div>
    <div class="tab-content mt-1 p-2 w-100" id="v-pills-tabContent">
      <div
        class="tab-pane fade show active"
        id="v-pills-home"
        role="tabpanel"
        aria-labelledby="v-pills-home-tab"
        tabindex="0">
        <!-- Vista de estacionamiento -->
        <h4 class="text-center mt-2">Registrar</h4>

        <form class="flex-grow-1 row g-2 p-3" id="formEstacionamiento">
          <div class="col-md-12 col-lg-6 ">
            <label for="placaE" class="form-label">Placas</label>
            <input type="text" class="form-control" id="placaE" />
          </div>
          <div class="col-md-12 col-lg-6 ">
            <label for="categoria" class="form-label">Categoria</label>
            <select class="form-control" id="categoria"></select>
          </div>
          <div class="col-md-12 col-lg-6 ">
            <label for="marcaE" class="form-label">Marca</label>
            <input type="text" class="form-control" id="marcaE" />
          </div>
          <div class="col-md-12 col-lg-6 ">
            <label for="colorE" class="form-label">Color</label>
            <input type="text" class="form-control" id="colorE" />
          </div>
          <div class="w-auto">
            <button type="submit" class="btn btn-secondary mt-2">Guardar</button>
          </div>
        </form>
        <!-- Mostrando detalles del ticket -->
        <div class="contenedor-tickets flex-grow-1 d-flex gap-2 mt-3">
          <!-- COBRO DE FOLIO ESTACIONAMIENTO -->
          <div class="bloque-uno">
            <div class="col-sm-12 col-md-6  mx-auto">
              <input
                type="text"
                class="form-control text-center"
                id="folio"
                placeholder="Cobrar folio..." />
            </div>
            <div class="ticket d-none">
              <div class="encab_ticket">
                <div id="folioNum" class="text-white"></div>
              </div>
              <div class="logo">
                <img
                  id="logoEstacionamiento"
                  alt="Logo"
                  class="rounded-circle" />
                <p class="mt-2" id="negocioEstacionamiento"></p>
              </div>
              <div class="details">
                <h6 class="text-center">RECIBO DE ESTACIONAMIENTO</h6>
                <p id="fechaEntrada" class="text-center"></p>
                <div class="d-flex justify-content-between horas">
                  <p id="horaEntrada"></p>
                  <p id="horaSalida"></p>
                </div>
                <p id="tiempo" class="text-center"></p>
                <p id="total" class="text-center"></p>
              </div>
              <div class="barcode">
                <svg id="codigoBarras"></svg>
              </div>
            </div>
          </div>
          <!-- CONSULTA DE FOLIO ESTACIONAMIENTO -->
          <div class="bloque-dos">
            <div class="col-sm-12 col-md-6  mx-auto">
              <input
                type="text"
                class="form-control text-center"
                id="buscarFolio"
                placeholder="Consulta el folio..." />
            </div>
            <div class="ticketDetalle d-none">
              <p id="estadoPago" class="d-none"></p>
              <div class="encab_ticket">
                <div id="folioNum-dos" class="text-white"></div>
                <div class="eliminarTicket">
                  <div class="btn-group btn-group-sm" role="group" aria-label="Small button group">
                    <button type="button"
                      class="btn btn-light cancelarTicket"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      data-bs-title="Cancelar ticket"><i class="fa fa-ban" aria-hidden="true"></i></button>
                    <button type="button"
                      class="btn btn-light reimprimir"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      data-bs-title="Reimprimir ticket entrada"><i class="fa fa-print"></i></button>
                    <button type="button"
                      id="deleteTicket"
                      ticketNum=""
                      class="btn btn-light deletTicket"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      data-bs-title="Eliminar ticket"><i class="fa fa-trash-o" aria-hidden="true"></i></button>
                  </div>
                </div>
              </div>
              <div class="logo">
                <img
                  id="logoEstacionamiento-dos"
                  class="rounded-circle"
                  alt="Logo" />
                <p class="mt-2" id="negocio-dos"></p>
              </div>
              <div class="details">
                <h6 class="text-center">RECIBO DE ESTACIONAMIENTO</h6>
                <p id="fechaEntrada-dos" class="text-center"></p>
                <div class="d-flex justify-content-between horas">
                  <p id="horaEntrada-dos"></p>
                  <p id="horaSalida-dos"></p>
                </div>
                <p id="tiempo-dos" class="text-center"></p>
                <p id="total-dos" class="text-center"></p>
              </div>
              <div class="barcode">
                <svg id="codigoBarras-dos"></svg>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div
        class="tab-pane fade"
        id="v-pills-profile"
        role="tabpanel"
        aria-labelledby="v-pills-profile-tab"
        tabindex="0">
        <!-- Vista de pension -->
        <form class="row g-3" id="formPension">
          <h4 class="text-center">Registrar</h4>
          <div class="col-md-6">
            <label for="cliente" class="form-label">Cliente</label>
            <select name="" id="cliente" class="form-control"></select>
          </div>
          <div class="col-md-6">
            <label for="tipo" class="form-label">Tipo</label>
            <select id="tipo" class="form-control"></select>
          </div>
          <div class="col-md-6">
            <label for="marca" class="form-label">Marca</label>
            <input type="text" class="form-control" id="marca" />
          </div>
          <div class="col-md-6">
            <label for="color" class="form-label">Color</label>
            <input type="text" class="form-control" id="color" />
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-secondary">Guardar</button>
          </div>
        </form>
        <div class="d-flex justify-content-center mt-5 impresionTicket">
          <div class="col-4">
            <div class="mx-auto">
              <input
                type="text"
                class="form-control text-center"
                id="folioPension"
                placeholder="Cobrar folio..." />
            </div>
            <div class="ticketPension mt-4 d-none">
              <div class="encab_ticket">
                <div id="folioNumPension" class="text-white"></div>
                <div class="eliminarTicket">
                  <button
                    id="imprimirTicket"
                    type="button"
                    class="btn btn-light btn-sm"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-title="Imprimir ticket">
                    <i class="fa fa-print"></i>
                  </button>
                </div>
              </div>
              <div class="logo">
                <img id="logoPension" alt="Logo" class="rounded-circle" />
                <p class="mt-2" id="negocioPension"></p>
                <small id="direccion"></small>
              </div>
              <div class="details">
                <h6 class="text-center">RECIBO DE PENSIÓN</h6>
                <p id="entradaPension" class="text-center"></p>
                <div class="d-flex justify-content-between horas">
                  <p id="horaEntrada"></p>
                </div>

                <p id="totalPension" class="text-center"></p>
              </div>
              <div class="barcode">
                <svg id="codigoBarrasPension"></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="tab-pane fade"
        id="v-pills-disabled"
        role="tabpanel"
        aria-labelledby="v-pills-disabled-tab"
        tabindex="0">
        <!-- Vista de clientes -->
        <form class="row g-3" id="formClientes">
          <h4 class="text-center">Registrar</h4>
          <div class="col-md-6">
            <label for="nombreC" class="form-label">Nombre</label>
            <input type="text" class="form-control" id="nombreC" />
          </div>
          <div class="col-md-6">
            <label for="telefonoC" class="form-label">Telefono</label>
            <input type="text" class="form-control" id="telefonoC" />
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-secondary">Guardar</button>
          </div>
        </form>
      </div>
      <div
        class="tab-pane fade"
        id="v-pills-messages"
        role="tabpanel"
        aria-labelledby="v-pills-messages-tab"
        tabindex="0">
        <!-- Vista de servicios -->
        <form class="row g-3" id="formServicios">
          <h4 class="text-center">Registrar</h4>
          <div class="col-md-6">
            <label for="servicio" class="form-label">Servicio</label>
            <select id="servicio" class="form-control"></select>
          </div>
          <div class="col-md-6">
            <label for="cantidadServicio" class="form-label">Cantidad</label>
            <input
              type="number"
              class="form-control"
              min="1"
              value="1"
              id="cantidadServicio" />
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-secondary">Guardar</button>
          </div>
        </form>
      </div>
      <div
        class="tab-pane fade"
        id="v-pills-settings"
        role="tabpanel"
        aria-labelledby="v-pills-settings-tab"
        tabindex="0">
        <!-- Vista de gastos -->
        <form class="row g-3" id="formGastos">
          <h4 class="text-center">Registrar</h4>
          <div class="col-md-6">
            <label for="concepto" class="form-label">Concepto</label>
            <input type="text" class="form-control" id="concepto" />
          </div>
          <div class="col-md-6">
            <label for="cantidadGasto" class="form-label">Cantidad</label>
            <input
              type="number"
              step="0.5"
              class="form-control"
              min="1"
              value="1"
              id="cantidadGasto" />
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-secondary">Guardar</button>
          </div>
        </form>
      </div>
      <!-- <div
          class="tab-pane fade"
          id="v-pills-panel"
          role="tabpanel"
          aria-labelledby="v-pills-panel-tab"
          tabindex="0"
        >
        </div> -->
      <div
        class="tab-pane fade"
        id="v-pills-precios"
        role="tabpanel"
        aria-labelledby="v-pills-precios-tab"
        tabindex="0">
        <!-- Precios Estacionamiento -->
        <form class="row g-3" id="formPrecios">
          <h4 class="text-center">Precios Estacionamiento</h4>
          <div class="col-md-6">
            <label for="categoriaP" class="form-label">Categoria</label>
            <input type="text" class="form-control" id="categoriaP" />
          </div>
          <div class="col-md-6">
            <label for="precioHora" class="form-label">Precio X Hora</label>
            <input
              type="number"
              step="0.5"
              class="form-control"
              min="1"
              value="1"
              id="precioHora" />
          </div>
          <div class="col-md-6">
            <label for="precioFraccion" class="form-label">Precio X Fraccion</label>
            <input
              type="number"
              step="0.5"
              class="form-control"
              min="1"
              value="1"
              id="precioFraccion" />
          </div>
          <div class="col-md-3">
            <label for="minimo" class="form-label">Tiempo minimo</label>
            <input
              type="number"
              class="form-control"
              min="1"
              value="2"
              id="minimo" />
          </div>
          <div class="col-md-3">
            <label for="maximo" class="form-label">Tiempo maximo</label>
            <input
              type="number"
              class="form-control"
              min="1"
              value="30"
              id="maximo" />
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-secondary">Guardar</button>
          </div>
        </form>
        <!-- Precios Pension -->
        <form class="row g-3 mt-4" id="formTipoPension">
          <h4 class="text-center">Precios Pensiones</h4>
          <div class="col-md-6">
            <label for="tipoPension" class="form-label">Pension</label>
            <input type="text" class="form-control" id="tipoPension" />
          </div>
          <div class="col-md-6">
            <label for="precioPension" class="form-label">Precio</label>
            <input type="number" class="form-control" id="precioPension" />
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-secondary">Guardar</button>
          </div>
        </form>
        <!-- Precios Servicios -->
        <form class="row g-3 mt-4" id="formTipoServicios">
          <h4 class="text-center">Precios Servicios</h4>
          <div class="col-md-6">
            <label for="tipoServicio" class="form-label">Servicio</label>
            <input type="text" class="form-control" id="tipoServicio" />
          </div>
          <div class="col-md-6">
            <label for="precioServicio" class="form-label">Precio</label>
            <input type="number" class="form-control" id="precioServicio" />
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-secondary">Guardar</button>
          </div>
        </form>
      </div>
      <div
        class="tab-pane fade"
        id="v-pills-usuarios"
        role="tabpanel"
        aria-labelledby="v-pills-usuarios-tab"
        tabindex="0">
        <!-- Vista de usuarios -->
        <form class="row g-3" id="formUsuarios">
          <h4 class="text-center">Registrar Usuario</h4>
          <div class="col-md-6">
            <label for="nombre" class="form-label">Nombre</label>
            <input type="text" class="form-control" id="nombre" />
          </div>
          <div class="col-md-6">
            <label for="perfil" class="form-label">Perfil</label>
            <select id="perfil" class="form-control">
              <option value="admin">Administrador</option>
              <option value="recepcion">Recepción</option>
            </select>
          </div>
          <div class="col-md-12">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" />
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-secondary">Guardar</button>
          </div>
        </form>
      </div>
      <div
        class="tab-pane fade"
        id="v-pills-sistema"
        role="tabpanel"
        aria-labelledby="v-pills-sistema-tab"
        tabindex="0">
        <!-- Vista de configuracion del sistema -->
        <form class="row g-3" id="formConfiguracion">
          <h4 class="text-center">Configuracion del sistema</h4>
          <div class="col-md-6">
            <label for="negocio" class="form-label">Nombre del negocio</label>
            <input type="text" class="form-control" id="nombreNegocio" />
          </div>
          <div class="col-md-6">
            <label for="direccion" class="form-label">Direccion</label>
            <input type="text" class="form-control" id="direccionNegocio" />
          </div>
          <div class="col-md-6">
            <label for="telefono" class="form-label">Telefono</label>
            <input type="tel" class="form-control" id="telefonoNegocio" />
          </div>
          <div class="col-md-6">
            <label class="form-label" for="mensaje">Mensaje de ticket</label>
            <textarea
              rows="6"
              class="form-control"
              placeholder="Leave a comment here"
              id="mensajeNegocio"></textarea>
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-secondary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <script>
    // Registrar el Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("service-worker.js")
        .then((registration) => {
          console.log("Service Worker registrado con éxito:", registration);
        })
        .catch((error) => {
          console.error("Error al registrar el Service Worker:", error);
        });
    } else {
      console.warn("Service Workers no son soportados en este navegador.");
    }
  </script>

  <script src="js/lib/boostrap.js"></script>
  <script src="js/lib/jsbarcode.js"></script>
  <script src="js/lib/moment.js"></script>
  <script src="js/lib/sweetalert.js"></script>
  <script type="module" src="js/app.js"></script>
</body>

</html>