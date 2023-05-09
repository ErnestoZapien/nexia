from django.shortcuts import render,redirect
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect
from ia_app.models import Bot,Skill,Detalles
from django.utils import timezone
from django.http import JsonResponse
import logging

logging.basicConfig(filename='app.log', level=logging.DEBUG)