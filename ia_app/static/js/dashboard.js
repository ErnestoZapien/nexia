$(document).ready(function () {
    $.ajax({
        url: "/api/mensajes",
        type: "GET",
        dataType: "json",
    }).done(function (data) {

        console.log(data);

        let seriesData = [];

        for (var i = 0; i < data.mensajes.length; i++) {
            let serie = {
                name: data.mensajes[i].dia,
                data: [data.mensajes[i].total / 2]
            }
            seriesData.push(serie);
        }

        if (data.bots.length == 1) {
            document.getElementById("numeroBots").innerHTML = data.bots.length;
        } else {
            document.getElementById("numeroBots").innerHTML = data.bots.length;
        }

        Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Número de mensajes por día'
            },
            xAxis: {
                categories: [''],
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Número de mensajes'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: seriesData
        });

    }).fail(function (data) {
        console.log(data);
    });

    // Obtener el token del local storage
    let token = localStorage.getItem("token");

    // Obtener los ultimos 5 caracteres del token
    let ultimosCaracteres = token.substring(token.length - 5, token.length);

    // Poner el valor del token en el input
    document.getElementById("token").value = token;

    // Poner el valor del token en el label
    document.getElementById("tokenLabel").innerHTML = 'Token: ************' + ultimosCaracteres;

});

function generarToken(data) {

    let csrf = document.getElementsByName("csrf-token")[0].content;

    $.ajax({
        url: "generarToken/obtener",
        type: "POST",
        headers: {
            "X-CSRFToken": csrf
        },
        data: {
            "id": data
        }
    }).done(function (data) {

        Swal.fire({
            title: 'Token generado',
            text: '¿Quieres copiar el token al portapapeles?',
            icon: 'success',
            confirmButtonText: 'Si',
            showCancelButton: true,
            cancelButtonText: 'No'
        }).then((result) => {

            if (result.isConfirmed) {
                navigator.clipboard.writeText(data.token)
                    .then(() => {

                        // Poner el valor del token en el input
                        document.getElementById("token").value = data.token;

                        // Obtener los ultimos 5 caracteres del token
                        let token = data.token;
                        let ultimosCaracteres = token.substring(token.length - 5, token.length);

                        document.getElementById("tokenLabel").innerHTML = 'Token: ************' + ultimosCaracteres;

                        // Guardar token en el local storage y session storage
                        sessionStorage.setItem("token", data.token);
                        localStorage.setItem("token", data.token);

                    })
                    .catch(err => {
                        console.error('Error al copiar al portapapeles:', err);
                    })
            } else {

                // Poner el valor del token en el input
                document.getElementById("token").value = data.token;

                // Obtener los ultimos 5 caracteres del token
                let token = data.token;
                let ultimosCaracteres = token.substring(token.length - 5, token.length);

                document.getElementById("tokenLabel").innerHTML = 'Token: ************' + ultimosCaracteres;

                // Guardar token en el local storage y session storage
                sessionStorage.setItem("token", data.token);
                localStorage.setItem("token", data.token);
            }
        }).catch((err) => {
            console.log(err);
        });

    }).fail(function (data) {
        console.log(data);
    });
}

function copiarToken(){

    let token = document.getElementById("token").value;

    navigator.clipboard.writeText(token)
        .then(() => {
            Swal.fire({
                title: 'Token copiado',
                text: 'El token se ha copiado al portapapeles',
                icon: 'success',
                confirmButtonText: 'Ok'
            });
        })
        .catch(err => {
            console.error('Error al copiar al portapapeles:', err);
        })
}