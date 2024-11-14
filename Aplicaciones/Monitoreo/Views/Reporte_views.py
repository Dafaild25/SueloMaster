from django.shortcuts import render
from django.http import JsonResponse
import random

def vista_estadistica(request):
    # Ejemplo de datos para la gráfica (puedes obtener estos datos desde tu base de datos)
    labels = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"]
    data = [random.randint(0, 100) for _ in labels]  # Generar datos aleatorios

    # Pasamos los datos al template
    context = {
        "labels": labels,
        "data": data,
    }
    return render(request, 'Reportes/VistaReporte.html', context)