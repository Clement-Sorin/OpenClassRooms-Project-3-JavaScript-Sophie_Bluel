// Appel au contenu du local storage pour works
let works = window.localStorage.getItem("works")
// Appel à la requête de l'API pour works et sauvegarde dans le local storage
if (works === null) {
    // Récupération des travaux depuis l'API
    const response = fetch("http://localhost:5678/api/works").then(response.json())
    // Transformation des travaux en JSON
    const valeurWorks = JSON.stringify(works)
    // Stockage des informations dans le localStorage
    window.localStorage.setItem("works", valeurWorks)
} else {
    works = JSON.parse(works)
}

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

genererProjets(works)
