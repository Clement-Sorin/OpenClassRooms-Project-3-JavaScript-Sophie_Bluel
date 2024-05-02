const divProjets = document.querySelector(".gallery")
const divFiltres = document.querySelector(".filtres")
const logButton = document.getElementById("log")
const token = window.localStorage.getItem("token")
const headerFetch = {
    "Authorization": "Bearer " + token,
    "Accept": "application/json"
}
const divEdit = document.getElementById("div-edit-hidden")
const divPortTitle = document.getElementById("modif-hidden")
const modal = document.getElementById("modal")
const linkOpenModal = document.getElementById("link-modif")
const linkCloseModal = document.querySelectorAll(".icon-fermer")
const linkBack = document.getElementById("icon-retour")
const modalPartOne = document.getElementById("modal-part-1")
const modalPartTwo = document.getElementById("modal-part-2")
const contentModale = document.getElementById("gallery-modal")
const boutonAjouter = document.getElementById("btn-ajouter")
const formProjets = document.getElementById("form-ajout-photo")
const inputFile = document.getElementById("file-input")
const errorFileSize = document.getElementById("file-size-error")
const divAjoutPhoto = document.getElementById("div-ajouter-photo")
const divApercuPhoto = document.getElementById("apecu-photo")
const inputTitre = document.getElementById("input-titre-ajouter-photo")
const selectCategory = document.getElementById("input-categorie-ajouter-photo")
const btnValiderAjouterPhoto = document.getElementById("btn-valider-ajouter-photo")
const fakeBtn = document.getElementById("fake-button-valider")
const errorForm = document.getElementById("error-form")

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

        // Génération des projets par filtres
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
                let projectModalHTML = ""
                projetFiltres.forEach(projet => {
                    projetFiltresHTML += `
                    <figure data-id="${projet.id}">
                        <img src="${projet.imageUrl}" alt="${projet.title}">
                        <figcaption>${projet.title}</figcaption>
                    </figure>
                    `
                    projectModalHTML += `
                    <div data-id="${projet.id}" class="div-image-modal">
                        <img class="img-modal" src="${projet.imageUrl}">
                        <a id="${projet.id}" class="link-icon-trash">
                            <i class="fa-solid fa-trash-can"></i>
                        </a>
                    </div>
                    `
                })
                divProjets.innerHTML = projetFiltresHTML
                contentModale.innerHTML = projectModalHTML
                const trashLink = document.querySelectorAll(".link-icon-trash")
                supprimerProjets(trashLink)
            })
        })
        // Selection du filtre "tous" en premier
        for(let i=0; i<btnFiltres.length; i++) {
            btnFiltres[i].click()
            break
        }
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
linkOpenModal.addEventListener("click", () => {
    modal.showModal()
    modalPartOne.setAttribute("style", "")
    modalPartTwo.setAttribute("style", "display:none;")
})
linkCloseModal.forEach(link => {
    link.addEventListener("click", () => {modal.close()})
})
window.addEventListener("click", event => {
    if(modal.open) {
        if(event.target === modal) {modal.close()}
    }
})

// Suppression des projets dans la modale
function supprimerProjets(trashLink) {
    trashLink.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault()
            const projetId = link.id
            const divProjetId = document.querySelectorAll(`[data-id="${projetId}"]`)
            let alertSuppression = confirm("Êtes-vous sûr de vouloir supprimer ce projet?")
            if(alertSuppression) {
                // Requête fetch avec method DELETE
                try {
                    fetch(`http://localhost:5678/api/works/${projetId}`, {
                        method: "DELETE",
                        headers: headerFetch,
                        body: projetId
                    }).then(response => {
                        if (response.ok === false) {
                            alert("Erreur de la requête HTTP")
                        } else {
                            divProjetId.forEach(block => {
                                block.innerHTML = ""
                            })
                        }
                    })
                } catch(error) {
                    console.error(error)
                    alert("Le projet n'a pas pu être supprimé")
                }
            } 
        })
    })
}

// Fonction d'ouverture de la modale partie 2 (Ajout Photo)
boutonAjouter.addEventListener("click", (e) => {
    e.preventDefault()
    modalPartOne.setAttribute("style", "display:none;")
    modalPartTwo.setAttribute("style", "")
    chercherCategories()
})

// Fonction d'ajout du contenu sur la partie Ajout Photo de la modale
function chercherCategories() {
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
}

// Retour sur la modale part 1
linkBack.addEventListener("click", () => {
    modalPartOne.setAttribute("style", "")
    modalPartTwo.setAttribute("style", "display:none;")
})

// Aperçu de l'image lors de l'input file et erreur si le fichier est trop volumineux
if(inputFile.value) {inputFile.value = ""}
inputFile.addEventListener("change", (event) => {
    errorFileSize.setAttribute("style", "display:none;")
    const fileData = event.target.files
    const maxSize = 4194304
    for(let i=0; i<fileData.length; i++) {
        const file = fileData[i]
        const pathFile = URL.createObjectURL(file)
        if(file.size >= maxSize) {
            errorFileSize.setAttribute("style", "")
            event.target.value = ""
            return
        }
        else {
            divAjoutPhoto.setAttribute("style", "display: none;")
            divApercuPhoto.setAttribute("style", "")
            divApercuPhoto.innerHTML = `
                <img id="img-apercu" src="${pathFile}" alt="${file.name}"></img>
            `
        }
    }
})

// Vérification des valeurs du formulaire
formProjets.addEventListener("input", () => {
    if(inputFile.value && inputTitre.value && selectCategory.value){
        btnValiderAjouterPhoto.setAttribute("style", "")
        fakeBtn.setAttribute("style", "display: none;")
    } else {
        btnValiderAjouterPhoto.setAttribute("style", "display: none;")
        fakeBtn.setAttribute("style", "")
    }
})
// Message d'erreur si mauvais remplissage des champs
fakeBtn.addEventListener("click", () => {
    alert("Les champs ne sont pas correctement remplis")
})

// Méthode POST sur les nouveaux projets
btnValiderAjouterPhoto.addEventListener("click", (e) => {
    e.preventDefault()
    const formData = new FormData(formProjets)
    console.log(formData)
    try {
        fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: formData,
            headers: headerFetch
        }).then(response => {
            if (!response.ok) {alert("Erreur de la requête HTTP")} 
            else {
                alert("Le projet a été correctement ajouté")
                formProjets.reset()
                divAjoutPhoto.setAttribute("style", "")
                divApercuPhoto.setAttribute("style", "display: none;")
            }
        })
    } catch(error) {
        console.error(error)
        alert("Le projet n'a pas pu être ajouté")
    }
})