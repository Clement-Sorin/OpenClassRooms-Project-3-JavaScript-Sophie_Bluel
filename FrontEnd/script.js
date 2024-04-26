import {genererProjets, genererFiltres, genererProjetsModale, toggleModale} from "./functions.js"
import {verifierAuthentification} from "./authentified.js"

// Requête des données depuis l'API
fetch("http://localhost:5678/api/works")
    .then(response => {
        if (response.ok === false) {
            throw new Error("Erreur de la requête HTTP")
        }

        return response.json()
    })
    .then(works => {
        // DOM principal
        genererProjets(works)
        genererFiltres(works)
        // modale
        toggleModale()
        genererProjetsModale(works)
    })

verifierAuthentification()
