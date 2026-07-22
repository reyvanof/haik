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

// GLOBAL STATE & KONFIGURASI
window.ADMIN_PIN = "6969";
window.isAdminLoggedIn = false;

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
    { group: 'HAKUSHIKAI', category: 'VEST', item: 'VEST', qty: '30-40 PCS', priceWO: 130000, priceW: null, note: '', ket: '' },
    { group: 'HAKUSHIKAI', category: 'ROBBERY RESULTS', item: 'SPRING', qty: '20 PCS', priceWO: 75000, priceW: null, note: '1:1', ket: 'BARTER WITH PLAT BESI' },
    { group: 'HAKUSHIKAI', category: 'ROBBERY RESULTS', item: 'GEAR', qty: '20 PCS', priceWO: 7500, priceW: null, note: '1:1', ket: 'BARTER WITH PLAT BESI' },
    { group: 'HAKUSHIKAI', category: 'ROBBERY RESULTS', item: 'KOTAK KARET', qty: '20 PCS', priceWO: 7500, priceW: null, note: '1:1', ket: '' },
    { group: 'SHINIGAMI', category: 'VEST', item: 'VEST', qty: '30 PCS', priceWO: 120000, priceW: null, note: '', ket: '' },
    { group: 'SHINIGAMI', category: 'ROBBERY RESULTS', item: 'SPRING', qty: '50 PCS EACH', priceWO: 7000, priceW: null, note: '1:1', ket: 'BARTER WITH PLAT BESI' },
    { group: 'SHINIGAMI', category: 'ROBBERY RESULTS', item: 'GEAR', qty: '50 PCS EACH', priceWO: 7000, priceW: null, note: '1:1', ket: 'BARTER WITH PLAT BESI' },
    { group: 'H2', category: 'VEST', item: 'VEST', qty: '50 PCS', priceWO: 120000, priceW: null, note: '1:1', ket: '' },
    { group: 'H2', category: 'ROBBERY RESULTS', item: 'SPRING', qty: '70 PCS EACH', priceWO: 5000, priceW: null, note: '1:1', ket: 'BARTER WITH PLAT BESI' },
    { group: 'H2', category: 'ROBBERY RESULTS', item: 'GEAR', qty: '70 PCS EACH', priceWO: 5000, priceW: null, note: '1:1', ket: 'BARTER WITH PLAT BESI' },
    { group: 'DVC', category: 'VEST', item: 'VEST', qty: '30 PCS', priceWO: 140000, priceW: null, note: '', ket: '' },
    { group: 'REBELLION', category: 'VEST', item: 'VEST', qty: '30 PCS', priceWO: 150000, priceW: null, note: '', ket: '' },
    { group: 'RDF', category: 'VEST', item: 'VEST', qty: 'UNLIMITED', priceWO: 120000, priceW: null, note: '', ket: '' },
    { group: 'HELL STAR', category: 'VEST', item: 'VEST', qty: '30 PCS', priceWO: 120000, priceW: null, note: '', ket: '' },
    { group: 'AROGANZ', category: 'VEST', item: 'VEST', qty: '30 PCS', priceWO: 150000, priceW: null, note: '', ket: '' },
    { group: 'FREEMASON', category: 'VEST', item: 'VEST', qty: '30 PCS', priceWO: 150000, priceW: null, note: '', ket: '' },
    { group: 'WTMC', category: 'VEST', item: 'VEST', qty: '20 PCS', priceWO: 120000, priceW: null, note: '', ket: '' },
    { group: 'CAMMORA', category: 'VEST', item: 'VEST', qty: 'TBA', priceWO: 0, priceW: null, note: '', ket: '' },
    { group: 'SINGARAJA', category: 'VEST', item: 'SINGARAJA VEST', qty: '70 PCS', priceWO: 115000, priceW: null, note: '', ket: '' },
    { group: 'SINGARAJA', category: 'PELURU CLASS 1', item: '9MM', qty: 'FLEXIBLE', priceWO: 30000, priceW: null, note: 'per clip', ket: '' },
    { group: 'SINGARAJA', category: 'PELURU CLASS 1', item: '44 MAGNUM', qty: 'FLEXIBLE', priceWO: 30000, priceW: null, note: 'per clip', ket: '' },
    { group: 'SINGARAJA', category: 'PELURU CLASS 2', item: '45 ACP', qty: 'FLEXIBLE', priceWO: 30000, priceW: null, note: 'per clip', ket: '' },
    { group: 'SINGARAJA', category: 'PELURU CLASS 3', item: '5.56 MM', qty: 'FLEXIBLE', priceWO: 50000, priceW: null, note: 'per clip', ket: '' }
];

