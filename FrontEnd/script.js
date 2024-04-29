const divProjets = document.querySelector(".gallery")
const divFiltres = document.querySelector(".filtres")
const logButton = document.getElementById("log")
const token = window.localStorage.getItem("token")
const divEdit = document.getElementById("div-edit-hidden")
const divPortTitle = document.getElementById("modif-hidden")
const modal = document.getElementById("modal")
const linkOpenModal = document.getElementById("link-modif")
const linkCloseModal = document.getElementById("icon-fermer")

// Requête des données depuis l'API
fetch("http://localhost:5678/api/works")
    .then(response => {
        if (response.ok === false) {
            throw new Error("Erreur de la requête HTTP")
        }

        return response.json()
    })
    .then(works => {
        // Générer les filtres dans le DOM
        const nomCategorie = new Set()
        works.forEach(categories => {
            nomCategorie.add(categories.category.name)
        })
        const tableCategories = Array.from(nomCategorie)
        let filtreHTML = ""
        filtreHTML = `<button id="${tableCategories}" class="btn-filtre">Tous</button>`
        tableCategories.forEach(filtre => {
            filtreHTML += `
            <button id="${filtre}" class="btn-filtre">${filtre}</button>
            `
        })
        divFiltres.innerHTML = filtreHTML

        // Fonctionnalité des filtres
        const btnFiltres = document.querySelectorAll(".btn-filtre")
        btnFiltres.forEach(filtre => {
            filtre.addEventListener("click", () => {
                btnFiltres.forEach(btn => {
                    btn.classList.remove("filter-selected")
                })
                filtre.classList.add("filter-selected")
                const id = filtre.id
                const categories = id.split(",")
                const projetFiltres = works.filter(work => categories.includes(work.category.name))
                let projetFiltresHTML = ""
                projetFiltres.forEach(projet => {
                    projetFiltresHTML += `
                    <figure data-id="${projet.id}">
                        <img src="${projet.imageUrl}" alt="${projet.title}">
                        <figcaption>${projet.title}</figcaption>
                    </figure>
                    `
                })
                divProjets.innerHTML = projetFiltresHTML
            })
        })
        // Selection du filtre "tous" en premier
        for(let i=0; i<btnFiltres.length; i++) {
            btnFiltres[i].click()
            break
        }

        // modale
        genererProjetsModale(works)
        openAjoutPhoto()
    })

// Verification de l'authentification
if (token) {
    logButton.innerHTML = `<a href="" id="log">logout</a>`
    logButton.addEventListener("click", () => {
        window.localStorage.removeItem("token")
    })
    divEdit.id = "div-edit"
    divPortTitle.id = "modif"
    divFiltres.classList.toggle("filtres-hidden")
}

// Ouverture et fermeture de la modale
linkOpenModal.addEventListener("click", () => {modal.showModal()})
linkCloseModal.addEventListener("click", () => {modal.close()})
window.addEventListener("click", event => {
    if(modal.open) {
        if(event.target === modal) {modal.close()}
    }
})

function genererProjetsModale(works) {
    for (let i=0; i<works.length; i++) {
        const projetIds = works[i].id
        const projetImg = works[i].imageUrl
        afficherGallery(projetImg, projetIds)
        ecouterPoubelle(projetImg, projetIds)
    }
}

// Fonction d'affichage des projets dans la modale
const contentModale = document.getElementById("content-modal")
const bodyModal = document.getElementById("body-modal")
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

// Fonction d'ouverture de la modale partie 2 (Ajout Photo)
export function openAjoutPhoto() {
    boutonAjouter.addEventListener("click", (e) => {
        e.preventDefault()
        bodyModal.innerHTML= ""
        afficherAjoutPhoto()
    })
}

// Fonction d'ajout du contenu sur la partie Ajout Photo de la modale
export function afficherAjoutPhoto() {
    titleModale.innerText = "Ajout photo"
    // Icon Retour
    const divIconRetour = document.getElementById("div-icon-fermer")
    divIconRetour.innerHTML += `<a id="icon-retour"><i class="fa-solid fa-arrow-left"></i></a>`
    divIconRetour.setAttribute("style","flex-direction: row-reverse; justify-content: space-between;")
    retournerModaleGallerie()
    // Form
    const formAjout = document.createElement("form")
    formAjout.id = "form-ajout-photo"
    bodyModal.appendChild(formAjout)
    // Input Ajouter photo
    const divAjouterPhoto = document.createElement("div")
    divAjouterPhoto.id = "div-ajouter-photo"
    formAjout.appendChild(divAjouterPhoto)
    divAjouterPhoto.innerHTML = `<i class="fa-regular fa-image"></i>`
    divAjouterPhoto.innerHTML += `<button id="btn-input-file"><label for="file-input" class="custom-file-input">+ Ajouter Photo</label><input type="file" id="file-input" required></button>`
    divAjouterPhoto.innerHTML += `<p>jpg, png: 4mo max</p>`
    // Input titre
    const divTitreAjouterPhoto = document.createElement("div")
    divTitreAjouterPhoto.id = "div-titre-ajouter-photo"
    formAjout.appendChild(divTitreAjouterPhoto)
    divTitreAjouterPhoto.innerHTML = `<label for="input-titre-ajouter-photo">Titre</label>`
    divTitreAjouterPhoto.innerHTML += `<input type="text" id="input-titre-ajouter-photo" name="title" required>`
    // Input catégorie
    const divCategorieAjouterPhoto = document.createElement("div")
    divCategorieAjouterPhoto.id = "div-categorie-ajouter-photo"
    formAjout.appendChild(divCategorieAjouterPhoto)
    divCategorieAjouterPhoto.innerHTML = `<label for="categorie-ajouter-photo">Catégorie</label>`
    divCategorieAjouterPhoto.innerHTML += `<select name="category" id="input-categorie-ajouter-photo" required></select>`
    const selectCategories = document.getElementById("input-categorie-ajouter-photo")
    selectCategories.innerHTML += `<option value="" disabled selected style="display: none;"></option>`
    fetch("http://localhost:5678/api/categories")
    .then(response => {
        if (response.ok === false) {
            throw new Error("Erreur de la requête HTTP")
        }
        return response.json()
    })
    .then(data => {
        data.forEach(objet => {
            const id = objet.id
            const name = objet.name
            selectCategories.innerHTML += `<option value="${id}">${name}</option>`
        })
    })
    // Button Submit
    const divBoutonAjouterPhoto = document.createElement("div")
    divBoutonAjouterPhoto.id = "div-bouton-ajouter-photo"
    formAjout.appendChild(divBoutonAjouterPhoto)
    divBoutonAjouterPhoto.innerHTML = `<button type="submit" id="btn-valider-ajouter-photo">Valider</button>`
}

function retournerModaleGallerie() {
    const boutonRetour = document.getElementById("icon-retour")
    boutonRetour.addEventListener("click", () => {
        bodyModal.innerHTML= ""
    })
}