/* Affichage dynamique de la galerie - function afficherTravaux */
const galerie = document.getElementById("gallery");

const afficherTravaux = () => {
    fetch("http://localhost:5678/api/works")
        .then(function (resp) {
            return resp.json();
        })
        .then(function (data) {
            for (work in data) {
                galerie.innerHTML += 
                `<figure data-category="${data[work].categoryId}" class="active">
                    <img src="${data[work].imageUrl}" alt="${data[work].title}">
                    <figcaption>${data[work].title}</figcaption>
                </figure>`;
            }
        });
};

afficherTravaux();

/* Paramètres boutons */
function filtreTravaux(value) {
}

/* Affichage de la galerie avec les filtres */
let filtres = document.querySelectorAll("#filtres button");

for (let filtre of filtres) {
    filtre.addEventListener("click", function () {
        let etiquette = this.id.split("-")[1]; // Je récupère l'identifiant de catégorie à partir du bouton filtre

        let figures = document.querySelectorAll("#gallery figure"); // Je récupère toutes les figures de la galerie

        for (let figure of figures) { // Pour chaque figure, je n'active que celle qui correspond à la bonne étiquette
            figure.classList.replace("active", "inactive"); // Les figures sont par défaut inactives
                
            if (!etiquette || figure.dataset.category === etiquette) { // Si aucune étiquette sélectionnée ou si la figure correspond à la catégorie sélectionnée
                    figure.classList.replace("inactive", "active"); // J'active la figure
             }
        }
    });
}

/* Affichage dynamique du bouton filtre qd la catégorie est sélectionnée */
let btnFiltres = document.querySelectorAll(".btn-filtre");
for (let btnFiltre of btnFiltres) {
    btnFiltre.addEventListener("click", function () {
        for (let otherBtn of btnFiltres) {
            otherBtn.classList.remove("active");
        }
      this.classList.add("active");
    });
}