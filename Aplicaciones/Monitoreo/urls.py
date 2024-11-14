from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .Views.Navegador_views import vistaNavegador
from .Views.Logeo_views import *
from .Views.Ubicacion_views import *
from .Views.Sensor_views import *

urlpatterns = [
    path('',vistaNavegador, name='vistaNavegador'),
    
    #UBICACION
    path('vistaUbicacion/',vistaUbicacion,name='vistaUbicacion'),
    path('registrar_ubicacion/', registrar_ubicacion, name='registrar_ubicacion'),
    path('obtenerUbicacion/<int:ubicacion_id>/',obtenerUbicacion,name='obtenerUbicacion'),
    path('editarUbicacion/<int:ubicacion_id>/',editarUbicacion,name='editarUbicacion'),
    path('eliminarUbicacion/<int:ubicacion_id>/',eliminarUbicacion,name='eliminarUbicacion'),

    #SENSOR
    path('vistaSensor/',vistaSensor,name='vistaSensor'),
    path('registrar_sensor/', registrar_sensor, name='registrar_sensor'),
    path('obtenerSensor/<int:sensor_id>/',obtenerSensor,name='obtenerSensor'),
    path('editarSensor/<int:sensor_id>/',editarSensor,name='editarSensor'),
    path('eliminarSensor/<int:sensor_id>/',eliminarSensor,name='eliminarSensor'),

]
