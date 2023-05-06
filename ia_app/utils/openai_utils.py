import openai
import os
from ia_app.models import Skill
import pickle
import logging
import json
from django.utils import timezone
from django.http import JsonResponse
logging.basicConfig(filename='app.log', level=logging.DEBUG)
# from openai import api_request
# from openai.api_resources import Model
# from openai import openai

# model=openai.Api(engine="davinci")


logging.basicConfig(filename='app.log', level=logging.DEBUG)


# openai.api_key = "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"

# openai.api_key = ""
# openai.organization = "org-kecBNWT3mB0Yf4WA7LVkbKFH"
# openai.api_key = os.getenv("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")


prompts = "Lux es un chatbot que responde de manera amable, cálida ,alegre y servicial, es un vendedor, siempre responderá de manera natural y espontánea. Solo responderá a todo lo relacionado con nova gps y cuando realicen preguntas diferentes a este tema o la información que se tenga del mismo indicará que no puede responder eso de una manera creativa e invitará a preguntar algo más acerca de Nova. La información de nova se encuentra en https://novagps.com.mx/. Nova no cuenta con distribuidores. Lux habla diferentes idiomas como español, inglés y francés .La batería de nova puede durar de 2 a 3 días. *Esto puede variar debido al movimiento que genere. Las N-Zones son delimitaciones de zonas perimetrales en tu mapa. Al momento que tu Nova entre o salga de una de ellas recibirás una alerta .Solo si cuentas con membresía activa y con dispositivo GPS puedes hacer uso de la aplicación PWA que es compatible con diferentes dispositivos, como de escritorio, en las plataformas Android y IOS. Solamente se pueden crear 3 N-Zones por cuenta, si se desea tener más es necesario contactar al área de ventas para validar los paquetes existentes de N-Zones. Los costos de las membresías de Nova son 1 mes por $85, 6 meses por $425 con un mes de regalo, 12 meses por $850 con 2 meses de regalo. El costo del dispositivo es de $1,300.00 MXN. Nuestras redes sociales son Facebook: https://www.facebook.com/novagpsoficial , Instagram: https://www.instagram.com/novagpsoficial  y Tiktok: https://www.tiktok.com/@novagps, <br> Donde subimos mucho contenido para tí. Las situaciones que hay fuera de casa nos hacen estar constantemente preocupados por la seguridad de aquellos que amamos, pero, aunque quisiéramos, no podemos estar a su lado todo el tiempo. Por ello existe Nova, un dispositivo que te permite conectar con ellos sin necesidad de estar presente, brindándote la tranquilidad de saber su ubicación y acompañarlos en sus trayectos. Nuestra aplicación es una herramienta poderosa que les permite rastrear la ubicación de sus seres queridos.Ya sea que sean padres, parejas, amigos o simplemente estén pendientes de sus seres queridos, nuestra aplicación les dará la confianza y certeza que necesitan para saber donde se encuentran los que más aman. Las caracteristicas de la App de Nova: - Conoce la ubicación en tiempo real - Crea N-Zones o puntos de interés para tí - Crea grupos para todo tipo de ocasiones - Comparte tu ubicación con otros usuarios - Revisa el historial de tus viajes - Botón de pánico para cualquier situación. Las caracteristicas del dispositivo Nova: - SIM Global - Diseño compacto - Red 4G - Batería de larga duración - Botón de pánico - Alta precisión. Este dispositivo cuenta con una SIM que puede conectarse al operador que ofrezca una mejor cobertura en cada caso. Está SIM ofrece un servicio Multi-operador y Multi-país. El rastreo en tiempo real es una característica con la cual no se requiere Refresh, seguimiento individual o grupal de tus Nova, estatus del dispositivo, entre muchas cosas más. Cuenta con un diseño compacto, todo lo que necesitas en este dispositivo, planeado para pasar desapercibido, con una potencia incomparable y con una amplia batería a fin de acompañarte siempre. Los recorridos son una herramienta que te permitirá tener el control total de las rutas y zonas asignadas a tus Nova, permitiéndote personalizarlas de acuerdo a tus necesidades. Cuenta con alertas personalizables que llegan directamente a tu teléfono móvil o bandeja de entrada de tu correo electrónico. Puedes pagar por medio de mercado pago con tarjeta de débito o crédito, también en tiendas de conveniencia con una referencia (OXXO,HEB,Chedrahui,etc). Nova fue fundada por Mael Preumont junto con su equipo de Ingenieros preocupados por la situación de la sociedad actual. Las Oficinas se encuentran en León, Guanajuato, México. Nova nace en el 2022 bajo la idea de poder generar una herramienta que pueda dar certeza a las personas que la utilicen. Maximo se pueden agregar 20 personas por grupo. No tiene costo de envío dentro de la Republica Mexicana. El equipo detrás de nova es el Ing. Ernesto Zapien Director del Área de Desarrollo, Ing. Angel Morales Director del Área de Marketing y Diseño, Ing. Ivan Ramirez Desarrollador, Ing. Sofia Padilla Diseñadora Multimedia."


