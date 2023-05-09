$(document).ready(function () {
    // Datatable de 
    $("#table-bots").DataTable({
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
        },
        "columnDefs": [
            {targets: [0,1,2,3,4], className: 'dt-head-center'},
            {targets: [0,1,2,3,4], className: 'dt-body-center'}
        ]
    });

    // Set color en el texto del Bot
    pickerAnsBot = new iro.ColorPicker("#txtAnsBot", {
        width: 100,
        color: "rgb(0, 0, 0)",
        borderWidth: 1,
        borderColor: "#fff",
    });

    // variable del text input para escribir color o ver el codigo hex
    hexInputAnsBot = document.getElementById("hexInputAnsBot");

    // inicializar rueda rgb con color / text input
    pickerAnsBot.on(["color:init", "color:change"], function (color) {
        hexInputAnsBot.value = color.hexString;
        document.getElementById('colorBot').style.color = hexInputAnsBot.value;
    });

    // evento para set color en la rueda rgb en caso de cambiar el codigo
    hexInputAnsBot.addEventListener('change', function () {
        pickerAnsBot.color.hexString = this.value;
    });

    // Set color en el texto del Bot
    pickerAnsUsr = new iro.ColorPicker("#txtAnsUser", {
        width: 100,
        color: "rgb(0, 0, 0)",
        borderWidth: 1,
        borderColor: "#fff",
    });

    // variable del text input para escribir color o ver el codigo hex
    hexInputAnsUs = document.getElementById("hexInputAnsUs");

    // inicializar rueda rgb con color / text input
    pickerAnsUsr.on(["color:init", "color:change"], function (color) {
        hexInputAnsUs.value = color.hexString;
        var textUser = document.getElementById('colorUser');
        textUser.style.color = hexInputAnsUs.value;
    });

    // evento para set color en la rueda rgb en caso de cambiar el codigo
    hexInputAnsUs.addEventListener('change', function () {
        pickerAnsUsr.color.hexString = this.value;
    });

    // Set color en el texto del Bot
    pickerPrimary = new iro.ColorPicker("#txtPrimary", {
        width: 100,
        color: "rgb(255, 255, 255)",
        borderWidth: 1,
        borderColor: "#fff",
    });

    // variable del text input para escribir color o ver el codigo hex
    hexInputPrimary = document.getElementById("hexInputPrimary");

    // inicializar rueda rgb con color / text input
    pickerPrimary.on(["color:init", "color:change"], function (color) {
        hexInputPrimary.value = color.hexString;
        var bgPrimary = document.getElementById('backgroundPrimary');
        bgPrimary.style.backgroundColor = $("#hexInputPrimary").val();
    });

    // evento para set color en la rueda rgb en caso de cambiar el codigo
    hexInputPrimary.addEventListener('change', function () {
        pickerPrimary.color.hexString = this.value;
    });

    // Set color en el texto del Bot
    pickerSecondary = new iro.ColorPicker("#txtSecondary", {
        width: 100,
        color: "rgb(0, 0, 0)",
        borderWidth: 1,
        borderColor: "#fff",
    });

    // variable del text input para escribir color o ver el codigo hex
    hexInputSecondary = document.getElementById("hexInputSecondary");

    // inicializar rueda rgb con color / text input
    pickerSecondary.on(["color:init", "color:change"], function (color) {
        hexInputSecondary.value = color.hexString;
        var cSecondary = document.getElementById('colorSecondary');
        cSecondary.style.color = $("#hexInputSecondary").val();
        cSecondary.style.marginTop = '1.5rem';
    });

    // evento para set color en la rueda rgb en caso de cambiar el codigo
    hexInputSecondary.addEventListener('change', function () {
        pickerSecondary.color.hexString = this.value;
    });
});

// Variables globales
const widget = uploadcare.SingleWidget("[role=uploadcare-uploader]");

var arg; var arge; var swish; var pickerAnsBot; var pickerAnsUsr; var hexInputPrimary;
var pickerPrimary; var pickerSecondary; var hexInputAnsBot; var hexInputAnsUs; var hexInputSecondary;
var cardSimulator = '';
var qna = [];
var i = 0; var currentTab = 0;
var settingColorBot, settingColorUsr, settingColorPrimary, settingColorSecondary, settingColorBack, settingPosition;
// 