window.initialKelompokToBmc = [
    { group: 'HAKUSHIKAI', category: 'SENJATA CLASS 1', item: 'CERAMIC', qty: '30 PCS', priceWO: 280000, priceW: 0, note: '', ket: '' },
    { group: 'HAKUSHIKAI', category: 'SENJATA CLASS 1', item: 'REVOLVER', qty: '30 PCS', priceWO: 190000, priceW: 175000, note: '', ket: '' },
    { group: 'HAKUSHIKAI', category: 'SENJATA CLASS 2', item: 'TEC-9', qty: '30 PCS', priceWO: 290000, priceW: 200000, note: '', ket: '6 KOTAK KARET, 7 SPRING, 6 GEAR' },
    { group: 'HAKUSHIKAI', category: 'SENJATA CLASS 2', item: 'MINI SMG', qty: '30 PCS', priceWO: 290000, priceW: 200000, note: '', ket: '' },
    { group: 'HAKUSHIKAI', category: 'SENJATA CLASS 2', item: 'MICRO SMG', qty: '30 PCS', priceWO: 370000, priceW: 240000, note: '', ket: '8 KOTAK KARET, 8 SPRING, 7 GEAR' },
    { group: 'HAKUSHIKAI', category: 'SENJATA CLASS 2', item: 'SMG', qty: '30 PCS', priceWO: 370000, priceW: 240000, note: '', ket: '' },
    { group: 'HAKUSHIKAI', category: 'SENJATA CLASS 3', item: 'ASSAULT RIFFLE', qty: '3 PCS', priceWO: 400000, priceW: 0, note: '', ket: '' },
    { group: 'SHINIGAMI', category: 'SENJATA CLASS 1', item: 'CERAMIC', qty: 'UNLIMITED SELAGI ADA BAHAN', priceWO: 100000, priceW: null, note: '', ket: '' },
    { group: 'SHINIGAMI', category: 'SENJATA CLASS 1', item: 'REVOLVER', qty: 'UNLIMITED', priceWO: 200000, priceW: null, note: '', ket: '' },
    { group: 'SHINIGAMI', category: 'SENJATA CLASS 2', item: 'TEC-9', qty: 'UNLIMITED', priceWO: 250000, priceW: null, note: '', ket: '' },
    { group: 'SHINIGAMI', category: 'SENJATA CLASS 2', item: 'MINI SMG', qty: 'UNLIMITED', priceWO: 250000, priceW: null, note: '', ket: '' },
    { group: 'SHINIGAMI', category: 'SENJATA CLASS 2', item: 'MICRO SMG', qty: 'UNLIMITED', priceWO: 280000, priceW: null, note: '', ket: '' },
    { group: 'SHINIGAMI', category: 'SENJATA CLASS 2', item: 'SMG', qty: 'UNLIMITED', priceWO: 280000, priceW: null, note: '', ket: '' },
    { group: 'SHINIGAMI', category: 'SENJATA CLASS 3', item: 'ASSAULT RIFFLE', qty: 'UNLIMITED', priceWO: 470000, priceW: null, note: '', ket: '' },
    { group: 'H2', category: 'SENJATA CLASS 1', item: 'CERAMIC', qty: '500 PCS', priceWO: 80000, priceW: null, note: '1:1', ket: '' },
    { group: 'H2', category: 'SENJATA CLASS 1', item: 'REVOLVER', qty: '500 PCS', priceWO: 160000, priceW: null, note: '1:1', ket: '' },
    { group: 'H2', category: 'SENJATA CLASS 2', item: 'TEC-9 / MINI SMG', qty: '400 PCS', priceWO: 210000, priceW: null, note: '1:1', ket: '' },
    { group: 'H2', category: 'SENJATA CLASS 2', item: 'MICRO SMG / SMG', qty: '400 PCS', priceWO: 250000, priceW: null, note: '1:1', ket: '' },
    { group: 'H2', category: 'SENJATA CLASS 3', item: 'ASSAULT RIFFLE', qty: '20-30 PCS', priceWO: 500000, priceW: null, note: '1:1', ket: '' },
    { group: 'CAMMORA', category: 'ILLEGAL ITEMS', item: 'SPRING', qty: 'FLEXIBLE', priceWO: 14000, priceW: 5000, note: 'SPECIAL: ORDER > 100 PCS (12.5k)', ket: '' },
    { group: 'CAMMORA', category: 'ILLEGAL ITEMS', item: 'GEAR', qty: 'FLEXIBLE', priceWO: 14000, priceW: 5000, note: 'SPECIAL: ORDER > 100 PCS (12.5k)', ket: '' },
    { group: 'CAMMORA', category: 'ILLEGAL ITEMS', item: 'PLAT BESI', qty: 'FLEXIBLE', priceWO: 7000, priceW: 5000, note: '', ket: '' },
    { group: 'CAMMORA', category: 'ILLEGAL ITEMS', item: 'BUBUK MESIU', qty: 'FLEXIBLE', priceWO: 8000, priceW: 5000, note: '', ket: '' },
    { group: 'CAMMORA', category: 'ILLEGAL ITEMS', item: 'OLI PELUMAS', qty: 'FLEXIBLE', priceWO: 7000, priceW: 5000, note: '', ket: '' },
    { group: 'CORTEZ', category: 'ILLEGAL ITEMS', item: 'SPRING / GEAR / PLAT BESI / MESIU', qty: 'FLEXIBLE', priceWO: 0, priceW: 0, note: 'JASA 5-10K / ITEM', ket: '' },
    { group: 'REBELLION', category: 'PELURU CLASS 1', item: '9MM', qty: 'FLEXIBLE', priceWO: 38000, priceW: null, note: '', ket: '' },
    { group: 'REBELLION', category: 'PELURU CLASS 1', item: '44 MAGNUM', qty: 'FLEXIBLE', priceWO: 40000, priceW: null, note: '', ket: '' },
    { group: 'REBELLION', category: 'PELURU CLASS 2', item: '45 ACP', qty: 'FLEXIBLE', priceWO: 45000, priceW: null, note: '', ket: '' },
    { group: 'REBELLION', category: 'PELURU CLASS 3', item: '5.56 MM', qty: 'FLEXIBLE', priceWO: 60000, priceW: null, note: '', ket: '' },
    { group: 'RDF', category: 'PELURU CLASS 1', item: '9MM', qty: 'FLEXIBLE', priceWO: 34000, priceW: 13000, note: '', ket: '' },
    { group: 'RDF', category: 'PELURU CLASS 1', item: '44 MAGNUM', qty: 'FLEXIBLE', priceWO: 33000, priceW: 15000, note: '', ket: '' },
    { group: 'RDF', category: 'PELURU CLASS 2', item: '45 ACP', qty: 'FLEXIBLE', priceWO: 38000, priceW: 22000, note: '', ket: '' },
    { group: 'RDF', category: 'PELURU CLASS 3', item: '5.56 MM', qty: 'FLEXIBLE', priceWO: 56000, priceW: 33000, note: '', ket: '' },
    { group: 'SINGARAJA', category: 'VEST', item: 'VEST', qty: 'MAX 70 PCS', priceWO: 115000, priceW: null, note: '', ket: '' },
    { group: 'SINGARAJA', category: 'PELURU CLASS 1', item: '9MM', qty: '70 PCS / WEEK', priceWO: 30000, priceW: null, note: 'per clip', ket: '' },
    { group: 'SINGARAJA', category: 'PELURU CLASS 1', item: '44 MAGNUM', qty: '70 PCS / WEEK', priceWO: 30000, priceW: null, note: 'per clip', ket: '' },
    { group: 'SINGARAJA', category: 'PELURU CLASS 2', item: '45 ACP', qty: '70 PCS / WEEK', priceWO: 30000, priceW: null, note: 'per clip', ket: '' },
    { group: 'SINGARAJA', category: 'PELURU CLASS 3', item: '5.56 MM', qty: '70 PCS / WEEK', priceWO: 50000, priceW: null, note: 'per clip', ket: '' },
    { group: 'HELL STAR', category: 'MONEY LAUNDERING', item: 'BLACK MONEY -> RED MONEY', qty: 'CUCI > 1 JUTA', priceWO: 0, priceW: 0, note: '10% FEE', ket: 'CUCI MONEY' },
    { group: 'HELL STAR', category: 'MONEY LAUNDERING', item: 'RED MONEY -> WHITE MONEY', qty: 'CUCI > 1 JUTA', priceWO: 0, priceW: 0, note: '20% FEE', ket: 'CUCI MONEY' }
];

