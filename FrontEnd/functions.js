// Generation dynamique des projets sur la page HTML
export function genererProjets(works) {
    for (let i = 0; i < works.length; i++) {
        const projet = works[i]
        // Recherche de l'emplacement dans le DOM
        const divProjets = document.querySelector(".gallery")
        // Génération de la balise figure
        const figureProjet = document.createElement("figure")
        figureProjet.dataset.id = works[i].id
        // Balise image
        const imageProjet = document.createElement("img")
        imageProjet.src = projet.imageUrl
        imageProjet.alt = projet.title
        // Titre du projet
        const titreProjet = document.createElement("figcaption")
        titreProjet.innerText = projet.title
        // Intégration dans la page HTML
        divProjets.appendChild(figureProjet)
        figureProjet.appendChild(imageProjet)
        figureProjet.appendChild(titreProjet)
    }
}

// Génération et fonction des filtres
export function genererFiltres(works) {
    // Recherche des différentes catégories
    const nomCategorie = new Set()
    works.forEach(categories => {
        nomCategorie.add(categories.category.name)
    })
    const tableCategories = Array.from(nomCategorie)

    // Generation des boutons de filtre
    const divFiltres = document.querySelector(".filtres")
    // Bouton Tous
    let boutons = document.createElement("button")
    boutons.classList.add("btn-filtre")
    boutons.id = "btn-Tous"
    boutons.innerText = "Tous"
    divFiltres.appendChild(boutons)
    // Fonctionnalité d'apparition de tous les projets sur le bouton Tous
    const btnTous = document.getElementById("btn-Tous")
    btnTous.addEventListener("click", () => {
        document.querySelector(".gallery").innerHTML = ""
        genererProjets(works)
    })

    // Boutons catégories
    for (let i = 0; i < tableCategories.length; i++) {
        boutons = document.createElement("button")
        boutons.classList.add("btn-filtre")
        boutons.id = `btn-${tableCategories[i]}`
        boutons.innerText = tableCategories[i]
        divFiltres.appendChild(boutons)
        // Fonctionnalité de tri selon le bouton
        const btnFiltrer = document.getElementById(`btn-${tableCategories[i]}`)
        btnFiltrer.addEventListener("click", () => {
            const nomCategorie = btnFiltrer.innerText
            const projetFiltres = works.filter(work => work.category.name === nomCategorie)
            document.querySelector(".gallery").innerHTML = ""
            genererProjets(projetFiltres)
        })
    }
}

// Fonction Ouverture et fermeture de la modale
export function toggleModale() {
    let modal = null
    const openModal = function (e) {
        e.preventDefault()
        const target = document.querySelector(e.target.getAttribute("href"))
        target.style.display = null
        target.removeAttribute("aria-hidden")
        target.setAttribute("aria-modal", "true")
        modal = target
        modal.addEventListener("click", closeModal)
        modal.querySelector(".js-modal-close").addEventListener("click", closeModal)
        modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
    }

    const closeModal = function (e) {
        if(modal === null) return
        e.preventDefault()
        modal.style.display = "none"
        modal.setAttribute("aria-hidden", "true")
        modal.removeAttribute("aria-modal")
        modal.removeEventListener("click", closeModal)
        modal.querySelector(".js-modal-close").removeEventListener("click", closeModal)
        modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation)
        modal = null
    }

    const stopPropagation = function(e) {
        e.stopPropagation()
    }
    
    document.querySelectorAll(".js-modal").forEach(a => {
        a.addEventListener("click", openModal)
    })
}

// Fonction de génration des projets dans la modale
export function genererProjetsModale(works) {
    for (let i=0; i<works.length; i++) {
        const projetIds = works[i].id
        const projetImg = works[i].imageUrl
        afficherGallery(projetImg, projetIds)
        ecouterPoubelle(projetImg, projetIds)
    }
}

// Fonction d'affichage des projets dans la modale
const contentModale = document.getElementById("content-modal")
const titleModale = document.getElementById("title-modal")
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

// Fonction de suppression du projet
function ecouterPoubelle() {
    // Recherche de l'ID du projet à supprimer
    const trashLink = document.querySelectorAll(".link-icon-trash")
    trashLink.forEach(trashLink => {
        trashLink.addEventListener("click", () => {
            const projetId = trashLink.id
            envoyerDelete(projetId)
        })
    })
}

// Fonction de Requête DELETE des projets
function envoyerDelete(projetId) {
    // Pop Up de confirmation de suppression
    let alertSuppression = confirm("Êtes-vous sûr de vouloir supprimer ce projet?")
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
                    rafraichirModale()
                }
            })
        } catch(error) {
            console.error(error)
            alert("Le projet n'a pas pu être supprimé")
        }
    } 
}

// Fonction de rafraîchissement de la modale
const divProjets = document.querySelector(".gallery")
function rafraichirModale() {
    contentModale.innerHTML = ""
    divProjets.innerHTML = ""
    fetch("http://localhost:5678/api/works")
        .then(response => {
            if (response.ok === false) {
                throw new Error("Erreur de la requête HTTP")
            }
            return response.json()
        })
        .then(works => {
            genererProjetsModale(works)
            genererProjets(works)
        })
}