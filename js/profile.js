const nombreUsuario = document.getElementById("nombre-usuario");
const correoUsuario = document.getElementById("correo-usuario");
const botonEditar = document.getElementById("editar-nombre");

const modalNombre = document.getElementById("modal-nombre");
const formularioNombre = document.getElementById("form-nombre");
const inputNombre = document.getElementById("nuevo-nombre");
const cancelarNombre = document.getElementById("cancelar-nombre");
const botonContrasena = document.getElementById("cambiar-contrasena");

const modalContrasena = document.getElementById("modal-contrasena");
const formularioContrasena = document.getElementById("form-contrasena");
const inputContrasena = document.getElementById("nueva-contrasena");
const inputConfirmar = document.getElementById("confirmar-contrasena");
const cancelarContrasena = document.getElementById("cancelar-contrasena");

cargarPerfil();

//====================Eventos=============
botonEditar.addEventListener("click", () => {

    inputNombre.value = nombreUsuario.textContent;
    modalNombre.classList.add("activo");
});

cancelarNombre.addEventListener("click", () => {

    formularioNombre.reset();
    modalNombre.classList.remove("activo");
});

formularioNombre.addEventListener("submit", editarNombre
);

botonContrasena.addEventListener("click", () => {
    modalContrasena.classList.add("activo");
});

cancelarContrasena.addEventListener("click", () => {

    formularioContrasena.reset();
    modalContrasena.classList.remove("activo");
});

formularioContrasena.addEventListener("submit", cambiarContrasena
);

//==================Funciones==============
async function cargarPerfil() {
    const { data: sessionData } =
        await supabaseClient.auth.getSession();

    const usuario = sessionData.session.user;

    correoUsuario.textContent = usuario.email;

    const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", usuario.id)
    .single();

    if (error) {
        console.error(error);
        return;
    }

    nombreUsuario.textContent = data.nombre;
}


async function editarNombre(e){
    e.preventDefault();

    const nuevoNombre =
        inputNombre.value.trim();

    if(!nuevoNombre)return;

    const { data: sessionData } =
        await supabaseClient.auth.getSession();

    const usuario = sessionData.session.user;

    const { error } = await supabaseClient
        .from("profiles")
        .update({
            nombre: nuevoNombre
        })
        .eq("id", usuario.id);

    if (error) {
        alert(error.message);
        return;
    }

    nombreUsuario.textContent = nuevoNombre;
    formularioNombre.reset();

    modalNombre.classList.remove("activo");
}


async function cambiarContrasena(e){
    e.preventDefault();

    if(inputContrasena.value !== inputConfirmar.value){
        alert("Las contraseñas no coinciden.");
        return;
    }

    const { error } =
        await supabaseClient.auth.updateUser({
            password: inputContrasena.value
        });

    if(error){
        alert(error.message);
        return;
    }

    formularioContrasena.reset();

    modalContrasena.classList.remove("activo");

    alert("Contraseña actualizada correctamente.");
}