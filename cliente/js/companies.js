var localstorage=window.localStorage;
var categoriaActual = localStorage.getItem('categoriaActual');
var ordenEnProceso=JSON.parse(localstorage.getItem('ordenEnProceso'));


function actualizarCarrito(){
    

    if(this.ordenEnProceso==null || this.ordenEnProceso==""){
        document.getElementById('cantidadCarrito').innerHTML="";
    document.getElementById('cantidadCarrito').innerHTML+=`<p>0</p>`
    }else{
        document.getElementById('cantidadCarrito').innerHTML="";
    document.getElementById('cantidadCarrito').innerHTML+=`<p>${this.ordenEnProceso.cantidad}</p>`
    }

    
}

async function fetchCategory() {
    try {
        const response = await fetch(`http://localhost:3000/categorias/${categoriaActual}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data.categoria;
    } catch (error) {
        console.error('Error fetching categorias:', error);
        return []; // Retornar un array vacío en caso de error
    }
}

function changeNameCategorie(nombre) {
    const categorieNameElement = document.getElementById('CategorieName');
    categorieNameElement.innerHTML = `<p>${nombre}</p>`;
    console.log("Funcionó");
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

async function renderCompanies() {

    actualizarCarrito();

    try {
        const categoria = await fetchCategory();

        if (categoria && categoria.length > 0) {
            changeNameCategorie(categoria[0].nombre);

            const panelCompaniesElement = document.getElementById('panelCompanies');
            panelCompaniesElement.innerHTML = "";

            categoria[0].empresas.forEach(companie => {
                const companieCard = document.createElement('div');
                companieCard.classList.add('col-6');
                companieCard.innerHTML = `
                    <div class="companieCard" onclick="mostrarProductos('${companie._id}')">
                        <div class="companieImage">
                            <div class="companieImageBackground"></div>
                            <img src="${companie.imagen}" alt="">
                        </div>
                        <div class="companieInfo">
                            <p>${companie.nombre}</p>
                            <div>
                                ${addPuntuation(companie.puntuacion)}
                            </div>
                        </div>
                    </div>
                `;
                panelCompaniesElement.appendChild(companieCard);
            });
        }
    } catch (error) {
        console.error('Error rendering companies:', error);
    }
}

function mostrarProductos(id) {
    localStorage.setItem('empresaActual', id);
    window.location.href = "./companie.html";
}

function abrirCompras(){
    window.location.href = "../cliente/purchases.html";
}

renderCompanies();
