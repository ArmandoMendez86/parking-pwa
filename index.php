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
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
    crossorigin="anonymous" />
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/fontawesome-4.7@4.7.0/css/font-awesome.min.css" />

  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/sweetalert2@11.17.2/dist/sweetalert2.min.css" />
  <link rel="stylesheet" href="css/ticket.css" />
  <link rel="stylesheet" href="css/styles.css" />
</head>

<body>
  <nav class="navbar w-100">
    <div class="container-fluid">
      <a class="navbar-brand text-white" href="#">
        <img
          src="img/logo.jpg"
          alt="Logo"
          width="80"
          height="80"
          class="d-inline-block align-text-top rounded-circle" />
        CONTROL DE ESTACIONAMIENTO V.1
      </a>
      <div>
        <a href="app/controladores/logout.php">
          <button
            class="btn btn-danger rounded-circle"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            data-bs-title="Salir del sistema">
            <i class="fa fa-sign-out" aria-hidden="true"></i>
          </button>
        </a>
      </div>
    </div>
  </nav>
  <div class="d-flex align-items-start h-100" id="contenedor-principal">
    <div
      class="nav flex-column nav-pills me-2 align-items-center mt-2 p-2 h-100"
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
        Estacionamiento
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
        Pension
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
        Clientes
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
        Servicios
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
        Gastos
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
          Precios
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
          Usuarios
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
        Sistema
      </button>

      <button id="reporte" class="btn btn-light mt-auto" disabled>Reporte</button>
    </div>
    <div class="tab-content mt-2 p-5 w-100 h-100" id="v-pills-tabContent">
      <div
        class="tab-pane fade show active"
        id="v-pills-home"
        role="tabpanel"
        aria-labelledby="v-pills-home-tab"
        tabindex="0">
        <!-- Vista de estacionamiento -->
        <form class="row g-3" id="formEstacionamiento">
          <h4 class="text-center">Registrar Estacionamiento</h4>
          <div class="col-md-6">
            <label for="placaE" class="form-label">Placas</label>
            <input type="text" class="form-control" id="placaE" />
          </div>
          <div class="col-md-6">
            <label for="categoria" class="form-label">Categoria</label>
            <select class="form-control" id="categoria"></select>
          </div>
          <div class="col-md-6">
            <label for="marcaE" class="form-label">Marca</label>
            <input type="text" class="form-control" id="marcaE" />
          </div>
          <div class="col-md-6">
            <label for="colorE" class="form-label">Color</label>
            <input type="text" class="form-control" id="colorE" />
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-primary">Registrar</button>
          </div>
        </form>

        <!-- Mostrando detalles del ticket -->

        <div class="contenedor-tickets mt-5">
          <!-- COBRO DE FOLIO ESTACIONAMIENTO -->
          <div class="bloque-uno">
            <div class="col-6 mx-auto">
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
            <div class="col-6 mx-auto">
              <input
                type="text"
                class="form-control text-center"
                id="buscarFolio"
                placeholder="Consulta el folio..." />
            </div>
            <div class="ticketDetalle d-none">
              <p id="estadoPago" class="d-none">Pagado</p>
              <div class="encab_ticket">
                <div id="folioNum-dos" class="text-white"></div>
                <div class="eliminarTicket">
                  <button
                    class="btn btn-sm btn-light"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-title="Reimprimir ticket entrada">
                    <i class="fa fa-print"></i>
                  </button>
                  <button
                    id="deleteTicket"
                    ticketNum=""
                    type="button"
                    class="btn btn-danger btn-sm"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-title="Eliminar ticket">
                    X
                  </button>
                </div>
              </div>
              <div class="logo">
                <img
                  id="logoEstacionamiento-dos"
                  class="rounded-circle"
                  alt="Logo" />
                <p class="mt-2" id="negocio-dos">
                  Nombre de la Empresa<br />Dirección
                </p>
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
          <h4 class="text-center">Registrar Pensión</h4>
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
            <button type="submit" class="btn btn-primary">Registrar</button>
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
          <h4 class="text-center">Registrar Cliente</h4>
          <div class="col-md-6">
            <label for="nombreC" class="form-label">Nombre</label>
            <input type="text" class="form-control" id="nombreC" />
          </div>
          <div class="col-md-6">
            <label for="telefonoC" class="form-label">Telefono</label>
            <input type="text" class="form-control" id="telefonoC" />
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-primary">Registrar</button>
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
          <h4 class="text-center">Venta de Servicio</h4>
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
            <button type="submit" class="btn btn-primary">Registrar</button>
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
          <h4 class="text-center">Registrar Gasto</h4>
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
            <button type="submit" class="btn btn-primary">Registrar</button>
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
            <button type="submit" class="btn btn-primary">Registrar</button>
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
            <button type="submit" class="btn btn-primary">Registrar</button>
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
            <button type="submit" class="btn btn-primary">Registrar</button>
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
            <button type="submit" class="btn btn-primary">Registrar</button>
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
            <button type="submit" class="btn btn-primary">Registrar</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
    crossorigin="anonymous"></script>
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

  <script src="js/jsbarcode.js"></script>
  <script src="js/moment.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.17.2/dist/sweetalert2.all.min.js"></script>
  <script type="module" src="js/app.js"></script>
</body>

</html>