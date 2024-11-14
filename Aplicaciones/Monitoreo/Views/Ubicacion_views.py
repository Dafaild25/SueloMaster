# views.py
from django.shortcuts import render
from django.shortcuts import render,get_object_or_404
from django.http import JsonResponse
from django.db import IntegrityError
from ..models import Ubicacion
from django.utils import timezone  # Importar timezone para usar la fecha actual si es necesario

def vistaUbicacion(request):
    ubicacion = Ubicacion.objects.all()  # Obtén todos los empleados
    # Combina ambos contextos en un solo diccionario
    context = {
        'ubicaciones': ubicacion
    }
    return render(request, '../templates/Ubicacion/ubicacion.html', context)


def registrar_ubicacion(request):
    if request.method == 'POST':
        try:
        
            ubicacion = Ubicacion(
                nombre=request.POST.get('nombre'),
                descripcion = request.POST.get('descripcion'),
                direccion = request.POST.get('direccion'),
                fecha_creacion = request.POST.get('fecha_creacion')                
            )
            ubicacion.save()
            return JsonResponse({'message': 'Ubicacion agregada exitosamente.'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Método no permitido.'}, status=405)

def obtenerUbicacion(request, ubicacion_id):
    try:
        ubicacion = Ubicacion.objects.get(id=ubicacion_id)
        data = {
            'id':ubicacion.id,
            'nombre': ubicacion.nombre,
            'direccion': ubicacion.direccion,
            'descripcion': ubicacion.descripcion,
            'fecha_creacion': ubicacion.fecha_creacion,
        }
        return JsonResponse(data, status=200)
    except Ubicacion.DoesNotExist:
        return JsonResponse({'error': 'Ubicacion no encontrada.'}, status=404)
    
def editarUbicacion(request, ubicacion_id):
    if request.method == 'POST':
        
        ubicacion = get_object_or_404(Ubicacion, id=ubicacion_id)

        try:
            # Actualiza los datos del empleado
            ubicacion.nombre = request.POST.get('nombre')
            ubicacion.descripcion = request.POST.get('descripcion')
            ubicacion.direccion = request.POST.get('direccion')
            ubicacion.fecha_creacion = request.POST.get('fecha_creacion')  
           
            ubicacion.save()

            return JsonResponse({'message': 'Ubicacion actualizada exitosamente.'}, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Método no permitido.'}, status=405)

def eliminarUbicacion(request, ubicacion_id):
    if request.method == 'DELETE': 
        try:
            ubicacion = get_object_or_404(Ubicacion, id=ubicacion_id)
            ubicacion.delete()
            return JsonResponse({'message': 'Ubicacion eliminada exitosamente.'}, status=204)  
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400) 

    return JsonResponse({'error': 'Método no permitido.'}, status=405)  