window.brangkasState = {
    whiteMoney: 15000000,
    blackMoney: 5000000,
    redMoney: 2000000,
    items: { 'VEST': 25, 'CERAMIC': 10, 'REVOLVER MK2': 5, '9MM': 100, 'PLAT BESI': 150 }
};

window.cartItems = [];
window.bmcToKelompokData = [...window.initialBmcToKelompok];
window.kelompokToBmcData = [...window.initialKelompokToBmc];
window.transactionsData = [];

// FUNGSI SINKRONISASI CLOUD FIREBASE
async function saveDataToCloud() {
    try {
        await setDoc(docRef, {
            brangkasState: window.brangkasState,
            bmcToKelompokData: window.bmcToKelompokData,
            kelompokToBmcData: window.kelompokToBmcData,
            transactionsData: window.transactionsData,
            lastUpdated: new Date().toISOString()
        }, { merge: true });
        console.log("Sync Sukses Ke Cloud Firestore BMCC!");
    } catch (error) {
        console.error("Gagal simpan ke Cloud:", error);
    }
}

window.saveData = function() {
    saveDataToCloud();
};

function initRealtimeSync() {
    onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            window.brangkasState = data.brangkasState || window.brangkasState;
            window.bmcToKelompokData = data.bmcToKelompokData || window.initialBmcToKelompok;
            window.kelompokToBmcData = data.kelompokToBmcData || window.initialKelompokToBmc;
            window.transactionsData = data.transactionsData || [];

            const statusEl = document.getElementById('status-koneksi');
            if (statusEl) {
                statusEl.innerText = "🟢 Terhubung Cloud";
                statusEl.style.backgroundColor = "#d1fae5";
                statusEl.style.color = "#065f46";
            }

            renderAll();
        } else {
            saveDataToCloud();
        }
    }, (err) => {
        console.error("Error Real-time:", err);
        const statusEl = document.getElementById('status-koneksi');
        if (statusEl) {
            statusEl.innerText = "🔴 Disconnected";
            statusEl.style.backgroundColor = "#fee2e2";
            statusEl.style.color = "#991b1b";
        }
    });
}

