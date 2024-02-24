/* Récupération du token d'authentification */
function recupererToken() {
    return localStorage.getItem('token');
}

/* Affichage et fermeture clic croix ou extérieur de la modale "galerie photo" */
const boutonModifier = document.querySelector('.projets-modifier button');
const modaleModifier = document.getElementById('modale-modifier');
const overlay = document.querySelector('.overlay');

boutonModifier.addEventListener('click', function() {
    modaleModifier.style.display = 'flex';
    overlay.classList.remove('display-none')
})

const croixFermer1 = document.querySelector('.fermer-modale-js');
const croixFermer2 = document.querySelector('.fermer-modale2-js');

croixFermer1.addEventListener('click', function() {
    modaleModifier.style.display = 'none';
    overlay.classList.add('display-none')
})

croixFermer2.addEventListener('click', function() {
    modaleModifier.style.display = 'none';
    overlay.classList.add('display-none')
})

overlay.addEventListener('click', function() {
    modaleModifier.style.display = 'none';
    overlay.classList.add('display-none')
})

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

/* Gestion de l'envoi d'un nouveau projet au backend avec FormData */
document.getElementById('formAjout').addEventListener('submit', function(event) {
    event.preventDefault();

    let imageInput = document.getElementById('btn-add').files[0];
    let titreInput = document.getElementById('input-titre').value;
    let categorieSelect = document.getElementById('input-categorie').value;

    let formData = new FormData();
    formData.append('image', imageInput);
    formData.append('title', titreInput);
    formData.append('category', categorieSelect);

    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': 'Bearer ' + token 
        }
    })

.then(response => {
    if(response.ok) {
        return response.json();
    } else {
        throw new Error("Erreur lors de l'envoi du formulaire.");
    }
})
.then(data => {
    afficherMessageSucces("Le formulaire a été envoyé avec succès");
})
.catch(error => {
    afficherMessageErreur(error.message);
});
});

function afficherMessageSucces(message) {
    document.getElementById("messageForm").innerHTML = `<div class="success">${message}</div>`;
}

function afficherMessageErreur(message) {
    document.getElementById("messageForm").innerHTML = `<div class="error">${message}</div>`;
}

/* Aperçu de la miniature de l'image lorsqu'elle est chargée */
document.getElementById('btn-add').addEventListener('change', function(event) {
    let imageInput = event.target.files[0];
    let imgPreviewContainer = document.getElementById('image-preview');
    let imageUploadIndication = document.getElementById('image-upload-indication')

    if (imageInput) {
        let reader = new FileReader();
        reader.onload = function(e) {
            // Créer l'élément <img>
            let imgPreview = document.createElement('img');
            imgPreview.src = e.target.result;
            imgPreview.alt = "Aperçu de l'image chargée";
            imgPreview.style.maxWidth = "129px";
            imgPreview.style.display = 'block';

            // Ajouter l'élément <img> au conteneur d'aperçu d'image
            imgPreviewContainer.innerHTML = '';
            imgPreviewContainer.appendChild(imgPreview);

            // Cacher le contenu de téléchargement d'image
            imageUploadIndication.style.display = 'none';
        };
        reader.readAsDataURL(imageInput);
    } else {
        imgPreviewContainer.innerHTML = '';
    }
});


/* Récupération du token d'authentification */
function recupererToken() {
    return localStorage.getItem('token');
}
