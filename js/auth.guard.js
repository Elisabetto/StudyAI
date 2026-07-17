//==========Comprobar sesión=====
document.addEventListener(
    "DOMContentLoaded",
    validarAccesoProtegido
);

window.addEventListener(
    "pageshow",
    validarAccesoProtegido
);

//==============Funciones===============
async function validarAccesoProtegido() {

    const { data, error } =
        await supabaseClient.auth.getSession();

    if (error) {
        console.error(error);

        return;
    }

    if (!data.session) {

        window.location.href = "login.html";
    }
}