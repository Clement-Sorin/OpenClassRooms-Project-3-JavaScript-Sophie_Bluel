const inputEmail = document.getElementById("email")
const errorEmail = document.getElementById("email-error")
const inputPassword = document.getElementById("password")
const errorPassword = document.getElementById("password-error")
const forms = document.getElementById("login-form")
const loginError = document.getElementById("response-error")
const requestError = document.getElementById("request-error")

// RegEx on email input
inputEmail.addEventListener("change", event => {
    const emailValue = event.target.value.trim()
    const regex = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+")
    const resultEmail = regex.test(emailValue)
    if (!resultEmail) {errorEmail.setAttribute("style", "display: block;")}
    else {errorEmail.setAttribute("style", "display: none;")}
})

// Regex on password input
inputPassword.addEventListener("change", event => {
    const passwordValue = event.target.value.trim()
    const regex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{1,}$")
    const resultPassword = regex.test(passwordValue)
    if (!resultPassword) {errorPassword.setAttribute("style", "display: block;")}
    else {errorPassword.setAttribute("style", "display: none;")}
})

// Submit login form
forms.addEventListener("submit", event => {
    event.preventDefault()
    const objectJsonLogin = {
        email: inputEmail.value,
        password: inputPassword.value,
    }
    const bodyRequete = JSON.stringify(objectJsonLogin)
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
        window.location.href = "../../index.html"
    }).catch(() => {
        console.error("Connexion impossible")
    })
})
