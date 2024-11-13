from django.shortcuts import render

def listarSensores(request):
    return render(request, 'Sensores/index.html')