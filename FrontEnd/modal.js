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
    requeteProjets()
}

// Fonction de fermeture de la modale
function fermerModale() {
    const iconFermer = document.getElementById("icon-fermer")
    iconFermer.addEventListener("click" , closeModal => {
        closeModal.preventDefault()
        modale.setAttribute("style", "display: none;")
        location.reload()
    })
}

// Requête GET des projets par ID
function requeteProjets(works) {
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
        afficherGallery(projetImg, projetIds)
        supprimerProjet()
    }
}

// Fonction d'édition pour la partie supprimer les traveaux
const contentModale = document.getElementById("content-modal")
const boutonAjouter = document.getElementById("btn-modal")
function afficherGallery(projetImg, projetIds) {
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
    const linkIcon = document.createElement("a")
    linkIcon.classList.add("link-icon-trash")
    linkIcon.id = projetIds
    linkIcon.innerHTML = `<i class="fa-solid fa-trash-can"></i>`
    divImage.appendChild(linkIcon)
    // Bouton
    boutonAjouter.setAttribute("style", "display: block;")
    boutonAjouter.innerText = "Ajouter une photo"
}

// Fonction de rafraîchissement de la gallerie
function rafraichirGallerie() {
    contentModale.innerHTML = ""
    requeteProjets()
}

// Fonction de suppression du projet
function supprimerProjet() {
    // Recherche de l'ID du projet à supprimer
    const trashLink = document.querySelectorAll(".link-icon-trash")
    trashLink.forEach(trashLink => {
        trashLink.addEventListener("click", () => {
            const projetId = trashLink.id
            envoyerDelete(projetId)
        })
    })
    // Fonction de Requête DELETE
    function envoyerDelete(projetId) {
        // Pop Up de confirmation de suppression
        let alertSuppression = confirm("Êtes-vous sûr de vouloir supprimer ce projet?")
        console.log(alertSuppression)
        if(alertSuppression) {
            // Préparation des données pour la requête
            const token = localStorage.getItem("token")
            const headerDelete = {
                "Authorization": "Bearer " + token
            }
            // Requête fetch avec method DELETE
            try {
                fetch(`http://localhost:5678/api/works/${projetId}`, {
                    method: "DELETE",
                    headers: headerDelete,
                    body: projetId
                }).then(response => {
                    if (response.ok === false) {
                        alert("Erreur de la requête HTTP")
                    } else {
                        rafraichirGallerie()
                    }
                })
            } catch(error) {
                console.error(error)
                alert("Le projet n'a pas pu être supprimé")
            }
        } 
    }
}