// Widgets para las fotos del BOT
widget.onUploadComplete(fileInfo => {
    arg = fileInfo.cdnUrl;
});

widget.onUploadComplete(fileInfo => {
    arge = fileInfo.cdnUrl;
})
// 

// evento para mostrar el tab actual
document.addEventListener("DOMContentLoaded", function (event) {
    showTab(currentTab);
});

// widget para editar foto
const widg = uploadcare.SingleWidget("[id=uploadcare-editar]");

// funcion para agregar al array objetos de Question n Answer
$("#btnAddQNA").on('click', function () {
    var html = '';

    if ($("#txtQuestion").val() != '' && $("#txtAnswer").val() != '') {
        var data = {
            question: $("#txtQuestion").val(),
            answer: $("#txtAnswer").val(),
            id: i
        };

        qna.push(data);
        i++;
    }

    qna.forEach(q => {
        html += `<div id="qna-${i}">
                    <p><span class="text-primary">Q: ${q.question}</span></p>
                    <p><span class="text-success">A: ${q.answer}</span></p>
                    <div class="text-end">
                        <span onclick="deleteQNA(${q.id})" style="cursor: pointer"><i class="fa-solid fa-trash text-danger"></i></span>
                    </div>
                </div>`;
    });

    document.getElementById('card-qna').innerHTML = html;

    $("#txtAnswer").val('');
    $("#txtQuestion").val('');
});

// funcion para refrescar el card de Question n Answer
$("#btnRefreshQNA").on('click', function () {
    var html = '';
    var html2 = '';

    document.getElementById('card-qna').innerHTML = html;
    document.getElementById('card-simulation').innerHTML = html2;

    $("#txtQuestion").val('');
    $("#txtAnswer").val('');

    i = 0;
    qna = [];
});

// multiselect para multiples idiomas
$("#multiple-select-field").select2({
    theme: "bootstrap-5",
    width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
    placeholder: $(this).data('placeholder'),
    closeOnSelect: false,
    dropdownParent: $('#multiple-select-field').parent(),
});

// swuitch para el cambiar el color fondo del chat
$("#switchBackground").on('click', function () {
    if ($("#switchBackground").is(':checked')) {
        var bgChat = document.getElementById('backgroundChat');
        var bgRb = document.getElementById('bgrbnx');
        var bgRu = document.getElementById('bgrunx');

        bgChat.style.backgroundColor = '#212529';
        bgRb.style.backgroundColor = '#34383d';
        bgRb.style.color = '#fff';
        bgRu.style.backgroundColor = '#34383d';
        bgRu.style.color = '#fff';
    }
    else {
        var bgChat = document.getElementById('backgroundChat');
        var bgRb = document.getElementById('bgrbnx');
        var bgRu = document.getElementById('bgrunx');

        bgChat.style.backgroundColor = '#fff';
        bgRb.style.backgroundColor = '#dbdbdb';
        bgRb.style.color = '#000';
        bgRu.style.backgroundColor = '#dbdbdb';
        bgRu.style.color = '#000';
    }
});

// funcion para set color
$("#tabDefaultTextBot").on('change', function () {
    var textBot = document.getElementById('colorBot');

    textBot.style.color = $("#tabDefaultTextBot").val();
});

// funcion para set color
$("#tabDefaultTextUsr").on('change', function () {
    var textUsr = document.getElementById('colorUser');

    textUsr.style.color = $("#tabDefaultTextUsr").val();
});

// funcion para set color
$("#tabDefaultPrimary").on('change', function () {
    var primary = document.getElementById('backgroundPrimary');

    primary.style.backgroundColor = $("#tabDefaultPrimary").val();
});

// funcion para set color
$("#tabDefaultSecondary").on('change', function () {
    var secondary = document.getElementById('colorSecondary');

    secondary.style.color = $("#tabDefaultSecondary").val();
});

