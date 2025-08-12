const API_URL = "https://menu-du-restaurant-florian-6.onrender.com";


function chargerCommandes() {
  fetch(`${API_URL}/commandes`)
    .then(res => res.json())
    .then(data => afficherCommandes(data));
}

function afficherCommandes(commandes) {
  const div = document.getElementById("commandes");
  div.innerHTML = "";
  commandes.forEach((commande, i) => {
    const bloc = document.createElement("div");
    bloc.className = "commande";
    bloc.innerHTML = `<strong>Commande #${i+1}</strong><br>` +
      commande.items.map(item => `${item.nom} - ${item.prix} €`).join("<br>");
    div.appendChild(bloc);
  });
}

setInterval(chargerCommandes, 3000); // Rafraîchit toutes les 3s
chargerCommandes();
