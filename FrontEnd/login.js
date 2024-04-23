// RegEx Champ d'email
const champEmail = document.getElementById("email")
const divEmail = document.getElementById("div-email")
const errorEmail = document.createElement("p")
errorEmail.classList.add("error")
errorEmail.innerText = "Le format de saisi d'email est invalide"

champEmail.addEventListener("change", event => {
    const valeurEmail = event.target.value.trim()
    const regex = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+")
    const resultEmail = regex.test(valeurEmail)
    switch (resultEmail) {
    case true:
        if (divEmail.contains(errorEmail)) {
            divEmail.removeChild(errorEmail)
        }

        break
    case false:
        if (!divEmail.contains(errorEmail)) {
            divEmail.appendChild(errorEmail)
        }

        break
    default:

        break
    }
})

// Regex Champ de Password
const champPassword = document.getElementById("password")
const divPassword = document.getElementById("div-password")
const errorPassword = document.createElement("p")
errorPassword.classList.add("error")
errorPassword.innerText = "Le format de saisi du mot de passe est invalide"

champPassword.addEventListener("input", event => {
    const valeurPassword = event.target.value.trim()
    const regex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{1,}$")
    const resultPassword = regex.test(valeurPassword)
    switch (resultPassword) {
    case true:
        if (divPassword.contains(errorPassword)) {
            divPassword.removeChild(errorPassword)
        }

        break
    case false:
        if (!divPassword.contains(errorPassword)) {
            divPassword.appendChild(errorPassword)
        }

        break
    default:

        break
    }
})

// Submit du formulaire de Login
const formulaires = document.getElementById("login-form")
formulaires.addEventListener("submit", event => {
    event.preventDefault()
    // Récupération des données du formulaire et implémentation dans un objet JSON
    const objetJsonLogin = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
    }
    const bodyRequete = JSON.stringify(objetJsonLogin)
    // Verification des données par requête HTTP
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: bodyRequete,
    }).then(response => {
        if (response.ok) {
            return response.json()
        } else {
            console.log("Mauvais login")
        }
    }).then(({token}) => {
        console.log("Token :" + token)
    })
})
