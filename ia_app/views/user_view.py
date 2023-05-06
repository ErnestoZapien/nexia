from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from ia_app.models import User

def register_user(request):
    try:
        if request.method == 'GET':
            email = 'lab@satech.mx'
            password = '1234'
            name = 'Laboratorio'
            User.objects.create_superuser(email=email, password=password, name=name)
            return JsonResponse({'result': 'Se ha registrado el usuario correctamente'}, status=200)
    except Exception as ex:
        return JsonResponse({'error': str(ex)}, status=500)