// funcion para cambiar color fondo del chat en tab Predeterminado
$("#switchBackgroundDefault").on('click', function () {
    if ($("#switchBackgroundDefault").is(':checked')) {
        var bgChat = document.getElementById('backgroundChat');
        var bgRb = document.getElementById('bgrbnx');
        var bgRu = document.getElementById('bgrunx');

        bgChat.style.backgroundColor = '#212529';
        bgRb.style.backgroundColor = '#34383d';
        bgRb.style.color = '#fff';
        bgRu.style.backgroundColor = '#34383d';
        bgRu.style.color = '#fff';
    }
    else {
        var bgChat = document.getElementById('backgroundChat');
        var bgRb = document.getElementById('bgrbnx');
        var bgRu = document.getElementById('bgrunx');

        bgChat.style.backgroundColor = '#fff';
        bgRb.style.backgroundColor = '#dbdbdb';
        bgRb.style.color = '#000';
        bgRu.style.backgroundColor = '#dbdbdb';
        bgRu.style.color = '#000';
    }
});

// funcion para limpiar restablecer datos al cambiar de tab
$("#default-tab").on('click', function () {
    document.getElementById('backgroundPrimary').style.backgroundColor = settingColorPrimary;
    document.getElementById('colorSecondary').style.color = settingColorSecondary;
    document.getElementById('colorBot').style.color = settingColorBot;
    document.getElementById('colorUser').style.color = settingColorUsr;
    document.getElementById('backgroundChat').style.backgroundColor = settingColorBack;

    if (settingColorBack == '#332D2D') {
        $("#switchBackgroundDefault").prop('checked', true);
    } else {
        $("#switchBackgroundDefault").prop('checked', false)
    }

    if (settingPosition == 1) {
        $("#switchPositionDefault").prop('checked', true);
    } else {
        $("#switchPositionDefault").prop('checked', false);
    }
});

// funcion para limpiar restablecer datos al cambiar de tab
$("#custom-tab").on('click', function () {
    document.getElementById('backgroundPrimary').style.backgroundColor = settingColorPrimary;
    document.getElementById('colorSecondary').style.color = settingColorSecondary;
    document.getElementById('colorBot').style.color = settingColorBot;
    document.getElementById('colorUser').style.color = settingColorUsr;
    document.getElementById('backgroundChat').style.backgroundColor = settingColorBack;

    $("#tabDefaultTextBot").val('').trigger('');
    $("#tabDefaultTextUsr").val('').trigger('');
    $("#tabDefaultPrimary").val('').trigger('');
    $("#tabDefaultSecondary").val('').trigger('');
    $("#hexInputPrimary").val(settingColorPrimary);
    $("#hexInputAnsBot").val(settingColorBot);
    $("#hexInputAnsUs").val(settingColorUsr);
    $("#hexInputSecondary").val(settingColorSecondary);

    pickerPrimary.color.hexString = settingColorPrimary;
    pickerAnsBot.color.hexString = settingColorBot;
    pickerAnsUsr.color.hexString = settingColorUsr;
    pickerSecondary.color.hexString = settingColorSecondary;

    if (settingColorBack == '#332D2D') {
        $("#switchBackground").prop('checked', true);
    } else {
        $("#switchBackground").prop('checked', false)
    }

    if (settingPosition == 1) {
        $("#switchPosition").prop('checked', true);
    } else {
        $("#switchPosition").prop('checked', false);
    }
});

// Funcion para cargar informacion en el modal de actualizar
function modalEditar(id) {
    fetch('bots/editInfo?numB=' + id)
        .then(response => response.json())
        .then(data => {
            // Valores cargados en los inputs
            $("#id").val(data.id);
            $("#id_tema").val(data.tema_id);
            $("#imagen-editar").val(data.imagen);
            $("#nombre-editar").val(data.nombre);
            $("#tema-editar").val(data.tema_nombre);
            $("#cliente-editar").val(data.empresa_id);
            $("#descripcion-editar").val(data.descripcion);
        })
        .catch(error => console.error(error))
}

// Funcion para desactivar Bot
function off(id) {
    var data = {
        bot_id: id
    }
    
    Swal.fire({
        title: '¿Deseas eliminar?',
        text: "Al eliminar el ChatBot no se podrá recuperar",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        confirmButtonText: '¡Sí, eliminar!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        $.ajax({
            url: 'bots/off',
            method: 'POST',
            data: data,
            headers: {
                "X-CSRFToken": csrf
            },
            beforeSend: function () {
                Swal.fire({
                    title: 'Eliminando información...',
                    html: 'Por favor espere.',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
            }
        }).done((data) => {
            Swal.close();

            Swal.fire({
                title: '¡Listo!',
                text: 'Se eliminó correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/bots';
                }
            });
        }).fail((error) => {
            Swal.close();

            Swal.fire(
                '¡Error!',
                'Error al eliminar los datos',
                'error',
            );
        });
    })
}

