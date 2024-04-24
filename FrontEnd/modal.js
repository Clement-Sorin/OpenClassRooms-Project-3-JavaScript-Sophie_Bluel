// Fonction d'ouverture de modale
export function gererModale() {
    fermerModale()
    ouvrirModale()
}

const modale = document.getElementById("modal")
// Fonction Ouverture de la modale
function ouvrirModale() {
    const boutonModifier = document.getElementById("link-modif")
    boutonModifier.addEventListener("click", openModal => {
        openModal.preventDefault
        modale.setAttribute("style", "display: flex;")
    })
}

// Fonction de fermeture de la modale
function fermerModale() {
    const iconFermer = document.getElementById("icon-fermer")
    iconFermer.addEventListener("click" , closeModal => {
        closeModal.preventDefault
        modale.setAttribute("style", "display: none;")
    })
}