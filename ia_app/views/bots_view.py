from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from ia_app.models import Bot
from ia_app.models import Empresa
from ia_app.models import Tema
from ia_app.models import Skill
from ia_app.models import Detalles
from ia_app.models import Mensajes
from django.utils import timezone
from django.http import JsonResponse
from ia_app.utils import openai_utils
import logging
from django.http import HttpResponse
import openai


logging.basicConfig(filename='app.log', level=logging.DEBUG)

# Mostrar todos los registros


@login_required()  # Solo usuarios autenticados pueden acceder a esta vista
def bots(request):  # funcion index con todos los registros necesarios
    empresa = Empresa.objects.all()
    bots = Bot.objects.all()
    botsact = []
    for item in bots:
        if item.status == True:
            botsact.append(item)

    logging.info(type(botsact))
    return render(request, 'bots.html', {'empresa': empresa, 'bots': botsact})

# Funcion para registrar ChatBot


@login_required()  # Solo usuarios autenticados pueden acceder a esta vista
@csrf_protect  # Protección contra ataques CSRF
def create(request):
    try:
        # valores a registrar
        imagen = request.POST['imagen']
        nombre = request.POST['nombre']
        tema = request.POST['tema']
        descripcion = request.POST['descripcion']
        cliente = request.POST['cliente']

        # Insertar Tema
        tema = Tema(nombre=tema,
                    descripcion=descripcion,
                    empresa_id=cliente)
        tema.save()

        # Insertar Bot
        bot = Bot(imagen=imagen,
                  nombre=nombre,
                  tema_id=tema.id,
                  status=True,
                  created_at=timezone.now(),
                  updated_at=timezone.now())
        bot.save()

        # Redigir
        return redirect('/bots')
    except Exception as e:
        logging.info(e)

# Funcion para editar ChatBot


@login_required()  # Solo usuarios autenticados pueden acceder a esta vista
@csrf_protect  # Protección contra ataques CSRF
def edit(request):
    try:
        # Actualizar Tema
        t = Tema.objects.get(id=int(request.POST['tema_id']))
        t.nombre = request.POST['tema']
        t.descripcion = request.POST['descripcion']
        t.empresa_id = int(request.POST['cliente'])

        t.save()

        # Actualizar ChatBot
        b = Bot.objects.get(id=int(request.POST['id']))
        if request.POST.get('imagen') is not None:
            b.imagen = request.POST['imagen']
            b.nombre = request.POST['nombre']
            b.status = True
            b.tema_id = int(request.POST['tema_id'])
        else:
            b.nombre = request.POST['nombre']
            b.status = True
            b.tema_id = int(request.POST['tema_id'])

        b.save()

        # Redirigir
        return redirect('/bots')
    except Exception as e:
        logging.info(e)

# Funcion para enviar informacion a actualizar


@login_required()  # Solo usuarios autenticados pueden acceder a esta vista
@csrf_protect  # Protección contra ataques CSRF
def editInfo(request):
    # valores necesarios
    id = request.GET.get('numB')

    bot = Bot.objects.get(id=id)
    tema = Tema.objects.get(id=bot.tema_id)
    empresa = Empresa.objects.get(id=tema.empresa_id)

    # Respuesta en JSON para actualizacion
    return JsonResponse({
        'id': bot.id,
        'imagen': bot.imagen,
        'tema_id': bot.tema_id,
        'tema_nombre': tema.nombre,
        'status': bot.status,
        'nombre': tema.nombre,
        'descripcion': tema.descripcion,
        'empresa_id': tema.empresa_id,
        'empresa_nombre': empresa.nombre
    })

# Funcion para eliminar ChatBot


@login_required()  # Solo usuarios autenticados pueden acceder a esta vista
@csrf_protect  # Protección contra ataques CSRF
def delete(request):
    try:
        # Obtener el objeto a eliminar por ID
        id_bot = request.GET.get('numE')

        bot = Bot.objects.get(id=id_bot)
        bot.status = False

        bot.save()

        # Redirigir
        return redirect('/bots')
    except Exception as e:
        logging.info(e)

