from django.shortcuts import render
from ia_app.models import Boton, Mensajes
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db.models.functions import TruncDate
from django.db.models import Count
from django.db import connection
from django.contrib.auth import get_user_model
User = get_user_model()
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

def login_form_view(request):
    return render(request, 'auth/login_page.html')


@login_required()
def return_base_view(request):

    btn = Boton.objects.all()

    mensajes_por_dia = Mensajes.objects.annotate(dia=TruncDate('fecha')).values('dia').annotate(total=Count('id')).order_by('dia')

    return render(request, 'base/base_page.html',{'boton':btn})

@login_required()
def devolverMensajes(request):

    mensajes_por_dia = Mensajes.objects.annotate(dia=TruncDate('fecha')).values('dia').annotate(total=Count('id')).order_by('dia')

    with connection.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) FROM ia_app_bot AS iaB INNER JOIN ia_app_tema AS iaT ON iaB.tema_id = iaT.id WHERE iaB.status = 1 and iaT.empresa_id = 1")
        rows = cursor.fetchall()

    return JsonResponse({'mensajes':list(mensajes_por_dia),'bots':rows})

@login_required()
def generarToken(request):

    id = request.POST['id']

    # Buscar al usuario
    usuario = User.objects.get(id=id)

    myAccess = MyTokenObtainPairSerializer.get_token(usuario)

    return JsonResponse({'token':str(myAccess)})

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['name'] = user.name
        token['email'] = user.email
        token['password'] = user.password

        return token

def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            current_path = request.path
            return redirect('/dashboard',{'current_path':current_path})
        else:
            messages.error(request, 'El correo y/o la contraseña son incorrectos',extra_tags="text-danger fw-bold")
            return redirect('/')
    else:
        return redirect('/')

@login_required()
def logout_view(request):
    logout(request)
    return redirect('/')

