// js/tabla.js
// Configuracion de DataTables. Aqui estan la paginacion, el orden, la busqueda,
// el formato de las celdas, el rango de fechas y los botones de exportacion.

// Posicion de cada columna en la tabla (empieza en 0)
const COL = { id: 0, fecha: 1, cliente: 2, categoria: 3, ciudad: 4, cantidad: 5, total: 6, estado: 7 };

// Clase CSS que corresponde a cada estado (ver css/estilos.css)
const CLASES_ESTADO = { Pagado: 'ok', Pendiente: 'pend', Cancelado: 'anulado' };

function crearTabla() {

  // Opciones comunes de los tres botones de exportacion.
  // Al personalizar el cuerpo se devuelven los valores crudos en las columnas que
  // tienen formato (fecha, total y estado), asi el archivo no lleva HTML ni simbolos.
  const exportar = {
    columns: [0, 1, 2, 3, 4, 5, 6, 7],
    format: {
      body: (dato, fila, columna) => {
        const registro = tabla.row(fila).data();
        if (columna === COL.fecha) return registro.fecha;            // AAAA-MM-DD
        if (columna === COL.total) return String(registro.total);    // numero, sin $
        if (columna === COL.estado) return registro.estado;          // texto, sin etiqueta
        return dato;
      }
    }
  };

  const tabla = new DataTable('#tabla', {
    data: VENTAS,                       // arreglo de objetos de js/datos.js

    columns: [
      { data: 'id', title: 'ID' },

      // Se guarda como 'AAAA-MM-DD' (ordena bien) y solo se muestra con formato local
      { data: 'fecha', title: 'Fecha',
        render: (valor, tipo) => tipo === 'display'
          ? new Date(valor + 'T00:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
          : valor },

      { data: 'cliente', title: 'Cliente' },
      { data: 'categoria', title: 'Categoría' },
      { data: 'ciudad', title: 'Ciudad' },
      { data: 'cantidad', title: 'Cant.' },

      // Moneda. Para ordenar y buscar se sigue usando el numero crudo
      { data: 'total', title: 'Total', className: 'dt-right',
        render: (valor, tipo) => tipo === 'display' ? moneda.format(valor) : valor },

      // Estado con etiqueta de color
      { data: 'estado', title: 'Estado',
        render: (valor, tipo) => tipo === 'display'
          ? `<span class="etiqueta ${CLASES_ESTADO[valor]}">${valor}</span>`
          : valor }
    ],

    // Paginacion, orden y busqueda global
    paging: true,
    pageLength: 10,
    ordering: true,
    order: [[COL.fecha, 'desc']],       // al abrir, lo mas reciente primero
    searching: true,
    searchDelay: 200,                   // espera 200 ms despues de escribir
    responsive: true,                   // en pantallas pequenas oculta columnas

    // Donde va cada control. Buttons es la extension de exportacion.
    layout: {
      topStart: {
        buttons: [
          { extend: 'csv',   text: 'CSV',   filename: 'ventas', exportOptions: exportar },
          { extend: 'excel', text: 'Excel', filename: 'ventas', title: 'Ventas 2026', exportOptions: exportar },
          { extend: 'pdf',   text: 'PDF',   filename: 'ventas', title: 'Ventas 2026',
            orientation: 'landscape', exportOptions: exportar }
        ]
      },
      topEnd: 'search',
      bottomStart: ['pageLength', 'info'],
      bottomEnd: 'paging'
    },

    // Textos en espanol (sin depender de internet)
    language: {
      search: 'Buscar',
      lengthMenu: 'Mostrar _MENU_ filas',
      info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
      infoEmpty: 'Sin registros',
      infoFiltered: '(filtrado de _MAX_ en total)',
      zeroRecords: 'No hay resultados con esos filtros',
      paginate: { previous: 'Anterior', next: 'Siguiente' }
    }
  });

  return tabla;
}

// Filtro por rango de fechas. DataTables ejecuta esta funcion para cada fila:
// si devuelve true la fila se queda, si devuelve false se oculta.
DataTable.ext.search.push((ajustes, datosFila, indice, fila) => {
  if (ajustes.nTable.id !== 'tabla') return true;      // solo aplica a esta tabla

  const desde = document.querySelector('#fDesde').value;   // '' si esta vacio
  const hasta = document.querySelector('#fHasta').value;

  // Las fechas son texto 'AAAA-MM-DD', asi que compararlas como texto funciona
  if (desde && fila.fecha < desde) return false;
  if (hasta && fila.fecha > hasta) return false;
  return true;
});