function renderAll() {
    if (typeof window.renderBrangkas === "function") window.renderBrangkas();
    if (typeof window.renderMemberCatalog === "function") window.renderMemberCatalog();
    if (typeof window.renderBmcToKelompok === "function") window.renderBmcToKelompok();
    if (typeof window.renderKelompokToBmc === "function") window.renderKelompokToBmc();
    if (typeof window.renderTransactions === "function") window.renderTransactions();
    if (typeof window.renderCart === "function") window.renderCart();
}

// LOGIKA UI DAN PEMROSETAN AKSI
window.handleRoleChange = function() {
    const roleSelect = document.getElementById('user-role');
    if (roleSelect.value === 'admin') {
        if (!window.isAdminLoggedIn) {
            document.getElementById('modal-pin').classList.add('active');
            document.getElementById('input-pin-admin').focus();
        } else {
            window.showAdminTabs();
        }
    } else {
        window.isAdminLoggedIn = false;
        window.hideAdminTabs();
    }
};

window.submitAdminPin = function() {
    const pinVal = document.getElementById('input-pin-admin').value;
    if (pinVal === window.ADMIN_PIN) {
        window.isAdminLoggedIn = true;
        document.getElementById('modal-pin').classList.remove('active');
        document.getElementById('input-pin-admin').value = '';
        window.showAdminTabs();
        alert('Akses Admin / Pengurus Diterima!');
    } else {
        alert('PIN Salah! Akses ditolak.');
        document.getElementById('input-pin-admin').value = '';
        window.cancelAdminAuth();
    }
};

