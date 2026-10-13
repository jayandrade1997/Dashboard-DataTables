# Dashboard de ventas

Dashboard de una sola página que combina una grilla interactiva hecha con DataTables y dos gráficas hechas con Chart.js. Las dos partes están conectadas. Cuando se busca o se filtra en la tabla, las gráficas y las tarjetas de resumen se recalculan con las filas que quedaron.

El proyecto se hizo para la exposición sobre **DataTables y grillas avanzadas** y **gráficos y visualización de datos**. Trabaja con 80 ventas simuladas de enero a junio de 2026, de una tienda ficticia con seis categorías de producto y cinco ciudades.

## Cómo abrirlo

No requiere instalación ni conexión a internet. Todas las librerías vienen dentro de la carpeta `lib/`. Basta con descargar o clonar el repositorio y abrir el archivo `index.html` en cualquier navegador moderno, con doble clic.

Si se prefiere abrirlo desde un servidor local, se puede ejecutar `python -m http.server 8000` dentro de la carpeta del proyecto y entrar a `http://localhost:8000`.

## Cómo se usa, paso a paso

### Al abrir la página

Lo primero que aparece son cuatro tarjetas con el resumen de todas las ventas. Muestran el total vendido ($ 93.488.000), el número de pedidos (80), el ticket promedio, que es lo que gasta en promedio cada pedido ($ 1.168.600), y el porcentaje de pedidos que ya están pagados (65 %).

Debajo hay dos gráficas. A la izquierda se ven las ventas por categoría en barras, ordenadas de mayor a menor, donde Tecnología queda de primera por un margen amplio. A la derecha se ven las ventas mes a mes en una línea, de enero a junio. Si se pasa el cursor sobre una barra o un punto de la línea, aparece un globo con el valor exacto en pesos.

Al final está la tabla con los 80 registros, de las ventas más recientes a las más antiguas. Muestra diez filas por página, y los estados Pagado, Pendiente y Cancelado se distinguen con etiquetas verde, amarilla y roja.

### Buscar en la tabla

Arriba a la derecha de la tabla hay un cuadro de búsqueda. Al escribir allí, la tabla busca el texto en todas las columnas a la vez. Por ejemplo, al escribir "Laura" quedan solo los 7 pedidos de clientes con ese nombre. En ese mismo instante las tarjetas y las dos gráficas se recalculan y pasan a mostrar únicamente esos 7 pedidos. Al borrar el texto, todo vuelve a mostrar las 80 ventas.

### Filtrar por columna y por fechas

Encima de la tabla hay tres listas desplegables para filtrar por categoría, ciudad y estado, y dos campos de fecha, uno para desde y otro para hasta. Cada filtro funciona solo o combinado con los demás y con la búsqueda. Al elegir la categoría Hogar quedan 14 pedidos, y si además se elige el estado Pagado quedan 8. Al escoger como rango del 1 de marzo al 30 de abril quedan 23 pedidos, y la gráfica de líneas pasa a mostrar solo marzo y abril.

El botón "Limpiar filtros" deja todo como al principio, sin búsqueda, sin filtros y sin fechas.

### Ordenar y cambiar de página

Al hacer clic en el encabezado de cualquier columna, la tabla se ordena por ella. Un segundo clic invierte el orden. La columna Total se ordena como número, por lo que $ 9.882.000 queda por encima de $ 980.000 aunque el texto se vea más corto. Para recorrer los registros, abajo a la derecha están los botones Anterior y Siguiente, y abajo a la izquierda un selector permite ver 10, 25, 50 o 100 filas por página. Ordenar o cambiar de página no altera las gráficas, porque ellas siempre resumen todas las filas que pasan el filtro y no solo las de la página visible.

### Exportar los datos

Arriba a la izquierda de la tabla están los botones CSV, Excel y PDF. Cada uno descarga un archivo con las ventas que se están viendo. Si hay un filtro aplicado, el archivo trae únicamente las filas filtradas, de todas las páginas. En los archivos de CSV y Excel el total sale como número sin símbolo de moneda, y el estado como texto, para que se pueda sumar y analizar. El PDF sale en horizontal para que quepan todas las columnas.

### Comparar barras y torta

Sobre la gráfica de categorías hay un botón que dice "Ver como torta". Al presionarlo, la misma información se dibuja en una torta con leyenda, y el botón cambia a "Ver como barras". Sirve para comparar los dos tipos con los mismos datos. Con seis categorías la torta ya se vuelve más difícil de leer que las barras, porque cuesta comparar el tamaño de las porciones parecidas, mientras que en las barras la comparación es directa por la altura.

