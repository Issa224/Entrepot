function getData() {
    return JSON.parse(localStorage.getItem('data') || '{"produits":[],"entrees":[],"sorties":[]}');
}

function renderProductList(filter = "") {
    const data = getData();
    let produits = data.produits;

    // Filtrage par recherche
    if (filter && filter.trim() !== "") {
        produits = produits.filter(p =>
            p.nom.toLowerCase().includes(filter.trim().toLowerCase())
        );
    }

    const container = document.querySelector('.product-item');
    if (!container) return;

    if (produits.length === 0) {
        container.innerHTML = "<p>Aucun produit trouvé.</p>";
        return;
    }

    container.innerHTML = produits.map(p =>
        `<div class="product">
            <strong>${p.nom}</strong><br>
            Prix unitaire : <span>${p.valeur ? p.valeur + " $" : "?"}</span><br>
            Stock total : <span>${p.stock || 0}</span>
        </div>`
    ).join('');
}

document.addEventListener('DOMContentLoaded', function() {
    renderProductList();

    // Recherche dynamique
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', function() {
            renderProductList(searchInput.value);
        });
        searchInput.addEventListener('input', function() {
            renderProductList(searchInput.value);
        });
    }
});