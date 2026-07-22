import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// KONFIGURASI FIREBASE CLOUD
const firebaseConfig = {
    apiKey: "AIzaSyBO9R9D54dCZYtJynKXtw6KtdYccOw68Fs",
    authDomain: "bmcc-704a0.firebaseapp.com",
    databaseURL: "https://bmcc-704a0-default-rtdb.firebaseio.com",
    projectId: "bmcc-704a0",
    storageBucket: "bmcc-704a0.firebasestorage.app",
    messagingSenderId: "141806053766",
    appId: "1:141806053766:web:02e8ee4184619f8d77a407",
    measurementId: "G-G33CCPVSZ9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const docRef = doc(db, "bmc_system", "brangkas_data");

// GLOBAL STATE
window.ADMIN_PIN = "6969";
window.isAdminLoggedIn = false;

// KATALOG ANGGOTA INTERNAL
window.memberCatalogData = [
    { category: 'BODY ARMOR', name: 'VEST', priceBM: 80000, priceUP: 108000, note: '' },
    { category: 'CLASS 1 (SENJATA +15%)', name: 'CERAMIC', priceBM: 95000, priceUP: 110000, note: 'Khusus Senjata +15%' },
    { category: 'CLASS 1 (SENJATA +15%)', name: 'REVOLVER MK2', priceBM: 190000, priceUP: 216000, note: 'Khusus Senjata +15%' },
    { category: 'CLASS 2 (SENJATA +15%)', name: 'SMG', priceBM: 290000, priceUP: 350000, note: 'Khusus Senjata +15%' },
    { category: 'CLASS 2 (SENJATA +15%)', name: 'MICRO SMG', priceBM: 290000, priceUP: 350000, note: 'Khusus Senjata +15%' },
    { category: 'CLASS 2 (SENJATA +15%)', name: 'MINI SMG', priceBM: 250000, priceUP: 290000, note: 'Khusus Senjata +15%' },
    { category: 'CLASS 2 (SENJATA +15%)', name: 'TEC-9', priceBM: 250000, priceUP: 290000, note: 'Khusus Senjata +15%' },
    { category: 'CLASS 3 (SENJATA +15%)', name: 'ASSAULT RIFFLE', priceBM: 500000, priceUP: 540000, note: 'Khusus Senjata +15%' },
    { category: 'AMMO CLASS 1', name: '44 MAGNUM', priceBM: 40000, priceUP: 54000, note: '30 PCS / PER CLIP' },
    { category: 'AMMO CLASS 1', name: '9MM', priceBM: 40000, priceUP: 54000, note: '30 PCS / PER CLIP' },
    { category: 'AMMO CLASS 2', name: '45 ACP', priceBM: 57000, priceUP: 60000, note: '100 PCS / PER CLIP' },
    { category: 'AMMO CLASS 3', name: '5.56 MM', priceBM: 75000, priceUP: 81000, note: '100 PCS / PER CLIP' },
    { category: 'DRUGS', name: 'LINTINGAN', priceBM: 0, priceUP: 0, note: 'FREE (PER PREPARE)' },
    { category: 'DRUGS', name: 'TAWAS', priceBM: 0, priceUP: 0, note: 'FREE (PER PREPARE)' },
    { category: 'DRUGS', name: 'LSD', priceBM: 0, priceUP: 0, note: 'FREE (PER PREPARE)' },
    { category: 'DRUGS', name: 'KECUBUNG', priceBM: 0, priceUP: 0, note: 'FREE (PER PREPARE)' },
    { category: 'ATTACHMENT', name: 'EXTENDED PISTOL', priceBM: 88000, priceUP: 95000, note: '' },
    { category: 'ATTACHMENT', name: 'EXTENDED SMG', priceBM: 113000, priceUP: 122000, note: '' },
    { category: 'ATTACHMENT', name: 'EXTENDED RIFFLE', priceBM: 132000, priceUP: 142000, note: '' },
    { category: 'ATTACHMENT', name: 'SUPRESSOR LIGHT', priceBM: 138000, priceUP: 150000, note: '' },
    { category: 'ATTACHMENT', name: 'SUPRESSOR HEAVY', priceBM: 213000, priceUP: 230000, note: '' },
    { category: 'ATTACHMENT', name: 'SCOPE MACRO', priceBM: 100000, priceUP: 110000, note: '' },
    { category: 'ATTACHMENT', name: 'SCOPE MEDIUM', priceBM: 150000, priceUP: 163000, note: '' },
    { category: 'ATTACHMENT', name: 'FLASH', priceBM: 69000, priceUP: 75000, note: '' },
    { category: 'ATTACHMENT', name: 'GRIP', priceBM: 150000, priceUP: 163000, note: '' }
];

window.initialBmcToKelompok = [
    { group: 'HAKUSHIKAI', category: 'VEST', item: 'VEST', qty: '30-40 PCS', priceWO: 130000, priceW: 0, note: '-', ket: '-' },
    { group: 'HAKUSHIKAI', category: 'ROBBERY RESULTS', item: 'SPRING', qty: '20 PCS', priceWO: 7500, priceW: 0, note: '1:1', ket: 'BARTER WITH PLAT BESI' },
    { group: 'HAKUSHIKAI', category: 'ROBBERY RESULTS', item: 'GEAR', qty: '20 PCS', priceWO: 7500, priceW: 0, note: '1:1', ket: 'BARTER WITH PLAT BESI' },
    { group: 'HAKUSHIKAI', category: 'ROBBERY RESULTS', item: 'KOTAK KARET', qty: '20 PCS', priceWO: 7500, priceW: 0, note: '1:1', ket: 'BARTER WITH PLAT BESI' },
    { group: 'SHINIGAMI', category: 'VEST', item: 'VEST', qty: '30 PCS', priceWO: 120000, priceW: 0, note: '-', ket: '-' },
    { group: 'SHINIGAMI', category: 'ROBBERY RESULTS', item: 'SPRING', qty: '50 PCS EACH', priceWO: 7000, priceW: 0, note: '1:1', ket: 'BARTER WITH PLAT BESI' },
    { group: 'SHINIGAMI', category: 'ROBBERY RESULTS', item: 'GEAR', qty: '50 PCS EACH', priceWO: 7000, priceW: 0, note: '1:1', ket: 'BARTER WITH PLAT BESI' },
    { group: 'H2', category: 'VEST', item: 'VEST', qty: '50 PCS', priceWO: 120000, priceW: 0, note: '1:1', ket: '-' },
    { group: 'H2', category: 'ROBBERY RESULTS', item: 'SPRING', qty: '70 PCS EACH', priceWO: 5000, priceW: 0, note: '1:1', ket: 'BARTER WITH PLAT BESI' },
    { group: 'H2', category: 'ROBBERY RESULTS', item: 'GEAR', qty: '70 PCS EACH', priceWO: 5000, priceW: 0, note: '1:1', ket: 'BARTER WITH PLAT BESI' },
    { group: 'DVC', category: 'VEST', item: 'VEST', qty: '30 PCS', priceWO: 140000, priceW: 0, note: '-', ket: '-' },
    { group: 'REBELLION', category: 'VEST', item: 'VEST', qty: '30 PCS', priceWO: 150000, priceW: 0, note: '-', ket: '-' },
    { group: 'RDF', category: 'VEST', item: 'VEST', qty: 'UNLIMITED', priceWO: 120000, priceW: 0, note: '-', ket: '-' },
    { group: 'HELLSTAR', category: 'VEST', item: 'VEST', qty: '30 PCS', priceWO: 120000, priceW: 0, note: '-', ket: '-' },
    { group: 'AROGANZ', category: 'VEST', item: 'VEST', qty: '30 PCS', priceWO: 150000, priceW: 0, note: '-', ket: '-' },
    { group: 'FREEMASON', category: 'VEST', item: 'VEST', qty: '30 PCS', priceWO: 150000, priceW: 0, note: '-', ket: '-' },
    { group: 'WTMC', category: 'VEST', item: 'VEST', qty: '20 PCS', priceWO: 120000, priceW: 0, note: '-', ket: '-' },
    { group: 'CAMMORA', category: 'VEST', item: 'VEST', qty: 'TBA', priceWO: 0, priceW: 0, note: 'TBA', ket: '-' },
    { group: 'ADDON BUSINESS', category: 'ROBBERY EQUIPMENT', item: 'DRILL', qty: 'TBA', priceWO: 50000, priceW: 0, note: '-', ket: '-' },
    { group: 'ADDON BUSINESS', category: 'ROBBERY EQUIPMENT', item: 'ALAT ELECTRONIC', qty: 'TBA', priceWO: 65000, priceW: 0, note: '-', ket: '-' },
    { group: 'ADDON BUSINESS', category: 'ROBBERY EQUIPMENT', item: 'ADVANCE LOCKPICK', qty: 'TBA', priceWO: 0, priceW: 0, note: 'TBA', ket: '-' },
    { group: 'ADDON BUSINESS', category: 'ROBBERY EQUIPMENT', item: 'OBENG', qty: 'TBA', priceWO: 0, priceW: 0, note: 'TBA', ket: '-' }
];

window.initialKelompokToBmc = [
    { group: 'HAKUSHIKAI', category: 'SENJATA CLASS 1', item: 'CERAMIC', qty: '30 PCS', priceWO: 280000, priceW: 0, note: '-', ket: 'WITH JASA: TBA' },
    { group: 'HAKUSHIKAI', category: 'SENJATA CLASS 1', item: 'REVOLVER', qty: '30 PCS', priceWO: 190000, priceW: 175000, note: '-', ket: '-' },
    { group: 'HAKUSHIKAI', category: 'SENJATA CLASS 2', item: 'TEC - 9', qty: '30 PCS', priceWO: 290000, priceW: 200000, note: '-', ket: '6 KOTAK KARET, 7 SPRING, 6 GEAR' },
    { group: 'HAKUSHIKAI', category: 'SENJATA CLASS 2', item: 'MINI SMG', qty: '30 PCS', priceWO: 290000, priceW: 200000, note: '-', ket: '-' },
    { group: 'HAKUSHIKAI', category: 'SENJATA CLASS 2', item: 'MICRO SMG', qty: '30 PCS', priceWO: 370000, priceW: 240000, note: '-', ket: '-' },
    { group: 'HAKUSHIKAI', category: 'SENJATA CLASS 2', item: 'SMG', qty: '30 PCS', priceWO: 370000, priceW: 240000, note: '-', ket: '8 KOTAK KARET, 8 SPRING, 7 GEAR' },
    { group: 'HAKUSHIKAI', category: 'SENJATA CLASS 3', item: 'ASSAULT RIFFLE', qty: '3 PCS', priceWO: 400000, priceW: 0, note: '-', ket: 'WITH JASA: TBA' },
    { group: 'SHINIGAMI', category: 'SENJATA CLASS 1', item: 'CERAMIC', qty: 'UNLIMITED SELAGI ADA BAHAN', priceWO: 100000, priceW: 0, note: '-', ket: '-' },
    { group: 'SHINIGAMI', category: 'SENJATA CLASS 1', item: 'REVOLVER', qty: 'UNLIMITED SELAGI ADA BAHAN', priceWO: 200000, priceW: 0, note: '-', ket: '-' },
    { group: 'SHINIGAMI', category: 'SENJATA CLASS 2', item: 'TEC - 9', qty: 'UNLIMITED SELAGI ADA BAHAN', priceWO: 250000, priceW: 0, note: '-', ket: '-' },
    { group: 'SHINIGAMI', category: 'SENJATA CLASS 2', item: 'MINI SMG', qty: 'UNLIMITED SELAGI ADA BAHAN', priceWO: 250000, priceW: 0, note: '-', ket: '-' },
    { group: 'SHINIGAMI', category: 'SENJATA CLASS 2', item: 'MICRO SMG', qty: 'UNLIMITED SELAGI ADA BAHAN', priceWO: 280000, priceW: 0, note: '-', ket: '-' },
    { group: 'SHINIGAMI', category: 'SENJATA CLASS 2', item: 'SMG', qty: 'UNLIMITED SELAGI ADA BAHAN', priceWO: 280000, priceW: 0, note: '-', ket: '-' },
    { group: 'SHINIGAMI', category: 'SENJATA CLASS 3', item: 'ASSAULT RIFFLE', qty: 'UNLIMITED SELAGI ADA BAHAN', priceWO: 470000, priceW: 0, note: '-', ket: '-' },
    { group: 'H2', category: 'SENJATA CLASS 1', item: 'CERAMIC', qty: '500 PCS', priceWO: 80000, priceW: 0, note: '1:1', ket: '-' },
    { group: 'H2', category: 'SENJATA CLASS 1', item: 'REVOLVER', qty: '500 PCS', priceWO: 160000, priceW: 0, note: '1:1', ket: '-' },
    { group: 'H2', category: 'SENJATA CLASS 2', item: 'TEC - 9', qty: '400 PCS', priceWO: 210000, priceW: 0, note: '1:1', ket: '-' },
    { group: 'H2', category: 'SENJATA CLASS 2', item: 'MINI SMG', qty: '400 PCS', priceWO: 210000, priceW: 0, note: '1:1', ket: '-' },
    { group: 'H2', category: 'SENJATA CLASS 2', item: 'MICRO SMG', qty: '400 PCS', priceWO: 250000, priceW: 0, note: '1:1', ket: '-' },
    { group: 'H2', category: 'SENJATA CLASS 2', item: 'SMG', qty: '400 PCS', priceWO: 250000, priceW: 0, note: '1:1', ket: '-' },
    { group: 'H2', category: 'SENJATA CLASS 3', item: 'ASSAULT RIFFLE', qty: '20-30 PCS', priceWO: 500000, priceW: 0, note: '1:1', ket: '-' },
    { group: 'CAMMORA', category: 'ILLEGAL ITEMS', item: 'SPRING', qty: '-', priceWO: 14000, priceW: 5000, note: 'Rp12.500', ket: 'SPECIAL : ORDER DIATAS 100 PCS' },
    { group: 'CAMMORA', category: 'ILLEGAL ITEMS', item: 'GEAR', qty: '-', priceWO: 14000, priceW: 5000, note: 'Rp12.500', ket: 'SPECIAL : ORDER DIATAS 100 PCS' },
    { group: 'CAMMORA', category: 'ILLEGAL ITEMS', item: 'PLAT BESI', qty: '-', priceWO: 7000, priceW: 5000, note: '-', ket: '-' },
    { group: 'CAMMORA', category: 'ILLEGAL ITEMS', item: 'BUBUK MESIU', qty: '-', priceWO: 8000, priceW: 5000, note: '-', ket: '-' },
    { group: 'CAMMORA', category: 'ILLEGAL ITEMS', item: 'OLI PELUMAS', qty: '-', priceWO: 7000, priceW: 5000, note: '-', ket: '-' },
    { group: 'CORTEZ', category: 'ILLEGAL ITEMS', item: 'SPRING / GEAR / PLAT BESI / MESIU', qty: '-', priceWO: 0, priceW: 0, note: '-', ket: 'JASA 5-10K/ITEM' },
    { group: 'REBELLION', category: 'PELURU CLASS 1', item: '9MM', qty: '-', priceWO: 36000, priceW: 0, note: '-', ket: '-' },
    { group: 'REBELLION', category: 'PELURU CLASS 1', item: '44 MAGNUM', qty: '-', priceWO: 40000, priceW: 0, note: '-', ket: '-' },
    { group: 'REBELLION', category: 'PELURU CLASS 2', item: '45 ACP', qty: '-', priceWO: 45000, priceW: 0, note: '-', ket: '-' },
    { group: 'REBELLION', category: 'PELURU CLASS 3', item: '5.56 MM', qty: '-', priceWO: 60000, priceW: 0, note: '-', ket: '-' },
    { group: 'RDF', category: 'PELURU CLASS 1', item: '9MM', qty: '-', priceWO: 34000, priceW: 13000, note: '-', ket: '-' },
    { group: 'RDF', category: 'PELURU CLASS 1', item: '44 MAGNUM', qty: '-', priceWO: 33000, priceW: 15000, note: '-', ket: '-' },
    { group: 'RDF', category: 'PELURU CLASS 2', item: '45 ACP', qty: '-', priceWO: 38000, priceW: 22000, note: '-', ket: '-' },
    { group: 'RDF', category: 'PELURU CLASS 3', item: '5.56 MM', qty: '-', priceWO: 56000, priceW: 33000, note: '-', ket: '-' },
    { group: 'SINGARAJA', category: 'PELURU CLASS 1', item: '9MM', qty: '70 PCS / WEEK', priceWO: 30000, priceW: 0, note: '-', ket: '-' },
    { group: 'SINGARAJA', category: 'PELURU CLASS 1', item: '44 MAGNUM', qty: '70 PCS / WEEK', priceWO: 30000, priceW: 0, note: '-', ket: '-' },
    { group: 'SINGARAJA', category: 'PELURU CLASS 2', item: '45 ACP', qty: '70 PCS / WEEK', priceWO: 30000, priceW: 0, note: '-', ket: '-' },
    { group: 'SINGARAJA', category: 'PELURU CLASS 3', item: '5.56 MM', qty: '70 PCS / WEEK', priceWO: 50000, priceW: 0, note: '-', ket: '-' },
    { group: 'HELLSTAR', category: 'MONEY LAUNDERING', item: 'BLACK MONEY -> RED MONEY', qty: 'CUCI > 1 JUTA', priceWO: 0, priceW: 0, note: '10%', ket: 'CUCI LEBIH DARI 1 JUTA' },
    { group: 'HELLSTAR', category: 'MONEY LAUNDERING', item: 'RED MONEY -> WHITE MONEY', qty: 'CUCI > 1 JUTA', priceWO: 0, priceW: 0, note: '20%', ket: 'CUCI LEBIH DARI 1 JUTA' },
    { group: 'AROGANZ', category: 'MONEY LAUNDERING', item: 'BLACK MONEY -> RED MONEY', qty: '-', priceWO: 0, priceW: 0, note: '-', ket: '-' },
    { group: 'AROGANZ', category: 'MONEY LAUNDERING', item: 'RED MONEY -> WHITE MONEY', qty: '-', priceWO: 0, priceW: 0, note: '-', ket: '-' }
];

window.brangkasState = {
    whiteMoney: 15000000,
    blackMoney: 5000000,
    redMoney: 2000000,
    items: { 'VEST': 25, 'CERAMIC': 10, 'REVOLVER MK2': 5, '9MM': 100 }
};

window.cartItems = [];
window.bmcToKelompokData = [...window.initialBmcToKelompok];
window.kelompokToBmcData = [...window.initialKelompokToBmc];
window.transactionsData = [];

// HELPER FORMAT
function formatRP(num) { 
    if (!num || num === 0) return '-';
    return 'Rp ' + num.toLocaleString('id-ID'); 
}
function formatUSD(num) { 
    if (!num || num === 0) return '-';
    return '$ ' + num.toLocaleString('en-US'); 
}

// RENDER FUNCTIONS
window.renderBrangkas = function() {
    const wEl = document.getElementById('stat-white-money');
    if (wEl) wEl.innerText = formatRP(window.brangkasState.whiteMoney);
    const bEl = document.getElementById('stat-black-money');
    if (bEl) bEl.innerText = formatUSD(window.brangkasState.blackMoney);
    const rEl = document.getElementById('stat-red-money');
    if (rEl) rEl.innerText = formatUSD(window.brangkasState.redMoney);

    let totalItems = 0;
    const tbody = document.getElementById('tbody-brangkas-items');
    if (tbody) {
        tbody.innerHTML = '';
        for (let [itemName, qty] of Object.entries(window.brangkasState.items || {})) {
            totalItems += qty;
            tbody.innerHTML += `
                <tr>
                    <td style="font-weight:600;">${itemName}</td>
                    <td><span class="badge badge-green">${qty} PCS</span></td>
                    <td><button class="btn btn-sm btn-red" onclick="window.deleteBrangkasItem('${itemName}')">Hapus</button></td>
                </tr>
            `;
        }
    }
    const countEl = document.getElementById('stat-item-count');
    if (countEl) countEl.innerText = totalItems + ' PCS';
};

window.renderMemberCatalog = function() {
    const tbody = document.getElementById('tbody-member-catalog');
    if (!tbody) return;
    tbody.innerHTML = '';
    window.memberCatalogData.forEach((item) => {
        tbody.innerHTML += `
            <tr>
                <td><span class="badge badge-black">${item.category}</span></td>
                <td style="font-weight: bold; color: var(--accent-gold);">${item.name}</td>
                <td style="color: var(--accent-purple); font-weight: 600;">${item.priceBM ? formatUSD(item.priceBM) : 'FREE'}</td>
                <td style="color: var(--accent-green); font-weight: 600;">${item.priceUP ? formatRP(item.priceUP) : 'FREE'}</td>
                <td style="color: var(--text-muted); font-size: 0.85rem;">${item.note}</td>
                <td>
                    <button class="btn btn-sm btn-green" onclick="window.addToCart('${item.name}', ${item.priceBM}, ${item.priceUP})">+ Keranjang</button>
                </td>
            </tr>
        `;
    });
};

window.renderCart = function() {
    const tbody = document.getElementById('tbody-cart-items');
    if (!tbody) return;
    const payType = document.getElementById('cart-pay-type')?.value || 'UP';
    tbody.innerHTML = '';
    let grandTotal = 0;

    if (window.cartItems.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">Keranjang Kosong</td></tr>`;
    } else {
        window.cartItems.forEach(item => {
            const price = payType === 'BM' ? item.priceBM : item.priceUP;
            const subtotal = price * item.qty;
            grandTotal += subtotal;
            tbody.innerHTML += `
                <tr>
                    <td style="font-weight:600; font-size:0.85rem;">${item.name}</td>
                    <td>
                        <input type="number" min="1" value="${item.qty}" class="form-control" style="width:55px; padding:2px 5px;" onchange="window.updateCartQty('${item.name}', this.value)">
                    </td>
                    <td style="font-size:0.85rem; font-weight:bold; color:var(--accent-green);">${payType === 'BM' ? formatUSD(subtotal) : formatRP(subtotal)}</td>
                    <td><button class="btn btn-sm btn-red" onclick="window.removeFromCart('${item.name}')">✕</button></td>
                </tr>
            `;
        });
    }
    const totEl = document.getElementById('cart-grand-total');
    if (totEl) totEl.innerText = payType === 'BM' ? formatUSD(grandTotal) : formatRP(grandTotal);
};

window.renderBmcToKelompok = function() {
    const tbody = document.getElementById('tbody-bmc-to-kelompok');
    if (!tbody) return;
    tbody.innerHTML = '';
    window.bmcToKelompokData.forEach((item, index) => {
        tbody.innerHTML += `
            <tr>
                <td style="font-weight: bold; color: var(--accent-gold);">${item.group}</td>
                <td><span class="badge badge-black">${item.category}</span></td>
                <td style="font-weight: 600;">${item.item}</td>
                <td><span class="badge badge-white">${item.qty}</span></td>
                <td style="color: var(--accent-green);">${item.priceWO ? formatRP(item.priceWO) : '-'}</td>
                <td style="color: var(--accent-blue);">${item.priceW ? formatRP(item.priceW) : '-'}</td>
                <td style="color: var(--accent-red); font-size: 0.85rem;">${item.note || '-'}</td>
                <td style="color: var(--text-muted); font-size: 0.85rem;">${item.ket || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-blue" onclick="window.processOrderPanel('BMC_TO_KELOMPOK', ${index})">Proses Order</button>
                </td>
            </tr>
        `;
    });
};

window.renderKelompokToBmc = function() {
    const tbody = document.getElementById('tbody-kelompok-to-bmc');
    if (!tbody) return;
    tbody.innerHTML = '';
    window.kelompokToBmcData.forEach((item, index) => {
        tbody.innerHTML += `
            <tr>
                <td style="font-weight: bold; color: var(--accent-gold);">${item.group}</td>
                <td><span class="badge badge-black">${item.category}</span></td>
                <td style="font-weight: 600;">${item.item}</td>
                <td><span class="badge badge-white">${item.qty}</span></td>
                <td style="color: var(--accent-green);">${item.priceWO ? formatRP(item.priceWO) : '-'}</td>
                <td style="color: var(--accent-blue);">${item.priceW ? formatRP(item.priceW) : '-'}</td>
                <td style="color: var(--accent-red); font-size: 0.85rem;">${item.note || '-'}</td>
                <td style="color: var(--text-muted); font-size: 0.85rem;">${item.ket || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-green" onclick="window.processOrderPanel('KELOMPOK_TO_BMC', ${index})">Terima / Beli</button>
                </td>
            </tr>
        `;
    });
};

window.renderTransactions = function() {
    const tbody = document.getElementById('tbody-transactions');
    if (!tbody) return;
    tbody.innerHTML = '';
    window.transactionsData.forEach(tx => {
        const isIncome = tx.type === 'PEMASUKAN';
        tbody.innerHTML += `
            <tr>
                <td style="color:var(--text-muted); font-size:0.85rem;">${tx.time}</td>
                <td><span class="badge ${isIncome ? 'badge-green' : 'badge-red'}">${tx.type}</span></td>
                <td style="font-weight:600;">${tx.item}</td>
                <td>${tx.qty} PCS</td>
                <td style="font-weight:bold; color:${isIncome ? 'var(--accent-green)' : 'var(--accent-red)'};">${tx.total}</td>
                <td>${tx.payType}</td>
                <td style="color:var(--text-muted); font-size:0.85rem;">${tx.notes}</td>
            </tr>
        `;
    });
};

function renderAll() {
    window.renderBrangkas();
    window.renderMemberCatalog();
    window.renderBmcToKelompok();
    window.renderKelompokToBmc();
    window.renderTransactions();
    window.renderCart();
}

// SYNC FIREBASE
async function saveDataToCloud() {
    try {
        await setDoc(docRef, {
            brangkasState: window.brangkasState,
            bmcToKelompokData: window.bmcToKelompokData,
            kelompokToBmcData: window.kelompokToBmcData,
            transactionsData: window.transactionsData,
            lastUpdated: new Date().toISOString()
        }, { merge: true });
    } catch (error) {
        console.error("Gagal simpan ke Cloud:", error);
    }
}

window.saveData = saveDataToCloud;

function initRealtimeSync() {
    onSnapshot(docRef, (docSnap) => {
        const statusEl = document.getElementById('status-koneksi');
        if (docSnap.exists()) {
            const data = docSnap.data();
            window.brangkasState = data.brangkasState || window.brangkasState;
            window.bmcToKelompokData = data.bmcToKelompokData || window.initialBmcToKelompok;
            window.kelompokToBmcData = data.kelompokToBmcData || window.initialKelompokToBmc;
            window.transactionsData = data.transactionsData || [];

            if (statusEl) {
                statusEl.innerText = "🟢 Terhubung Cloud";
                statusEl.style.backgroundColor = "#d1fae5";
                statusEl.style.color = "#065f46";
            }
        } else {
            if (statusEl) {
                statusEl.innerText = "🟢 Terhubung (Baru)";
                statusEl.style.backgroundColor = "#d1fae5";
                statusEl.style.color = "#065f46";
            }
            saveDataToCloud();
        }
        renderAll();
    }, (err) => {
        console.error("Error Real-time:", err);
        const statusEl = document.getElementById('status-koneksi');
        if (statusEl) {
            statusEl.innerText = "🔴 Disconnected";
            statusEl.style.backgroundColor = "#fee2e2";
            statusEl.style.color = "#991b1b";
        }
        renderAll();
    });
}

// UI & TAB SYSTEM
window.handleRoleChange = function() {
    const roleSelect = document.getElementById('user-role');
    if (roleSelect.value === 'admin') {
        if (!window.isAdminLoggedIn) {
            document.getElementById('modal-pin')?.classList.add('active');
            document.getElementById('input-pin-admin')?.focus();
        } else {
            window.showAdminTabs();
        }
    } else {
        window.isAdminLoggedIn = false;
        window.hideAdminTabs();
    }
};

window.submitAdminPin = function() {
    const pinVal = document.getElementById('input-pin-admin')?.value;
    if (pinVal === window.ADMIN_PIN) {
        window.isAdminLoggedIn = true;
        document.getElementById('modal-pin')?.classList.remove('active');
        if (document.getElementById('input-pin-admin')) document.getElementById('input-pin-admin').value = '';
        window.showAdminTabs();
        alert('Akses Admin Diterima!');
    } else {
        alert('PIN Salah!');
        if (document.getElementById('input-pin-admin')) document.getElementById('input-pin-admin').value = '';
        window.cancelAdminAuth();
    }
};

window.cancelAdminAuth = function() {
    document.getElementById('modal-pin')?.classList.remove('active');
    if (document.getElementById('input-pin-admin')) document.getElementById('input-pin-admin').value = '';
    if (document.getElementById('user-role')) document.getElementById('user-role').value = 'member';
    window.hideAdminTabs();
};

window.showAdminTabs = function() {
    document.querySelectorAll('.admin-tab').forEach(el => el.classList.remove('admin-only'));
};

window.hideAdminTabs = function() {
    document.querySelectorAll('.admin-tab').forEach(el => el.classList.add('admin-only'));
    window.switchTab('member-catalog');
};

window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    let btnId = 'btn-tab-member';
    if (tabId === 'dashboard') btnId = 'btn-tab-dashboard';
    else if (tabId === 'bmc-to-kelompok') btnId = 'btn-tab-bmc';
    else if (tabId === 'kelompok-to-bmc') btnId = 'btn-tab-kelompok';
    else if (tabId === 'transactions') btnId = 'btn-tab-tx';

    document.getElementById(btnId)?.classList.add('active');
    document.getElementById(tabId)?.classList.add('active');
};

