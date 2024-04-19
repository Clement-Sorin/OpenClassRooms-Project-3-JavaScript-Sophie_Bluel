// Requête des données depuis l'API
fetch("http://localhost:5678/api/works")
    .then(response => {
        if (response.ok === false) {
            throw new Error("Erreur de la requête HTTP")
        }

        return response.json()
    })
    .then(works => {
        genererProjets(works)
        genererFiltres(works)
    })

// Generation dynamique des projets sur la page HTML
function genererProjets(works) {
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

        divProjets.appendChild(figureProjet)
        figureProjet.appendChild(imageProjet)
        figureProjet.appendChild(titreProjet)
    }
}

// Génération des filtres
function genererFiltres(works) {
    // Recherche des différentes catégories
    const nomCategorie = new Set()
    works.forEach(categories => {
        nomCategorie.add(categories.category.name)
    })
    const tableCategories = Array.from(nomCategorie)
    // Generation des boutons de filtre
    const divFiltres = document.querySelector(".fitres")
    let boutons = document.createElement("button")
    boutons.classList.add("btn-filtre")
    boutons.innerText = "Tous"
    divFiltres.appendChild(boutons)
    for (let i = 0 ; i < tableCategories.length ; i++) {
        boutons = document.createElement("button")
        boutons.classList.add("btn-filtre")
        boutons.innerText = tableCategories[i]
        divFiltres.appendChild(boutons)
    }
    
    
    
}
