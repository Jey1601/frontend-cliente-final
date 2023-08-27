function verificarContrasena() {
    const contrasena = document.getElementById('signUpClientPassword');
    const contrasenaVerificacion = document.getElementById('signUpClientPasswordConfirm');
    const enviar = document.getElementById('registrarse');

    if (contrasena.value !== contrasenaVerificacion.value) {
        contrasena.classList.add('inputInvalid');
        contrasenaVerificacion.classList.add('inputInvalid');
        enviar.classList.add("btn-invalid");
      
        enviar.removeEventListener('click',enviarSolicitud);

    } else {
        contrasena.classList.remove('inputInvalid');
        contrasenaVerificacion.classList.remove('inputInvalid');
        enviar.classList.remove("btn-invalid");
       
        enviar.addEventListener('click',enviarSolicitud);

    }

}


async function enviarSolicitud(event) {
    event.preventDefault();

    const nombre = document.getElementById('signUpClientName').value;
    const apellido = document.getElementById('signUpClientLastName').value;
    const telefono= document.getElementById('signUpClientTelefono').value;
    const email = document.getElementById('signUpClientEmail').value;
    const contrasena = document.getElementById('signUpClientPassword').value;

     // Verificar si hay campos vacíos
     if (nombre === '' || apellido === '' || email === '' || telefono === '' || contrasena === '') {
        appendAlert("Por favor completa todos los campos", "danger");
        return; // Detener el proceso de registro
    }

    const informacion ={
        nombre:nombre, 
        apellido:apellido, 
        telefono: telefono,
        email: email,
        contrasena: contrasena,
        ordenes:[]
        }
    console.log("la información es",informacion)    
    try {
        const response = await fetch(`http://localhost:3000/usuarios`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(informacion),
        });
        const responseData = await response.json();
        if (responseData.usuario) {
            console.log("usuario agregado con exito")
            vaciarInputs();
            appendAlert("¡Gracias por registrarte!", "success")
           
        } else { 
            console.log('solicitud fallido'); // Opcional: Manejo de error
        }
    } catch (error) {
        console.error('Error en la solicitud:', error); // Manejo de errores de red u otros
    }

}

const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
const appendAlert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
}

function vaciarInputs() {
    const inputs = document.querySelectorAll('input'); // Seleccionar todos los inputs

    inputs.forEach(input => {
        if (input.type !== 'submit' && input.type !== 'button') {
            input.value = ''; // Vaciar el valor del input, excepto para botones de envío
        }
    });
}