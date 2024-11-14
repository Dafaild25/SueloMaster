# views.py
from django.shortcuts import render
from django.shortcuts import render,get_object_or_404
from django.http import JsonResponse
from django.db import IntegrityError
from ..models import Sensor,Ubicacion
from django.utils import timezone  # Importar timezone para usar la fecha actual si es necesario

def vistaSensor(request):
    sensor = Sensor.objects.all()  # Obtén todos los empleados
    ubicaciones = Ubicacion.objects.all()
    # Combina ambos contextos en un solo diccionario
    context = {
        'sensores': sensor,
        'ubicaciones': ubicaciones
    }
    return render(request, '../templates/Sensor/vistaSensor.html', context)

def obtener_ubicaciones(request):
    # Obtiene todos los propietarios
    ubicaciones = Ubicacion.objects.all().values('id', 'nombre')
    return JsonResponse(list(ubicaciones), safe=False)

def registrar_sensor(request):
    if request.method == 'POST':
        try:
            # Obtener el ID de la ubicación desde el POST
            ubicacion_id = request.POST.get('ubicacion')
            
            # Asegúrate de que el ID de la ubicación se ha proporcionado
            if not ubicacion_id:
                return JsonResponse({'error': 'Ubicación no proporcionada.'}, status=400)
            
            # Obtener la instancia de Ubicacion correspondiente al ID
            ubicacion = Ubicacion.objects.get(id=ubicacion_id)
            
            # Crear el sensor y asignar la instancia de Ubicacion
            sensor = Sensor(
                tipo=request.POST.get('tipo'),
                descripcion=request.POST.get('descripcion'),
                ubicacion=ubicacion,  # Asignar la instancia de Ubicacion
                fecha_instalacion=request.POST.get('fecha_instalacion')                
            )
            
            sensor.save()
            return JsonResponse({'message': 'Sensor agregado exitosamente.'}, status=201)
        
        except Ubicacion.DoesNotExist:
            return JsonResponse({'error': 'Ubicación no encontrada.'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Método no permitido.'}, status=405)

def obtenerSensor(request, sensor_id):
    try:
        sensor = Sensor.objects.get(id=sensor_id)
        data = {
            'id':sensor.id,
            'tipo': sensor.tipo,
            'descripcion': sensor.descripcion,
            'ubicacion': sensor.ubicacion.id,
            'fecha_instalacion': sensor.fecha_instalacion,
        }
        return JsonResponse(data, status=200)
    except Sensor.DoesNotExist:
        return JsonResponse({'error': 'Sensor no encontrada.'}, status=404)
    
def editarSensor(request, sensor_id):
    if request.method == 'POST':
        
        sensor = get_object_or_404(Sensor, id=sensor_id)

        try:
            # Actualiza los datos del empleado
            sensor.tipo = request.POST.get('tipo')
            sensor.descripcion = request.POST.get('descripcion')
            ubicacion_id = request.POST.get('ubicacion')
            ubicacion = get_object_or_404(Ubicacion, id=ubicacion_id)
            sensor.ubicacion = ubicacion
            sensor.fecha_instalacion = request.POST.get('fecha_instalacion')  
           
            sensor.save()

            return JsonResponse({'message': 'Sensor actualizado exitosamente.'}, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Método no permitido.'}, status=405)

def eliminarSensor(request, sensor_id):
    if request.method == 'DELETE': 
        try:
            sensor = get_object_or_404(Sensor, id=sensor_id)
            sensor.delete()
            return JsonResponse({'message': 'Sensor eliminado exitosamente.'}, status=204)  
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400) 

    return JsonResponse({'error': 'Método no permitido.'}, status=405)  