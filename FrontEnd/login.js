/* Récupération des informations du formulaire de connexion */
document.getElementById("formulaire-login").addEventListener("submit", function (event){
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur dans l’identifiant ou le mot de passe');
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('token', data.token);
        window.location.href = 'index.html';
        
    })
    .catch(error => {
        document.getElementById("erreur-connexion").textContent = error.message;
    });
});