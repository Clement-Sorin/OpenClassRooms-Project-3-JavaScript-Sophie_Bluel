// Vérification si le token d'authentification est présent
export function verifierAuthentification() {
    const tokenLocalStorage = window.localStorage.getItem("token")
    if (tokenLocalStorage) {
        changerBoutonLogout()
        genererBandeauEdit()
        genererBoutonModifier()
        cacherFiltres()
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
    const divEdit = document.getElementById("div-edit-hidden")
    divEdit.id = "div-edit"
}

// Fonction d'apparition du bouton modifier
function genererBoutonModifier() {
    const divPortTitle = document.getElementById("modif-hidden") 
    divPortTitle.id = "modif"
}

// Fonction cacher les filtres
function cacherFiltres() {
    const divFiltres = document.querySelector(".filtres")
    divFiltres.classList.toggle("filtres-hidden")
}
