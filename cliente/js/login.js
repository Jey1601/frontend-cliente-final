var localstorage=window.localStorage;




async function login(event) {
    
    localStorage.removeItem("ordenEnProceso");
    
    event.preventDefault();

    const emailInput = document.getElementById("loginClientEmail");
    const passwordInput = document.getElementById("loginClientPassword");

    const email = emailInput.value;
    const password = passwordInput.value;

    console.log(email);
    console.log(password);

    try {
        const response = await fetch(`http://localhost:3000/usuarios/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                contrasena: password,
            }),
        });
        const responseData = await response.json();
        if (responseData.usuario) {
            
            localStorage.setItem('usuario', JSON.stringify(responseData.usuario));

            
            window.location.href = "./categories.html";
        } else {
            console.log('Inicio de sesión fallido');
            appendAlert("¡oh!, parece que no recuerdas tus datos", "danger") // Opcional: Manejo de error
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