from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from ia_app.models import Bot, Skill, Mensajes, Detalles, User, Empresa, Tema
from rest_framework.exceptions import AuthenticationFailed
from django.utils import timezone
from django.http import JsonResponse
import logging
import json
from django.http import HttpResponse
import openai
import requests
import json
import requests
import jwt
import datetime
import traceback
from requests.auth import HTTPBasicAuth
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
logging.basicConfig(filename='app.log', level=logging.DEBUG)


class ApiBotView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def post(self, request):
        try:
            data = json.loads(request.body)
            if not data:
                return Response({"error": "no se enviaron los datos"}, status=status.HTTP_400_BAD_REQUEST)
            if "question" in data and "bot_id" in data:
                # obtenemos el id del usuario
                user = request.user
                user_id = user.id
                # obtenemos los datos del bot
                bot = Bot.objects.get(id=data['bot_id'])
                # obtenemos el Tema, Empresa, Skill, Detalles y Mensajes
                tema = Tema.objects.get(id=bot.tema.id)
                # empresa = Empresa.objects.get(id=user_id)
                skill = Skill.objects.get(bot_id=bot.id)
                detalles = Detalles.objects.filter(bot_id=bot.id)
                # mensajes = Mensajes.objects.filter(bot_id=bot.id)
                text = ""
                content = "Eres un bot de "+tema.nombre+" que quiere decir "+tema.descripcion+" , tu nombre es "+bot.nombre+" , tienes las siguienes habilidades "+skill.skill+" , lo que no puedes realizar es  :"+skill.bans + \
                    " ,cuando se te realice una pregunta a lo que no puedes responder  deberas responder lo siguiente  '"+skill.answer_unkwn+"'.Eres habil de poder hablar los siguientes idiomas " + \
                    skill.language+"."
                messages = [
                    {"role": "system", "content": content},
                    {"role": "user", "content": "Hola"},
                    {"role": "assistant", "content": "Hola, ¿en qué te puedo ayudarte"},
                ]

                for d in detalles:
                    messages.append({"role": "user", "content": d.question})
                    messages.append({"role": "assistant", "content": d.answer})
                # Aqui se compone todo contenido del sistema para el json
                messages.append({"role": "user", "content": data["question"]})
                response = openai.ChatCompletion.create(
                    model='gpt-3.5-turbo',
                    messages=messages,
                    temperature=0.8,
                    max_tokens=1024,
                )
                logging.info(response)
                if 'message' in response['choices'][0]:
                    answer={
                        "bot_name":bot.nombre,
                        "answer":response['choices'][0]['message']['content']
                    }
                    pregunta=Mensajes.objects.create(mensaje=data["question"],bot_id=bot.id)
                    respuesta=Mensajes.objects.create(mensaje=answer,bot_id=bot.id)
                    return Response(answer, status=status.HTTP_200_OK)
                else:
                    return Response("¡Nada de pánico! Nuestro servidor está tomando una siesta. Volverá pronto y todo estará de nuevo en orden", status=status.HTTP_200_OK)
            else:
                message = {
                    'error': 'El envio de datos no es correcto, verifica que todos los datos se esten enviando'}
                return Response(message, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as ex:
            return HttpResponse(str(ex))

class ApiViewBot(APIView):
    def post(self, request):
        try:
            data = json.loads(request.body)
            if not data:
                return Response("no se enviaron los datos",status=status.HTTP_400_BAD_REQUEST)

            #data = json.loads(data)
            if data and "bot_id" in data:
                # obtenemos el id del usuario
                user = request.user
                user_id = user.id
                # obtenemos los datos del bot
                bot = Bot.objects.get(id=data['bot_id'])
                # obtenemos el Tema, Empresa, Skill, Detalles y Mensajes
                tema = Tema.objects.get(id=bot.tema.id)
                # empresa = Empresa.objects.get(id=user_id)
                skill = Skill.objects.get(bot_id=bot.id)
                detalles = Detalles.objects.filter(bot_id=bot.id)
                # mensajes = Mensajes.objects.filter(bot_id=bot.id)

                text = ""
                content = "Eres un bot de "+tema.nombre+" que quiere decir "+tema.descripcion+" , tu nombre es "+bot.nombre+" , tienes las siguienes habilidades "+skill.skill+" , lo que no puedes realizar es  :"+skill.bans + \
                    " ,cuando se te realice una pregunta a lo que no puedes responder  deberas responder lo siguiente  '"+skill.answer_unkwn+"'.Eres habil de poder hablar los siguientes idiomas " + \
                    skill.language+"."
                messages = [
                    {"role": "system", "content": content},
                ]

                for d in detalles:
                    messages.append({"role": "user", "content": d.question})
                    messages.append({"role": "assistant", "content": d.answer})
                # Aqui se compone todo contenido del sistema para el json
                # messages.append({"role": "user", "content": data["question"]})
                messages.append({"role": "assistant", "content": "Hola, Dime que haces y quien eres de manera muy breve"})
                response = openai.ChatCompletion.create(
                    model='gpt-3.5-turbo',
                    messages=messages,
                    temperature=0.8,
                    max_tokens=1024,
                )
                logging.info(response)
                if 'choices' in response and 'message' in response['choices'][0]:
                    answer={
                        "bot_name":bot.nombre,
                        "answer":response['choices'][0]['message']['content']
                    }
                    logging.info(answer)
                    return Response(answer, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "Nuestro servidor está tomando una siesta. Volverá pronto y todo estará de nuevo en orden"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "El envio de datos no es correcto, verifica que todos los datos se esten enviando"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
                #return Response(message, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as ex:
            traceback_str = traceback.format_exc()
            response_data = {'error': str(ex), 'traceback': traceback_str}
            return HttpResponse(json.dumps(response_data), content_type='application/json', status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Funcion para generar el token
# @csrf_exempt
# def question_bot(request):
#     try:
#         # Creacion de token manualmente
#         data = json.loads(request.body)
#         user = User.objects.get(email=data.get('email'))
#         refresh = RefreshToken.for_user(user)
#         # return HttpResponse(response.json()['refresh'])
#         return HttpResponse(refresh)
#         # return HttpResponse(data)
#     except Exception as ex:
#         logging.error(ex)
#         return HttpResponse(ex)


@csrf_exempt
def generate_token(request):
    try:
        data = json.loads(request.body)
        url = ('http://localhost:8000/api/token/')
        headers = {'Content-Type': 'application/json'}
        response = requests.post(url, headers=headers, data=json.dumps(data))
        return HttpResponse(response.json()['refresh'])
        # return HttpResponse(data)
    except Exception as ex:
        logging.error(ex)
        return HttpResponse(ex)


@csrf_exempt
def test(request):
    try:
        data = json.loads(request.body)
        return HttpResponse(data)
    except Exception as ex:
        logging.error(ex)
        return HttpResponse(ex)
