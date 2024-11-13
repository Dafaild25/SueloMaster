from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .Views.Navegador_views import vistaNavegador,inicio
from .Views.Logeo_views import *
from .Views.Sensor_views import registrarSensor,vistaSensor

urlpatterns = [
    path('',inicio, name='inicio'),
    path('',vistaNavegador, name='vistaNavegador'),
    # REGISTRO USUARIO
    path('registro/',registro, name='registro'),
    # LOGIN
    path('iniciarSesion/',iniciarSesion,name='iniciarSesion'),
    # LOGOUT
    path('cerrarSesion/',cerrarSesion,name='cerrarSesion'),
    
    # PARA REGISTRAR SENSORES 
    path('vistaSensor/',vistaSensor,name='vistaSensor'),
    path('registrarSensor/',registrarSensor, name='registrarSensor'),
    
]
