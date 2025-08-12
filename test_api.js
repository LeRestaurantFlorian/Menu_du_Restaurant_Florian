// test_api.js
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const API_URL = "https://menu-du-restaurant-florian-6.onrender.com";

// Fonction fetch avec timeout
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw new Error(`Erreur ou délai dépassé pour ${url} : ${err.message}`);
  }
}

(async () => {
  try {
    console.log("=== 1. Menu actuel ===");
    const resMenu = await fetchWithTimeout(`${API_URL}/menu`);
    const menu = await resMenu.json();
    console.log(menu);

    console.log("\n=== 2. Ajout d'un plat ===");
    const resAjout = await fetchWithTimeout(`${API_URL}/menu`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom: "Pizza Test", prix: 9.99, categorie: "Plat" })
    });
    const ajout = await resAjout.json();
    console.log(ajout);

    console.log("\n=== 3. Liste des commandes ===");
    const resCmd = await fetchWithTimeout(`${API_URL}/commandes`);
    const commandes = await resCmd.json();
    console.log(commandes);
  } catch (err) {
    console.error("❌ Erreur lors du test :", err.message);
  }
})();