// Funcion para registrar Chatbot
function registrarBot() {
    if ($("#nombre").val() != '' && $("#tema").val() != '' && $("#cliente").val() != ''
        && $("#descripcion").val() != '' && arg != []) {
        var data = {
            imagen: arg,
            nombre: $("#nombre").val(),
            tema: $("#tema").val(),
            cliente: $("#cliente").val(),
            descripcion: $("#descripcion").val(),
        }

        console.log(data);

        $.ajax({
            url: 'bots/create',
            method: 'POST',
            headers: {
                "X-CSRFToken": csrf
            },
            data: data,
        }).done((data) => {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'success',
                title: 'Registrado correctamente'
            }).then((result) => {
                window.location.href = '/bots';
            })
        }).fail((error) => {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'error',
                title: 'Se produjo un error al registrar, intentaló nuevamente.'
            }).then((result) => {
                window.location.href = '/bots';
            })
        });
    } else {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: 'error',
            title: 'Campos incompletos, completa todos los campos para registrar tu nuevo ChatBot.'
        })
    }

}

// Funcion para activar Bot
function activate(id) {
    var data = {
        bot_id: id
    }

    Swal.fire({
        title: '¿Estás seguro de activar este Bot?',
        icon: 'info',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Activar',
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.close();

            $.ajax({
                url: 'bots/activate',
                method: 'POST',
                data: data,
                headers: {
                    "X-CSRFToken": csrf
                },
                beforeSend: function () {
                    Swal.fire({
                        title: 'Por favor espere',
                        text: 'Activando Bot',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });
                }
            }).done((response) => {
                Swal.fire({
                    title: 'Bot activado',
                    text: 'El bot se activó correctamente',
                    icon: 'success',
                    showConfirmButton: true,
                    confirmButtonText: 'Ok'
                }).then((result) => {
                    if (result.isConfirmed) {
                        location.reload();
                    }
                });
            }).fail((error) => {
                console.error(error)
                Swal.fire({
                    title: 'Ocurrió un error',
                    text: 'Por favor contacta a servicio técnico',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    showConfirmButton: true
                });
            });
        } else if (result.isDenied) {
            Swal.close();

            Swal.fire({
                title: 'Ocurrió un error',
                text: 'Por favor contacta a servicio técnico',
                icon: 'error',
                confirmButtonText: 'Ok',
                showConfirmButton: true
            });
        }
    });
}

// Funcion para eliminar Bot
function deleteBot(id) {
    var data = {
        bot_id: id
    }

    Swal.fire({
        title: '¿Estás seguro de eliminar este Bot?',
        text: 'No se podrá recuperar la información',
        icon: 'info',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Eliminar',
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.close();

            $.ajax({
                url: 'bots/delete',
                method: 'POST',
                data: data,
                headers: {
                    "X-CSRFToken": csrf
                },
                beforeSend: function () {
                    Swal.fire({
                        title: 'Por favor espere',
                        text: 'Eliminando información',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });
                }
            }).done((response) => {
                Swal.fire({
                    title: 'Bot Eliminado',
                    text: 'El bot se eliminó correctamente',
                    icon: 'success',
                    showConfirmButton: true,
                    confirmButtonText: 'Ok'
                }).then((result) => {
                    if (result.isConfirmed) {
                        location.reload();
                    }
                });
            }).fail((error) => {
                console.error(error)
                Swal.fire({
                    title: 'Ocurrió un error',
                    text: 'Por favor contacta a servicio técnico',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    showConfirmButton: true
                });
            });
        } else if (result.isDenied) {
            Swal.close();

            Swal.fire({
                title: 'Ocurrió un error',
                text: 'Por favor contacta a servicio técnico',
                icon: 'error',
                confirmButtonText: 'Ok',
                showConfirmButton: true
            });
        }
    });
}

