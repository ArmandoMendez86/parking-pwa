document.querySelector("#formLogin").addEventListener("submit", async (e)=>{
    e.preventDefault()
    const usuario = document.querySelector("#usuario").value
    const password = document.querySelector("#password").value

    try {
        const respuesta = await fetch("app/controladores/LoginController.php?action=login", {
            method: "POST",
            body: JSON.stringify({usuario, password}),
            headers: { "Content-Type": "application/json" },
          })
        const resultado = await respuesta.json()
        if(resultado.success){
            window.location.href = "./";
            
        }else{
            window.location.href = "login.html";

        }
    } catch (error) {
        console.log("Error en la peticion: " + error)
    }

})