// FITUR KELOLA KEUANGAN DASHBOARD (FIXED REFRESH ISSUE)
window.handleDashboardMoney = async function(event, type) {
    if (event) event.preventDefault(); // Mencegah form reload/pindah tab

    const amountInput = prompt(`Masukkan Jumlah Uang untuk transaksi ${type}:`, "100000");
    if (!amountInput) return;

    const nominal = parseInt(amountInput);
    if (isNaN(nominal) || nominal <= 0) {
        alert("Nominal tidak valid!");
        return;
    }

    const payType = confirm("Klik OK untuk 'Uang Putih' atau CANCEL untuk 'Black Money'") ? 'UP' : 'BM';
    const notes = prompt("Keterangan / Catatan Transaksi:", "Setor/Tarik Brangkas");

    if (type === 'PEMASUKAN') {
        if (payType === 'UP') window.brangkasState.whiteMoney += nominal;
        else window.brangkasState.blackMoney += nominal;
    } else {
        if (payType === 'UP') window.brangkasState.whiteMoney = Math.max(0, window.brangkasState.whiteMoney - nominal);
        else window.brangkasState.blackMoney = Math.max(0, window.brangkasState.blackMoney - nominal);
    }

    const formattedTotal = payType === 'UP' ? formatRP(nominal) : formatUSD(nominal);

    window.transactionsData.unshift({
        time: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
        type: type,
        item: 'KAS BRANGKAS',
        qty: 1,
        total: formattedTotal,
        payType: payType === 'UP' ? 'Uang Putih' : 'Black Money',
        notes: notes || '-'
    });

    await window.saveData();
    renderAll();
    alert(`✅ Transaksi ${type} senilai ${formattedTotal} Berhasil Dicatat!`);
};

