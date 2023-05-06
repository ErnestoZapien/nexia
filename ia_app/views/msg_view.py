from django.shortcuts import render,redirect
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect
from ia_app.models import Bot
from django.utils import timezone
from django.http import JsonResponse
import logging

logging.basicConfig(filename='app.log', level=logging.DEBUG)
# Funcion para eliminar ChatBot
@login_required() # Solo usuarios autenticados pueden acceder a esta vista
@csrf_protect # Protección contra ataques CSRF
def msgBot(request):
    id = request.GET.get('botid')

    bot = Bot.objects.get(id=id)

    return JsonResponse({
        'id':bot.id,
        'nombre':bot.nombre,
    })