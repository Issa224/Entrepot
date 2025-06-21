// Utilitaire pour récupérer et sauvegarder les produits dans le localStorage
function getData() {
    return JSON.parse(localStorage.getItem('data') || '{"produits":[],"entrees":[],"sorties":[]}');
}
function saveData(data) {
    localStorage.setItem('data', JSON.stringify(data));
}

// Affiche la liste des produits dans .entry-item
function renderProductList() {
    const data = getData();
    const produits = data.produits;
    const container = document.querySelector('.entry-item');
    if (!container) return;
    if (produits.length === 0) {
        container.innerHTML = "<p>Aucun produit en stock.</p>";
        return;
    }
    container.innerHTML = produits.map(p =>
        `<div class="product">
            <strong>${p.nom}</strong> - Stock: ${p.stock} - Valeur: ${p.valeur ? p.valeur + " $" : "?"}
        </div>`
    ).join('');
}

function updateDashboard() {
    const data = getData();
    // Nombre de produits
    if(document.getElementById('totalProducts'))
        document.getElementById('totalProducts').textContent = data.produits.length;
    // Valeur totale
    if(document.getElementById('totalValue'))
        document.getElementById('totalValue').textContent = data.produits.reduce((sum, p) => sum + ((p.stock || 0) * (p.valeur || 0)), 0) + " $";
    // Total entrées
    if(document.getElementById('totalEntree'))
        document.getElementById('totalEntree').textContent = data.entrees.reduce((sum, e) => sum + (e.quantite || 0), 0);
    // Total sorties
    if(document.getElementById('totalSortie'))
        document.getElementById('totalSortie').textContent = data.sorties.reduce((sum, s) => sum + (s.quantite || 0), 0);
    // Faible stock
    if(document.getElementById('lowStock'))
        document.getElementById('lowStock').textContent = data.produits.filter(p => p.stock > 0 && p.stock <= 5).length;
    // Rupture
    if(document.getElementById('outOfStock'))
        document.getElementById('outOfStock').textContent = data.produits.filter(p => p.stock === 0).length;
}

document.addEventListener('DOMContentLoaded', function() {
    renderProductList();
    updateDashboard();

    const form = document.getElementById('entryForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const nom = document.getElementById('product').value.trim();
        const quantite = parseInt(document.getElementById('quantity').value, 10);
        const date = document.getElementById('date').value || new Date().toISOString().slice(0,10);

        if (!nom || isNaN(quantite) || quantite < 1) {
            alert("Veuillez remplir tous les champs correctement.");
            return;
        }

        let data = getData();
        // Vérifie si le produit existe déjà
        let prod = data.produits.find(p => p.nom.toLowerCase() === nom.toLowerCase());
        if (prod) {
            prod.stock += quantite;
        } else {
            // Demande la valeur du produit si nouveau
            let valeur = parseFloat(prompt("Valeur unitaire du produit ($) ?", "0"));
            if (isNaN(valeur) || valeur < 0) valeur = 0;
            prod = { nom, stock: quantite, valeur };
            data.produits.push(prod);
        }
        // Ajoute l'entrée dans l'historique
        data.entrees.push({ produit: nom, quantite, date });
        saveData(data);
        form.reset();
        renderProductList();
        updateDashboard();

        // Synchronisation automatique du dashboard sur tous les onglets
        window.dispatchEvent(new Event('storage'));
    });
});