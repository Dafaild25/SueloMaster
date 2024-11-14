from django.db import models

# Modelo para Ubicaciones
class Ubicacion(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=100)
    direccion = models.CharField(max_length=100)
    fecha_creacion = models.DateField()

    def __str__(self):
        return self.nombre

# Modelo para Sensores
class Sensor(models.Model):
    TIPOS_SENSORES = [
        ('TEMPERATURA', 'Temperatura'),
        ('HUMEDAD', 'Humedad'),
        ('ACIDEZ', 'Acidez')
    ]

    tipo = models.CharField(max_length=12, choices=TIPOS_SENSORES)
    descripcion = models.CharField(max_length=200, null=True, blank=True)
    ubicacion = models.ForeignKey(Ubicacion, on_delete=models.CASCADE, related_name='sensores')
    fecha_instalacion = models.DateField()

    def __str__(self):
        return f"{self.get_tipo_display()} - {self.ubicacion.nombre}"

# Modelo para Mediciones
class Medicion(models.Model):
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE, related_name='mediciones')
    valor = models.FloatField()
    fecha_medicion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Medición de {self.sensor.get_tipo_display()} en {self.sensor.ubicacion.nombre} - Valor: {self.valor}"

# Modelo para Reportes
class Reporte(models.Model):
    ubicacion = models.ForeignKey(Ubicacion, on_delete=models.CASCADE, related_name='reportes')
    fecha_reporte = models.DateTimeField(auto_now_add=True)
    temperatura_promedio = models.FloatField()
    humedad_promedio = models.FloatField()
    acidez_promedio = models.FloatField()
    observaciones = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Reporte - {self.ubicacion.nombre} - {self.fecha_reporte.strftime('%Y-%m-%d')}"

    # Método para calcular promedios
    def calcular_promedios(self):
        mediciones = self.ubicacion.sensores.prefetch_related('mediciones')
        temperatura = [m.valor for s in mediciones.filter(tipo='TEMPERATURA') for m in s.mediciones.all()]
        humedad = [m.valor for s in mediciones.filter(tipo='HUMEDAD') for m in s.mediciones.all()]
        acidez = [m.valor for s in mediciones.filter(tipo='ACIDEZ') for m in s.mediciones.all()]

        self.temperatura_promedio = sum(temperatura) / len(temperatura) if temperatura else 0
        self.humedad_promedio = sum(humedad) / len(humedad) if humedad else 0
        self.acidez_promedio = sum(acidez) / len(acidez) if acidez else 0
        self.save()
