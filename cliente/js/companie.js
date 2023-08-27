var localstorage=window.localStorage;
var empresaActual = localStorage.getItem('empresaActual');
var usuario= JSON.parse(localstorage.getItem('usuario'));
var ordenEnProceso=JSON.parse(localstorage.getItem('ordenEnProceso'));


async function fetchCompanie() {
    try {
        const response = await fetch(`http://localhost:3000/empresas/${empresaActual}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data.empresa;
    } catch (error) {
        console.error('Error fetching company:', error);
        return []; // Retornar un array vacío en caso de error
    }
}

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



async function fetchProductos() {
    try {
        const response = await fetch(`http://localhost:3000/empresas/${empresaActual}/productos`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data.detalleProductos[0].detalleProductos;
    } catch (error) {
        console.error('Error fetching products:', error);
        return []; // Retornar un array vacío en caso de error
    }
}

function addPuntuation(puntuacion) {
    let re = '';

    for (let i = 1; i <= puntuacion; i++) {
        re += ' <i class="fa-solid fa-star" style="color: #ffea00;"></i>';
    }
    for (let j = 5; j > puntuacion; j--) {
        re += ' <i class="fa-solid fa-star" style="color: gray;"></i>';
    }

    return re;
}

function renderProducts(productos) {

    actualizarCarrito();

    let re = '';

    productos.forEach(function (producto) {


        const productoEncontrado = this.ordenEnProceso.productos.find(item => item.id === producto._id);
        let cantidad=0;
        let subtotal=producto.precio;
        if (productoEncontrado) {
          subtotal=productoEncontrado.cantidad*producto.precio;  
          cantidad=productoEncontrado.cantidad;
        } 

        re += `
            <div class="col-12">
                <div class="productCard">
                    <div class="productImage">
                        <div class="productImageBackground"></div>
                       
                        <img src="${producto.imagen}" alt="">
                        
                    </div>
                    <div class="productInfo">
                        <p>${producto.nombre}</p>
                        <p class="info">${producto.descripcion}</p>
                        <div class="productOptions">
                            <div class="btnProductLarge" id="subtotal-${producto._id}">${subtotal}</div>
                            <i type="button"  onclick="disminuirCantidad('${producto._id}')" class="fa-solid fa-circle-minus" style="color: #ff6392;"></i>
                            <input class="productQuantity" type="number" min="0" value="${cantidad}" id="quantity-${producto._id}">
                            <i type="button" onclick="aumentarCantidad('${producto._id}')" class="fa-solid fa-circle-plus" style="color: #ff6392;"></i>
                            <button class="btnProductLarge" onclick="agregarAOrden('${producto._id}', ${producto.precio})">Pedir</button>
                        </div>
                    </div>
                </div>
            </div>`;
    });

    return re;
}

async function renderCompanie() {
    try {
        const empresa = await fetchCompanie();

        if (empresa) {
            const companieNameElement = document.getElementById('CompanieName');
            companieNameElement.innerHTML = `<p>${empresa.nombre}</p>`;

            const inicialCompanieInfoElement = document.getElementById('inicialCompanieInfo');
            inicialCompanieInfoElement.innerHTML = `
                <div class="col-3">
                    <img id="imgActualCompanie" src="${empresa.imagen}" alt="">
                </div>
                <div class="col-9">
                    <p class="info">${empresa.descripcion}</p>
                    <div>${addPuntuation(empresa.puntuacion)}</div>
                </div>`;

            const productos = await fetchProductos();
            const panelProductsElement = document.getElementById('panelProducts');
            panelProductsElement.innerHTML = renderProducts(productos,);
        }
    } catch (error) {
        console.error('Error rendering company:', error);
    }
}

function abrirCompras() {
    window.location.href = "../cliente/purchases.html";
}


async function agregarAOrden(id,precio){
    
    
    const cantidad = document.getElementById(`quantity-${id}`).value;
    
    
    
    
    if(cantidad>0){

        const subtotal = cantidad*precio
    document.getElementById(`subtotal-${id}`).innerHTML="";
    document.getElementById(`subtotal-${id}`).innerHTML=subtotal;

        const productoEncontrado = this.ordenEnProceso.productos.find(producto => producto.id === id);
        
        if (productoEncontrado) {
        
        productoEncontrado.cantidad=parseInt(cantidad);
       

        } else {
        
        this.ordenEnProceso.productos.push({
            id:id,
            cantidad:parseInt(cantidad),
            precio:precio,
            
        });    

        }

    
    
    }else{

        const productIndex = this.ordenEnProceso.productos.findIndex(producto => producto.id === id);

        if (productIndex !== -1) {
            this.ordenEnProceso.productos.splice(productIndex, 1);
        }

    }

    
    actualizarCarrito();

    localstorage.setItem('ordenEnProceso',JSON.stringify(this.ordenEnProceso));
    
    
}

function actualizarCarrito(){

    let cantidad=0;
    
        
 
        if(this.ordenEnProceso==null || this.ordenEnProceso=="" || this.ordenEnProceso.productos==null){
            document.getElementById('cantidadCarrito').innerHTML="";
        document.getElementById('cantidadCarrito').innerHTML+=`<p>0</p>`
        }else{

            this.ordenEnProceso.productos.forEach(item=>{
                cantidad+=item.cantidad;
            })
        
            document.getElementById('cantidadCarrito').innerHTML="";
            document.getElementById('cantidadCarrito').innerHTML+=`<p>${cantidad}</p>`
            this.ordenEnProceso.cantidad= cantidad;

            
        }
    
}

function disminuirCantidad(id){
    let cantidad=parseInt(document.getElementById(`quantity-${id}`).value);

    if(cantidad>0){
        cantidad-=1;
        document.getElementById(`quantity-${id}`).value=cantidad;
    }
    
}

function aumentarCantidad(id){
    let cantidad=parseInt(document.getElementById(`quantity-${id}`).value);
    cantidad+=1;
    document.getElementById(`quantity-${id}`).value=cantidad;
}



renderCompanie();
