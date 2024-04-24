// Fonction d'ouverture/fermeture de modale
export function toggleModale() {
    fermerModale()
    ouvrirModale()
}

const modale = document.getElementById("modal")
const bodyModale = document.getElementById("body-modal")
const titleModale = document.getElementById("title-modal")
// Fonction Ouverture de la modale
function ouvrirModale() {
    const boutonModifier = document.getElementById("link-modif")
    boutonModifier.addEventListener("click", openModal => {
        openModal.preventDefault
        modale.setAttribute("style", "display: flex;")
    })
    projetsID()
}

// Fonction de fermeture de la modale
function fermerModale() {
    const iconFermer = document.getElementById("icon-fermer")
    iconFermer.addEventListener("click" , closeModal => {
        closeModal.preventDefault
        modale.setAttribute("style", "display: none;")
    })
}

// Requête GET des projets par ID
function projetsID(works) {
    fetch("http://localhost:5678/api/works")
    .then(response => {
        if (response.ok === false) {
            throw new Error("Erreur de la requête HTTP")
        }

        return response.json()
    })
    .then(works => {
        rechercherProjets(works)
    })
}

// Fonction de recherche des données des projets
function rechercherProjets(works) {
    for (let i=0; i<works.length; i++) {
        const projetIds = works[i].id
        const projetImg = works[i].imageUrl
        afficherGallery(projetImg)
    }
}

// Fonction d'édition pour la partie supprimer les traveaux
const contentModale = document.getElementById("content-modal")
const boutonAjouter = document.getElementById("btn-modal")
function afficherGallery(projetImg) {
    // Titre
    titleModale.innerText = "Galerie Photo"
    // Images
    const divImage = document.createElement("div")
    divImage.classList.add("div-image-modal")
    const imgProjets = document.createElement("img")
    imgProjets.src = projetImg
    imgProjets.classList.add("img-modal")
    contentModale.appendChild(divImage)
    divImage.appendChild(imgProjets)
    // bouton supprimer sur l'image
    const divIcon = document.createElement("a")
    divIcon.classList.add("link-icon-trash")
    divIcon.innerHTML = `<i class="fa-solid fa-trash-can"></i>`
    divImage.appendChild(divIcon)
    // Bouton
    boutonAjouter.innerText = "Ajouter une photo"
}


