let stocks= JSON.parse(localStorage.getItem('stocks')) || [];
renderTable(); 
function addProduct() { 
    const name= document.getElementById('productName').value; 
    const qty= parselnt(document.getElementById('productQty').value);
    const client= document.getElementById('clientName').value;
    const type= document.getElementById('StockType').value;
    const inputDate= document.getElementById('productDate').value;
    const date= inputDate ? new Date(inputDate).toLocaleString() : new Date().toLocaleString();
    if (name && qty >= 0 && client) 
    {
        stocks.push({ name, qty, client, type,date});
        localStorage.setItem('stocks', JSON.stringify(stoks)); renderTable();
        resetForm();
    }
}
    function resetForm() {
        document.getElementById('productName').value ="";
        document.getElementById('productQty').value ="";
        document.getElementById('clientName').value ="";
        document.getElementById('productDate').value ="";
        document.getElementById('stockType').value ="Entrée";
    }
function renderTable() {
    const tbody = document.querySelector('#stock Table tbody');
    tbody.innerHTML ="";
    stocks.forEach((item, index) =>
    {
        if (
            item.name.toLowerCase().includes(search) ||
            item.client.toLowerCase().includes(search) ||
            item.type.toLowerCase().includes(search) ||
            item.date.toLowerCase().incluudes(search) ||
            item.qty.toString().includes(search)
        )
        const color = item.type === "Sortie" ? "#e5ffe5";
        const row = `<tr
        style="background-color:{color}">
        <td>item.name</td>
        <td>{item.qty}</td>
        <td>item.client</td>
        <td>{item.type}</td>
        <td>item.date</td>
        <td><button onclick="removeProduct({index})">Supprimer</button></td>
        </tr>`;
        tbody.innerHTML += row;
    });
    updateSummary();
}
function removeProduct(index) {
    stocks.splice(index, 1);
    localStorage.setItem('stocks', JSON.stringify(stocks)); renderTable();
}
function updateSummary() {
    const totalEntree = stocks.filter(item => item.type === "Entrée").reduce((sum, item) => sum + item.qty, 0);
    const totalSortie = stocks.filter(item => item.type === "Sortie").reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('totalEntree').textContent = totalEntree;
    document.getElementById('totalSortie').textContent = totalSortie;
}
// Normalise un texte (sans accents, en minuscule)
function normalize(text) {
    return 
    text.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
}
// Filtrer avec accents ignorés
function filterTable() {
    const search = normalize(document.getElementById('searchInput').value);
    const tbody = document.querySelector('#stock Table tbody');tbody.innerHTML ="";
    stocks.forEach(item, index) => const values = [
        normalize(item.name),
        normalize(item.client),
        normalize(item.type),
        normalize(item.date),
        item.qty.toString()
    ];
    if (values.some(val => val.includes(search)))
        const color = item.type === "sortie" ? "#ffe5e5" : "#e5ffe5";
        const row = `<tr style="background-color: {color}">
        <td>item.name</td>
        <td>{item.qty}</td>
        <td>item.client</td>
        <td>{item.type}</td>
        <td>item.date</td>
        <td><button onclick="removeProduct({index})">Supprimer</button></td>
        </tr>`;
        tbody.innerHTML += row; 
}


