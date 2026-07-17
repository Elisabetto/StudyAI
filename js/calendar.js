const modal = document.getElementById("modal-evento");
const botonCrear = document.querySelector(".crear-evento");
const botonCancelar = document.getElementById("cancelar-evento");

const formulario = document.getElementById("form-evento");

const inputTitulo = document.getElementById("titulo-evento");
const inputDescripcion = document.getElementById("descripcion-evento");
const inputTipo = document.getElementById("tipo-evento");
const inputFecha = document.getElementById("fecha-evento");
const inputHora = document.getElementById("hora-evento");

const listaEventos = document.querySelector(".lista-evento");
const proximosEventos = document.getElementById("proximos-eventos");
const calendarioDiv = document.getElementById("calendario");

//===============Variables==========
let eventos = [];
let calendario;

//===========Inicio========
document.addEventListener( "DOMContentLoaded", iniciarCalendario );

//===============Eventos=============
botonCrear.addEventListener("click", () => {
    modal.classList.add("activo");
});

botonCancelar.addEventListener("click", () => {
    formulario.reset();
    modal.classList.remove("activo");
});

formulario.addEventListener("submit", guardarEvento);

//===========Funciones=============
async function iniciarCalendario() {

    calendario = new FullCalendar.Calendar(calendarioDiv, {

        initialView: "dayGridMonth",
        locale: "es",
        firstDay: 1,

        buttonText: {
            today: "Hoy"
        },

        height: 600
    });

    calendario.render();

    setTimeout(() => {
        calendario.updateSize();
    }, 100);

    await cargarEventos();
}
async function guardarEvento(e){
    e.preventDefault();

    const { data: sessionData } =
        await supabaseClient.auth.getSession();

    const usuario = sessionData.session.user;

    const { error } = await supabaseClient
        .from("events")
        .insert({
            user_id: usuario.id,
            titulo: inputTitulo.value,
            descripcion: inputDescripcion.value,
            tipo: inputTipo.value,
            fecha: inputFecha.value,
            hora: inputHora.value || null
        });

    if(error) {
        alert(error.message);

        return;
    }

    formulario.reset();
    modal.classList.remove("activo");

    await cargarEventos();
}

async function cargarEventos() {
    const { data: sessionData } =
        await supabaseClient.auth.getSession();

    const usuario = sessionData.session.user;

    const { data, error } = await supabaseClient
        .from("events")
        .select("*")
        .eq("user_id", usuario.id)
        .order("fecha", { ascending: true });

    if (error) {
        console.error(error);

        return;
    }

    eventos = data;

    actualizarCalendario();
    renderizarProximosEventos();
    renderizarEventos(eventos);
}

function renderizarProximosEventos(){
    proximosEventos.innerHTML = "";

    const pendientes = eventos
        .filter(evento => !evento.completado)
        .slice(0,5);

    if(pendientes.length === 0){

        proximosEventos.innerHTML =
            "<p>No hay eventos próximos.</p>";

        return;
    }

    pendientes.forEach(evento => {
        const div = document.createElement("div");

        div.className = "evento";
        div.innerHTML = `
            <h4>${evento.titulo}</h4>

            <p>
                ${new Date(evento.fecha)
                    .toLocaleDateString("es-ES")}
                ${evento.hora || ""}
            </p>
        `;

        proximosEventos.appendChild(div);
    });
}

function renderizarEventos(lista) {
    listaEventos.innerHTML = "";

    if (lista.length === 0) {

        listaEventos.innerHTML =
            "<p>No tienes eventos todavía.</p>";

        return;
    }

    lista.forEach(evento => {
        const tarjeta = document.createElement("div");

        tarjeta.className = "evento";

        tarjeta.innerHTML = `
    <h3>${evento.titulo}</h3>

    <p>${evento.descripcion || ""}</p>
    <p><strong>Tipo:</strong> ${evento.tipo}</p>
    <p>${new Date(evento.fecha).toLocaleDateString("es-ES")}</p>
    <p>${evento.hora || ""}</p>
    <p>
        ${
            evento.completado
            ? "✅ Completado"
            : "⏳ Pendiente"
        }
    </p>

    <div class="acciones-evento">
        ${
            !evento.completado
            ? `<button class="completar-evento"
                    data-id="${evento.id}">
                    Completado
               </button>`
            : ""
        }

        <button class="eliminar-evento"
            data-id="${evento.id}">
            Eliminar
        </button>
    </div>
`;

        listaEventos.appendChild(tarjeta);
    });

    const botonesEliminar =
        document.querySelectorAll(".eliminar-evento");

    botonesEliminar.forEach(boton => {

        boton.addEventListener("click", async () => {

            await eliminarEvento(
                boton.dataset.id
            );
        });
    });

    const botonesCompletar =
    document.querySelectorAll(".completar-evento");

botonesCompletar.forEach(boton => {

    boton.addEventListener("click", async () => {

        await completarEvento(
            boton.dataset.id
        );
    });
});
}

async function eliminarEvento(id) {

    const { error } = await supabaseClient
        .from("events")
        .delete()
        .eq("id", id);

    if (error) {
        alert(error.message);

        return;
    }

    await cargarEventos();
}

async function completarEvento(id) {

    const { error } = await supabaseClient
        .from("events")
        .update({
            completado: true
        })
        .eq("id", id);

    if(error){
        alert(error.message);
        
        return;
    }

    await cargarEventos();
}

function actualizarCalendario() {
    if (!calendario) return;

    calendario.removeAllEvents();
    calendario.addEventSource(
        
        eventos.map(evento => ({
            id: evento.id, 
            title: evento.titulo,
            start: evento.fecha,
            allDay: true
        }))
    );
}