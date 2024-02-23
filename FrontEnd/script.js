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

// Appel de la fonction pour obtenir les photos au chargement de la page
afficherTravaux();

/* Récupération du token */
const token = localStorage.getItem("token");

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

/* Affichage et fermeture de la modale "galerie photo" */
const openModal = function (e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    target.style.display = null;
    target.removeAttribute('aria-hidden');
    modal = target;
    modal.addEventListener('click', closeModal);

    // Attachement de l'événement de fermeture uniquement à l'élément de fermeture spécifique à chaque modale
    if (modal.classList.contains('modale-galerie-affichage')) {
        modal.querySelector('.fermer-modale-js').addEventListener('click', closeModal);
    } else if (modal.classList.contains('modale-galerie-ajout')) {
        modal.querySelector('.fermer-modale-js').addEventListener('click', closeModal);
    }

    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
};

document.querySelectorAll('.modale-js').forEach(a => {
    a.addEventListener('click', openModal);
});


/* Affichage de la galerie dans la modale */
async function afficherTravauxModale() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        const data = await response.json();
        const gallery = document.getElementById('gallery-modale');

        data.forEach(photo => {
            const container = document.createElement('div');
            container.classList.add('photo-container');
            container.dataset.category = photo.categoryId;

            const img = document.createElement('img');
            img.src = photo.imageUrl;
            img.alt = photo.title;
            img.classList.add('active');

            container.appendChild(img);

            gallery.appendChild(container);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des photos', error);
    }
}

afficherTravauxModale()

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
LogOut()

/* Récupération du token d'authentification */
function recupererToken() {
    return localStorage.getItem('token');
}

/* Possiblité de supprimer des travaux de la galerie lorsque je suis connecté */
function supprimerTravaux(id) {
    const token = recupererToken();

    if (!token) {
        console.error('Erreur : vous ne vous êtes pas authentifié');
        return;
    }

    const options = {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ${token}',
            'Content-Type': 'application/json'
        }
    };

    fetch('http://localhost:5678/api/works/${id}', options)
        .then(response => {
            if (!response.ok) {
                throw new Error('La suppression de travaux existants a échoué');
            }
            actualiserDOM();
        })
        .catch(error => {
            console.error('Erreur lors de la suppression du travail', error);
        });
}


/* ci-dessus code pour la fonction supprimerTravaux. 
supprimerTravaux()

Il faudra rajouter ensuite un écouteur d'évenement qui récupère l'id de l'image et la supprime 
User
j'ai une galerie qui s'affiche dynamiquement avec javascript et appel à l'API http://localhost:5678/api/works. Avec le code que tu m'as donné au dessus, je veux que lorsque je clique sur une des images de la galerie, ça me la supprime. COmment faire?
*/

/* Changement de la modale "galerie photo" à "ajouter photo" au clic sur "ajouter" */
const bouton = document.querySelector('.button-ajouter');
const modaleGalerie = document.querySelector('.modale-galerie-affichage')
const modaleAjout = document.querySelector('.modale-galerie-ajout');

bouton.addEventListener('click', function() {
    bouton.parentElement.style.display = 'none';
    modaleAjout.style.display = 'flex';
});

/* Changement de la modale "ajouter photo" à "galerie photo" au clic sur la flèche retour */
const btnRetour = document.querySelector('.retour-modale-js')

btnRetour.addEventListener('click', function () {
    modaleAjout.style.display = 'none';
    modaleGalerie.style.display = 'flex';
});

/* Affichage de la liste des catégories dans la modale "ajout photo" */
const selectElement = document.getElementById('input-categorie'); 

fetch('http://localhost:5678/api/categories')
    .then(response => response.json())
    .then(data => {
        const mesCategories = document.getElementById('input-categorie');
        data.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            mesCategories.appendChild(option);
        });
    })

/* Gestion de l'envoi d'un nouveau projet avec bouton valider actif si tous les champs sont saisis */
// Je verifie si tous les champs sont remplis
function verifierChamps () {
    const titre = document.getElementById('input-titre').value;
    const categories = document.getElementById('input-categorie').value;
    const fichiers = document.getElementById('btn-add').value;

    return titre !== '' && categories !== '' && fichiers !== '';
}

// J'active ou désactive le bouton "valider"
function gererBoutonValider () {
    const boutonValider = document.getElementById('boutonValider');
    const formulaireComplet = verifierChamps();

    if (formulaireComplet) {
        boutonValider.classList.replace('button-valider-incomplet', 'button-valider-complet');
    } else {
        boutonValider.classList.replace('button-valider-complet', 'button-valider-incomplet');
    }
}

// J'écoute les évenements dans les champs de saisie
document.addEventListener('DOMContentLoaded', function() {
    const champs = document.querySelectorAll('input[type="text"], input[type="file"], select');
    champs.forEach(champs => {
        champs.addEventListener('input', gererBoutonValider);
    });
});