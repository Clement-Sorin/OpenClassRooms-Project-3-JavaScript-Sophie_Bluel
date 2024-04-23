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
    const divFiltres = document.querySelector(".fitres")
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
