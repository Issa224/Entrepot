function getData() {
    return JSON.parse(localStorage.getItem('data') || '{"produits":[],"entrees":[],"sorties":[]}');
}

// Affiche les 5 dernières activités (entrées et sorties)
function renderRecentActivity() {
    const data = getData();
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

    // Trie par date décroissante
    activities = activities.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    const ul = document.getElementById('recentActivityList');
    if (!ul) return;
    if (activities.length === 0) {
        ul.innerHTML = "<li>Aucune activité récente.</li>";
        return;
    }
    ul.innerHTML = activities.map(act =>
        `<li>
            <i class="fas ${act.type === 'Entrée' ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
            <strong>${act.produit}</strong> : ${act.type} (${act.quantite}) le ${act.date}
        </li>`
    ).join('');
}

// Affiche les 3 dernières sorties
function renderRecentSortie() {
    const data = getData();
    let sorties = data.sorties
        .map(s => ({
            produit: s.produit,
            quantite: s.quantite,
            date: s.date
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);

    const ul = document.getElementById('recentSortieList');
    if (!ul) return;
    if (sorties.length === 0) {
        ul.innerHTML = "<li>Aucune sortie récente.</li>";
        return;
    }
    ul.innerHTML = sorties.map(s =>
        `<li>
            <i class="fas fa-arrow-up"></i>
            <strong>${s.produit}</strong> : ${s.quantite} le ${s.date}
        </li>`
    ).join('');
}

// Initialisation et synchronisation
function updateMouvements() {
    renderRecentActivity();
    renderRecentSortie();
}

document.addEventListener('DOMContentLoaded', updateMouvements);
window.addEventListener('storage', updateMouvements);