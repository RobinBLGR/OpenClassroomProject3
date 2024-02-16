/* Affichage dynamique de la galerie - function afficherTravaux */
const galerie = document.getElementById("gallery")

const afficherTravaux = () => {
    fetch("http://localhost:5678/api/works")
        .then(function (resp) {
            return resp.json()
        })
        .then(function (data) {
            for(work in data) {
                galerie.innerHTML += 
                `<figure>
				<img src="${data[work].imageUrl}" alt="${data[work].title}" data-${data[work].categoryId}>
				<figcaption>${data[work].title}</figcaption>
			    </figure>`
            }
        })
}
afficherTravaux()

