var usuario= JSON.parse(localStorage.getItem('usuario'));; 
var categoriaActual = '';
var localstorage=window.localStorage;

var ordenEnProceso={
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

if (localStorage.getItem('usuario') == null) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
} else {
    usuario = JSON.parse(localStorage.getItem('usuario'));
}

if(localstorage.getItem('ordenEnProceso')==null){
    localstorage.setItem('ordenEnProceso',JSON.stringify(ordenEnProceso));
}else{
    ordenEnProceso=JSON.parse(localstorage.getItem('ordenEnProceso'));
}
function actualizarCarrito(){
    

    if(this.ordenEnProceso==null || this.ordenEnProceso=="" || this.ordenEnProceso.productos==null){
        document.getElementById('cantidadCarrito').innerHTML="";
    document.getElementById('cantidadCarrito').innerHTML+=`<p>0</p>`
    }else{
        document.getElementById('cantidadCarrito').innerHTML="";
    document.getElementById('cantidadCarrito').innerHTML+=`<p>${this.ordenEnProceso.cantidad}</p>`
    }

    
}



async function fetchCategorias() {
    try {
        const response = await fetch(`http://localhost:3000/categorias`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data.categorias;
    } catch (error) {
        console.error('Error fetching categorias:', error);
        return []; // Retornar un array vacío en caso de error
    }
}

async function renderizarCategorias() {
    actualizarCarrito();
    try {
        const categorias = await fetchCategorias();

        const palabras = usuario.nombre.split(" ");
        const primerNombre = palabras[0];

        const welcomeCategories = document.getElementById('welcomeCategories');
        const containerCategories = document.getElementById('containerCategories');

        welcomeCategories.innerHTML = `
            <p>¡Hola ${primerNombre}!</p>
            <p>¿Qué te llevamos hoy?</p>
        `;

        containerCategories.innerHTML = `
            <div class="row sloganCategories">
                <div class="col">
                    <p>¡Aquí encontrarás todo lo que quieras!</p>
                </div>
            </div>
        `;

        const categoriesHTML = await createCategories(categorias);
        containerCategories.innerHTML += categoriesHTML;
    } catch (error) {
        console.error('Error rendering categorias:', error);
    }
}

function createCategories(categorias){
    let re = '<div id="Panel" class="row">';

    categorias.forEach(function(categoria) {
        re += `
            <div class="col-6">
                <div class="categorieCard" onclick="abrirCategoria('${categoria._id}')">
                    <div class="categorieImage">
                        <div class="categorieImageBackground"></div>
                        <img src="${categoria.imagen}" alt="">
                    </div>
                    <p>${categoria.nombre}</p>
                </div>
            </div>`;
    });

    re += '</div>';

    return re;
}


function abrirCategoria(_id) {

    console.log("hola");
    localStorage.setItem('categoriaActual',(_id));  
    window.location.href = "./companies.html";
}

function abrirCompras(){
    window.location.href = "../cliente/purchases.html";
}




renderizarCategorias();