// Funcion para actualizar ChatBot
function actualizarBot() {
    var data = {
        id: $("#id").val(),
        imagen: arge,
        nombre: $("#nombre-editar").val(),
        tema: $("#tema-editar").val(),
        cliente: $("#cliente-editar").val(),
        descripcion: $("#descripcion-editar").val(),
        tema_id: $("#id_tema").val(),
    }

    console.log(data);

    $.ajax({
        url: 'bots/editar',
        method: 'POST',
        headers: {
            "X-CSRFToken": csrf
        },
        data: data,
    }).done((data) => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: 'success',
            title: 'Actualizado correctamente'
        }).then((result) => {
            window.location.href = '/bots';
        })
    }).fail((error) => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: 'error',
            title: 'Se produjo un error al actualizar, intentaló nuevamente.'
        }).then((result) => {
            window.location.href = '/bots';
        })
    });
}

// funcion para cargar datos de las skills del bot
function modalSkill(id) {
    var data = {
        id: id
    }

    $.ajax({
        url: 'bots/modaledit',
        method: 'POST',
        data: data,
        headers: {
            "X-CSRFToken": csrf
        },
    }).done((result) => {
        qna = [];
        console.log(result);

        $("#id_bot").val(result.id);
        $("#txtConfig").val(result.skill);
        $("#txtAnsBloc").val(result.answer_unkwn);
        $("#multiple-select-field").val('');
        $("#multiple-select-field").select2().val('');
        $("#txtBloc").val(result.bans);
        $("#txtSimulationQuestion").val('');

        nextPrev(0);

        if (result.detalle) {
            var lang = result.language.split(',');

            console.log(lang);

            $("#multiple-select-field").select2().val(lang);
            $("#multiple-select-field").select2().val();

            cardSimulator = '';

            var html = '';

            resp = result.detalle;
            qna = result.detalle;

            resp.forEach(r => {
                html += `<div id="qna-${r.id_det}">
                            <p><span class="text-primary">Q: ${r.question}</span></p>
                            <p><span class="text-success">A: ${r.answer}</span></p>
                            <div class="text-end">
                                <span onclick="deleteQNA(${r.id_det})" style="cursor: pointer"><i class="fa-solid fa-trash text-danger"></i></span>
                            </div>
                        </div>`;
            });

            document.getElementById('card-simulation').innerHTML = cardSimulator;
            document.getElementById('card-qna').innerHTML = html;
        } else {
            var html = '';

            document.getElementById('card-qna').innerHTML = html;
        }
    }).fail((error) => {
        console.error(error);
    })

}

// funcion para simular preguntas al Bot
function simulator() {
    var lang = $("#multiple-select-field").select2('val').slice();
    var l = lang.join();

    var data = {
        question: $("#txtSimulationQuestion").val(),
        skill: $("#txtConfig").val(),
        lenguage: l,
        bans: $("#txtBloc").val(),
        conversation: JSON.stringify(qna),
        bot_id: $("#id_bot").val(),
    }

    cardSimulator += `<p><span class="text-primary">Q: ${data.question}</span></p>`

    $.ajax({
        url: 'bots/simulator',
        method: 'POST',
        data: data,
        headers: {
            "X-CSRFToken": csrf
        },
        beforeSend: function () {
            Swal.fire({
                title: 'Espere',
                text: 'Generando simulación',
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
        }
    }).done(function (result) {
        Swal.close();

        cardSimulator += `<div>
                            <p><span class="text-success">A: ${result}</span></p>
                        </div>`;

        document.getElementById('card-simulation').innerHTML = cardSimulator;
    }).fail(function (error) {
        Swal.fire(
            'Error al agregar!',
            'Vuelva a intentarlo!',
            'error'
        );
    });
}

// funcion para agregar Bot
function addBot() {
    var lang = $("#multiple-select-field").select2('val').slice();
    var l = lang.join();

    var data = {
        bot_id: $("#id_bot").val(),
        skill: $("#txtConfig").val(),
        lenguage: l,
        answer_ukwn: $("#txtAnsBloc").val(),
        bans: $("#txtBloc").val(),
        conversation: JSON.stringify(qna)
    }

    if (qna.length != 0) {
        Swal.fire({
            title: '¿Quieres hacer una simulación antes de registrar?',
            showDenyButton: true,
            confirmButtonText: 'Si',
            denyButtonText: `No`,
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.close();
            } else if (result.isDenied) {
                $.ajax({
                    url: 'bots/skills',
                    method: 'POST',
                    data: data,
                    headers: {
                        "X-CSRFToken": csrf
                    },
                    beforeSend: function () {
                        Swal.fire({
                            title: 'Espere',
                            text: 'Guardando información',
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            allowEnterKey: false,
                            didOpen: () => {
                                Swal.showLoading();
                            }
                        });
                    }
                }).done(function (result) {
                    Swal.close();

                    Swal.fire({
                        title: '¡Listo!',
                        text: 'Registro exitoso',
                        icon: 'success',
                        confirmButtonText: 'Aceptar',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                        }
                    });
                }).fail(function (error) {
                    Swal.fire(
                        'Error al agregar!',
                        'Vuelva a intentarlo!',
                        'error'
                    );
                });
            }
        })
    } else {
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'Es necesario completar la información para registrar un Bot.',
            timer: 1500,
            showConfirmButton: false,
        });
    }
}