window.cancelAdminAuth = function() {
    document.getElementById('modal-pin').classList.remove('active');
    document.getElementById('input-pin-admin').value = '';
    document.getElementById('user-role').value = 'member';
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

    const activeBtn = document.getElementById(btnId);
    if (activeBtn) activeBtn.classList.add('active');

    const activeTab = document.getElementById(tabId);
    if (activeTab) activeTab.classList.add('active');
};

function formatRP(num) {
    return 'Rp ' + (num || 0).toLocaleString('id-ID');
}
function formatUSD(num) {
    return '$ ' + (num || 0).toLocaleString('en-US');
}

window.renderBrangkas = function() {
    document.getElementById('stat-white-money').innerText = formatRP(window.brangkasState.whiteMoney);
    document.getElementById('stat-black-money').innerText = formatUSD(window.brangkasState.blackMoney);
    document.getElementById('stat-red-money').innerText = formatUSD(window.brangkasState.redMoney);

    let totalItems = 0;
    const tbody = document.getElementById('tbody-brangkas-items');
    tbody.innerHTML = '';

    for (let [itemName, qty] of Object.entries(window.brangkasState.items || {})) {
        totalItems += qty;
        tbody.innerHTML += `
            <tr>
                <td style="font-weight:600;">${itemName}</td>
                <td><span class="badge badge-green">${qty} PCS</span></td>
                <td>
                    <button class="btn btn-sm btn-red" onclick="deleteBrangkasItem('${itemName}')">Hapus</button>
                </td>
            </tr>
        `;
    }

    document.getElementById('stat-item-count').innerText = totalItems + ' PCS';
};

window.toggleBrangkasType = function() {
    const type = document.getElementById('b-type').value;
    const itemGroup = document.getElementById('group-b-item-name');
    const lblQty = document.getElementById('lbl-b-qty');

    if (type === 'item') {
        itemGroup.style.display = 'block';
        lblQty.innerText = 'Jumlah Barang (QTY)';
    } else {
        itemGroup.style.display = 'none';
        lblQty.innerText = 'Nominal Uang';
    }
};

