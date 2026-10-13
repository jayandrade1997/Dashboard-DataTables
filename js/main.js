// js/main.js
// Conecta la tabla con las graficas y las tarjetas.
// Idea central: la tabla es la fuente de verdad. Cada vez que la tabla se
// redibuja (busqueda, filtro, cambio de pagina) se leen las filas filtradas
// y se recalcula todo lo demas.

document.addEventListener('DOMContentLoaded', () => {

  // 1. Las graficas se crean primero (todavia vacias)
  crearGraficaCategorias('bar');
  crearGraficaMeses();

  // 2. Se crea la tabla
  const tabla = crearTabla();

  // 3. Se llenan las listas de filtros con los valores que existen en los datos
  llenarLista('#fCategoria', valoresUnicos(VENTAS, 'categoria'));
  llenarLista('#fCiudad', valoresUnicos(VENTAS, 'ciudad'));
  llenarLista('#fEstado', valoresUnicos(VENTAS, 'estado'));

  // Filas que cumplen el filtro actual, sin importar en que pagina este el usuario
  function filasFiltradas() {
    return tabla.rows({ search: 'applied' }).data().toArray();
  }

  // Recalcula tarjetas y graficas con las filas filtradas
  function refrescarTodo() {
    const filas = filasFiltradas();
    const suma = filas.reduce((acc, f) => acc + f.total, 0);
    const pagados = filas.filter(f => f.estado === 'Pagado').length;

    document.querySelector('#kpiTotal').textContent = moneda.format(suma);
    document.querySelector('#kpiPedidos').textContent = filas.length;
    document.querySelector('#kpiTicket').textContent = filas.length ? moneda.format(suma / filas.length) : '-';
    document.querySelector('#kpiPagados').textContent = filas.length
      ? Math.round(pagados / filas.length * 100) + ' %'
      : '-';

    actualizarGraficas(filas);
  }

  // 4. Cada redibujado de la tabla actualiza todo
  tabla.on('draw', refrescarTodo);

  // 5. Filtros por columna. Se usa 'exact' para que coincida la palabra completa
  function aplicarFiltros() {
    tabla.column(COL.categoria).search(document.querySelector('#fCategoria').value, { exact: true });
    tabla.column(COL.ciudad).search(document.querySelector('#fCiudad').value, { exact: true });
    tabla.column(COL.estado).search(document.querySelector('#fEstado').value, { exact: true });
    tabla.draw();    // el rango de fechas tambien se aplica aqui (ver tabla.js)
  }
  ['#fCategoria', '#fCiudad', '#fEstado', '#fDesde', '#fHasta'].forEach(id =>
    document.querySelector(id).addEventListener('change', aplicarFiltros));

  // 6. Boton para quitar todos los filtros
  document.querySelector('#btnLimpiar').addEventListener('click', () => {
    ['#fCategoria', '#fCiudad', '#fEstado'].forEach(id => { document.querySelector(id).value = ''; });
    ['#fDesde', '#fHasta'].forEach(id => { document.querySelector(id).value = ''; });
    tabla.search('');            // vacia la busqueda global
    aplicarFiltros();
  });

  // 7. Boton que cambia la grafica 1 entre barras y torta
  const btnTipo = document.querySelector('#btnTipo');
  btnTipo.addEventListener('click', () => {
    const nuevo = tipoCategorias === 'bar' ? 'pie' : 'bar';
    crearGraficaCategorias(nuevo);
    btnTipo.textContent = nuevo === 'bar' ? 'Ver como torta' : 'Ver como barras';
    refrescarTodo();             // la grafica nueva nace vacia, se vuelve a llenar
  });

  // 8. Primer calculo al cargar la pagina
  refrescarTodo();
});

// Llena un <select> con la opcion "Todos" y los valores recibidos
function llenarLista(selector, valores) {
  const lista = document.querySelector(selector);
  lista.add(new Option('Todos', ''));
  valores.forEach(v => lista.add(new Option(v, v)));
}
