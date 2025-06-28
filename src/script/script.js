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

    function getData() {
        return JSON.parse(localStorage.getItem('data') || '{"produits":[],"entrees":[],"sorties":[]}');
    }

    function updateDashboard() {
        const data = getData();
        if(document.getElementById('totalProducts')) document.getElementById('totalProducts').textContent = data.produits.length;
        if(document.getElementById('totalValue')) document.getElementById('totalValue').textContent = data.produits.reduce((sum, p) => sum + ((p.stock || 0) * (p.valeur || 0)), 0) + " $";
        if(document.getElementById('totalEntree')) document.getElementById('totalEntree').textContent = data.entrees.reduce((sum, e) => sum + (e.quantite || 0), 0);
        if(document.getElementById('totalSortie')) document.getElementById('totalSortie').textContent = data.sorties.reduce((sum, s) => sum + (s.quantite || 0), 0);
        if(document.getElementById('lowStock')) document.getElementById('lowStock').textContent = data.produits.filter(p => p.stock > 0 && p.stock <= 5).length;
        if(document.getElementById('outOfStock')) document.getElementById('outOfStock').textContent = data.produits.filter(p => p.stock === 0).length;

        // Alertes
        const outOfStockList = document.getElementById('outOfStockList');
        if(outOfStockList) {
            const outOfStock = data.produits.filter(p => p.stock === 0);
            if (outOfStock.length === 0) {
                outOfStockList.innerHTML = `<li><i class="fas fa-check-circle"></i> Aucun produit en rupture</li>`;
            } else {
                outOfStockList.innerHTML = outOfStock.map(p => `<li><i class="fas fa-times-circle"></i> ${p.nom}</li>`).join('');
            }
        }
        const lowStockList = document.getElementById('lowStockList');
        if(lowStockList) {
            const lowStock = data.produits.filter(p => p.stock > 0 && p.stock <= 5);
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
            // Ajoute toutes les entrées
            data.entrees.forEach(e => {
                activities.push({
                    type: 'Entrée',
                    produit: e.produit,
                    quantite: e.quantite,
                    date: e.date
                });
            });
            // Ajoute toutes les sorties
            data.sorties.forEach(s => {
                activities.push({
                    type: 'Sortie',
                    produit: s.produit,
                    quantite: s.quantite,
                    date: s.date
                });
            });
            // Trie par date décroissante et prend les 5 plus récentes
            activities = activities.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
            if (activities.length === 0) {
                recentActivityList.innerHTML = "<li>Aucune activité récente.</li>";
            } else {
                recentActivityList.innerHTML = activities.map(act =>
                    `<li>
                        <i class="fas ${act.type === 'Entrée' ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
                        <strong>${act.produit}</strong> : ${act.type} (${act.quantite}) le ${act.date}
                    </li>`
                ).join('');
            }
        }

        // Dernières sorties
        const recentSortieList = document.getElementById('recentSortieList');
        if(recentSortieList) {
            // On prend les 3 dernières sorties
            let sorties = data.produits.map(p => ({ produit: p.nom, date: p.derniereSortie }))
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 3);
            recentSortieList.innerHTML = sorties.map(s =>
                `<li>
                    <i class="fas fa-arrow-up"></i>
                    <strong>${s.produit}</strong> : sortie le ${s.date}
                </li>`
            ).join('');
        }
    }

    // Met à jour le dashboard au chargement
    updateDashboard();

    // Synchronisation automatique si modification dans un autre onglet
    window.addEventListener('storage', updateDashboard);
});