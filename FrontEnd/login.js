// Submit du formulaire de Login
const formulaires = document.getElementById("login-form")
formulaires.addEventListener("submit", (event) => {
    event.preventDefault()
    // Récupération des données du formulaire et implémentation dans un objet JSON
    const objetJsonLogin = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    }
    const bodyRequete = JSON.stringify(objetJsonLogin)
    // Verification des données par requête HTTP
    const response = fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: bodyRequete
    }).then(response => {
        if(response.ok) {
            return response.json()
        } else {
            console.log("Mauvais login")
        }
    }).then(data => {
        const token = data.token
        console.log("Token :" + token)
    })
})