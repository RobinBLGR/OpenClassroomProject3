/* Affichage dynamique de la galerie - function afficherTravaux */
const galerie = document.getElementById("gallery");

const afficherTravaux = () => {
    fetch("http://localhost:5678/api/works")
        .then(function (resp) {
            return resp.json();
        })
        .then(function (data) {
            for (const work in data) {
                galerie.innerHTML += 
                `<figure data-category="${data[work].categoryId}" class="active">
                    <img src="${data[work].imageUrl}" alt="${data[work].title}">
                    <figcaption>${data[work].title}</figcaption>
                </figure>`;
            }
        });
};

afficherTravaux();

function filtreTravaux() {
    let etiquette = this.id.split("-")[1]; // Je récupère l'identifiant de catégorie à partir du bouton filtre
        
    let figures = document.querySelectorAll("#gallery figure"); // Je récupère toutes les figures de la galerie
        
    for (let figure of figures) { // Pour chaque figure, je n'active que celle qui correspond à la bonne étiquette
        figure.classList.replace("active", "inactive"); // Les figures sont par défaut inactives
                        
        if (!etiquette || figure.dataset.category === etiquette) { // Si aucune étiquette sélectionnée ou si la figure correspond à la catégorie sélectionnée
            figure.classList.replace("inactive", "active"); // J'active la figure
        }
    }
}

/* Affichage de la galerie avec les filtres + dynamique du bouton filtre qd la catégorie est sélectionnée */
const filters = document.getElementById("filtres")
fetch ("http://localhost:5678/api/categories")
    .then (response => response.json())
    .then (categories => {
        categories.unshift({
            id: 0,
            name: "Tous"
        })
        for (const category of categories) {
            const filter = document.createElement("button")
            filter.innerText = category.name 
            filter.id = `categorie-${category.id}`
            filter.classList.add("btn-filtre")
            if (category.id === 0) {
                filter.classList.add("active")
            } 
            filters.appendChild(filter)
            filter.addEventListener("click", filtreTravaux);
        }
    })

/* Récupération du token */
const token = localStorage.getItem("token");

/* Affichage du lien logout uniquement si je suis connecté + déconnexion */
function LogOut() {
    if (token) {
        const log = document.querySelector(".log");

        if(log) {
            log.textContent = "logout";
            log.removeAttribute("href")
            log.addEventListener("click", function () {
                localStorage.removeItem("token");
                location.reload();
            })
        }
    }
}
LogOut ()

/* Affichage du bandeau noir, bouton modifier et disparition du filtre quand je suis connecté */
function modeEdition() {
    if (token) {
        const filtresRemove = document.querySelectorAll(".btn-filtre");
        const boutonModifier = document.querySelector(".btn-modifier-remove");
        const bandeauNoir = document.querySelector(".bandeau-noir-remove");

        filtresRemove.forEach(btn => {
            btn.classList.replace("btn-filtre", "btn-filtre-remove");
        });

        if(boutonModifier) {
            boutonModifier.classList.replace("btn-modifier-remove", "btn-modifier")
        }

        if(bandeauNoir) {
            bandeauNoir.classList.replace("bandeau-noir-remove", "bandeau-noir")
        }
    }
}
modeEdition();

/* Affichage et fermeture de la modale "galerie photo" */
let modal = null

const openModal = function (e) {
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute("href"))
    target.style.display = null
    target.removeAttribute("aria-hidden")
    modal = target
    modal.addEventListener("click", closeModal)
    modal.querySelector(".fermer-modale-js").addEventListener("click", closeModal)
}

const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault()
    modal.style.display = "none"
    modal.setAttribute("aria-hidden", "true")
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".fermer-modale-js").removeEventListener("click", closeModal)
    modal = null
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

document.querySelectorAll(".modale-js").forEach(a => {
    a.addEventListener("click", openModal)
})



