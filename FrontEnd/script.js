/* Affichage dynamique de la galerie - function afficherTravaux */
async function afficherTravaux() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        const data = await response.json();
        const gallery = document.getElementById('gallery');

        data.forEach(photo => {
            const container = document.createElement('div');
            container.classList.add('photo-container');
            container.dataset.category = photo.categoryId;

            const img = document.createElement('img');
            img.src = photo.imageUrl;
            img.alt = photo.title;
            img.classList.add('active');

            const title = document.createElement('p');
            title.textContent = photo.title;

            container.appendChild(img);
            container.appendChild(title);

            gallery.appendChild(container);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des photos', error);
    }
}

function filtreTravaux() {
    const etiquette = this.id.split("-")[1];
    const filters = document.querySelectorAll(".btn-filtre"); // Sélectionnez tous les boutons filtres

    // Supprimez la classe "active" de tous les boutons filtres
    filters.forEach(filter => {
        filter.classList.remove("active");
    });

    // Ajoutez la classe "active" uniquement au bouton cliqué
    this.classList.add("active");

    const containers = document.querySelectorAll("#gallery .photo-container");

    for (const container of containers) {
        if (!etiquette || etiquette === "0" || container.dataset.category === etiquette) {
            container.classList.add("active");
            container.classList.remove("inactive");
        } else {
            container.classList.remove("active");
            container.classList.add("inactive");
        }
    }
}

const filters = document.getElementById("filtres");
fetch("http://localhost:5678/api/categories")
    .then(response => response.json())
    .then(categories => {
        categories.unshift({
            id: 0,
            name: "Tous"
        });
        for (const category of categories) {
            const filter = document.createElement("button");
            filter.innerText = category.name;
            filter.id = `categorie-${category.id}`;
            filter.classList.add("btn-filtre");
            if (category.id === 0) {
                filter.classList.add("active");
            }
            filters.appendChild(filter);
            filter.addEventListener("click", filtreTravaux);
        }
    });

afficherTravaux();

/* Récupération du token */
const token = localStorage.getItem("token");

/* Récupération du token d'authentification */
function recupererToken() {
    return localStorage.getItem('token');
}

/* Affichage du bandeau noir, bouton modifier et disparition du filtre quand je suis connecté */
function modeEdition() {
    if (token) {
        const filtresRemove = document.getElementById("filtres");
        const boutonModifier = document.querySelector(".btn-modifier-remove");
        const bandeauNoir = document.querySelector(".bandeau-noir-remove");

        if(filtresRemove) {
            filtresRemove.id = "filtres-remove";
        }

        if(boutonModifier) {
            boutonModifier.classList.replace("btn-modifier-remove", "btn-modifier")
        }

        if(bandeauNoir) {
            bandeauNoir.classList.replace("bandeau-noir-remove", "bandeau-noir")
        }
    }
}
modeEdition();


