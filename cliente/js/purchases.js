var localstorage = window.localStorage;
var ordenEnProceso = ordenEnProceso = JSON.parse(localstorage.getItem('ordenEnProceso'));
var usuario = JSON.parse(localStorage.getItem('usuario'));

async function fetchProducto(id) {
    try {
        const response = await fetch(`http://localhost:3000/productos/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data.producto;
    } catch (error) {
        console.error('Error fetching company:', error);
        return []; // Retornar un array vacío en caso de error
    }
}


async function cargarProductos() {


    document.getElementById('contenedorProductos').innerHTML = "";

    const productos = ordenEnProceso.productos;


    productos.forEach(async item => {

        const producto = await fetchProducto(item.id);

        console.log(producto);

        document.getElementById('contenedorProductos').innerHTML +=
            `<div class="col-12">

        <div class="productCard">
            <div class="productImage">
                <div class="productImageBackground"></div>
                <img src="${producto.imagen}" alt="">
            </div>
            <div class="productInfo">
                <p>${producto.nombre}</p>
                <p class="info">${producto.descripcion}</p>
                <div class="productOptions">
                    <div class="btnProductLarge" id="subtotal-${producto._id}">${item.cantidad * producto.precio}</div>
                    <i type="button" onclick="disminuirCantidad('${producto._id}')" class="fa-solid fa-circle-minus" style="color: #ff6392;"></i>
                    
                    <input class="productQuantity" type="number" min="0" value="${item.cantidad}" id="quantity-${producto._id}">
                    
                    <i type="button" onclick="aumentarCantidad('${producto._id}')" class="fa-solid fa-circle-plus" style="color: #ff6392;"></i>
                    <button onclick="agregarAOrden('${producto._id}',${producto.precio})" class="btnProductLarge">Pedir</button>
                </div>
                <button type="button"class="btnQuitar" onclick="removerProducto('${producto._id}')" >Quitar</button> 
            </div>

        </div>

    </div>`

    });
}


async function agregarAOrden(id, precio) {


    const cantidad = document.getElementById(`quantity-${id}`).value;



    if (cantidad > 0) {
        const subtotal = cantidad * precio
        document.getElementById(`subtotal-${id}`).innerHTML = "";
        document.getElementById(`subtotal-${id}`).innerHTML = subtotal;

        const productoEncontrado = this.ordenEnProceso.productos.find(producto => producto.id === id);

        if (productoEncontrado) {

            productoEncontrado.cantidad = parseInt(cantidad);
        } else {


            this.ordenEnProceso.productos.push({
                id: id,
                cantidad: parseInt(cantidad),
            });


        }


    } else {

        const productIndex = this.ordenEnProceso.productos.findIndex(producto => producto.id === id);

        if (productIndex !== -1) {
            this.ordenEnProceso.productos.splice(productIndex, 1);
        }

        cargarProductos();
    }

    let cantidadTotal = 0;

    this.ordenEnProceso.productos.forEach(item => {
        cantidadTotal += item.cantidad;
    })

    this.ordenEnProceso.cantidad = cantidadTotal;

    cambiarTotalOrden();

    localstorage.setItem('ordenEnProceso', JSON.stringify(this.ordenEnProceso));






}


function disminuirCantidad(id) {
    let cantidad = parseInt(document.getElementById(`quantity-${id}`).value);

    if (cantidad > 0) {
        cantidad -= 1;
        document.getElementById(`quantity-${id}`).value = cantidad;
    }

}

function aumentarCantidad(id) {
    let cantidad = parseInt(document.getElementById(`quantity-${id}`).value);
    cantidad += 1;
    document.getElementById(`quantity-${id}`).value = cantidad;
}

function cambiarTotalOrden() {
    const productos = this.ordenEnProceso.productos;
    let total = 0;
    let cantidad = 0;
    productos.forEach((producto) => {
        total += (producto.cantidad * producto.precio);
        cantidad += producto.cantidad;
    })

    document.getElementById('totalPurchase').innerHTML = total;
    this.ordenEnProceso.total = total;
    this.ordenEnProceso.cantidad = cantidad;
    localstorage.setItem('ordenEnProceso', JSON.stringify(this.ordenEnProceso));
    habilitarBoton();
}


function removerProducto(id) {
    const index = this.ordenEnProceso.productos.findIndex(producto => producto.id === id);
    this.ordenEnProceso.productos.splice(index, 1);
    localstorage.setItem('ordenEnProceso', JSON.stringify(this.ordenEnProceso));
    cargarProductos();
    cambiarTotalOrden();
    habilitarBoton();
}

function removerTodo() {


    this.ordenEnProceso.productos = [];
    localstorage.setItem('ordenEnProceso', JSON.stringify(this.ordenEnProceso));
    cargarProductos();
    cambiarTotalOrden()
    habilitarBoton();
}


function habilitarBoton() {

    const boton = document.getElementById('btnProceder');
    if (this.ordenEnProceso.cantidad > 0) {
        boton.classList.remove("btn-proceed-unActive");
        boton.addEventListener("click", abrirModalUbicacion);
    } else {
        boton.classList.add("btn-proceed-unActive");
        boton.removeEventListener("click", abrirModalUbicacion);
    }
}


function abrirModalUbicacion() {
    const miModal = new bootstrap.Modal(document.getElementById("ubicationModal"));
    miModal.show();


}



function iniciarMapa() {
    var latitud = 14.084455;
    var longitud = -87.163976;

    var coordenadas = {
        lat: latitud,
        lng: longitud
    };

    generarMapa(coordenadas);
}

function generarMapa(coordenadas) {
    var mapa = new google.maps.Map(document.getElementById('mapa'), {
        zoom: 12,
        center: new google.maps.LatLng(coordenadas.lat, coordenadas.lng)
    });

    var marcador = new google.maps.Marker({
        map: mapa,
        draggable: true,
        position: new google.maps.LatLng(coordenadas.lat, coordenadas.lng)
    });

    marcador.addListener('dragend', function (event) {
        document.getElementById("latitud").value = this.getPosition().lat();
        document.getElementById("longitud").value = this.getPosition().lng();
    });
}


function agregarUbicacion() {
    const latitud = parseFloat(document.getElementById('latitud').value);
    const longitud = parseFloat(document.getElementById('longitud').value);
    const direccion = document.getElementById('ubicationPurchase').value;

    this.ordenEnProceso.latitud = latitud;
    this.ordenEnProceso.longitud = longitud;
    this.ordenEnProceso.ubicacion = direccion;

    localstorage.setItem('ordenEnProceso', JSON.stringify(this.ordenEnProceso));

}

async function agregarOrden() {

    let productos = []
    let producto = {
        _id: {},
        cantidad: 0,
        precio: 0,
    }
    this.ordenEnProceso.productos.forEach((item) => {
        producto._id = {
            "$oid": item.id,
        },
            producto.cantidad = item.cantidad,
            producto.precio = item.precio


        productos.push(producto);
        producto = {
            _id: {},
            cantidad: 0,
            precio: 0,
        }
    })

    this.ordenEnProceso.productos = productos;
    console.log("la orden corregida es" , this.ordenEnProceso)

    try {
        let respuesta = await fetch(`http://localhost:3000/ordenes`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json", // MIME Type
            },
            
            body: JSON.stringify(this.ordenEnProceso)
            // Assuming 'body' is an object you want to send as JSON
        });
        console.log("la orden a guardar es",this.ordenEnProceso)
        if (!respuesta.ok) {

            throw new Error(`HTTP error! Status: ${respuesta.status}`);

        }

        let mensaje = await respuesta.json();
        console.log(mensaje);

        let divMensajes = document.getElementById("mensajes");
        // Do something with 'divMensajes', e.g., divMensajes.textContent = mensaje;

    } catch (error) {
        console.error('Error:', error);
    }

    localStorage.removeItem("ordenEnProceso");

    ordenEnProceso={
        idUsuario:usuario._id,
        idMotorista:usuario._id,
        estado:"pendiente",
        productos:[],
        ubicacion:"",
        total:0,
        cantidad:0,
        latitud:0,
        longitud:0
    };

    localstorage.setItem('ordenEnProceso',JSON.stringify(ordenEnProceso));

    document.getElementById('totalPurchase').innerHTML = 0;
    cargarProductos();
    //window.location.href = "./categories.html";
}


const alertPlaceholder = document.getElementById('liveAlertPlaceholder')

const appendAlert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-success alert-dismissible" role="alert">`,
    `   <div>¡Enhorabuena!, has hecho tu pedido correctamente</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
}

const alertTrigger = document.getElementById('succesAlert')
if (alertTrigger) {
  alertTrigger.addEventListener('click', () => {
    appendAlert('Nice, you triggered this alert message!', 'success')
  })
}


habilitarBoton();
cambiarTotalOrden();
cargarProductos();