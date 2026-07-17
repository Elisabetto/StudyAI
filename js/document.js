const tituloDocumento = document.getElementById("titulo-documento");
const fechaSubida = document.getElementById("fecha-subida");
const ultimaModificacion = document.getElementById("ultima-modificacion");
const visorPDF = document.getElementById("visor-pdf");
const textoResumen = document.getElementById("texto-resumen");
const botonResumen = document.getElementById("generar-resumen");
const contenidoTest = document.getElementById("contenido-test");
const botonTest = document.getElementById("generar-test");
const botonRegenerarTest = document.getElementById("regenerar-test");

//===============Variables============
let documentoActual = null;
let textoDocumento = "";

const parametros = new URLSearchParams(window.location.search);
const documentoId = parametros.get("id");

//============configuración=================
pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://unpkg.com/pdfjs-dist@3.11.174/legacy/build/pdf.worker.min.js";

//======Inicio=======
cargarDocumento();

//=============Eventos===========
botonResumen.addEventListener("click", generarResumen);

botonTest.addEventListener("click", generarTest);

botonRegenerarTest.addEventListener("click", regenerarTest);

//==========Funciones============
async function cargarDocumento(){

    if(!documentoId){
        alert("Documento no encontrado.");

        window.location.href = "documents.html";
        return;
    }

    const { data, error } = await supabaseClient
        .from("documents")
        .select("*")
        .eq("id", documentoId)
        .single();

    if(error){
        alert(error.message);
        return;
    }

    documentoActual = data;

    mostrarDocumento();
}

async function mostrarDocumento(){
    tituloDocumento.textContent = documentoActual.titulo;

    fechaSubida.textContent =
        "Subido el: " +
        new Date(documentoActual.fecha_subida).toLocaleDateString();

    ultimaModificacion.textContent =
        "Última modificación: " +
        new Date(documentoActual.fecha_subida).toLocaleDateString();

    const { data, error } = await supabaseClient.storage
        .from("documents")

        .createSignedUrl(
            documentoActual.archivo_url,
            3600
        );

    if(error){
        alert(error.message);
        return;
    }

    visorPDF.src = data.signedUrl;

    textoDocumento = await extraerTextoPDF(data.signedUrl);
}

async function extraerTextoPDF(url) {
    let textoCompleto = "";

    const pdf = await pdfjsLib.getDocument(url).promise;

    for (let pagina = 1; pagina <= pdf.numPages; pagina++) {
        const page = await pdf.getPage(pagina);

        const contenido = await page.getTextContent();

        const textoPagina = contenido.items
            .map(item => item.str)
            .join(" ");

        textoCompleto += textoPagina + "\n\n";
    }

    return textoCompleto;
}



async function generarResumen() {
    if (!textoDocumento) {
        alert("No se ha podido leer el documento.");
        return;
    }

    if (documentoActual.resumen) {
    textoResumen.textContent = documentoActual.resumen;
    return;
}

    textoResumen.textContent = "Generando resumen...";

    const { data, error } = await supabaseClient.functions.invoke("ai", {
        body: {
            accion: "resumen",
            texto: textoDocumento
        }
    });

    if (error) {
        textoResumen.textContent = "Ha ocurrido un error.";
        console.error(error);
        return;
    }

    await supabaseClient
    .from("documents")
    .update({
        resumen: data.respuesta
    })
    .eq("id", documentoActual.id);

documentoActual.resumen = data.respuesta;

textoResumen.textContent = data.respuesta;
}



async function generarTest() {

    if (!textoDocumento) {
        alert("No se ha podido leer el documento.");
        return;
    }

    if (documentoActual.test) {
        contenidoTest.innerHTML =
            documentoActual.test.replace(/\n/g, "<br>");
        return;
    }

    contenidoTest.textContent = "Generando test...";

    const { data, error } = await supabaseClient.functions.invoke("ai", {
        body: {
            accion: "test",
            texto: textoDocumento
        }
    });

    if (error) {
        contenidoTest.textContent = "Ha ocurrido un error.";
        console.error(error);
        return;
    }

    await supabaseClient
    .from("documents")
    .update({
        test: data.respuesta
    })
    .eq("id", documentoActual.id);

documentoActual.test = data.respuesta;

contenidoTest.innerHTML =
    data.respuesta.replace(/\n/g, "<br>");

}

async function regenerarTest() {
    documentoActual.test = null;

    await supabaseClient
        .from("documents")
        .update({
            test: null
        })
        .eq("id", documentoActual.id);

    await generarTest();
}