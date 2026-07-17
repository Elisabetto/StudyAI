const formularioAuth = document.querySelector(".auth-formulario")
const botonCerrarSesion = document.querySelector(".cerrar-sesion");

//=============Inicio==============
if (window.location.pathname.includes("register.html") && formularioAuth) {

    formularioAuth.addEventListener(
        "submit",
        registrarUsuario
    );

}

if (window.location.pathname.includes("login.html") && formularioAuth) {

    formularioAuth.addEventListener(
        "submit",
        iniciarSesion
    );
}

if (botonCerrarSesion) {

    botonCerrarSesion.addEventListener(
        "click",
        cerrarSesion
    );
}

//==========Funciones=============
async function registrarUsuario(e) {
    e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const contrasena = document.getElementById("contrasena").value;
        const confirmarContrasena = document.getElementById("confirmar-contrasena").value;

        if(contrasena !== confirmarContrasena) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        const { error } = await supabaseClient.auth.signUp({
            email: correo,
            password: contrasena, 
            options: {
                data: {
                    nombre:nombre
                }
            }
        });

        if (error) {
            alert(error.message);
            return;
        }
        alert("Cuenta creada correctamente.");

        window.location.href = "login.html";
}

async function iniciarSesion(e) {
    e.preventDefault();

    const correo = document.getElementById("correo").value.trim();
    const contrasena = document.getElementById("contrasena").value;

    const { error } = await supabaseClient.auth.signInWithPassword({
            email: correo,
            password: contrasena
        });
        
        if (error) {
            alert(error.message);
            return;
        }
        alert("¡Bienvenido!");

        window.location.href = "dashboard.html";
}

async function cerrarSesion(e) {
    e.preventDefault();
    
    const { error } = await supabaseClient.auth.signOut();

        if (error) {
            alert(error.message);
            return;
        }
        window.location.href = "index.html";
}