// FITUR ORDER CUSTOM & PROSES ORDER PANEL
window.openCustomOrderModal = async function(targetPanel) {
    const group = prompt("Masukkan Nama Kelompok / Pengorder:", "HAKUSHIKAI");
    if (!group) return;

    const category = prompt("Masukkan Kategori Barang:", "SENJATA / VEST / DLL");
    const item = prompt("Masukkan Nama Barang:", "AK-47 / VEST / DLL");
    const qty = prompt("Masukkan Qty / Jumlah:", "10 PCS");
    const priceWO = parseInt(prompt("Harga Without Jasa (Nominal Angka saja):", "100000")) || 0;
    const priceW = parseInt(prompt("Harga With Jasa (Nominal Angka saja, isi 0 jika tidak ada):", "0")) || 0;
    const note = prompt("Special Note / Catatan:", "-");
    const ket = prompt("Keterangan Tambahan:", "-");

    const newObj = { group, category, item, qty, priceWO, priceW, note, ket };

    if (targetPanel === 'BMC_TO_KELOMPOK') {
        window.bmcToKelompokData.push(newObj);
    } else {
        window.kelompokToBmcData.push(newObj);
    }

    await window.saveData();
    renderAll();
    alert("✅ Order Custom Berhasil Ditambahkan!");
};

