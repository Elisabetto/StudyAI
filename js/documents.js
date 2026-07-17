const modal = document.getElementById("modal-subir");
const botonSubir = document.querySelector(".subir-documento");
const botonCancelar = document.getElementById("cancelar-subida");
const formulario = document.getElementById("form-subir-documento");

const inputTitulo = document.getElementById("titulo-documento");
const inputArchivo = document.getElementById("archivo");

const listaDocumentos = document.querySelector(".lista-documentos");
const buscador = document.getElementById("buscar-documento");

const TAMANO_MAXIMO = 10 * 1024 * 1024;

let documentos = [];

cargarDocumentos();

//==============Eventos================
botonSubir.addEventListener("click", () => {

    modal.classList.add("activo");
});

botonCancelar.addEventListener("click", () => {

    formulario.reset();
    modal.classList.remove("activo");
});

formulario.addEventListener("submit", subirDocumento);

buscador.addEventListener("input", () => {
    const texto = buscador.value.toLowerCase().trim();
    
    const filtrados = documentos.filter(documento =>
        documento.titulo
            .toLowerCase()
            .includes(texto)
    );

    renderizarDocumentos(filtrados);
});

//===============Funciones=============
async function subirDocumento(e){
    e.preventDefault();

    const titulo = inputTitulo.value.trim();

    const archivo = inputArchivo.files[0];

    if(!titulo){
        alert("Introduce un título.");
        return;
    }

    if(!archivo){
        alert("Selecciona un archivo.");
        return;
    }

    if(archivo.type !== "application/pdf"){
        alert("Solo se permiten archivos PDF.");
        return;
    }

    if(archivo.size > TAMANO_MAXIMO){
        alert("El archivo supera los 10MB.");
        return;
    }

    const { data: sessionData } = await supabaseClient.auth.getSession();

    const usuario = sessionData.session.user;

    const nombreLimpio = archivo.name
    .replace(/\s+/g, "_")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

    const nombreArchivo = `${usuario.id}/${Date.now()}_${nombreLimpio}`;

    const { error: errorStorage } = await supabaseClient
        .storage
        .from("documents")
        .upload(nombreArchivo, archivo);

    if(errorStorage){
        alert(errorStorage.message);
        return;
    }

    await guardarDocumento(
        titulo,
        archivo,
        nombreArchivo
    );
}

async function guardarDocumento(titulo, archivo, nombreArchivo){
    const { data: sessionData } = await supabaseClient.auth.getSession();

    const usuario = sessionData.session.user;

    const { error } = await supabaseClient
        .from("documents")
        .insert({
            user_id: usuario.id,
            titulo: titulo,
            nombre_archivo: archivo.name,
            archivo_url: nombreArchivo,
            tipo_archivo: archivo.type,
            tamano: archivo.size
        });

    if(error){
        alert(error.message);
        return;
    }

    formulario.reset();
    modal.classList.remove("activo");
    await cargarDocumentos();
}

async function cargarDocumentos(){
    const { data: sessionData } = await supabaseClient.auth.getSession();

    const usuario = sessionData.session.user;

    const { data, error } = await supabaseClient
        .from("documents")
        .select("*")
        .eq("user_id", usuario.id)
        .order("fecha_subida", { ascending: false });

    if(error){
        console.error(error);
        return;
    }

    documentos = data;
    renderizarDocumentos(documentos);
}

function renderizarDocumentos(lista){
    listaDocumentos.innerHTML = "";

    if(lista.length === 0){
        listaDocumentos.innerHTML =
        "<p>No tienes documentos todavía.</p>";
        return;
    }

    lista.forEach(documento => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "documento";
        tarjeta.innerHTML = `
            <h3>${documento.titulo}</h3>
            <p>${new Date(documento.fecha_subida).toLocaleDateString()}</p>

            <div class="acciones">
                <button class="abrir-documento" data-id="${documento.id}">Abrir</button>
                <button class="eliminar-documento" data-id="${documento.id}">Eliminar</button>
            </div>
        `;

        listaDocumentos.appendChild(tarjeta);
    });

    const botonesAbrir = document.querySelectorAll(".abrir-documento");
    botonesAbrir.forEach(boton => {

    boton.addEventListener("click", () => {
        const id = boton.dataset.id;

        window.location.href = `document.html?id=${id}`;
    });

    });

    const botonesEliminar = document.querySelectorAll(".eliminar-documento");
    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", async () => {
            const id = boton.dataset.id;
            await eliminarDocumento(id);
        });
    });
}

async function eliminarDocumento(id) {
        const { data: documento, error } = await supabaseClient
            .from("documents")
            .select("*")
            .eq("id", id)
            .single();

        if(error){
            alert(error.message);
            return;
        }

        const { error: errorStorage } = await supabaseClient
        .storage
        .from("documents")
        .remove([documento.archivo_url]);

        if (errorStorage) {
            alert(errorStorage.message);
            return;
        }

        const { error: errorDatabase } = await supabaseClient
        .from("documents")
        .delete()
        .eq("id", id);

        if(errorDatabase) {
            alert(errorDatabase.message);
            return;
        }

        await cargarDocumentos();
}