# Funcion para la configuración del bot


@login_required()  # Solo usuarios autenticados pueden acceder a esta vista
@csrf_protect  # Protección contra ataques CSRF
def config(request):
    try:
        # Obtener el objeto a eliminar por ID
        bot_id = request.POST.get('bot_id')
        skill = request.POST.get('skill')
        bans = request.POST.get('bans')
        answer_ukwn = request.POST.get('answer_ukwn')
        lenguage = request.POST.get('lenguage')
        conversation = request.POST.get('conversation')
        # question_test = request.POST.get('question_test')
        skillDB = Skill(bans=bans,
                        answer_unkwn=answer_ukwn,
                        skill=skill,
                        language=lenguage,
                        bot_id=bot_id
                        )
        skillDB.save()
        text = ""
        conversation = eval(conversation)
        # Aqui se compone todo el json de messages de acuerdo a cada bot
        for i in range(len(conversation)):
            question = conversation[i]["question"]
            answer = conversation[i]["answer"]
            details = Detalles(question=question, answer=answer, bot_id=bot_id)
            details.save()
            text = text+"{"+'"role": "user", "content":"'+question + \
                '"},'+"{"+'"role": "assistant", "content": "'+answer+'"},'

        # Aqui se compone todo contenido del sistema para el json
        content = "Eres un bot de "+tema.nombre+" que quiere decir "+tema.descripcion+" , tu nombre es "+botDB.nombre+" , tienes las siguienes habilidades "+skill+" , a continuación se describre lo que no puedes realizar "+bans + \
            " , si preguntan otro tema que no estes programado deebes responder : "+answer_ukwn+".Eres habil de poder hablar los siguientes idiomas " + \
            lenguage+" , a continuación se muestra una conversación con un usuario "+text
        messages = [
            {"role": "system", "content": content},
            {"role": "user", "content": "Hola"},
            {"role": "assistant", "content": "Hola, ¿en qué te puedo ayudarte"},
            {"role": "user", "content": "¿Eres mi papa?"},
        ]
        response = openai.ChatCompletion.create(
            model='gpt-3.5-turbo',
            messages=messages,
            temperature=0.8,
            max_tokens=1024,
        )
        # return HttpResponse(messages)
        if response['choices'][0]['message']['content'] != "":
            # logging.info(result)
            return redirect('/bots')
        else:
            return HttpResponse("Error")
    except Exception as e:
        logging.info(e)
        return e