window.processOrderPanel = async function(type, index) {
    const dataList = type === 'BMC_TO_KELOMPOK' ? window.bmcToKelompokData : window.kelompokToBmcData;
    const item = dataList[index];

    if (!item) return;

    const qtyInput = prompt(`Proses Order [${item.item}] (${item.group})\nMasukkan Jumlah (Qty):`, "1");
    if (!qtyInput) return;

    const qty = parseInt(qtyInput);
    if (isNaN(qty) || qty <= 0) {
        alert("Jumlah tidak valid!");
        return;
    }

    const priceToUse = item.priceWO || item.priceW || 0;
    const total = priceToUse * qty;
    const isIncome = type === 'BMC_TO_KELOMPOK';
    const txType = isIncome ? 'PEMASUKAN' : 'PENGELUARAN';

    if (isIncome) {
        window.brangkasState.whiteMoney += total;
    } else {
        window.brangkasState.whiteMoney = Math.max(0, window.brangkasState.whiteMoney - total);
    }

    window.transactionsData.unshift({
        time: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
        type: txType,
        item: `${item.item} (${item.group})`,
        qty: qty,
        total: formatRP(total),
        payType: 'Uang Putih',
        notes: `Order Panel: ${item.group} | Note: ${item.note || '-'}`
    });

    await window.saveData();
    renderAll();
    alert(`✅ Order ${item.item} berhasil diproses!`);
};

