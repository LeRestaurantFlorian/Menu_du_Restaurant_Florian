const API_URL = "https://menu-du-restaurant-florian-6.onrender.com";

let panier = [];

fetch(`${API_URL}/menu`)
  .then(res => res.json())
  .then(data => afficherMenu(data));

function afficherMenu(menu) {
  const menuDiv = document.getElementById("menu");
  menu.forEach(item => {
    const div = document.createElement("div");
    div.className = "menu-item";
    div.innerHTML = `
      <strong>${item.nom}</strong><br>
      ${item.prix} €<br>
      <button onclick="ajouterPanier('${item.nom}', ${item.prix})">Ajouter</button>
    `;
    menuDiv.appendChild(div);
  });
}

function ajouterPanier(nom, prix) {
  panier.push({ nom, prix });
  afficherPanier();
}

function afficherPanier() {
  const ul = document.getElementById("panier");
  ul.innerHTML = "";
  panier.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.nom} - ${item.prix} €`;
    ul.appendChild(li);
  });
}

document.getElementById("envoyerCommande").addEventListener("click", () => {
  fetch(`${API_URL}/commandes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: panier }) // ✅ Correction ici
  })
  .then(res => res.json())
  .then(() => {
    alert("Commande envoyée !");
    panier = [];
    afficherPanier();
  });
});
