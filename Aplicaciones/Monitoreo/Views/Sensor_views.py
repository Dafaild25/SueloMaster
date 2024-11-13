from django.shortcuts import render,get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateparse import parse_datetime
from django.contrib.auth.decorators import login_required 
from ..models import Sensor,Ubicacion


def vistaSensor(request):
    sensor = Sensor.objects.all()  
    context = {
        'sensor':sensor,    
    }
    return render(request, '../templates/Sensor/vistaSensor.html', context)


def registrarSensor(request):
    if request.method == "POST":
        try:
            # Obtener los datos del formulario enviados desde JavaScript
            tipo = request.POST.get('tipo')
            descripcion = request.POST.get('descripcion')
            ubicacion_id = request.POST.get('ubicacion')
            fecha_instalacion_str = request.POST.get('fecha_instalacion')

            # Verificar que todos los campos requeridos estén presentes
            if not tipo or not ubicacion_id or not fecha_instalacion_str:
                return JsonResponse({"success": False, "message": "Faltan campos requeridos."}, status=400)

            # Convertir la fecha de instalación desde el formato string a un objeto datetime
            fecha_instalacion = parse_datetime(fecha_instalacion_str)
            if not fecha_instalacion:
                return JsonResponse({"success": False, "message": "Formato de fecha inválido."}, status=400)

            # Obtener la ubicación asociada al sensor
            try:
                ubicacion = Ubicacion.objects.get(id=ubicacion_id)
            except Ubicacion.DoesNotExist:
                return JsonResponse({"success": False, "message": "Ubicación no encontrada."}, status=400)

            # Crear una nueva instancia de Sensor
            sensor = Sensor.objects.create(
                tipo=tipo,
                descripcion=descripcion,
                ubicacion=ubicacion,
                fecha_instalacion=fecha_instalacion,
            )

            # Retornar una respuesta de éxito
            return JsonResponse({"success": True, "message": "Sensor registrado con éxito!"}, status=200)

        except Exception as e:
            # Retornar un error en caso de que algo falle
            return JsonResponse({"success": False, "message": str(e)}, status=400)

    return JsonResponse({"success": False, "message": "Método no permitido"}, status=405)
