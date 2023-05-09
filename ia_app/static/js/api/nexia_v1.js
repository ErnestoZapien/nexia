document.addEventListener("DOMContentLoaded", function () {

    //Cargar el arhivo CSS
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "https://3.229.53.151:8000/static/js/api/style_v1.css";
    document.head.appendChild(link);


    //Definir constantes necesarioas
    const bot_id = bot;
    const auth_token = token;
    const url = 'https://3.229.53.151:8000/protegida/';
    const nombre_bot = '';

    //realizar peticiones POST al iniciar la pagina
    function mensajeInicio(bot_id, callback) {
        try {
            var datos = JSON.stringify({
                "bot_id": bot_id,
            });
            realizarPeticion('https://3.229.53.151:8000/inicio/', 'POST', datos, function (response) {
                response = JSON.parse(response);
                respuestaBot(response);
                if (typeof callback === 'function') {
                    callback(response);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    //Envio de mensaje al dar click al boton o enter dentro del input
    function enviarMensaje(question, callback) {
        try {
            const datos = JSON.stringify({
                "bot_id": bot_id,
                "question": question,
            });
            realizarPeticion(url, 'POST', datos, function (response) {
                respuestaUser(question);
                respuestaBot(response);
                if (typeof callback === 'function') {
                    callback(response);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    //Realizar la peticion a la API
    function realizarPeticion(url, method, datos, callback) {
        const peticion = new XMLHttpRequest();
        peticion.open(method, url, true);
        peticion.setRequestHeader('Content-Type', 'application/ ');
        peticion.setRequestHeader('Authorization', 'Bearer ' + auth_token);
        peticion.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                if (typeof callback === 'function') {
                    callback(this.responseText);

                }
            }
        };
        peticion.send(datos);
        console.log(peticion);
        peticion.onerror = function (error) {
            console.log(error);
        }
        peticion.onabort = function () {
            console.log('Peticion abortada');
        }
        peticion.ontimeout = function () {
            console.log('Tiempo de espera agotado');
        }
    }

    //Funcion para crear el boton para abrir div con el chat
    const btn = document.createElement("button");
    btn.textContent = "Bo";

    function getColors() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var responseText = this.responseText;
                console.log(responseText);
            }
        };
        xhttp.open("GET", "https://3.229.53.151:8000/bots/setBtn?bot=1", true);
        xhttp.send();
    }

    getColors();



    //Agregar función de apertura al botón
    btn.addEventListener("click", function () {
        // Mostrar u ocultar el div flotante
        const popup = document.querySelector(".popup");
        popup.style.display = popup.style.display === "none" ? "block" : "none";
        mensajeInicio(bot_id);

    });


    // Crear el contenedor del botón
    const container = document.createElement("div");
    container.classList.add("float-btn");

    // Agregar el botón al contenedor
    container.appendChild(btn);
    btn.classList.add("btnc");

    // Agregar el contenedor al cuerpo del documento
    document.body.appendChild(container);

    // Crear el div flotante
    const popup = document.createElement("div");
    popup.classList.add("popup");
    document.body.appendChild(popup);
    //Crear contenedor header dentro del div flotante
    const topop = document.createElement("div");
    topop.classList.add("headpop");
    popup.appendChild(topop);

    //Poner imagen de perfil dentro del header
    const imgpop = document.createElement("img");
    imgpop.classList.add("ipop");
    imgpop.src =
        "https://scontent.fgdl3-1.fna.fbcdn.net/v/t39.30808-6/308867394_496970412442842_6156379305214807475_n.png?_nc_cat=105&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeHnciZanSuf5EwOab_0nv1xUICYVk9tSChQgJhWT21IKEx1i7UT4yKvYjUI3aCuCgW_l3e4H4XnNs5Of75PugdS&_nc_ohc=gaJ_CDzl61YAX8W98Wo&_nc_ht=scontent.fgdl3-1.fna&oh=00_AfCUw2gjCe7f4mi20ks0e7cH9PiL22aoMROfm4uu3RTnIQ&oe=6445ACB8";
    topop.appendChild(imgpop);


    //Poner nombre dentro del header
    const nmpop = document.createElement("span");
    nmpop.classList.add("npop");
    nmpop.textContent = "Cronoz";
    topop.appendChild(nmpop);

    //Crear contenedor body dentro del div flotante
    const bodpop = document.createElement("div");
    bodpop.classList.add("bpop");
    popup.appendChild(bodpop);


    //Crear contenedor footer dentro del div flotante
    const ftpop = document.createElement("div");
    ftpop.classList.add("fpop");
    popup.appendChild(ftpop);

    //Crear input dentro del footer
    const askpop = document.createElement("input");
    askpop.classList.add("apop");
    ftpop.appendChild(askpop);




    //Crear botón dentro del footer
    const btnpop = document.createElement("button");
    btnpop.classList.add("btpop");
    btnpop.textContent = "";
    ftpop.appendChild(btnpop);

    btnpop.addEventListener("click", function () {
        const vask = askpop.value;
        console.log(vask);
        enviarMensaje(vask);
    });

    askpop.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            btnpop.click();
            enviarMensaje(askpop.value);
        }
    });

    //funcion para la respuesta del usuario
    function respuestaBot(response) {
        console.log(typeof response);
        //guardar respuesta del bot
        var nombre_bot = response['bot_name'];
        var respuesta = response['answer'];
        console.log(nombre_bot);
        console.log(respuesta);

        // Crear el contenedor del bot
        const dbot = document.createElement("div");
        dbot.classList.add("dbots");
        bodpop.appendChild(dbot);

        // Crear el título del bot
        const tbot = document.createElement("span");
        tbot.classList.add("tbots");
        dbot.appendChild(tbot);

        // Agregar imagen al título del bot
        const itbot = document.createElement("img");
        itbot.classList.add("itbots");
        itbot.src =
            "https://png.pngtree.com/png-clipart/20200701/big/pngtree-robotic-head-vector-png-image_5439402.png";
        tbot.appendChild(itbot);

        // Agregar el nombre al título del bot
        const nbot = document.createElement("span");
        nbot.classList.add("nbots");
        nbot.textContent = nombre_bot;
        tbot.appendChild(nbot);

        // Crear la respuesta del bot
        const rbot = document.createElement("span");
        rbot.classList.add("rbots");
        rbot.textContent = respuesta;
        dbot.appendChild(rbot);

    }

    // crear un nuevo usuario
    function respuestaUser(question) {
        // Crear el contenedor del usuario
        const dusu = document.createElement("div");
        dusu.classList.add("dusus");
        bodpop.appendChild(dusu);

        // Crear el título del usuario
        const tusu = document.createElement("span");
        tusu.classList.add("tusus");
        dusu.appendChild(tusu);

        // Agregar imagen al título del usuario
        const iusu = document.createElement("img");
        iusu.classList.add("iusus");
        iusu.src =
            "https://seeklogo.com/images/M/Messenger-logo-BCED8EE81A-seeklogo.com.png";
        tusu.appendChild(iusu);

        // Agregar el nombre al título del usuario
        const nusu = document.createElement("span");
        nusu.classList.add("nusus");
        nusu.textContent = 'Usuario';
        tusu.appendChild(nusu);

        // Crear la pregunta del usuario
        const pusu = document.createElement("span");
        pusu.classList.add("pusus");
        pusu.textContent = question;
        dusu.appendChild(pusu);
    }


});