const saludoUsuario = document.getElementById("saludo-usuario");
const listaDocumentos = document.querySelector(".lista-documentos");
const listaEventos = document.getElementById("lista-proximos-eventos");

cargarDashboard();

//==================Funciones=============
async function cargarDashboard(){
    await cargarUsuario();

    await cargarDocumentos();

    await cargarEventos();
}

async function cargarUsuario(){
    const { data: sessionData } =
        await supabaseClient.auth.getSession();

    const usuario = sessionData.session.user;

    const { data } = await supabaseClient

        .from("profiles")

        .select("nombre")

        .eq("id", usuario.id)

        .single();

    saludoUsuario.textContent =
        `Hola, ${data.nombre} 👋`;
}

async function cargarDocumentos(){
    const { data: sessionData } =
        await supabaseClient.auth.getSession();

    const usuario = sessionData.session.user;

    const { data } = await supabaseClient
        .from("documents")
        .select("*")
        .eq("user_id", usuario.id)
        .order("fecha_subida", {
            ascending:false
        })

        .limit(3);

    listaDocumentos.innerHTML = "";

    if(data.length===0){
        listaDocumentos.innerHTML =
            "<p>No tienes documentos todavía.</p>";

        return;
    }

    data.forEach(documento=>{
        const div =
            document.createElement("div");

        div.className = "documento";

        div.innerHTML = `
            <h4>${documento.titulo}</h4>

            <p>
            ${new Date(documento.fecha_subida)
            .toLocaleDateString("es-ES")}
            </p>

            <button
            onclick="window.location.href='document.html?id=${documento.id}'">
            Abrir
            </button>
        `;

        listaDocumentos.appendChild(div);
    });
}

async function cargarEventos(){
    const { data: sessionData } =
        await supabaseClient.auth.getSession();

    const usuario =
        sessionData.session.user;

    const { data } =
        await supabaseClient
        .from("events")
        .select("*")
        .eq("user_id", usuario.id)
        .eq("completado", false)
        .order("fecha")
        .limit(3);

    listaEventos.innerHTML="";

    if(data.length === 0) {
        listaEventos.innerHTML=
        "<p>No tienes eventos próximos.</p>";

        return;
    }

    data.forEach(evento=>{
        const div =
            document.createElement("div");

        div.className = "evento";

        div.innerHTML=`
            <h4>${evento.titulo}</h4>

            <p>
            ${new Date(evento.fecha)
            .toLocaleDateString("es-ES")}

            ${evento.hora || ""}
            </p>
        `;

        listaEventos.appendChild(div);
    });
}