### En el celular o en una ventana pequeña

Las tarjetas se apilan en una sola columna y las dos gráficas pasan una debajo de la otra. En la tabla se ocultan las columnas secundarias, y cada fila muestra un signo más que despliega los datos que no caben.

## Cómo se conectan la tabla y las gráficas

La tabla es la fuente de verdad. DataTables emite un evento llamado `draw` cada vez que cambia lo que muestra, ya sea por una búsqueda, un filtro, un orden o un cambio de página. En `js/main.js`, ese evento llama a la función `refrescarTodo()`, que hace tres cosas.

Primero lee las filas que cumplen el filtro actual con `tabla.rows({ search: 'applied' })`, sin importar en qué página esté la persona. Luego suma el total por categoría y por mes con la función `sumarPor()`. Por último reemplaza las etiquetas y los valores de cada gráfica y llama a `update()`. Las gráficas no se crean de nuevo cada vez, se reutiliza el mismo objeto y solo cambian sus datos, que es lo que evita el error de canvas en uso de Chart.js.

## Estructura del proyecto

```
index.html               página principal
css/estilos.css          estilos y etiquetas de estado
js/datos.js              80 ventas simuladas (archivo generado)
js/utilidades.js         formato de moneda y funciones compartidas
js/tabla.js              configuración de DataTables, formatos, rango de fechas y exportación
js/graficas.js           configuración de las dos gráficas de Chart.js
js/main.js               conexión entre tabla, filtros, gráficas y tarjetas
lib/                     copia local de las librerías
extras/generar_datos.py  script que genera js/datos.js
ejercicio/               ejercicio para el curso, con y sin solución
docs/capturas/           imágenes del proyecto
```

El orden de los scripts en `index.html` importa. Primero van las librerías, luego los datos, luego las utilidades y al final el código propio, porque cada archivo usa lo que definió el anterior.

## Datos

Los datos son simulados. Se generan con `python extras/generar_datos.py`, que usa una semilla fija y por eso produce siempre las mismas 80 ventas. Cada venta tiene `id`, `fecha`, `cliente`, `categoria`, `ciudad`, `cantidad`, `precio`, `total` y `estado`. Las fechas se guardan como texto en formato año-mes-día, y el formato de moneda y de fecha se aplica solo al mostrarlas, de modo que el orden y la búsqueda trabajan con el valor original.

## Tecnologías y versiones

| Librería | Versión | Uso |
| --- | --- | --- |
| DataTables | 2.1.8 | Grilla interactiva |
| DataTables Buttons | 3.2.0 | Exportación a CSV, Excel y PDF |
| DataTables Responsive | 3.0.3 | Adaptación a pantallas pequeñas |
| jQuery | 3.7.1 | Dependencia de DataTables |
| JSZip | 3.10.1 | Generar el archivo de Excel |
| pdfmake | 0.2.7 | Generar el archivo PDF |
| Chart.js | 4.4.7 | Gráficas |

### Usar CDN en lugar de la copia local

Las librerías también se pueden cargar desde internet. Para eso se reemplazan en `index.html` las rutas de `lib/` por las siguientes.

```html
<link rel="stylesheet" href="https://cdn.datatables.net/2.1.8/css/dataTables.dataTables.min.css">
<link rel="stylesheet" href="https://cdn.datatables.net/buttons/3.2.0/css/buttons.dataTables.min.css">
<link rel="stylesheet" href="https://cdn.datatables.net/responsive/3.0.3/css/responsive.dataTables.min.css">

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.datatables.net/2.1.8/js/dataTables.min.js"></script>
<script src="https://cdn.datatables.net/buttons/3.2.0/js/dataTables.buttons.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js"></script>
<script src="https://cdn.datatables.net/buttons/3.2.0/js/buttons.html5.min.js"></script>
<script src="https://cdn.datatables.net/responsive/3.0.3/js/dataTables.responsive.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7"></script>
```

## Ejercicio para el curso

La carpeta `ejercicio/` contiene dos archivos. `ejercicio.html` es el punto de partida y tiene tres tareas por completar. La primera es configurar la paginación a 5 filas y el orden inicial por total. La segunda es dar formato de pesos colombianos a la columna Total sin perder el orden numérico. La tercera es conectar una gráfica con la tabla mediante el evento `draw`, para que muestre el total por categoría de las filas filtradas. El archivo `solucion.html` trae las tres tareas resueltas y comentadas.

## Licencias

DataTables, jQuery, JSZip, pdfmake y Chart.js usan licencia MIT. Las copias de la carpeta `lib/` se incluyen sin modificar.
