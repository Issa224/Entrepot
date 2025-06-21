function getData() {
    return JSON.parse(localStorage.getItem('data') || '{"produits":[],"entrees":[],"sorties":[]}');
}
function saveData(data) {
    localStorage.setItem('data', JSON.stringify(data));
}

// Affiche le formulaire de sortie
function renderSortieForm() {
    const data = getData();
    const container = document.getElementById('sortieFormContainer');
    if (!container) return;
    if (data.produits.length === 0) {
        container.innerHTML = "<p>Aucun produit en stock.</p>";
        return;
    }
    container.innerHTML = `
        <select id="sortieProduit" required>
            ${data.produits.map(p => `<option value="${p.nom}">${p.nom} (Stock: ${p.stock})</option>`).join('')}
        </select>
        <input type="number" id="sortieQuantite" min="1" placeholder="Quantité" required>
        <input type="date" id="sortieDate" value="${new Date().toISOString().slice(0,10)}" required>
        <button id="submitSortieBtn" type="button">Sortir</button>
        <div id="sortieError" style="color:red;margin-top:5px;"></div>
    `;
    document.getElementById('submitSortieBtn').onclick = function() {
        const produit = document.getElementById('sortieProduit').value;
        const quantite = parseInt(document.getElementById('sortieQuantite').value, 10);
        const date = document.getElementById('sortieDate').value || new Date().toISOString().slice(0,10);
        const data = getData();
        const prodObj = data.produits.find(p => p.nom === produit);
        const errorDiv = document.getElementById('sortieError');
        if (!produit || !quantite || quantite < 1) {
            errorDiv.textContent = "Veuillez saisir une quantité valide.";
            return;
        }
        if (prodObj && quantite > prodObj.stock) {
            errorDiv.textContent = "Stock insuffisant pour cette sortie.";
            return;
        }
        errorDiv.textContent = "";
        addSortie(produit, quantite, date);
        renderSortie();
        renderSortieForm();
        // Synchronisation dashboard
        window.dispatchEvent(new Event('storage'));
    };
}

// Ajoute une sortie et met à jour le stock
function addSortie(produit, quantite, date) {
    const data = getData();
    const prodObj = data.produits.find(p => p.nom === produit);
    quantite = Number(quantite);
    if (!prodObj || quantite > prodObj.stock) {
        alert("Stock insuffisant pour cette sortie.");
        return;
    }
    if (quantite < 1) {
        alert("Veuillez saisir une quantité valide.");
        return;
    }
    data.sorties.push({ produit, quantite, date });
    prodObj.stock -= quantite;
    saveData(data);
}

// Affiche la liste des sorties, avec recherche dynamique
function renderSortie(filter = "") {
    const data = getData();
    const container = document.querySelector('.sortie-item');
    if (!container) return;
    let sorties = data.sorties;
    if (filter && filter.trim() !== "") {
        sorties = sorties.filter(s => s.produit.toLowerCase().includes(filter.trim().toLowerCase()));
    }
    if (sorties.length === 0) {
        container.innerHTML = "<p>Aucune sortie enregistrée.</p>";
        return;
    }
    container.innerHTML = sorties.map(s =>
        `<div class="sortie">
            <span><i class="fas fa-arrow-up"></i> ${s.produit}</span>
            <span>Quantité : ${s.quantite}</span>
            <span>Date : ${s.date}</span>
        </div>`
    ).join('');
}

// Recherche dynamique
document.addEventListener('DOMContentLoaded', function() {
    renderSortieForm();
    renderSortie();

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            renderSortie(e.target.value);
        });
        // Optionnel : bouton rechercher
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                renderSortie(searchInput.value);
            });
        }
    }
});