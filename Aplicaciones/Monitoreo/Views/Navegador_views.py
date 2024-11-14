from django.shortcuts import render,get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required # Decorador para solicitar logue

def vistaNavegador(request):
    return render(request, '../templates/Navegador/vistaNavegador.html')