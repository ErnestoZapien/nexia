$(document).ready(function () {
    $("#table-bots").DataTable({
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
        }
    });
});

// get a widget reference
const widget = uploadcare.SingleWidget("[role=uploadcare-uploader]");
var arg;
var arge;
var qna = [];
var i = 0;
var currentTab = 0;

// listen to the "upload completed" event
widget.onUploadComplete(fileInfo => {
    // get a CDN URL from the file info
    arg = fileInfo.cdnUrl;
    console.log(fileInfo.cdnUrl);
});

widget.onUploadComplete(fileInfo => {
    arge = fileInfo.cdnUrl;
})

document.addEventListener("DOMContentLoaded", function (event) {
    showTab(currentTab);
});

const widg = uploadcare.SingleWidget("[id=uploadcare-editar]");

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

$("#multiple-select-field").select2({
    theme: "bootstrap-5",
    width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
    placeholder: $(this).data('placeholder'),
    closeOnSelect: false,
    dropdownParent: $('#multiple-select-field').parent(),
})

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

// Funcion para eliminar ChatBot
function eliminar(id) {
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
            url: 'bots/delete?numE=' + id,
            method: 'POST',
            data: {
                id: id
            },
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
    if ($("#nombre").val() != '' && $("#tema").val() != '' && $("#cliente").val() != '' && $("#descripcion").val() != '' && arg != []) {
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
        console.log(data);
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
        console.log(error)
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

function modalSkill(id) {
    fetch('msg/create?botid=' + id)
        .then(response => response.json())
        .then(data => {
            $("#id_bot").val(data.id);
        }).catch(error => console.error(error))
}

function simulator() {
    var html = '';

    if (qna.length != 0) {
        qna.forEach(q => {
            html += `   <p><span class="text-danger">Q: ${q.question}</span></p>
                        <p><span class="text-primary">A: ${q.answer}</span></p>`;
        });
    } else {
        html = 'No hay preguntas y respuestas aún.'
    }

    document.getElementById('card-simulation').innerHTML = html;
}

function addBot() {

    var lang = $("#multiple-select-field").select2('val').slice();
    var l = lang.join();
    var data = {
        bot_id: $("#id_bot").val(),
        skill: $("#txtConfig").val(),
        lenguage: l,
        answer_ukwn: $("#txtAnsBloc").val(),
        bans: $("#txtBloc").val(),
        conversation: qna
    }

    if (qna.length != 0) {
        Swal.fire({
            title: '¿Quieres hacer una simulación antes de registrar?',
            showDenyButton: true,
            confirmButtonText: 'Si',
            denyButtonText: `No`,
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.close()
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
                            // location.reload();
                        }
                    });
                }).fail(function (error) {
                    Swal.fire(
                        'Error al agregar!',
                        'Vuelva a intentarlo!',
                        'error'
                    )
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
        })
    }
}

function deleteQNA(id) {
    qna.forEach(q => {
        var index = qna.findIndex(x => x.id == q.id);

        if (qna[index].id == id) {
            qna.splice(index, 1)
        }
    });
}

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
    fixStepIndicator(n)
}

function fixStepIndicator(n) {
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) { x[i].className = x[i].className.replace(" active", ""); }
    x[n].className += " active";
}

function nextPrev(n) {
    var x = document.getElementsByClassName("tab");
    // if (n == 1 && !validateForm()) return false;
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