import {genererProjets, genererFiltres} from "./projects.js"
import {verifierAuthentification} from "./authentified.js"
import {gererModale} from "./modal.js"

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

verifierAuthentification()
gererModale()
