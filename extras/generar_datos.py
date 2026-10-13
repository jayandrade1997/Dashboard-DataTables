"""Genera js/datos.js con 80 ventas simuladas.

Uso (desde la raiz del proyecto):  python extras/generar_datos.py
La semilla fija hace que siempre se obtengan los mismos datos.
"""
import json
import random

random.seed(7)

# categoria -> (precio minimo, precio maximo) en pesos colombianos
categorias = {
    "Tecnología": (150000, 3500000),
    "Hogar": (30000, 600000),
    "Ropa": (25000, 300000),
    "Deportes": (40000, 700000),
    "Alimentos": (8000, 120000),
    "Juguetes": (20000, 250000),
}
ciudades = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Bucaramanga"]
nombres = [
    "Laura Gómez", "Andrés Ruiz", "Camila Pardo", "Juan Torres", "Sofía Díaz", "Mateo Rojas",
    "Valentina Castro", "Daniel Mejía", "Isabela Ortiz", "Santiago Vargas", "Mariana Silva",
    "Felipe Herrera",
]

ventas = []
for i in range(1, 81):
    cat = random.choice(list(categorias))
    precio = round(random.randint(*categorias[cat]), -3)
    cantidad = random.randint(1, 4)
    ventas.append({
        "id": i,
        "fecha": f"2026-{random.randint(1, 6):02d}-{random.randint(1, 28):02d}",
        "cliente": random.choice(nombres),
        "categoria": cat,
        "ciudad": random.choice(ciudades),
        "cantidad": cantidad,
        "precio": precio,
        "total": precio * cantidad,
        "estado": random.choices(["Pagado", "Pendiente", "Cancelado"], [70, 20, 10])[0],
    })

# Orden cronologico y se reasignan los id para que sigan ese orden
ventas.sort(key=lambda v: v["fecha"])
for n, v in enumerate(ventas, start=1):
    v["id"] = n

with open("js/datos.js", "w", encoding="utf-8") as f:
    f.write("// Archivo generado por extras/generar_datos.py. Datos simulados.\n")
    f.write("const VENTAS = " + json.dumps(ventas, ensure_ascii=False, indent=2) + ";\n")

print(f"Listo, {len(ventas)} ventas escritas en js/datos.js")