window.saveBrangkas = function(e) {
    e.preventDefault();
    const type = document.getElementById('b-type').value;
    const action = document.getElementById('b-action').value;
    const qty = parseInt(document.getElementById('b-qty').value) || 0;
    const notes = document.getElementById('b-notes').value.trim() || 'Manual Update Kas Brangkas';

    const now = new Date().toLocaleString('id-ID');
    let txType = 'PEMASUKAN';
    let labelKas = '';
    let formattedVal = '';

    if (type === 'white') {
        labelKas = 'Uang Putih (Rp)';
        formattedVal = formatRP(qty);
        if (action === 'add') {
            window.brangkasState.whiteMoney += qty;
            txType = 'PEMASUKAN';
        } else if (action === 'sub') {
            window.brangkasState.whiteMoney = Math.max(0, window.brangkasState.whiteMoney - qty);
            txType = 'PENGELUARAN';
        } else {
            window.brangkasState.whiteMoney = qty;
            txType = 'PEMASUKAN';
        }
    } else if (type === 'black') {
        labelKas = 'Black Money ($)';
        formattedVal = formatUSD(qty);
        if (action === 'add') {
            window.brangkasState.blackMoney += qty;
            txType = 'PEMASUKAN';
        } else if (action === 'sub') {
            window.brangkasState.blackMoney = Math.max(0, window.brangkasState.blackMoney - qty);
            txType = 'PENGELUARAN';
        } else {
            window.brangkasState.blackMoney = qty;
            txType = 'PEMASUKAN';
        }
    } else if (type === 'red') {
        labelKas = 'Red Money ($)';
        formattedVal = formatUSD(qty);
        if (action === 'add') {
            window.brangkasState.redMoney += qty;
            txType = 'PEMASUKAN';
        } else if (action === 'sub') {
            window.brangkasState.redMoney = Math.max(0, window.brangkasState.redMoney - qty);
            txType = 'PENGELUARAN';
        } else {
            window.brangkasState.redMoney = qty;
            txType = 'PEMASUKAN';
        }
    } else if (type === 'item') {
        const name = document.getElementById('b-item-name').value.trim().toUpperCase();
        if (!name) return alert('Nama item wajib diisi!');
        labelKas = 'Stok Item';
        formattedVal = qty + ' PCS';
        const currentQty = window.brangkasState.items[name] || 0;
        
        if (action === 'add') {
            window.brangkasState.items[name] = currentQty + qty;
            txType = 'PEMASUKAN';
        } else if (action === 'sub') {
            window.brangkasState.items[name] = Math.max(0, currentQty - qty);
            txType = 'PENGELUARAN';
        } else {
            window.brangkasState.items[name] = qty;
            txType = 'PEMASUKAN';
        }

        if (window.brangkasState.items[name] <= 0) delete window.brangkasState.items[name];
    }

    const actionText = action === 'add' ? 'PENAMBAHAN / DEPOSIT' : (action === 'sub' ? 'PENARIKAN / PENGGUNAAN' : 'SET ULANG');
    window.transactionsData.unshift({
        time: now,
        type: txType,
        item: type === 'item' ? document.getElementById('b-item-name').value.toUpperCase() : labelKas,
        qty: type === 'item' ? qty : 1,
        total: formattedVal,
        payType: labelKas,
        notes: `[${actionText}] ${notes}`
    });

    window.saveData();
    alert('Brangkas berhasil diupdate & tersimpan ke Cloud Firebase!');
    document.getElementById('form-brangkas').reset();
    window.toggleBrangkasType();
};

window.deleteBrangkasItem = function(itemName) {
    if (confirm(`Hapus ${itemName} dari brangkas?`)) {
        delete window.brangkasState.items[itemName];
        window.saveData();
    }
};

window.renderMemberCatalog = function() {
    const tbody = document.getElementById('tbody-member-catalog');
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
                    <button class="btn btn-sm btn-green" onclick="addToCart('${item.name}', ${item.priceBM}, ${item.priceUP})">+ Keranjang</button>
                </td>
            </tr>
        `;
    });
};

window.filterMemberCatalog = function() {
    const q = document.getElementById('search-member-item').value.toLowerCase();
    const rows = document.querySelectorAll('#tbody-member-catalog tr');
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(q) ? '' : 'none';
    });
};

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
    if (item) {
        item.qty = Math.max(1, parseInt(qty) || 1);
    }
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

window.renderCart = function() {
    const tbody = document.getElementById('tbody-cart-items');
    const payType = document.getElementById('cart-pay-type').value;
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
                        <input type="number" min="1" value="${item.qty}" class="form-control" style="width:55px; padding:2px 5px;" onchange="updateCartQty('${item.name}', this.value)">
                    </td>
                    <td style="font-size:0.85rem; font-weight:bold; color:var(--accent-green);">${payType === 'BM' ? formatUSD(subtotal) : formatRP(subtotal)}</td>
                    <td>
                        <button class="btn btn-sm btn-red" onclick="removeFromCart('${item.name}')">✕</button>
                    </td>
                </tr>
            `;
        });
    }

    document.getElementById('cart-grand-total').innerText = payType === 'BM' ? formatUSD(grandTotal) : formatRP(grandTotal);
};

