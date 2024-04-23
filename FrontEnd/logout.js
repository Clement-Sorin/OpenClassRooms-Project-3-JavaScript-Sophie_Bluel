// Vérification si le token d'authentification est présent
export function verifierAuthentification() {
    const tokenLocalStorage = window.localStorage.getItem("token")
    if (tokenLocalStorage) {
        changerBoutonLogout()
        genererBandeauEdit()
    }
}

// Fonction de changement du bouton Login en Logout si authentifié
function changerBoutonLogout() {
    const logButton = document.getElementById("log")
    logButton.innerText = "logout"
    logButton.setAttribute("href", "")
    logButton.addEventListener("click", () => {
        window.localStorage.removeItem("token")
    })
}

// Fonction d'apparition du bandeau du mode édition
function genererBandeauEdit() {
    const divEdit = document.getElementById("hidden")
    divEdit.id = "div-edit"
}