// funcion para desactivar Bot
function deleteQNA(id) {
    qna.forEach(q => {
        var index = qna.findIndex(x => x.id == q.id);

        if (qna[index].id == id) {
            qna.splice(index, 1);
        }
    });
}

// funcion para mostrar el tab activo
function showTab(n) {
    var x = document.getElementsByClassName("tab");
    x[n].style.display = "block";

    if (n == 0) {
        document.getElementById("prevBtn").style.display = "none";

        document.getElementById('addBot').style.display = 'none';
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
        document.getElementById("nextBtn").style.display = 'none';

        document.getElementById('addBot').style.display = 'inline';
    } else {
        document.getElementById("nextBtn").style.display = 'inline';
    }

    fixStepIndicator(n);
}

// funcion para el primer indicador del tab
function fixStepIndicator(n) {
    var i, x = document.getElementsByClassName("step");

    for (i = 0; i < x.length; i++) { x[i].className = x[i].className.replace(" active", ""); }

    x[n].className += " active";
}

// funcion para el siguiente STEP
function nextPrev(n) {
    var x = document.getElementsByClassName("tab");

    x[currentTab].style.display = "none";

    currentTab = currentTab + n;

    if (currentTab >= x.length) {
        document.getElementById("nextprevious").style.display = "none";
        document.getElementById("all-steps").style.display = "none";
        document.getElementById("register").style.display = "none";
        document.getElementById("text-message").style.display = "block";
    }

    showTab(currentTab);
}

// funcion para cargar datos del boton
function modalBtn(id) {
    fetch('bots/setBtn?bot=' + id)
        .then(response => response.json())
        .then((result) => {

            console.log(result)
            if (result.colorPrimary && result.colorSecondary && result.colorBot && result.colorUsr) {
                settingColorPrimary = result.colorPrimary;
                document.getElementById('backgroundPrimary').style.backgroundColor = result.colorPrimary;

                settingColorSecondary = result.colorSecondary;
                document.getElementById('colorSecondary').style.color = result.colorSecondary;

                settingColorBot = result.colorBot;
                document.getElementById('colorBot').style.color = result.colorBot;

                settingColorUsr = result.colorUsr;
                document.getElementById('colorUser').style.color = result.colorUsr;

                if (result.background == 1) {
                    settingColorBack = '#332D2D';
                    document.getElementById('backgroundChat').style.backgroundColor = '#332D2D';
                    $("#switchBackgroundDefault").attr('checked', true);
                } else {
                    settingColorBack = '#ffffff';
                    document.getElementById('backgroundChat').style.backgroundColor = '#ffffff';
                    $("#switchBackgroundDefault").attr('checked', false);
                }

                if (result.position == 1) {
                    settingPosition = 1;
                    $("#switchPositionDefault").attr('checked', true);
                } else {
                    settingPosition = 0;
                    $("#switchPositionDefault").attr('checked', false);
                }
            } else {
                settingColorPrimary = '#ffffff';
                document.getElementById('backgroundPrimary').style.backgroundColor = '#ffffff';

                settingColorSecondary = '#000000';
                document.getElementById('colorSecondary').style.color = '#000000';

                settingColorBot = '#000000';
                document.getElementById('colorBot').style.color = '#000000';

                settingColorUsr = '#000000';
                document.getElementById('colorUser').style.color = '#000000';

                settingColorBack = '#ffffff';
                document.getElementById('backgroundChat').style.backgroundColor = '#ffffff';
            }

            $("#img-prev-bot").attr('src', result.imagen)
            $("#colorSecondary").text(result.nombre);
            $("#txtBotIdBtn").val(result.bot_id);
        }).catch(error => console.error(error))
}

