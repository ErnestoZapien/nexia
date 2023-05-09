function agregarCliente() {

    const nombre = $('#nombre').val();
    const direccion = $('#direccion').val();
    const telefono = $('#telefono').val();
    const email = $('#email').val();
    const password = $('#password').val();

    const data = {
        nombre: nombre,
        direccion: direccion,
        telefono: telefono,
        email: email,
        password: password
    }

    $.ajax({
        url: 'clientes/agregar',
        type: 'POST',
        headers: {
            "X-CSRFToken": csrf
        },
        data: data,
    }).done(function (response) {

        console.log(response);

        if (response.error == 1) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El correo electrónico ya está registrado',
            })

            return;

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
                icon: 'success',
                title: 'Registro agregado correctamente'
            }).then((result) => {
                window.location.href = '/clientes';
            })
        }
    })
}

function eliminarCliente(id) {

    // Mostrar alerta de confirmación de sweetalert2
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Sí, eliminar!'
    }).then((result) => {
        if (result.value) {

            // Enviar petición AJAX
            $.ajax({
                url: 'clientes/eliminar?numR=' + id,
                type: 'POST',
                headers: {
                    "X-CSRFToken": csrf
                },
                success: function (result) {
                    Swal.fire(
                        '¡Eliminado!',
                        'El cliente ha sido eliminado.',
                        'success'
                    )
                    setTimeout(function () {
                        location.reload();
                    }, 2000);
                }
            })
        }
    })
}

const obtenerCliente = (id) => {

    $.ajax({
        url: 'clientes/obtenerCliente?numR=' + id,
        type: 'GET',
        headers: {
            "X-CSRFToken": csrf
        }
    }).done(function (response) {

        $('#modalEditarCliente').modal('show');

        console.log(response);

        $('#idEdit').val(response.id);
        $('#nombreEdit').val(response.nombre);
        $('#direccionEdit').val(response.direccion);
        $('#telefonoEdit').val(response.telefono);
        $('#emailEdit').val(response.email);

        if (response.estatus == '1') {
            $('#estatusEdit').val('1');
        } else {
            $('#estatusEdit').val('0');
        }
    });

}

function actualizarCliente() {

    let id = $('#idEdit').val();
    let nombre = $('#nombreEdit').val();
    let direccion = $('#direccionEdit').val();
    let telefono = $('#telefonoEdit').val();
    let email = $('#emailEdit').val();
    let password = $('#passwordEdit').val();
    let estatus = $('#estatusEdit').val();

    var data = {
        id: id,
        nombre: nombre,
        direccion: direccion,
        telefono: telefono,
        email: email,
        password: password,
        estatus: estatus
    }

    $.ajax({
        url: 'clientes/editarCliente',
        type: 'POST',
        headers: {
            "X-CSRFToken": csrf
        },
        data: data
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
            window.location.href = '/clientes';
        })
    }).fail((error) => {

        console.log(error);

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
            // window.location.href = '/clientes';
        })
    });
}

function activarCliente(id) {

    $.ajax({
        url: 'clientes/activarCliente?numR=' + id,
        type: 'POST',
        headers: {
            "X-CSRFToken": csrf
        }
    }).done(function (response) {

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
            title: 'Cliente activado correctamente'
        }).then((result) => {
            window.location.href = '/clientes';
        })
    })
}

function desactivarCliente(id) {
    
        $.ajax({
            url: 'clientes/desactivarCliente?numR=' + id,
            type: 'POST',
            headers: {
                "X-CSRFToken": csrf
            }
        }).done(function (response) {
    
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
                title: 'Cliente desactivado correctamente'
            }).then((result) => {
                window.location.href = '/clientes';
            })
        })
    }