from django.shortcuts import render
from rest_framework import generics
from django.http import JsonResponse, HttpResponse
import ia_app.utils.openai_utils as openai_api
import ia_app.utils.chatbot as chatbot
from django.views.decorators.csrf import csrf_exempt
import json
import logging
logging.basicConfig(filename='app.log', level=logging.DEBUG)


@csrf_exempt
def test_openai(request):
    try:
        data = json.loads(request.body)
        input_text = data.get('input_text')
        result_openai = openai_api.test_openai_api(input_text)
        return HttpResponse(result_openai)
    except Exception as ex:
        return {'error': str(ex)}


@csrf_exempt
def answer_openai(request):
    try:
        input_request = request.GET.get('input_request', None)
        result_openai = openai_api.generate_answer(input_request)
        return HttpResponse(result_openai)
    except Exception as ex:
        return {'error': str(ex)}


@csrf_exempt
def support(request):
    try:
        data = json.loads(request.body)
        # input_text = data.get('input_text')
        texto_pregunta = data.get('texto_pregunta')
        result_openai = openai_api.pruebas_bot(texto_pregunta)
        return HttpResponse(result_openai)
        # return HttpResponse(nombre_bot)
    except Exception as ex:
        return {'error': str(ex)}


@csrf_exempt
def test_samuel(request):
    try:
        data = json.loads(request.body)
        texto_entrenamiento = data.get('texto_entrenamiento')
        result_openai = openai_api.pruebas_samuel(texto_entrenamiento)
        return HttpResponse(result_openai)
        # return HttpResponse(nombre_bot)
    except Exception as ex:
        return {'error': str(ex)}


@csrf_exempt
def test_zapien(request):
    try:
        data = json.loads(request.body)
        result_openai = openai_api.prueba_zapien(texto_entrenamiento)
        return HttpResponse(result_openai)
        # return HttpResponse(nombre_bot)
    except Exception as ex:
        return {'error': str(ex)}