// funcion para registrar la configuracion del boton
function color() {
    var switchBG;
    var switchP;
    var switchBGDefault;
    var switchPDefault;

    if ($("#switchBackground").is(':checked')) {
        switchBG = 1;
    } else {
        switchBG = 0;
    }

    if ($("#switchPosition").is(':checked')) {
        switchP = 1;
    } else {
        switchP = 0;
    }

    if ($("#switchBackgroundDefault").is(':checked')) {
        switchBGDefault = 1;
    } else {
        switchBGDefault = 0;
    }

    if ($("#switchPositionDefault").is(':checked')) {
        switchPDefault = 1;
    } else {
        switchPDefault = 0;
    }

    if ($("#tabDefaultTextBot").val() != null && $("#tabDefaultTextUsr").val() != null &&
        $("#tabDefaultPrimary").val() != null && $("#tabDefaultSecondary").val() != null) {
        var data = {
            colorAnsBot: $("#tabDefaultTextBot").val(),
            colorAnsUsr: $("#tabDefaultTextUsr").val(),
            colorPrimary: $("#tabDefaultPrimary").val(),
            colorSecondary: $("#tabDefaultSecondary").val(),
            switchP: switchPDefault,
            switchBG: switchBGDefault,
            typeColor: 0,
            bot_id: $("#txtBotIdBtn").val()
        }
    } else if ($("#tabDefaultTextBot").val() == null && $("#tabDefaultTextUsr").val() == null &&
        $("#tabDefaultPrimary").val() == null && $("#tabDefaultSecondary").val() == null) {

        // $("#hexInputAnsBot").val() != '#000000' && $("#hexInputAnsBot").val().toUpperCase() != settingColorBot
        // && $("#hexInputAnsUs").val() != '#000000' && $("#hexInputAnsUs").val().toUpperCase() != settingColorUsr
        // && $("#hexInputPrimary").val() != '#FFFFFF' && $("#hexInputPrimary").val().toUpperCase() != settingColorPrimary
        // && $("#hexInputSecondary").val() != '#000000' && $("#hexInputSecondary").val().toUpperCase() != settingColorSecondary
        var data = {
            colorAnsBot: $("#hexInputAnsBot").val().toUpperCase(),
            colorAnsUsr: $("#hexInputAnsUs").val().toUpperCase(),
            colorPrimary: $("#hexInputPrimary").val().toUpperCase(),
            colorSecondary: $("#hexInputSecondary").val().toUpperCase(),
            switchP: switchP,
            switchBG: switchBG,
            typeColor: 1,
            bot_id: $("#txtBotIdBtn").val()
        }
    } else {
        Swal.fire({
            title: 'Campos sin completar',
            text: 'Es necesario completar todos los campos para continuar, vuelva a intentarlo',
            icon: 'error',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            confirmButtonText: 'Aceptar',
        });
    }

    console.log(data);

    $.ajax({
        url: 'bots/addBtn',
        method: 'POST',
        data: data,
        headers: {
            "X-CSRFToken": csrf
        },
        beforeSend: function () {
            Swal.fire({
                title: 'Espere',
                text: 'Guardando información',
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
        }
    }).done((result) => {
        Swal.close();

        Swal.fire({
            title: '¡Listo!',
            text: 'Registro exitoso',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                location.reload();
            }
        });
    }).fail((error) => {
        Swal.close();

        Swal.fire(
            'Error al agregar!',
            'Vuelva a intentarlo!',
            'error'
        );
    })
}

// funcion para limpiar los campos al cerrar modal de boton
function clearSettingsBtn() {
    $("#tabDefaultTextBot").val('').trigger('');
    $("#tabDefaultTextUsr").val('').trigger('');
    $("#tabDefaultPrimary").val('').trigger('');
    $("#tabDefaultSecondary").val('').trigger('');
}