window.checkoutMemberCart = function() {
    if (window.cartItems.length === 0) return alert('Keranjang masih kosong!');

    const buyerName = document.getElementById('cart-buyer-name').value.trim();
    const sellerName = document.getElementById('cart-seller-name').value.trim();

    if (!buyerName || !sellerName) {
        return alert('Harap isi Nama Pembeli dan Belinya Ke Siapa terlebih dahulu!');
    }

    const payType = document.getElementById('cart-pay-type').value;
    let grandTotal = 0;
    let summaryItems = [];

    window.cartItems.forEach(item => {
        const price = payType === 'BM' ? item.priceBM : item.priceUP;
        const subtotal = price * item.qty;
        grandTotal += subtotal;

        summaryItems.push(`${item.name} (${item.qty} PCS)`);

        const cleanName = item.name.toUpperCase();
        if (window.brangkasState.items && window.brangkasState.items[cleanName]) {
            window.brangkasState.items[cleanName] = Math.max(0, window.brangkasState.items[cleanName] - item.qty);
            if (window.brangkasState.items[cleanName] === 0) delete window.brangkasState.items[cleanName];
        }
    });

    if (payType === 'UP') {
        window.brangkasState.whiteMoney += grandTotal;
    } else {
        window.brangkasState.blackMoney += grandTotal;
    }

    const now = new Date().toLocaleString('id-ID');
    window.transactionsData.unshift({
        time: now,
        type: 'PEMASUKAN',
        item: summaryItems.join(', '),
        qty: window.cartItems.reduce((acc, curr) => acc + curr.qty, 0),
        total: payType === 'BM' ? formatUSD(grandTotal) : formatRP(grandTotal),
        payType: payType === 'BM' ? 'Black Money ($)' : 'Uang Putih (Rp)',
        notes: `Pembeli: ${buyerName} | Penjual: ${sellerName}`
    });

    window.saveData();
    window.clearCart();
    document.getElementById('cart-buyer-name').value = '';
    document.getElementById('cart-seller-name').value = '';
    alert('Transaksi Pembelian Anggota Berhasil Ditambahkan ke Firebase Cloud!');
};

window.renderBmcToKelompok = function() {
    const tbody = document.getElementById('tbody-bmc-to-kelompok');
    tbody.innerHTML = '';
    window.bmcToKelompokData.forEach((item) => {
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
                    <button class="btn btn-sm btn-blue" onclick="openSellModal('${item.item} (${item.group})', ${item.priceWO}, ${item.priceWO}, 'BMC -> Kelompok')">Proses Order</button>
                </td>
            </tr>
        `;
    });
};

window.renderKelompokToBmc = function() {
    const tbody = document.getElementById('tbody-kelompok-to-bmc');
    tbody.innerHTML = '';
    window.kelompokToBmcData.forEach((item) => {
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
                    <button class="btn btn-sm btn-green" onclick="openSellModal('${item.item} dari ${item.group}', ${item.priceWO}, ${item.priceWO}, 'Kelompok -> BMC')">Terima / Beli</button>
                </td>
            </tr>
        `;
    });
};

window.openSellModal = function(itemName, priceBM, priceUP, orderType) {
    document.getElementById('modal-sell-title').innerText = 'Transaksi Item: ' + itemName;
    document.getElementById('modal-display-name').value = itemName;
    document.getElementById('modal-item-name').value = itemName;
    document.getElementById('modal-price-bm').value = priceBM;
    document.getElementById('modal-price-up').value = priceUP;
    document.getElementById('modal-order-type').value = orderType;
    document.getElementById('modal-qty').value = 1;

    window.calcModalTotal();
    document.getElementById('modal-sell').classList.add('active');
};

window.calcModalTotal = function() {
    const qty = parseInt(document.getElementById('modal-qty').value) || 1;
    const payType = document.getElementById('modal-pay-type').value;
    const priceBM = parseFloat(document.getElementById('modal-price-bm').value) || 0;
    const priceUP = parseFloat(document.getElementById('modal-price-up').value) || 0;

    const unitPrice = payType === 'BM' ? priceBM : priceUP;
    const total = unitPrice * qty;

    document.getElementById('modal-unit-price').value = payType === 'BM' ? formatUSD(unitPrice) : formatRP(unitPrice);
    document.getElementById('modal-total-price').value = payType === 'BM' ? formatUSD(total) : formatRP(total);
};

