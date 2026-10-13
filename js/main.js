// js/main.js
// Conecta la tabla con los filtros de categoria, ciudad, estado y fechas.

document.addEventListener('DOMContentLoaded', () => {

  // 1. Se crea la tabla
  const tabla = crearTabla();

  // 2. Se llenan las listas de filtros con los valores que existen en los datos
  llenarLista('#fCategoria', valoresUnicos(VENTAS, 'categoria'));
  llenarLista('#fCiudad', valoresUnicos(VENTAS, 'ciudad'));
  llenarLista('#fEstado', valoresUnicos(VENTAS, 'estado'));

  // 3. Filtros por columna. Se usa 'exact' para que coincida la palabra completa
  function aplicarFiltros() {
    tabla.column(COL.categoria).search(document.querySelector('#fCategoria').value, { exact: true });
    tabla.column(COL.ciudad).search(document.querySelector('#fCiudad').value, { exact: true });
    tabla.column(COL.estado).search(document.querySelector('#fEstado').value, { exact: true });
    tabla.draw();    // el rango de fechas tambien se aplica aqui (ver tabla.js)
  }
  ['#fCategoria', '#fCiudad', '#fEstado', '#fDesde', '#fHasta'].forEach(id =>
    document.querySelector(id).addEventListener('change', aplicarFiltros));

  // 4. Boton para quitar todos los filtros
  document.querySelector('#btnLimpiar').addEventListener('click', () => {
    ['#fCategoria', '#fCiudad', '#fEstado'].forEach(id => { document.querySelector(id).value = ''; });
    ['#fDesde', '#fHasta'].forEach(id => { document.querySelector(id).value = ''; });
    tabla.search('');            // vacia la busqueda global
    aplicarFiltros();
  });

});

// Llena un <select> con la opcion "Todos" y los valores recibidos
function llenarLista(selector, valores) {
  const lista = document.querySelector(selector);
  lista.add(new Option('Todos', ''));
  valores.forEach(v => lista.add(new Option(v, v)));
}
