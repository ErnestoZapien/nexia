from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from ia_app.models import Empresa
from ia_app.models import User
from django.utils import timezone
from django.views.decorators.csrf import csrf_protect
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.http import HttpResponseRedirect
import logging
from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth.hashers import check_password

# Mostrar todos los registros


@login_required() # Solo usuarios autenticados pueden acceder a esta vista
@user_passes_test(lambda u: u.is_superuser)
@csrf_protect  # Protección contra ataques CSRF
def obtenerClientes(request):

    clientes = Empresa.objects.all()

    return render(request, 'clientes.html', {'clientes': clientes})

# Agregar un nuevo registro
@login_required()
@user_passes_test(lambda u: u.is_superuser)
@csrf_protect  # Protección contra ataques CSRF
def agregarCliente(request):

    # Si es POST, obtener los datos del formulario
    # Verificar que tengas la etiqueta name="nombre" en el input y asi con los demas
    nombre = request.POST['nombre']
    direccion = request.POST['direccion']
    telefono = request.POST['telefono']
    correo = request.POST['email']

    password = request.POST['password']

    # Verificar que el correo no exista
    if User.objects.filter(email=correo).exists() or Empresa.objects.filter(email=correo).exists():
        
        return JsonResponse({
            'error': 1
        })
    
    else:
        cliente = Empresa(nombre=nombre,
                      direccion=direccion,
                      telefono=telefono,
                      email=correo,
                      estatus=True,
                      created_at=timezone.now(),
                      updated_at=timezone.now())

        # Guardar el registro
        cliente.save()

        User.objects.create_user(email=correo, password=password, name=nombre)

        # Redireccionar a la vista de clientes
        return redirect('/clientes')


@login_required()
@user_passes_test(lambda u: u.is_superuser)
@csrf_protect
def obtenerCliente(request):

    # Si es GET, obtener el id del registro a editar por medio de la URL
    id_cliente = request.GET.get('numR')

    # Obtener el registro
    cliente = Empresa.objects.get(id=id_cliente)

    # Buscar el usuario
    usuario = User.objects.get(email=cliente.email)

    # Redireccionar a la vista de clientes
    return JsonResponse({
        'id': cliente.id,
        'nombre': cliente.nombre,
        'direccion': cliente.direccion,
        'telefono': cliente.telefono,
        'email': cliente.email,
        'password': usuario.password,
        'estatus': cliente.estatus
    })


@login_required()
@user_passes_test(lambda u: u.is_superuser)
@csrf_protect
def editarCliente(request):

    try:

        # Si es POST, obtener los datos del formulario
        id_cliente = int(request.POST['id'])
        nombre = request.POST['nombre']
        direccion = request.POST['direccion']
        telefono = int(request.POST['telefono'])
        correo = request.POST['email']
        password = request.POST['password']
        estatus = int(request.POST['estatus'])

        # Obtener el registro
        cliente = Empresa.objects.get(id=id_cliente)

        # Buscar el usuario
        usuario = User.objects.get(email=cliente.email)

        usuario.email = correo
        usuario.name = nombre
        usuario.updated_at = timezone.now()

        print(usuario.password)
        print(password)

        if password == '':
            pass
        else:
            print('La contraseña es incorrecta')
            usuario.set_password(password)

        if estatus == 1:
            usuario.is_active = True
        else:
            usuario.is_active = False

        usuario.save()

        # Editar el registro
        cliente.nombre = nombre
        cliente.direccion = direccion
        cliente.telefono = telefono
        cliente.email = correo
        cliente.estatus = estatus
        cliente.updated_at = timezone.now()

        # Guardar el registro
        cliente.save()

        return redirect('/clientes')

    except Exception as e:

        logging.info(e)


@login_required()
@user_passes_test(lambda u: u.is_superuser)
@csrf_protect
def eliminarCliente(request):

    # Obtener el id del registro a eliminar por medio de la URL
    id_cliente = request.GET.get('numR')

    # Obtener el registro
    empresa = Empresa.objects.get(id=id_cliente)

    usuario = User.objects.get(email=empresa.email)

    usuario.delete()

    # Eliminar el registro
    empresa.delete()

    # Redireccionar a la vista de clientes
    return redirect('/clientes')


@login_required()
@user_passes_test(lambda u: u.is_superuser)
@csrf_protect
def activarCliente(request):
    
        # Obtener el id del registro a eliminar por medio de la URL
        id_cliente = request.GET.get('numR')
    
        # Obtener el registro
        empresa = Empresa.objects.get(id=id_cliente)
    
        usuario = User.objects.get(email=empresa.email)

        usuario.is_active = True

        usuario.save()

        # Eliminar el registro
        empresa.estatus = True
    
        empresa.save()
    
        # Redireccionar a la vista de clientes
        return redirect('/clientes')

@login_required()
@user_passes_test(lambda u: u.is_superuser)
@csrf_protect
def desactivarCliente(request):
    
        # Obtener el id del registro a eliminar por medio de la URL
        id_cliente = request.GET.get('numR')
    
        # Obtener el registro
        empresa = Empresa.objects.get(id=id_cliente)
    
        usuario = User.objects.get(email=empresa.email)

        usuario.is_active = False

        usuario.save()

        # Eliminar el registro
        empresa.estatus = False
    
        empresa.save()
    
        # Redireccionar a la vista de clientes
        return redirect('/clientes')