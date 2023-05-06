from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from ia_app.models import Empresa
from django.utils import timezone
from django.views.decorators.csrf import csrf_protect
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.http import HttpResponseRedirect
import logging

# Mostrar todos los registros


@login_required()  # Solo usuarios autenticados pueden acceder a esta vista
@csrf_protect  # Protección contra ataques CSRF
def obtenerClientes(request):

    clientes = Empresa.objects.all()

    return render(request, 'clientes.html', {'clientes': clientes})

# Agregar un nuevo registro


@login_required()
@csrf_protect  # Protección contra ataques CSRF
def agregarCliente(request):

    # Si es POST, obtener los datos del formulario
    # Verificar que tengas la etiqueta name="nombre" en el input y asi con los demas
    nombre = request.POST['nombre']
    direccion = request.POST['direccion']
    telefono = request.POST['telefono']
    correo = request.POST['email']

    # Crear el registro
    cliente = Empresa(nombre=nombre,
                      direccion=direccion,
                      telefono=telefono,
                      email=correo,
                      estatus=True,
                      created_at=timezone.now(),
                      updated_at=timezone.now())

    # Guardar el registro
    cliente.save()

    # Redireccionar a la vista de clientes
    return redirect('/clientes')


@login_required()
@csrf_protect
def obtenerCliente(request):

    # Si es GET, obtener el id del registro a editar por medio de la URL
    id_cliente = request.GET.get('numR')

    # Obtener el registro
    cliente = Empresa.objects.get(id=id_cliente)

    # Redireccionar a la vista de clientes
    return JsonResponse({
        'id': cliente.id,
        'nombre': cliente.nombre,
        'direccion': cliente.direccion,
        'telefono': cliente.telefono,
        'email': cliente.email,
        'estatus': cliente.estatus
    })


@login_required()
@csrf_protect
def editarCliente(request):

    try:

        # Si es POST, obtener los datos del formulario
        id_cliente = int(request.POST['id'])
        nombre = request.POST['nombre']
        direccion = request.POST['direccion']
        telefono = int(request.POST['telefono'])
        correo = request.POST['email']
        estatus = int(request.POST['estatus'])

        # Obtener el registro
        cliente = Empresa.objects.get(id=id_cliente)

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
@csrf_protect
def eliminarCliente(request):

    # Obtener el id del registro a eliminar por medio de la URL
    id_cliente = request.GET.get('numR')

    # Obtener el registro
    empresa = Empresa.objects.get(id=id_cliente)

    # Eliminar el registro
    empresa.delete()

    # Redireccionar a la vista de clientes
    return redirect('/clientes')
