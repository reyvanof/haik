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
    { group: 'SHINIGAMI', category: 'VEST', item: 'VEST', qty: '30 PCS', priceWO: 120000, priceW: null, note: '', ket: '' }
];

window.initialKelompokToBmc = [
    { group: 'HAKUSHIKAI', category: 'SENJATA CLASS 1', item: 'CERAMIC', qty: '30 PCS', priceWO: 280000, priceW: 0, note: '', ket: '' },
    { group: 'SHINIGAMI', category: 'SENJATA CLASS 1', item: 'REVOLVER', qty: 'UNLIMITED', priceWO: 200000, priceW: null, note: '', ket: '' }
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
function formatRP(num) { return 'Rp ' + (num || 0).toLocaleString('id-ID'); }
function formatUSD(num) { return '$ ' + (num || 0).toLocaleString('en-US'); }

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
                    <button class="btn btn-sm btn-blue" onclick="window.openSellModal('${item.item} (${item.group})', ${item.priceWO}, ${item.priceWO}, 'BMC -> Kelompok')">Proses Order</button>
                </td>
            </tr>
        `;
    });
};

window.renderKelompokToBmc = function() {
    const tbody = document.getElementById('tbody-kelompok-to-bmc');
    if (!tbody) return;
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
                    <button class="btn btn-sm btn-green" onclick="window.openSellModal('${item.item} dari ${item.group}', ${item.priceWO}, ${item.priceWO}, 'Kelompok -> BMC')">Terima / Beli</button>
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
        // Jika offline/gagal konek ke firebase, tetap tampilkan data lokal awal agar tidak kosong
        renderAll();
    });
}

// UI ACTIONS
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
        alert('Akses Admin Diterima!');
    } else {
        alert('PIN Salah!');
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

    document.getElementById(btnId)?.classList.add('active');
    document.getElementById(tabId)?.classList.add('active');
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

window.filterMemberCatalog = function() {
    const q = document.getElementById('search-member-item').value.toLowerCase();
    const rows = document.querySelectorAll('#tbody-member-catalog tr');
    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(q) ? '' : 'none';
    });
};

window.closeModal = function(modalId) {
    document.getElementById(modalId).classList.remove('active');
};

// INIT ON LOAD
window.addEventListener('DOMContentLoaded', () => {
    // Jalankan render awal langsung tanpa menunggu Firebase
    renderAll();
    initRealtimeSync();

    const pinInput = document.getElementById('input-pin-admin');
    if (pinInput) {
        pinInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') window.submitAdminPin();
        });
    }
});
