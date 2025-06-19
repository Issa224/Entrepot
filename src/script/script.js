document.addEventListener('DOMContentLoaded', function() {
    // Sidebar responsive
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
        // Fermer le menu si on clique en dehors sur mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 900 && sidebar.classList.contains('open')) {
                if (!sidebar.contains(e.target) && e.target !== menuToggle) {
                    sidebar.classList.remove('open');
                }
            }
        });
    }

    // Données d'exemple
    const produits = [
        { nom: "Clavier mécanique", stock: 0, valeur: 80, entrees: 10, sorties: 10, derniereEntree: "2025-06-18", derniereSortie: "2025-06-19" },
        { nom: "Souris sans fil", stock: 2, valeur: 25, entrees: 15, sorties: 13, derniereEntree: "2025-06-17", derniereSortie: "2025-06-18" },
        { nom: "Écran 24 pouces", stock: 20, valeur: 150, entrees: 25, sorties: 5, derniereEntree: "2025-06-15", derniereSortie: "2025-06-16" },
        { nom: "Casque audio", stock: 4, valeur: 60, entrees: 8, sorties: 4, derniereEntree: "2025-06-14", derniereSortie: "2025-06-15" },
        { nom: "Webcam HD", stock: 0, valeur: 40, entrees: 5, sorties: 5, derniereEntree: "2025-06-13", derniereSortie: "2025-06-14" }
    ];

    // Calculs
    const totalProducts = produits.length;
    const totalValue = produits.reduce((sum, p) => sum + (p.stock * p.valeur), 0);
    const totalEntree = produits.reduce((sum, p) => sum + p.entrees, 0);
    const totalSortie = produits.reduce((sum, p) => sum + p.sorties, 0);
    const lowStock = produits.filter(p => p.stock > 0 && p.stock <= 5);
    const outOfStock = produits.filter(p => p.stock === 0);

    // Affichage dashboard
    if(document.getElementById('totalProducts')) document.getElementById('totalProducts').textContent = totalProducts;
    if(document.getElementById('totalValue')) document.getElementById('totalValue').textContent = totalValue + " $";
    if(document.getElementById('totalEntree')) document.getElementById('totalEntree').textContent = totalEntree;
    if(document.getElementById('totalSortie')) document.getElementById('totalSortie').textContent = totalSortie;
    if(document.getElementById('lowStock')) document.getElementById('lowStock').textContent = lowStock.length;
    if(document.getElementById('outOfStock')) document.getElementById('outOfStock').textContent = outOfStock.length;

    // Alertes
    const outOfStockList = document.getElementById('outOfStockList');
    if(outOfStockList) {
        if (outOfStock.length === 0) {
            outOfStockList.innerHTML = `<li><i class="fas fa-check-circle"></i> Aucun produit en rupture</li>`;
        } else {
            outOfStockList.innerHTML = outOfStock.map(p => `<li><i class="fas fa-times-circle"></i> ${p.nom}</li>`).join('');
        }
    }
    const lowStockList = document.getElementById('lowStockList');
    if(lowStockList) {
        if (lowStock.length === 0) {
            lowStockList.innerHTML = `<li><i class="fas fa-check-circle"></i> Aucun produit à faible stock</li>`;
        } else {
            lowStockList.innerHTML = lowStock.map(p => `<li><i class="fas fa-exclamation-triangle"></i> ${p.nom} (stock: ${p.stock})</li>`).join('');
        }
    }

    // Activité récente (entrées et sorties)
    const recentActivityList = document.getElementById('recentActivityList');
    if(recentActivityList) {
        // On prend les 5 dernières activités (entrées ou sorties)
        let activities = [];
        produits.forEach(p => {
            activities.push({ type: 'Entrée', produit: p.nom, date: p.derniereEntree });
            activities.push({ type: 'Sortie', produit: p.nom, date: p.derniereSortie });
        });
        activities = activities.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
        recentActivityList.innerHTML = activities.map(act =>
            `<li>
                <i class="fas ${act.type === 'Entrée' ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
                <strong>${act.produit}</strong> : ${act.type} le ${act.date}
            </li>`
        ).join('');
    }

    // Dernières sorties
    const recentSortieList = document.getElementById('recentSortieList');
    if(recentSortieList) {
        // On prend les 3 dernières sorties
        let sorties = produits.map(p => ({ produit: p.nom, date: p.derniereSortie }))
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);
        recentSortieList.innerHTML = sorties.map(s =>
            `<li>
                <i class="fas fa-arrow-up"></i>
                <strong>${s.produit}</strong> : sortie le ${s.date}
            </li>`
        ).join('');
    }
});