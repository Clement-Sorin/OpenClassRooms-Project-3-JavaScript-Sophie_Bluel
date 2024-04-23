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
    if (resultEmail) {
        if (divEmail.contains(errorEmail)) {
            divEmail.removeChild(errorEmail)
        }
    } else {
        if (!divEmail.contains(errorEmail)) {
            divEmail.appendChild(errorEmail)
        }
    }
})

// Regex Champ de Password
const champPassword = document.getElementById("password")
const divPassword = document.getElementById("div-password")
const error = document.createElement("p")
error.classList.add("error")

champPassword.addEventListener("change", event => {
    error.innerText = "Le format de saisi du mot de passe est invalide"
    const valeurPassword = event.target.value.trim()
    const regex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{1,}$")
    const resultPassword = regex.test(valeurPassword)
    if (resultPassword) {
        if (divPassword.contains(error)) {
            divPassword.removeChild(error)
        }
    } else {
        if (!divPassword.contains(error)) {
            divPassword.appendChild(error)
        }
    }
})

// Submit du formulaire de Login
const formulaires = document.getElementById("login-form")
formulaires.addEventListener("submit", event => {
    event.preventDefault()
    // Récupération des données du formulaire et implémentation dans un objet JSON
    const objetJsonLogin = {
        email: champEmail.value,
        password: champPassword.value,
    }
    const bodyRequete = JSON.stringify(objetJsonLogin)
    // Verification des données par requête HTTP
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: bodyRequete,
    }).then(response => {
        if (response.ok) {
            if (divPassword.contains(error)) {
                divPassword.removeChild(error)
            }

            return response.json()
        }

        error.innerText = "Le mot de passe ou l'identifiant n'est pas valide"
        if (!divPassword.contains(error)) {
            divPassword.appendChild(error)
        }
    }).then(({token}) => {
        window.localStorage.setItem("token", token)
        window.location.href = "index.html"
    })
})
