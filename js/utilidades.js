// js/utilidades.js
// Funciones y valores compartidos por la tabla y main.js.

// Formato de pesos colombianos, sin decimales. Ejemplo: $ 3.200.000
const moneda = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0
});

// Valores unicos de un campo, ordenados alfabeticamente (para llenar las listas de filtros)
function valoresUnicos(datos, campo) {
  return [...new Set(datos.map(d => d[campo]))].sort((a, b) => a.localeCompare(b, 'es'));
}