# @login_required()  # Solo usuarios autenticados pueden acceder a esta vista
@csrf_exempt
def test_config(request):
    try:
        # Obtener el objeto a eliminar por ID
        bot_id = request.POST.get('bot_id')
        skill = request.POST.get('skill')
        bans = request.POST.get('bans')
        answer_ukwn = request.POST.get('answer_ukwn')
        lenguage = request.POST.get('lenguage')
        conversation = request.POST.get('conversation')
        question_test = request.POST.get('question_test')
        # if request.GET.get('question_test') == 'true':
        #     question_test = request.GET.get('question_test')
        # else:
        # Aqui se compone todo el json de messages de acuerdo a cada bot
        # buscamos los datos del bot y su tema
        botDB = Bot.objects.get(id=bot_id)
        tema = Tema.objects.get(id=botDB.id)
        skillDB = Skill(bans=bans,
                        answer_unkwn=answer_ukwn,
                        skill=skill,
                        language=lenguage,
                        bot_id=bot_id
                        )
        skillDB.save()
        logging.info(skillDB)
        # conversation=JsonResponse({"question":"hola","answer":"hola"},{"question":"hola","answer":"hola"})
        text = ""
        conversation = eval(conversation)
        # Aqui se compone todo el json de messages de acuerdo a cada bot
        for i in range(len(conversation)):
            question = conversation[i]["question"]
            answer = conversation[i]["answer"]
            details = Detalles(question=question, answer=answer, bot_id=bot_id)
            details.save()
            text = text+"{"+'"role": "user", "content":"'+question + \
                '"},'+"{"+'"role": "assistant", "content": "'+answer+'"},'

        # Aqui se compone todo contenido del sistema para el json
        content = "Eres un bot de "+tema.nombre+" que quiere decir "+tema.descripcion+" , tu nombre es "+botDB.nombre+" , tienes las siguienes habilidades "+skill+" , a continuación se describre lo que no puedes realizar "+bans + \
            " , si preguntan otro tema que no estes programado deebes responder : "+answer_ukwn+".Eres habil de poder hablar los siguientes idiomas " + \
            lenguage+" , a continuación se muestra una conversación con un usuario "+text
        if question_test != "":
            messages = [
                {"role": "system", "content": content},
                {"role": "user", "content": "Hola"},
                {"role": "assistant", "content": "Hola, ¿en qué te puedo ayudarte"},
                {"role": "user", "content": question_test},
            ]
        else:
            messages = [
                {"role": "system", "content": content},
                {"role": "user", "content": "Hola"},
                {"role": "assistant", "content": "Hola, ¿en qué te puedo ayudarte"},
                {"role": "user", "content": "¿Eres mi papa?"},
            ]

        response = openai.ChatCompletion.create(
            model='gpt-3.5-turbo',
            messages=messages,
            temperature=0.8,
            max_tokens=1024,
        )
        # return HttpResponse(messages)
        if response['choices'][0]['message']['content'] != "":
            result = response['choices'][0]['message']['content']
            return Response()
        else:
            return HttpResponse("No se pudo generar una respuesta")
        logging.info(result)
        return result
    except Exception as e:
        logging.info(e)
        return HttpResponse(e)


# @login_required()  # Solo usuarios autenticados pueden acceder a esta vista
# @csrf_protect
def testing_bot(request):
    # traer las skills del bot
    bot_id = request.GET.get('bot_id')

    question_test = request.GET.get('question_test')

    botDB = Bot.objects.get(id=bot_id)
    tema = Tema.objects.get(id=botDB.tema.id)
    skills = Skill.objects.filter(bot_id=bot_id)
    detalles = Detalles.objects.filter(bot_id=bot_id)

    text = ""
    for i in range(len(detalles)):
        question = detalles[i].question
        answer = detalles[i].answer
        text = text+"{"+'"role": "user", "content":"'+question + \
            '"},'+"{"+'"role": "assistant", "content": "'+answer+'"},'
    # Aqui se compone todo contenido del sistema para el json
    content = "Eres un bot de "+tema.nombre+" que quiere decir "+tema.descripcion+" , tu nombre es "+botDB.nombre+" , tienes las siguienes habilidades "+skills[0].skill+" , a continuación se describre lo que no puedes realizar "+skills[0].bans+" " + \
        " , si preguntan otro tema que no estes programado deebes responder : "+skills[0].answer_unkwn+".Eres habil de poder hablar los siguientes idiomas " + \
        skills[0].language + \
        " , a continuación se muestra una conversación con un usuario "+text
    messages = [
        {"role": "system", "content": content},
        {"role": "user", "content": "Hola"},
        {"role": "assistant", "content": "Hola, ¿en qué te puedo ayudarte"},
        {"role": "user", "content": question_test},
    ]
    response = openai.ChatCompletion.create(
        model='gpt-3.5-turbo',
        messages=messages,
        temperature=0.8,
        max_tokens=1024,
    )
    # return HttpResponse(messages)
    if response['choices'][0]['message']['content'] != "":
        mensajeInicio = Mensajes(
            mensaje=question_test,
            bot_id=bot_id
        )
        mensajeInicio.save()

        mensaje = Mensajes(
            mensaje=response['choices'][0]['message']['content'],
            bot_id=bot_id
        )
        mensaje.save()
    else:
        return HttpResponse("No se pudo generar una respuesta")
