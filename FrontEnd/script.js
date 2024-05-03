const divProjects = document.querySelector(".gallery")
const divFilters = document.querySelector(".filters")
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
const linkCloseModal = document.querySelectorAll(".icon-close")
const linkBack = document.getElementById("icon-back")
const modalPartOne = document.getElementById("modal-part-1")
const modalPartTwo = document.getElementById("modal-part-2")
const contentModal = document.getElementById("gallery-modal")
const buttonAdd = document.getElementById("btn-add")
const formProjects = document.getElementById("form-add-img")
const inputFile = document.getElementById("file-input")
const errorFileSize = document.getElementById("file-size-error")
const divAddImage = document.getElementById("div-add-img")
const divPreviewImage = document.getElementById("preview-img")
const inputTitle = document.getElementById("input-title-add-img")
const selectCategory = document.getElementById("input-category-add-img")
const btnSubmitAddImage = document.getElementById("btn-submit-add-img")
const fakeBtn = document.getElementById("fake-btn-submit")

// Data request from API
try {
    fetch("http://localhost:5678/api/works")
    .then(response => {
        if (response.ok === false) {
            throw new Error("Erreur de la requête HTTP")
        }
        return response.json()
    })
    .then(works => {
        // Filters generation in DOM
        const categoryName = new Set()
        works.forEach(categories => {
            categoryName.add(categories.category.name)
        })
        const tableCategories = Array.from(categoryName)
        let filterHTML = ""
        // Filter "tous" (all)
        filterHTML = `<button id="${tableCategories}" class="btn-filter">Tous</button>`
        // filters by catagories available in API
        tableCategories.forEach(filter => {
            filterHTML += `
            <button id="${filter}" class="btn-filter">${filter}</button>
            `
        })
        divFilters.innerHTML = filterHTML

        // Projects display by filters in DOM (main page and modal - modal being the first filter by default)
        const btnFilters = document.querySelectorAll(".btn-filter")
        btnFilters.forEach(filter => {
            filter.addEventListener("click", () => {
                btnFilters.forEach(btn => {
                    btn.classList.remove("filter-selected")
                })
                filter.classList.add("filter-selected") 
                const id = filter.id
                const categories = id.split(",") 
                const projectfilters = works.filter(work => categories.includes(work.category.name))
                let projectfiltersHTML = ""
                let projectModalHTML = ""
                projectfilters.forEach(project => {
                    projectfiltersHTML += `
                    <figure data-id="${project.id}" class="fig-project">
                        <img src="${project.imageUrl}" alt="${project.title}">
                        <figcaption>${project.title}</figcaption>
                    </figure>
                    `
                    projectModalHTML += `
                    <div data-id="${project.id}" class="div-img-modal">
                        <img class="img-modal" src="${project.imageUrl}">
                        <a id="${project.id}" class="link-icon-trash">
                            <i class="fa-solid fa-trash-can"></i>
                        </a>
                    </div>
                    `
                })
                divProjects.innerHTML = projectfiltersHTML
                contentModal.innerHTML = projectModalHTML
                // Delete project
                const trashLink = document.querySelectorAll(".link-icon-trash")
                deleteProject(trashLink)
                // Style on projects (additionnal)
                const figProjects = document.querySelectorAll(".fig-project")
                styleProject(figProjects)
            })
        })
        // First filter selection on page load (all categories)
        for(let i=0; i<btnFilters.length; i++) {
            btnFilters[0].click()
            break
        }
    })
} catch(error) {
    console.error(error)
    alert("La requête n'a pas pu être effectuée")
}

// Auth verification
if (token) {
    logButton.innerHTML = `<a href="" id="log">logout</a>`
    logButton.addEventListener("click", () => {
        window.localStorage.removeItem("token")
    })
    divEdit.id = "div-edit"
    divPortTitle.id = "modif"
    divFilters.classList.toggle("filters-hidden")
}

// Open and close modal fonctionnality
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

// Open the modal Part 2 (add project)
buttonAdd.addEventListener("click", (e) => {
    e.preventDefault()
    modalPartOne.setAttribute("style", "display:none;")
    modalPartTwo.setAttribute("style", "")
    findCategories()
})

// Delete function in modal
function deleteProject(trashLink) {
    trashLink.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault()
            const projectId = link.id
            const divprojectId = document.querySelectorAll(`[data-id="${projectId}"]`)
            let alertDelete = confirm("Êtes-vous sûr de vouloir supprimer ce project?")
            if(alertDelete) {
                // Fetch request with DELETE method
                try {
                    fetch(`http://localhost:5678/api/works/${projectId}`, {
                        method: "DELETE",
                        headers: headerFetch,
                        body: projectId
                    }).then(response => {
                        if (response.ok === false) {
                            alert("Erreur de la requête HTTP")
                        } else {
                            divprojectId.forEach(block => {
                                block.remove()
                            })
                        }
                    })
                } catch(error) {
                    console.error(error)
                    alert("Le project n'a pas pu être supprimé")
                }
            } 
        })
    })
}

// Function add categories in the select area (modal part 2)
function findCategories() {
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
            selectCategory.innerHTML += `<option value="${id}">${name}</option>`
        })
    })
}

// Back to modal part 1 on back icon click
linkBack.addEventListener("click", () => {
    modalPartOne.setAttribute("style", "")
    modalPartTwo.setAttribute("style", "display:none;")
})

// Max size check and image preview in modal part 2
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
            divAddImage.setAttribute("style", "display: none;")
            divPreviewImage.setAttribute("style", "")
            divPreviewImage.innerHTML = `
                <img id="img-preview" src="${pathFile}" alt="${file.name}"></img>
            `
        }
    }
})

// Data check in form and change submit button if ok
formProjects.addEventListener("input", () => {
    if(inputFile.value && inputTitle.value && selectCategory.value){
        btnSubmitAddImage.setAttribute("style", "")
        fakeBtn.setAttribute("style", "display: none;")
    } else {
        btnSubmitAddImage.setAttribute("style", "display: none;")
        fakeBtn.setAttribute("style", "")
    }
})
// Error message for wrong input in form
fakeBtn.addEventListener("click", () => {
    alert("Les champs ne sont pas correctement remplis")
})

// Add new project with POST method
btnSubmitAddImage.addEventListener("click", (e) => {
    e.preventDefault()
    const formData = new FormData(formProjects)
    try {
        fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: formData,
            headers: headerFetch
        }).then(response => {
            if (!response.ok) {alert("Erreur de la requête HTTP")} 
            else {
                alert("Le project a été correctement ajouté")
                const image = formData.get('image')
                const urlImage = URL.createObjectURL(image)
                console.log(urlImage)
                const newProjectHTML = `
                <figure data-id="">
                    <img src="${urlImage}" alt="${inputTitle.value}">
                    <figcaption>${inputTitle.value}</figcaption>
                </figure>
                `
                const newProjectModalHTML = `
                <div data-id="" class="div-img-modal">
                    <img class="img-modal" src="${urlImage}">
                    <a id="" class="link-icon-trash">
                        <i class="fa-solid fa-trash-can"></i>
                    </a>
                </div>
                `
                divProjects.innerHTML += newProjectHTML
                contentModal.innerHTML += newProjectModalHTML
                formProjects.reset()
                divAddImage.setAttribute("style", "")
                divPreviewImage.setAttribute("style", "display: none;")
            }
        })
    } catch(error) {
        console.error(error)
        alert("Le project n'a pas pu être ajouté")
    }
})

// additionnal, style on projects
function styleProject(figProjects) {
    figProjects.forEach((div,index) => {
        div.style.animationDelay = (index * 0.15) + "s"
    })
}