def test_openai_api(input_text):
    response = openai.Completion.create(
        engine="davinci",
        prompt=input_text,
        max_tokens=1024,
        n=1,
        stop=None,
        temperature=0.7,
    )
    return response.choices[0].text.strip()


def generate_answer(input_request):
    print(input_request)
    response = openai.Completion.create(
        engine="davinci",
        prompt=input_request,
        max_tokens=1024,
        n=1,
        stop=None,
        temperature=0.7,
    )
    return response.choices[0].text.strip()


def get_response(input_text):
    # ask = prompts + "\nTú: " + input_text
    # response=prompt
    logging.info("Prompt: " + input_text)
    response = openai.Completion.create(
        model="text-moderation-playground",
        prompt=input_text,
        temperature=0.5,
        # max_tokens=256,
        max_tokens=100,
        top_p=0.3,
        frequency_penalty=0.5,
        presence_penalty=0
        # max_tokens=1024,
        # n=1,
        # stop=None,
        # temperature=0.5
    )
    return response.choices[0].text.strip()


def pruebas_bot(texto_pregunta):
    try:

        model = "davinci",
        messages = [
            {"role": "system", "content": "Eres un chatbot para ayudar y respoder preguntas referentes a Nova GPS , no podras contestar mas sobre otro tema que no sea nova gps , y tu nombre es Lux que proviene de Luz"},
            {"role": "user", "content": "¿Que es nova?"},
            {"role": "assistant", "content": "Las situaciones que hay fuera de casa nos hacen estar constantemente preocupados por la seguridad de aquellos que amamos, pero, aunque quisiéramos, no podemos estar a su lado todo el tiempo. Por ello existe Nova, un dispositivo que te permite conectar con ellos sin necesidad de estar presente, brindándote la tranquilidad de saber su ubicación y acompañarlos en sus trayectos"},
            {"role": "user", "content": "¿Que es un gps?"},
            {"role": "assistant",
                "content": "Un dispositivo GPS (Sistema de Posicionamiento Global) es como un amigo que te ayuda a encontrar el camino cuando estás perdido. Pero en lugar de utilizar señales de carreteras o señales de tráfico, utiliza señales de satélite para encontrar lo que más quieres"},
            {"role": "user", "content": "¿Cuánto le dura la batería?"},
            {"role": "assistant", "content": "La batería puede durar de 2 a 3 días. *Esto puede variar debido al movimiento que genere"},
            {"role": "user", "content": "¿Qué diferencia tienen con otros GPS?"},
            {"role": "assistant", "content": "La mayoría de los dispositivos GPS se conectan a través de datos y Wi-Fi, pero nosotros ofrecemos un valor adicional con nuestra SIM Global. Además, mientras que muchos otros GPS se enfocan en un grupo específico como personas o autos, nosotros abarcamos a personas, autos y también mascotas. En nuestro servicio, lo más importante es ayudarte a encontrar lo que más deseas y reconocemos la importancia de tener una ubicación precisa. Por esta razón, nuestro GPS tiene un radio de precisión mayor en comparación con otros dispositivos"},
            {"role": "user", "content": "¿Qué es una N-Zone?"},
            {"role": "assistant", "content": "Una N-Zone es una zona de seguridad que puedes establecer para que tu dispositivo te avise cuando alguien se acerca a ella. Puedes establecer una N-Zone en cualquier lugar que desees, como tu casa, tu oficina o la escuela de tus hijos"},
            {"role": "user", "content": "¿Cuánto cuesta?"},
            {"role": "assistant", "content": "El dispositivo Nova cuesta $1,300.00 y las membresías cuestan: 12 meses por $750.00, 6 meses $395.00 y 1 mes $85.00"},
            {"role": "user", "content": "¿Qué es una SIM Global?"},
            {"role": "assistant", "content": "Una SIM Global es una tarjeta SIM que te permite conectarte a la red de datos de cualquier país del mundo. Esto te permite utilizar tu dispositivo GPS en cualquier parte del mundo sin preocuparte por los costos de roaming"},
            {"role": "user", "content": "¿Esta disponible para todos los dispositivos?"},
            {"role": "assistant",
                "content": "Si, esta disponible para todos los dispositivos, desde computadoras, celulares, tablets, etc,. ya que es una aplicación PWA (Progressive Web App) que se puede instalar en cualquier dispositivo"},
            {"role": "user", "content": "¿Se puede consultar el historial del dispositivo?"},
            {"role": "assistant", "content": "Si, la consulta del historial de tu dispositivo NOVA esta habilitada en el apartado de Dispositivos, en la pestaña Historial, el cual puedes consultar 7 dias transcurridos, en caso de necesitar una consulta mas amplia es necesario contactar al departamento de Ventas NOVA para brindarte la atencion que necesites."},
            {"role": "user", "content": "¿Cuentan con envios a todo el pais?"},
            {"role": "assistant", "content": "Si, contamos con envios a todo el pais,  el tiempo de entrega es de 3 a 5 dias habiles"},
            # {"role": "user", "content": "¿Cuentan con servicio de instalacion?"},


            {"role": "user", "content": texto_pregunta},
        ]
        response = openai.ChatCompletion.create(
            model='gpt-3.5-turbo',
            messages=messages,
            temperature=0.8,
            max_tokens=1024,
        )
        return response['choices'][0]['message']['content']

        # with open("data.json") as f:
        #     data = json.load(f)

        # response=openai.Completion.create(
        #     engine="davinci",
        #     prompt=data["prompt"],
        #     max_tokens=1024,
        #     n=1,
        #     stop=None,
        #     temperature=0.5
        # )
        # respuesta=response.choices[0].text.strip()
        # return respuesta

        # model_spec = {
        #     "model": "text-davinci-002",
        #     "training_data": ["texto de entrenamiento"],
        #     "prompt": "",
        #     "temperature": 0.5,
        #     "max_tokens": 1024,
        #     "n": 1,
        #     "batch_size": 1,
        #     "num_steps": 1,
        #     "use_gpu": True,
        #     "input_prefix": "",
        #     "output_prefix": "",
        #     "stop": "\n"
        # }

        # model = openai.Model.create(
        #     engine="davinci",
        #     training_data=[texto_entrenamiento],
        #     prompt="",
        #     max_tokens=1024,
        #     temperature=0.5,
        #     n=1,
        #     batch_size=1,
        #     num_steps=1,
        #     use_gpu=True,
        #     input_prefix="respuesta:",
        #     output_prefix="bot:",
        #     name='LUX',
        # )
        # model.save("mi_modelo_entrenado")

    #     return model
    except Exception as ex:
        return ex

    # model.fine_tune(train_data)

    # tema=Tema(nomre=tema,descripcion=tema,empresa_id=empresa_id)
    # # tema.save()

    # promt=Promts(promt=texto_entrenamiento,tema_id=tema.id)

    # logging.info("Modelo: " + model.id)

    # return model.id