// CART FUNCTIONS
window.addToCart = function(itemName, priceBM, priceUP) {
    const existing = window.cartItems.find(i => i.name === itemName);
    if (existing) {
        existing.qty += 1;
    } else {
        window.cartItems.push({ name: itemName, priceBM: priceBM, priceUP: priceUP, qty: 1 });
    }
    window.renderCart();
};

window.updateCartQty = function(itemName, qty) {
    const item = window.cartItems.find(i => i.name === itemName);
    if (item) item.qty = Math.max(1, parseInt(qty) || 1);
    window.renderCart();
};

window.removeFromCart = function(itemName) {
    window.cartItems = window.cartItems.filter(i => i.name !== itemName);
    window.renderCart();
};

window.clearCart = function() {
    window.cartItems = [];
    window.renderCart();
};

window.checkoutMemberCart = async function() {
    if (window.cartItems.length === 0) {
        alert("Keranjang masih kosong! Silakan pilih barang dulu.");
        return;
    }

    const buyerInputs = document.querySelectorAll('input[placeholder*="Alex"], input[placeholder*="Pembeli"]');
    const sellerInputs = document.querySelectorAll('input[placeholder*="Haqi"], input[placeholder*="Penjual"]');
    
    const buyerInput = buyerInputs.length > 0 ? buyerInputs[0].value.trim() : '';
    const sellerInput = sellerInputs.length > 0 ? sellerInputs[0].value.trim() : '';
    
    const paySelect = document.querySelector('select:has(option[value*="Uang"]), #cart-pay-type');
    const payType = paySelect ? (paySelect.value.includes('Black') || paySelect.value === 'BM' ? 'BM' : 'UP') : 'UP';

    if (!buyerInput || !sellerInput) {
        alert("Harap isi 'Nama Anggota / Pembeli' dan 'Belinya Ke Siapa (Penjual)'!");
        return;
    }

    let totalNominal = 0;
    let itemSummaryList = [];

    window.cartItems.forEach(item => {
        const price = payType === 'BM' ? item.priceBM : item.priceUP;
        totalNominal += (price * item.qty);
        itemSummaryList.push(`${item.name} (${item.qty}x)`);
    });

    const formattedTotal = payType === 'BM' ? formatUSD(totalNominal) : formatRP(totalNominal);
    const itemSummaryStr = itemSummaryList.join(', ');

    const newTransaction = {
        time: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
        type: 'PEMASUKAN',
        item: itemSummaryStr,
        qty: window.cartItems.reduce((acc, curr) => acc + curr.qty, 0),
        total: formattedTotal,
        payType: payType === 'BM' ? 'Black Money' : 'Uang Putih',
        notes: `Pembeli: ${buyerInput} | Penjual: ${sellerInput}`
    };

    window.transactionsData.unshift(newTransaction);

    if (payType === 'BM') {
        window.brangkasState.blackMoney += totalNominal;
    } else {
        window.brangkasState.whiteMoney += totalNominal;
    }

    window.cartItems.forEach(item => {
        if (window.brangkasState.items && window.brangkasState.items[item.name]) {
            window.brangkasState.items[item.name] = Math.max(0, window.brangkasState.items[item.name] - item.qty);
        }
    });

    await window.saveData();
    window.clearCart();
    
    buyerInputs.forEach(i => i.value = '');
    sellerInputs.forEach(i => i.value = '');

    renderAll();
    alert("✅ Transaksi Berhasil Diproses & Dicatat ke Rekapan Transaksi!");
};

// INIT ON LOAD
window.addEventListener('DOMContentLoaded', () => {
    renderAll();
    initRealtimeSync();

    // Event listener untuk tombol Tambah Custom Order
    document.querySelectorAll('button').forEach(btn => {
        if (btn.innerText.includes('TAMBAH ORDER CUSTOM')) {
            btn.onclick = () => {
                const currentTab = document.querySelector('.tab-content.active')?.id;
                if (currentTab === 'bmc-to-kelompok') window.openCustomOrderModal('BMC_TO_KELOMPOK');
                else window.openCustomOrderModal('KELOMPOK_TO_BMC');
            };
        }
    });

    const pinInput = document.getElementById('input-pin-admin');
    if (pinInput) {
        pinInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') window.submitAdminPin();
        });
    }

    const checkoutBtn = document.querySelector('button:has(span), button.btn-green');
    if (checkoutBtn && checkoutBtn.innerText.includes('PROSES ORDER')) {
        checkoutBtn.onclick = window.checkoutMemberCart;
    }
});
