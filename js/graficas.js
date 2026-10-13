// js/graficas.js
// Configuracion de Chart.js. Las graficas se crean una sola vez y despues
// solo se les cambian los datos con actualizarGraficas().

const PALETA = ['#1F4E79', '#2E86C1', '#85C1E9', '#C0392B', '#E59866', '#7D8C8E'];

let gCategorias = null;     // grafica 1, barras (o torta)
let gMeses = null;          // grafica 2, lineas
let tipoCategorias = 'bar'; // tipo actual de la grafica 1

// Crea la grafica 1. Se puede llamar de nuevo con otro tipo ('bar' o 'pie').
function crearGraficaCategorias(tipo) {
  if (gCategorias) gCategorias.destroy();    // libera el canvas antes de reutilizarlo
  tipoCategorias = tipo;
  const esBarras = tipo === 'bar';

  gCategorias = new Chart(document.getElementById('gCategorias'), {
    type: tipo,
    data: {
      labels: [],
      datasets: [{
        label: 'Ventas (COP)',
        data: [],
        backgroundColor: esBarras ? '#1F4E79' : PALETA,
        borderRadius: esBarras ? 4 : 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,        // la altura la manda .caja-grafica
      plugins: {
        legend: { display: !esBarras, position: 'bottom' },
        tooltip: {
          callbacks: {
            label: ctx => esBarras
              ? ' ' + moneda.format(ctx.parsed.y)
              : ` ${ctx.label}: ${moneda.format(ctx.parsed)}`
          }
        }
      },
      // La torta no tiene ejes
      scales: esBarras ? {
        x: { title: { display: true, text: 'Categoría' } },
        y: { beginAtZero: true,
             title: { display: true, text: 'Ventas (COP)' },
             ticks: { callback: valor => moneda.format(valor) } }
      } : {}
    }
  });
}

// Crea la grafica 2 (lineas)
function crearGraficaMeses() {
  gMeses = new Chart(document.getElementById('gMeses'), {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Ventas (COP)',
        data: [],
        borderColor: '#C0392B',
        backgroundColor: '#C0392B',
        tension: 0.3,
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'bottom' },
        tooltip: { callbacks: { label: ctx => ' ' + moneda.format(ctx.parsed.y) } }
      },
      scales: {
        x: { title: { display: true, text: 'Mes' } },
        y: { beginAtZero: true,
             title: { display: true, text: 'Ventas (COP)' },
             ticks: { callback: valor => moneda.format(valor) } }
      }
    }
  });
}

// Recalcula las dos graficas con las filas que se le pasen
function actualizarGraficas(filas) {

  // Grafica 1, total por categoria, de mayor a menor
  const porCategoria = [...sumarPor(filas, f => f.categoria)].sort((a, b) => b[1] - a[1]);
  gCategorias.data.labels = porCategoria.map(par => par[0]);
  gCategorias.data.datasets[0].data = porCategoria.map(par => par[1]);
  gCategorias.update();

  // Grafica 2, total por mes. La clave es 'AAAA-MM', se ordena cronologicamente
  const porMes = [...sumarPor(filas, f => f.fecha.slice(0, 7))].sort((a, b) => a[0].localeCompare(b[0]));
  gMeses.data.labels = porMes.map(par => nombreMes(par[0]));
  gMeses.data.datasets[0].data = porMes.map(par => par[1]);
  gMeses.update();
}