def config_train_bot(bot_id, skill, bans, answer_unkwn, lenguage, conversation):
    try:
        # Aqui se compone todo el json de messages de acuerdo a cada bot
        # buscamos los datos del bot y su tema
        
        id=int(bot_id)
        # botDB = Bot.objects.get(id=id)

        
        # tema = Tema.objects.get(id=botDB.tema_id)
        # logging.info(tema)
        # Guardamos los datos en la db
        skillDB = Skill(bans=bans,
                      answer_unkwn=answer_unkwn,
                      skill=skill,
                      language=lenguage,
                      bot_id=bot_id
                      )
        logging.info(skillDB)
        return "ok"
        text = ""
        # Aqui se compone todo el json de messages de acuerdo a cada bot
        for i in range(len(conversation)):
            question = conversation[i]["question"]
            answer = conversation[i]["answer"]
            details = Detalles(question=question, answer=answer, bot_id=bot.id)
            details.save()
            text = text+"{"+'"role": "user", "content":"'+question + \
                '"},'+"{"+'"role": "assistant", "content": "'+answer+'"},'

        print("Datos guardados en la db")
        # Aqui se compone todo contenido del sistema para el json
        content = "Eres un bot de "+tema.nombre+" que quiere decir "+tema.descripcion+" , "+bot.nombre+" , tienes las siguienes habilidades"+skill+" , a continuación se describre lo que no puedes realizar "+bans + \
            " , si no sabes responder una pregunta puedes responder "+answer_unkwn+" ,eres habil de poder hablar los siguientes idiomas " + \
            lenguage+" , a continuación se muestra una conversación con un usuario "+text
        # Aqui se compone todo el json de messages de acuerdo a cada bot
        # if question_test == "":
        messages = [
            {"role": "system", "content": content},
            {"role": "user", "content": "Hola"},
            {"role": "assistant", "content": "Hola, ¿en qué te puedo ayudarte"},
            {"role": "user", "content": conversation[0]["question"]},
        ]
        # else:
        #     messages = [
        #     {"role": "system", "content": content},
        #     {"role": "user", "content": "Hola"},
        #     {"role": "assistant", "content": "Hola, ¿en qué te puedo ayudarte"},
        #     {"role": "user", "content": question_test},
        #     ]


        response = openai.ChatCompletion.create(
            model='gpt-3.5-turbo',
            messages=messages,
            temperature=0.8,
            max_tokens=1024,
        )
        if response['choices'][0]['message']['content'] != "":
            return "El bot se ha entrenado correctamente"
            # return response['choices'][0]['message']['content']
        else:
            return "Error al entrenar al bot "
    except Exception as ex:
        return ex


def prueba_zapien(texto_entrenamiento):
    try:
        # Aqui pones el codigo que ocupes dentro de esta funcion y si ocupas importar algo desde arriba , la consola marcara el error
        return "esto es una prueba"
    except Exception as ex:
        return ex
