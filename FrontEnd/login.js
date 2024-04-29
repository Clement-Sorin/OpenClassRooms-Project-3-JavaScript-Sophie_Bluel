// RegEx Champ d'email
const champEmail = document.getElementById("email")
const errorEmail = document.getElementById("email-error")
const champPassword = document.getElementById("password")
const errorPassword = document.getElementById("password-error")
const formulaires = document.getElementById("login-form")
const loginError = document.getElementById("response-error")
const requestError = document.getElementById("request-error")

champEmail.addEventListener("change", event => {
    const valeurEmail = event.target.value.trim()
    const regex = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+")
    const resultEmail = regex.test(valeurEmail)
    if (!resultEmail) {errorEmail.setAttribute("style", "display: block;")}
    else {errorEmail.setAttribute("style", "display: none;")}
})

// Regex Champ de Password
champPassword.addEventListener("change", event => {
    const valeurPassword = event.target.value.trim()
    const regex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{1,}$")
    const resultPassword = regex.test(valeurPassword)
    if (!resultPassword) {errorPassword.setAttribute("style", "display: block;")}
    else {errorPassword.setAttribute("style", "display: none;")}
})

// Submit du formulaire de Login
formulaires.addEventListener("submit", event => {
    event.preventDefault()
    const objetJsonLogin = {
        email: champEmail.value,
        password: champPassword.value,
    }
    const bodyRequete = JSON.stringify(objetJsonLogin)
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: bodyRequete,
    }).then(response => {
        if (response.ok) {
            loginError.setAttribute("style", "display:none;")
            return response.json()
        } else {
            loginError.setAttribute("style", "display:block;")
        }
    }).then(({token}) => {
        window.localStorage.setItem("token", token)
        window.location.href = "index.html"
    }).catch(() => {
        requestError.setAttribute("style", "display: block;")
    })
})
