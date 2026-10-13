// js/utilidades.js
// Funciones y valores compartidos por la tabla, las graficas y main.js.

// Formato de pesos colombianos, sin decimales. Ejemplo: $ 3.200.000
const moneda = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0
});

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

// Convierte la clave '2026-03' en 'mar 2026' para mostrarla en el eje de la grafica
function nombreMes(clave) {
  const [anio, mes] = clave.split('-');
  return MESES[Number(mes) - 1] + ' ' + anio;
}

// Suma el campo total de las filas agrupando por la clave que devuelva la funcion.
// Devuelve un Map, por ejemplo Map { 'Hogar' => 6200000, 'Ropa' => 4100000 }
function sumarPor(filas, clave) {
  const acumulado = new Map();
  for (const fila of filas) {
    const grupo = clave(fila);
    acumulado.set(grupo, (acumulado.get(grupo) || 0) + fila.total);
  }
  return acumulado;
}

// Valores unicos de un campo, ordenados alfabeticamente (para llenar las listas de filtros)
function valoresUnicos(datos, campo) {
  return [...new Set(datos.map(d => d[campo]))].sort((a, b) => a.localeCompare(b, 'es'));
}
