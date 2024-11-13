from django import forms # Importar formulario
from django.core import validators # Importar validaciones

from django.contrib.auth.forms import UserCreationForm # Importar para crear formulario
from django.contrib.auth.models import User # Importar clase User

class RegistroForm(UserCreationForm):    
    username = forms.CharField(
        label='Nombre de usuario',
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ingrese un nombre de usuario'})
    )
    email = forms.EmailField(
        label='Correo Electrónico',
        widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'ejemplo@ejemplo.com'})
    )
    first_name = forms.CharField(
        label='Nombre personal',
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ingrese su nombre'})
    )
    last_name = forms.CharField(
        label='Apellido',
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ingrese su apellido'}),
        validators=[
            validators.MinLengthValidator(2, 'Su apellido es muy corto'), # Numero minimo de caracteres
            validators.RegexValidator('^[A-Za-ñ ]+$', 'No incluir datos especiales'), # Aceptar un cierto tipo de caracteres
        ]
    )
    password1 = forms.CharField(
        label='Contraseña',
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Ingrese su contraseña'})
    )
    password2 = forms.CharField(
        label='Confirmar Contraseña',
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Confirme su contraseña'})
    )

    class Meta:
        model = User # Modelo basado en modelo de User
        fields = ['username','email','first_name','last_name','password1','password2'] # Campos del formulario
        