window.processTransaction = function(e) {
    e.preventDefault();
    const itemName = document.getElementById('modal-item-name').value;
    const qty = parseInt(document.getElementById('modal-qty').value) || 1;
    const payType = document.getElementById('modal-pay-type').value;
    const priceBM = parseFloat(document.getElementById('modal-price-bm').value) || 0;
    const priceUP = parseFloat(document.getElementById('modal-price-up').value) || 0;
    const orderType = document.getElementById('modal-order-type').value;
    const notes = document.getElementById('modal-notes').value;

    const unitPrice = payType === 'BM' ? priceBM : priceUP;
    const totalPrice = unitPrice * qty;

    if (payType === 'UP') {
        if (orderType === 'Kelompok -> BMC') {
            window.brangkasState.whiteMoney = Math.max(0, window.brangkasState.whiteMoney - totalPrice);
        } else {
            window.brangkasState.whiteMoney += totalPrice;
        }
    } else {
        if (orderType === 'Kelompok -> BMC') {
            window.brangkasState.blackMoney = Math.max(0, window.brangkasState.blackMoney - totalPrice);
        } else {
            window.brangkasState.blackMoney += totalPrice;
        }
    }

    const cleanItemName = itemName.split(' (')[0].toUpperCase();
    if (!window.brangkasState.items) window.brangkasState.items = {};

    if (orderType === 'Kelompok -> BMC') {
        window.brangkasState.items[cleanItemName] = (window.brangkasState.items[cleanItemName] || 0) + qty;
    } else {
        if (window.brangkasState.items[cleanItemName]) {
            window.brangkasState.items[cleanItemName] = Math.max(0, window.brangkasState.items[cleanItemName] - qty);
            if (window.brangkasState.items[cleanItemName] === 0) delete window.brangkasState.items[cleanItemName];
        }
    }

    const now = new Date().toLocaleString('id-ID');
    window.transactionsData.unshift({
        time: now,
        type: orderType === 'Kelompok -> BMC' ? 'PENGELUARAN' : 'PEMASUKAN',
        item: itemName,
        qty: qty,
        total: payType === 'BM' ? formatUSD(totalPrice) : formatRP(totalPrice),
        payType: payType === 'BM' ? 'Black Money ($)' : 'Uang Putih (Rp)',
        notes: notes || orderType
    });

    window.saveData();
    window.closeModal('modal-sell');
    alert('Transaksi berhasil dicatat & brangkas telah diupdate!');
};

window.renderTransactions = function() {
    const tbody = document.getElementById('tbody-transactions');
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

window.clearTransactions = function() {
    if (confirm('Yakin ingin menghapus seluruh riwayat transaksi?')) {
        window.transactionsData = [];
        window.saveData();
    }
};

window.openCustomOrderModal = function(panelTarget) {
    document.getElementById('custom-target-panel').value = panelTarget;
    document.getElementById('modal-custom-title').innerText = 'Tambah Order Custom: ' + panelTarget;
    document.getElementById('modal-custom-order').classList.add('active');
};

window.saveCustomOrder = function(e) {
    e.preventDefault();
    const panelTarget = document.getElementById('custom-target-panel').value;
    const newItem = {
        group: document.getElementById('c-group').value.trim().toUpperCase(),
        category: document.getElementById('c-category').value.trim().toUpperCase() || 'CUSTOM',
        item: document.getElementById('c-item').value.trim().toUpperCase(),
        qty: document.getElementById('c-qty').value.trim() || '1 PCS',
        priceWO: parseFloat(document.getElementById('c-price-wo').value) || 0,
        priceW: parseFloat(document.getElementById('c-price-w').value) || 0,
        note: document.getElementById('c-note').value.trim(),
        ket: ''
    };

    if (panelTarget === 'BMC -> Kelompok') {
        window.bmcToKelompokData.push(newItem);
    } else {
        window.kelompokToBmcData.push(newItem);
    }

    window.saveData();
    window.closeModal('modal-custom-order');
    document.getElementById('form-custom-order').reset();
    alert('Custom order berhasil ditambahkan!');
};

window.closeModal = function(modalId) {
    document.getElementById(modalId).classList.remove('active');
};

// INITIALIZATION
window.addEventListener('DOMContentLoaded', () => {
    initRealtimeSync();

    const pinInput = document.getElementById('input-pin-admin');
    if (pinInput) {
        pinInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') window.submitAdminPin();
        });
    }
});