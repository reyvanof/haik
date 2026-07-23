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
let isInitialLoadComplete = false;

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
    { group: 'SHINIGAMI', category: 'VEST', item: 'VEST', qty: '30 PCS', priceWO: 120000, priceW: 0, note: '-', ket: '-' },
    { group: 'H2', category: 'VEST', item: 'VEST', qty: '50 PCS', priceWO: 120000, priceW: 0, note: '1:1', ket: '-' },
    { group: 'DVC', category: 'VEST', item: 'VEST', qty: '30 PCS', priceWO: 140000, priceW: 0, note: '-', ket: '-' },
    { group: 'REBELLION', category: 'VEST', item: 'VEST', qty: '30 PCS', priceWO: 150000, priceW: 0, note: '-', ket: '-' }
];

window.initialKelompokToBmc = [
    { group: 'HAKUSHIKAI', category: 'SENJATA CLASS 1', item: 'CERAMIC', qty: '30 PCS', priceWO: 280000, priceW: 0, note: '-', ket: 'WITH JASA: TBA' },
    { group: 'HAKUSHIKAI', category: 'SENJATA CLASS 1', item: 'REVOLVER', qty: '30 PCS', priceWO: 190000, priceW: 175000, note: '-', ket: '-' },
    { group: 'SHINIGAMI', category: 'SENJATA CLASS 1', item: 'CERAMIC', qty: 'UNLIMITED SELAGI ADA BAHAN', priceWO: 100000, priceW: 0, note: '-', ket: '-' },
    { group: 'H2', category: 'SENJATA CLASS 1', item: 'CERAMIC', qty: '500 PCS', priceWO: 80000, priceW: 0, note: '1:1', ket: '-' }
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
window.orderHistoryData = [];
window.loanRecordsData = [];
window.loanDraftItems = [];
window.stockFlowData = [];
window.stockFlowChartDays = 7;
window.saleEditDraftItems = [];

// HELPER FORMAT
function formatRP(num) { return (!num || num === 0) ? 'Rp 0' : 'Rp ' + Number(num).toLocaleString('id-ID'); }
function formatUSD(num) { return (!num || num === 0) ? '$ ' + Number(num).toLocaleString('en-US') : '$ ' + Number(num).toLocaleString('en-US'); }

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function parseStoredAmount(value) {
    const digits = String(value ?? '').replace(/[^0-9-]/g, '');
    const amount = Number.parseInt(digits, 10);
    return Number.isFinite(amount) ? Math.max(0, amount) : 0;
}

function normalizeTransactionPayType(value) {
    const raw = String(value || '').trim().toUpperCase();
    if (raw.includes('BLACK')) return 'Black Money';
    if (raw.includes('RED')) return 'Red Money';
    if (raw === 'BARANG' || raw.includes('ITEM')) return 'BARANG';
    return 'Uang Putih';
}

function formatTransactionAmount(amount, payType) {
    const normalizedPayType = normalizeTransactionPayType(payType);
    if (normalizedPayType === 'BARANG') return `${Number(amount) || 0} PCS`;
    if (normalizedPayType === 'Black Money' || normalizedPayType === 'Red Money') {
        return formatUSD(amount);
    }
    return formatRP(amount);
}


// ARUS STOK BRANGKAS
function createStockFlowId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function mergeStockFlowItems(items) {
    const merged = {};
    (Array.isArray(items) ? items : []).forEach(entry => {
        const name = normalizeItemName(entry?.name);
        const qty = Math.max(0, Number(entry?.qty) || 0);
        if (!name || qty <= 0) return;
        merged[name] = (merged[name] || 0) + qty;
    });
    return Object.entries(merged).map(([name, qty]) => ({ name, qty }));
}

function recordStockFlow({ direction, source, items, amount = 0, payType = '-', notes = '-', createdAt = null, time = null }) {
    if (!Array.isArray(window.stockFlowData)) window.stockFlowData = [];
    const normalizedDirection = ['MASUK', 'KELUAR', 'PENJUALAN'].includes(direction)
        ? direction
        : 'KELUAR';
    const mergedItems = mergeStockFlowItems(items);
    if (mergedItems.length === 0) return;

    const isoTime = createdAt || new Date().toISOString();
    window.stockFlowData.unshift({
        id: createStockFlowId(),
        createdAt: isoTime,
        time: time || new Date(isoTime).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
        direction: normalizedDirection,
        source: String(source || 'Aktivitas Brangkas'),
        items: mergedItems,
        totalQty: mergedItems.reduce((sum, item) => sum + item.qty, 0),
        amount: Math.max(0, Number(amount) || 0),
        payType: String(payType || '-'),
        notes: String(notes || '-').trim() || '-'
    });

    // Batasi histori agar dokumen Firestore tidak membesar tanpa batas.
    window.stockFlowData = window.stockFlowData.slice(0, 1000);
}

function parseIndonesianDateTime(value) {
    const raw = String(value || '').trim();
    const match = raw.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})[,\s]+(\d{1,2})[.:](\d{2})/);
    if (!match) return null;
    let year = Number(match[3]);
    if (year < 100) year += 2000;
    const date = new Date(year, Number(match[2]) - 1, Number(match[1]), Number(match[4]), Number(match[5]));
    return Number.isNaN(date.getTime()) ? null : date;
}

function getStockFlowDate(record) {
    if (record?.createdAt) {
        const parsed = new Date(record.createdAt);
        if (!Number.isNaN(parsed.getTime())) return parsed;
    }
    return parseIndonesianDateTime(record?.time) || new Date(0);
}

function localDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatShortDate(date) {
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
}

function isMemberSaleTransaction(tx) {
    const notes = String(tx?.notes || '');
    return tx?.type === 'PEMASUKAN' && /Pembeli\s*:/i.test(notes) && /Penjual\s*:/i.test(notes);
}

function parseSaleSummary(summary) {
    return String(summary || '')
        .split(',')
        .map(part => {
            const match = part.trim().match(/^(.*?)\s+x(\d+)$/i);
            return match ? { name: normalizeItemName(match[1]), qty: Number(match[2]) || 0 } : null;
        })
        .filter(Boolean);
}


// NORMALISASI NAMA ITEM
// Dibutuhkan oleh proses order agar nama seperti "vest", "VEST", atau " Vest "
// selalu dianggap sebagai item yang sama.
function normalizeItemName(itemName) {
    return String(itemName || '')
        .trim()
        .replace(/\s+/g, ' ')
        .toUpperCase();
}

// Rapikan seluruh key stok sebelum stok ditambah atau dikurangi.
function normalizeBrangkasItems() {
    if (!window.brangkasState) {
        window.brangkasState = {
            whiteMoney: 0,
            blackMoney: 0,
            redMoney: 0,
            items: {}
        };
    }

    const sourceItems = window.brangkasState.items || {};
    const normalizedItems = {};

    Object.entries(sourceItems).forEach(([itemName, qty]) => {
        const normalizedName = normalizeItemName(itemName);
        if (!normalizedName) return;

        normalizedItems[normalizedName] =
            (Number(normalizedItems[normalizedName]) || 0) +
            (Number(qty) || 0);
    });

    window.brangkasState.items = normalizedItems;
}

function normalizeOrderHistoryData() {
    if (!Array.isArray(window.orderHistoryData)) {
        window.orderHistoryData = [];
        return;
    }

    window.orderHistoryData = window.orderHistoryData.map(order => ({
        ...order,
        group: String(order.group || '-').trim() || '-',
        item: normalizeItemName(order.item || '-'),
        qty: Number(order.qty) || 0,
        unitPrice: order.unitPrice || '-',
        total: order.total || '-',
        payType: order.payType || '-',
        notes: String(order.notes || '-').trim() || '-',
        status: String(order.status || 'PENDING').trim().toUpperCase() === 'DONE' ? 'DONE' : 'PENDING'
    }));
}


// NORMALISASI DATA UTANG / PEMINJAMAN
function normalizeLoanPaymentStatus(value) {
    const status = String(value || '').trim().toUpperCase().replace(/\s+/g, '_');
    if (['SUDAH_DIBAYAR', 'DIBAYAR', 'LUNAS', 'PAID', 'DONE'].includes(status)) {
        return 'SUDAH_DIBAYAR';
    }
    return 'BELUM_DIBAYAR';
}

function normalizeLoanRecordsData() {
    if (!Array.isArray(window.loanRecordsData)) {
        window.loanRecordsData = [];
        return;
    }

    window.loanRecordsData = window.loanRecordsData.map(record => ({
        ...record,
        status: normalizeLoanPaymentStatus(record.status),
        paidAt: normalizeLoanPaymentStatus(record.status) === 'SUDAH_DIBAYAR'
            ? (record.paidAt || record.updatedAt || '-')
            : null
    }));
}

// SYSTEM TAB & PERAN
window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.add('active');

    const btnTab = document.querySelector(`[data-tab="${tabId}"]`) ||
        document.querySelector(`[onclick="window.switchTab('${tabId}')"], [onclick="switchTab('${tabId}')"]`);
    if (btnTab) btnTab.classList.add('active');

    if (tabId === 'dashboard') {
        setTimeout(() => {
            window.renderStockFlowDashboard();
            window.renderLowStock();
        }, 50);
    }

    const adminMenuButton = document.getElementById('btn-admin-menu');
    if (adminMenuButton && tabId !== 'member-catalog') {
        adminMenuButton.classList.add('active');
    }

    document.getElementById('admin-menu')?.classList.remove('open');
};

window.toggleAdminMenu = function(event) {
    if (event) event.stopPropagation();
    if (!window.isAdminLoggedIn) return;
    document.getElementById('admin-menu')?.classList.toggle('open');
};

document.addEventListener('click', function(event) {
    const adminMenu = document.getElementById('admin-menu');
    if (adminMenu && !adminMenu.contains(event.target)) {
        adminMenu.classList.remove('open');
    }
});

window.handleRoleChange = function() {
    const role = document.getElementById('user-role').value;
    if (role === 'admin' && !window.isAdminLoggedIn) {
        document.getElementById('modal-pin').classList.add('active');
    } else if (role === 'member') {
        window.isAdminLoggedIn = false;
        document.querySelectorAll('.admin-only').forEach(el => el.style.setProperty('display', 'none', 'important'));
        window.switchTab('member-catalog');
    }
};

window.submitAdminPin = function() {
    const pin = document.getElementById('input-pin-admin').value;
    if (pin === window.ADMIN_PIN) {
        window.isAdminLoggedIn = true;
        document.querySelectorAll('.admin-only').forEach(el => el.style.setProperty('display', 'inline-block', 'important'));
        document.getElementById('modal-pin').classList.remove('active');
        document.getElementById('input-pin-admin').value = '';
        window.switchTab('dashboard');
    } else {
        alert('❌ PIN Admin Salah!');
    }
};

window.cancelAdminAuth = function() {
    document.getElementById('modal-pin').classList.remove('active');
    document.getElementById('user-role').value = 'member';
    window.handleRoleChange();
};

window.closeModal = function(modalId) {
    document.getElementById(modalId).classList.remove('active');
};

// RENDER FUNCTIONS - TERBARU
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
        // Loop data
        Object.entries(window.brangkasState.items || {}).forEach(([itemName, qty]) => {
            totalItems += qty;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight:600;">${itemName}</td>
                <td><span class="badge badge-green">${qty} PCS</span></td>
                <td>
                    <div style="display:flex; gap:8px; flex-wrap:wrap;">
                        <button class="btn btn-sm btn-blue" type="button"
                            onclick="window.openEditBrangkasItem(decodeURIComponent('${encodeURIComponent(itemName)}'))">
                            Edit
                        </button>
                        <button class="btn btn-sm btn-red" type="button"
                            onclick="window.deleteBrangkasItem(decodeURIComponent('${encodeURIComponent(itemName)}'))">
                            Hapus
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
    
    const countEl = document.getElementById('stat-item-count');
    if (countEl) countEl.innerText = totalItems + ' PCS';
};

window.openEditBrangkasItem = function(itemName) {
    if (!window.isAdminLoggedIn) {
        return alert('❌ Hanya pengurus yang dapat mengedit stok brangkas.');
    }

    normalizeBrangkasItems();
    const normalizedName = normalizeItemName(itemName);
    if (window.brangkasState.items[normalizedName] === undefined) {
        return alert('❌ Barang tidak ditemukan di stok brangkas.');
    }

    document.getElementById('edit-stock-item-name').value = normalizedName;
    document.getElementById('edit-stock-qty').value = Number(window.brangkasState.items[normalizedName]) || 0;
    document.getElementById('modal-edit-stock').classList.add('active');
};

window.saveBrangkasItemEdit = async function(e) {
    if (e) e.preventDefault();

    if (!window.isAdminLoggedIn) {
        return alert('❌ Hanya pengurus yang dapat mengedit stok brangkas.');
    }

    const itemName = normalizeItemName(document.getElementById('edit-stock-item-name').value);
    const newQty = Number.parseInt(document.getElementById('edit-stock-qty').value, 10);

    if (!itemName || !Number.isFinite(newQty) || newQty < 0) {
        return alert('❌ Quantity harus berupa angka 0 atau lebih.');
    }

    normalizeBrangkasItems();
    if (window.brangkasState.items[itemName] === undefined) {
        return alert('❌ Barang tidak ditemukan di stok brangkas.');
    }

    const previousQty = Number(window.brangkasState.items[itemName]) || 0;
    window.brangkasState.items[itemName] = newQty;

    const difference = newQty - previousQty;
    if (difference !== 0) {
        recordStockFlow({
            direction: difference > 0 ? 'MASUK' : 'KELUAR',
            source: 'Koreksi Stok',
            items: [{ name: itemName, qty: Math.abs(difference) }],
            notes: `Quantity dikoreksi dari ${previousQty} menjadi ${newQty} PCS`
        });
    }

    await window.saveData();
    window.renderBrangkas();
    window.closeModal('modal-edit-stock');
    alert(`✅ Quantity ${itemName} berhasil diubah menjadi ${newQty} PCS.`);
};

window.deleteBrangkasItem = async function(itemName) {
    console.log("Mencoba menghapus item:", itemName);
    
    // Konfirmasi penghapusan
    if (!confirm(`Yakin ingin menghapus ${itemName}?`)) return;

    // Hapus dari state
    if (window.brangkasState.items[itemName] !== undefined) {
        delete window.brangkasState.items[itemName];
        
        // Simpan ke Firestore
        await window.saveData();
        
        // Paksa render ulang UI
        window.renderBrangkas();
        alert(`✅ ${itemName} berhasil dihapus!`);
    } else {
        alert("❌ Gagal: Item tidak ditemukan di sistem.");
    }
};

window.renderMemberCatalog = function(filterText = '') {
    const tbody = document.getElementById('tbody-member-catalog');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    const filtered = window.memberCatalogData.filter(item => 
        item.name.toLowerCase().includes(filterText.toLowerCase()) || 
        item.category.toLowerCase().includes(filterText.toLowerCase())
    );

    filtered.forEach((item) => {
        tbody.innerHTML += `
            <tr>
                <td><span class="badge badge-black">${item.category}</span></td>
                <td style="font-weight: bold; color: var(--accent-gold);">${item.name}</td>
                <td style="color: var(--accent-purple); font-weight: 600;">${item.priceBM ? formatUSD(item.priceBM) : 'FREE'}</td>
                <td style="color: var(--accent-green); font-weight: 600;">${item.priceUP ? formatRP(item.priceUP) : 'FREE'}</td>
                <td style="color: var(--text-muted); font-size: 0.85rem;">${item.note}</td>
                <td>
                    <button class="btn btn-sm btn-green" type="button" onclick="window.addToCart('${item.name}', ${item.priceBM}, ${item.priceUP})">+ Keranjang</button>
                </td>
            </tr>
        `;
    });
};

window.filterMemberCatalog = function() {
    const text = document.getElementById('search-member-item').value;
    window.renderMemberCatalog(text);
};

// LOGIKA KERANJANG
window.addToCart = function(name, priceBM, priceUP) {
    const existing = window.cartItems.find(i => i.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        window.cartItems.push({ name, priceBM, priceUP, qty: 1 });
    }
    window.renderCart();
};

window.removeFromCart = function(index) {
    window.cartItems.splice(index, 1);
    window.renderCart();
};

window.clearCart = function() {
    window.cartItems = [];
    window.renderCart();
};

window.renderCart = function() {
    const tbody = document.getElementById('tbody-cart-items');
    if (!tbody) return;
    tbody.innerHTML = '';
    const payTypeEl = document.getElementById('cart-pay-type');
    const payType = payTypeEl ? payTypeEl.value : 'UP';
    let grandTotal = 0;

    window.cartItems.forEach((item, index) => {
        const unitPrice = payType === 'UP' ? item.priceUP : item.priceBM;
        const subtotal = unitPrice * item.qty;
        grandTotal += subtotal;

        tbody.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>
                    <input type="number" value="${item.qty}" min="1" style="width:50px;" class="form-control" onchange="window.updateCartQty(${index}, this.value)">
                </td>
                <td>${payType === 'UP' ? formatRP(subtotal) : formatUSD(subtotal)}</td>
                <td><button class="btn btn-sm btn-red" onclick="window.removeFromCart(${index})">X</button></td>
            </tr>
        `;
    });

    const totalEl = document.getElementById('cart-grand-total');
    if (totalEl) totalEl.innerText = payType === 'UP' ? formatRP(grandTotal) : formatUSD(grandTotal);
};

window.updateCartQty = function(index, qty) {
    const num = parseInt(qty);
    if (num > 0) {
        window.cartItems[index].qty = num;
        window.renderCart();
    }
};

window.checkoutMemberCart = async function() {
    if (window.cartItems.length === 0) return alert('Keranjang masih kosong!');
    const buyer = document.getElementById('cart-buyer-name').value.trim();
    const seller = document.getElementById('cart-seller-name').value.trim();
    const payType = document.getElementById('cart-pay-type').value;

    if (!buyer || !seller) return alert('Mohon isi nama Pembeli dan Penjual!');

    normalizeBrangkasItems();
    const shortages = window.cartItems.filter(item => {
        const stockName = normalizeItemName(item.name);
        return (Number(window.brangkasState.items[stockName]) || 0) < item.qty;
    });
    if (shortages.length > 0) {
        const details = shortages.map(item => {
            const stockName = normalizeItemName(item.name);
            return `${stockName}: stok ${Number(window.brangkasState.items[stockName]) || 0} PCS, diminta ${item.qty} PCS`;
        }).join('\n');
        return alert(`❌ Stok tidak mencukupi:

${details}`);
    }

    let grandTotal = 0;
    const soldItems = [];

    window.cartItems.forEach(item => {
        const price = payType === 'UP' ? item.priceUP : item.priceBM;
        const subtotal = price * item.qty;
        grandTotal += subtotal;
        const stockItemName = normalizeItemName(item.name);
        soldItems.push({ name: stockItemName, qty: item.qty });
        window.brangkasState.items[stockItemName] =
            (Number(window.brangkasState.items[stockItemName]) || 0) - item.qty;
    });

    if (payType === 'UP') window.brangkasState.whiteMoney += grandTotal;
    else window.brangkasState.blackMoney += grandTotal;

    // Penjualan anggota masuk ke Arus Stok, bukan lagi ke Transaksi Masuk.
    recordStockFlow({
        direction: 'PENJUALAN',
        source: 'Penjualan Anggota',
        items: soldItems,
        amount: grandTotal,
        payType: payType === 'UP' ? 'Uang Putih' : 'Black Money',
        notes: `Pembeli: ${buyer} | Penjual: ${seller}`
    });

    await window.saveData();
    window.clearCart();
    document.getElementById('cart-buyer-name').value = '';
    document.getElementById('cart-seller-name').value = '';
    renderAll();
    alert('✅ Penjualan berhasil disimpan di Arus Stok Brangkas!');
};

// LOGIKA INPUT/TARIK KAS & STOK
window.toggleBrangkasType = function() {
    const type = document.getElementById('b-type').value;
    const itemGroup = document.getElementById('group-b-item-name');
    if (type === 'item') {
        itemGroup.style.display = 'block';
    } else {
        itemGroup.style.display = 'none';
    }
};

window.saveBrangkas = async function(e) {
    if (e) e.preventDefault();
    const type = document.getElementById('b-type').value;
    const itemName = normalizeItemName(document.getElementById('b-item-name').value);
    const qty = parseInt(document.getElementById('b-qty').value, 10) || 0;
    const action = document.getElementById('b-action').value;
    const notes = document.getElementById('b-notes').value.trim() || '-';

    if (type === 'item') {
        if (!itemName) return alert('Masukkan nama item!');
        if (qty < 0) return alert('Quantity tidak boleh negatif.');
        normalizeBrangkasItems();

        const current = Number(window.brangkasState.items[itemName]) || 0;
        let updated = current;
        if (action === 'add') updated = current + qty;
        else if (action === 'sub') updated = Math.max(0, current - qty);
        else if (action === 'set') updated = qty;
        window.brangkasState.items[itemName] = updated;

        const difference = updated - current;
        if (difference !== 0) {
            recordStockFlow({
                direction: difference > 0 ? 'MASUK' : 'KELUAR',
                source: action === 'set' ? 'Set Ulang Stok' : 'Input Brangkas',
                items: [{ name: itemName, qty: Math.abs(difference) }],
                notes
            });
        }
    } else {
        const key = type === 'white' ? 'whiteMoney' : (type === 'black' ? 'blackMoney' : 'redMoney');
        const current = Number(window.brangkasState[key]) || 0;

        if (action === 'add') window.brangkasState[key] = current + qty;
        else if (action === 'sub') window.brangkasState[key] = Math.max(0, current - qty);
        else if (action === 'set') window.brangkasState[key] = qty;

        const txType = action === 'add' ? 'PEMASUKAN' : (action === 'sub' ? 'PENGELUARAN' : 'UPDATE STOK');
        const label = type === 'white' ? 'Uang Putih' : (type === 'black' ? 'Black Money' : 'Red Money');
        const totalFormatted = type === 'white' ? formatRP(qty) : formatUSD(qty);

        window.transactionsData.unshift({
            time: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
            type: txType,
            item: label,
            qty: 1,
            total: totalFormatted,
            payType: label,
            notes
        });
    }

    await window.saveData();
    renderAll();
    alert('✅ Brangkas Berhasil Diperbarui!');
};


// PANEL UTANG / PEMINJAMAN - KHUSUS PENGURUS
window.renderLoanItemOptions = function() {
    const select = document.getElementById('loan-item');
    if (!select) return;

    const previousValue = select.value;
    select.innerHTML = '<option value="">Pilih barang dari katalog anggota</option>';

    (window.memberCatalogData || []).forEach((item, index) => {
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = `${item.name} — BM ${formatUSD(item.priceBM)} | UP ${formatRP(item.priceUP)}`;
        select.appendChild(option);
    });

    if (previousValue && select.querySelector(`option[value="${previousValue}"]`)) {
        select.value = previousValue;
    }

    window.calculateLoanTotals();
};

window.addLoanDraftItem = function() {
    if (!window.isAdminLoggedIn) {
        return alert('❌ Hanya pengurus yang dapat menambahkan barang utang / peminjaman.');
    }

    const itemSelect = document.getElementById('loan-item');
    const qtyInput = document.getElementById('loan-qty');
    const itemIndex = Number.parseInt(itemSelect?.value, 10);
    const qty = Math.max(1, Number.parseInt(qtyInput?.value, 10) || 1);
    const item = Number.isInteger(itemIndex) ? window.memberCatalogData[itemIndex] : null;

    if (!item) return alert('❌ Pilih jenis barang terlebih dahulu.');
    if (!Array.isArray(window.loanDraftItems)) window.loanDraftItems = [];

    const existing = window.loanDraftItems.find(entry => entry.catalogIndex === itemIndex);
    if (existing) {
        existing.qty += qty;
    } else {
        window.loanDraftItems.push({
            catalogIndex: itemIndex,
            name: normalizeItemName(item.name),
            priceBM: Number(item.priceBM) || 0,
            priceUP: Number(item.priceUP) || 0,
            qty
        });
    }

    if (itemSelect) itemSelect.value = '';
    if (qtyInput) qtyInput.value = 1;
    window.calculateLoanTotals();
};

window.updateLoanDraftQty = function(index, value) {
    if (!Array.isArray(window.loanDraftItems) || !window.loanDraftItems[index]) return;
    const qty = Math.max(1, Number.parseInt(value, 10) || 1);
    window.loanDraftItems[index].qty = qty;
    window.calculateLoanTotals();
};

window.removeLoanDraftItem = function(index) {
    if (!Array.isArray(window.loanDraftItems)) window.loanDraftItems = [];
    window.loanDraftItems.splice(index, 1);
    window.calculateLoanTotals();
};

window.renderLoanDraftItems = function() {
    const tbody = document.getElementById('tbody-loan-draft-items');
    if (!tbody) return;

    const items = Array.isArray(window.loanDraftItems) ? window.loanDraftItems : [];
    const payType = document.getElementById('loan-pay-type')?.value === 'BM' ? 'BM' : 'UP';

    if (items.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center; color:var(--text-muted);">
                    Belum ada barang dipilih.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = items.map((entry, index) => {
        const unitPrice = payType === 'BM' ? entry.priceBM : entry.priceUP;
        const subtotal = unitPrice * entry.qty;
        return `
            <tr>
                <td style="font-weight:600;">${escapeHtml(entry.name)}</td>
                <td>
                    <input
                        type="number"
                        min="1"
                        value="${entry.qty}"
                        class="form-control qty-mini"
                        onchange="window.updateLoanDraftQty(${index}, this.value)"
                    >
                </td>
                <td style="font-weight:700; color:${payType === 'BM' ? 'var(--accent-purple)' : 'var(--accent-green)'};">
                    ${payType === 'BM' ? formatUSD(subtotal) : formatRP(subtotal)}
                </td>
                <td>
                    <button type="button" class="btn btn-sm btn-red" onclick="window.removeLoanDraftItem(${index})">Hapus</button>
                </td>
            </tr>
        `;
    }).join('');
};

window.calculateLoanTotals = function() {
    const payTypeSelect = document.getElementById('loan-pay-type');
    const totalEl = document.getElementById('loan-total-selected');
    const labelEl = document.getElementById('loan-total-label');
    const totalBox = document.getElementById('loan-total-box');

    if (!payTypeSelect || !totalEl || !labelEl || !totalBox) return;

    const payType = payTypeSelect.value === 'BM' ? 'BM' : 'UP';
    const items = Array.isArray(window.loanDraftItems) ? window.loanDraftItems : [];
    const total = items.reduce((sum, entry) => {
        const unitPrice = payType === 'BM' ? Number(entry.priceBM) || 0 : Number(entry.priceUP) || 0;
        return sum + (unitPrice * (Number(entry.qty) || 0));
    }, 0);

    totalBox.classList.remove('bm', 'up');
    totalBox.classList.add(payType === 'BM' ? 'bm' : 'up');
    labelEl.innerText = payType === 'BM' ? 'Total Black Money' : 'Total Uang Putih';
    totalEl.innerText = payType === 'BM' ? formatUSD(total) : formatRP(total);
    window.renderLoanDraftItems();
};

window.saveLoanRecord = async function(e) {
    if (e) e.preventDefault();

    if (!window.isAdminLoggedIn) {
        return alert('❌ Hanya pengurus yang dapat mengisi utang / peminjaman.');
    }

    const borrower = String(document.getElementById('loan-borrower')?.value || '').trim();
    const lender = String(document.getElementById('loan-lender')?.value || '').trim();
    const payType = document.getElementById('loan-pay-type')?.value === 'BM' ? 'BM' : 'UP';
    const draftItems = Array.isArray(window.loanDraftItems) ? window.loanDraftItems : [];

    if (!borrower || !lender) {
        return alert('❌ Nama peminjam dan yang meminjamkan wajib diisi.');
    }
    if (draftItems.length === 0) {
        return alert('❌ Tambahkan minimal satu jenis barang.');
    }

    if (!Array.isArray(window.loanRecordsData)) window.loanRecordsData = [];

    const items = draftItems.map(entry => {
        const unitPrice = payType === 'BM' ? Number(entry.priceBM) || 0 : Number(entry.priceUP) || 0;
        const qty = Math.max(1, Number(entry.qty) || 1);
        return {
            name: normalizeItemName(entry.name),
            qty,
            unitPrice,
            subtotal: unitPrice * qty
        };
    });
    const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    // Barang yang dipinjam berasal dari stok brangkas.
    // Validasi seluruh item terlebih dahulu agar stok tidak menjadi minus.
    normalizeBrangkasItems();
    const stockShortages = items.filter(item => {
        const stockName = normalizeItemName(item.name);
        const availableStock = Number(window.brangkasState.items[stockName]) || 0;
        return availableStock < item.qty;
    });

    if (stockShortages.length > 0) {
        const shortageMessage = stockShortages.map(item => {
            const stockName = normalizeItemName(item.name);
            const availableStock = Number(window.brangkasState.items[stockName]) || 0;
            return `${stockName}: stok ${availableStock} PCS, diminta ${item.qty} PCS`;
        }).join('\n');

        return alert(
            '❌ Stok brangkas tidak mencukupi:\n\n' +
            shortageMessage +
            '\n\nTambahkan stok terlebih dahulu atau kurangi quantity.'
        );
    }

    // Kurangi stok hanya setelah semua item dipastikan tersedia.
    items.forEach(item => {
        const stockName = normalizeItemName(item.name);
        const availableStock = Number(window.brangkasState.items[stockName]) || 0;
        window.brangkasState.items[stockName] = availableStock - item.qty;
    });

    recordStockFlow({
        direction: 'KELUAR',
        source: 'Utang / Peminjaman',
        items: items.map(item => ({ name: item.name, qty: item.qty })),
        amount: total,
        payType: payType === 'BM' ? 'Black Money' : 'Uang Putih',
        notes: `Peminjam: ${borrower} | Yang meminjamkan: ${lender}`
    });

    window.loanRecordsData.unshift({
        time: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
        borrower,
        lender,
        items,
        item: items.map(item => item.name).join(', '),
        qty: totalQty,
        payType,
        total,
        status: 'BELUM_DIBAYAR',
        paidAt: null,
        stockDeducted: true
    });

    await window.saveData();
    renderAll();

    document.getElementById('form-loan')?.reset();
    window.loanDraftItems = [];
    const qtyInput = document.getElementById('loan-qty');
    if (qtyInput) qtyInput.value = 1;
    window.calculateLoanTotals();

    alert('✅ Data utang / peminjaman multi-barang berhasil disimpan!');
};

window.renderLoanRecords = function() {
    const tbody = document.getElementById('tbody-loan-records');
    if (!tbody) return;

    normalizeLoanRecordsData();
    const records = Array.isArray(window.loanRecordsData) ? window.loanRecordsData : [];

    if (records.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align:center; color:var(--text-muted);">
                    Belum ada data utang / peminjaman.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = records.map((record, index) => {
        const isNewFormat = record.payType === 'BM' || record.payType === 'UP';
        const payType = record.payType === 'BM' ? 'BM' : 'UP';
        const paymentLabel = isNewFormat
            ? (payType === 'BM' ? 'Black Money' : 'Uang Putih')
            : 'Data Lama (BM / UP)';
        const totalDisplay = isNewFormat
            ? (payType === 'BM'
                ? formatUSD(Number(record.total) || 0)
                : formatRP(Number(record.total) || 0))
            : `${formatUSD(Number(record.totalBM) || 0)} / ${formatRP(Number(record.totalUP) || 0)}`;
        const totalColor = isNewFormat && payType === 'BM'
            ? 'var(--accent-purple)'
            : 'var(--accent-green)';

        const recordItems = Array.isArray(record.items) && record.items.length > 0
            ? record.items
            : [{ name: record.item || '-', qty: Number(record.qty) || 0 }];
        const itemsDisplay = recordItems.map(item =>
            `<div>${escapeHtml(item.name || '-')}</div>`
        ).join('');
        const qtyDisplay = recordItems.map(item =>
            `<div><span class="badge badge-white">${Number(item.qty) || 0} PCS</span></div>`
        ).join('');

        const status = normalizeLoanPaymentStatus(record.status);
        const statusLabel = status === 'SUDAH_DIBAYAR' ? 'SUDAH DIBAYAR' : 'BELUM DIBAYAR';
        const statusClass = status === 'SUDAH_DIBAYAR' ? 'badge-green' : 'badge-red';

        return `
            <tr>
                <td style="color:var(--text-muted); font-size:0.85rem;">${escapeHtml(record.time || '-')}</td>
                <td style="font-weight:700; color:var(--accent-gold);">${escapeHtml(record.borrower || '-')}</td>
                <td>${escapeHtml(record.lender || '-')}</td>
                <td style="font-weight:600;"><div class="loan-item-summary">${itemsDisplay}</div></td>
                <td><div class="loan-item-summary">${qtyDisplay}</div></td>
                <td><span class="badge badge-black">${escapeHtml(paymentLabel)}</span></td>
                <td style="font-weight:700; color:${totalColor};">${totalDisplay}</td>
                <td><span class="badge ${statusClass}">${statusLabel}</span></td>
                <td style="white-space:nowrap;">
                    <button class="btn btn-sm btn-blue" type="button" onclick="window.openEditLoanStatus(${index})">
                        Edit
                    </button>
                    <button class="btn btn-sm btn-red" type="button" onclick="window.deleteLoanRecord(${index})">
                        Hapus
                    </button>
                </td>
            </tr>
        `;
    }).join('');
};

window.openEditLoanStatus = function(index) {
    if (!window.isAdminLoggedIn) {
        return alert('❌ Hanya pengurus yang dapat mengubah status pembayaran.');
    }

    normalizeLoanRecordsData();
    const record = (window.loanRecordsData || [])[index];
    if (!record) return alert('❌ Data utang / peminjaman tidak ditemukan.');

    const itemNames = (Array.isArray(record.items) ? record.items : [])
        .map(item => `${item.name} x${item.qty}`)
        .join(', ') || record.item || '-';

    document.getElementById('edit-loan-index').value = String(index);
    document.getElementById('edit-loan-summary').value = `${record.borrower || '-'} | ${itemNames}`;
    document.getElementById('edit-loan-status').value = normalizeLoanPaymentStatus(record.status);
    document.getElementById('modal-edit-loan-status').classList.add('active');
};

window.saveLoanStatusEdit = async function(e) {
    if (e) e.preventDefault();

    if (!window.isAdminLoggedIn) {
        return alert('❌ Hanya pengurus yang dapat mengubah status pembayaran.');
    }

    const index = Number.parseInt(document.getElementById('edit-loan-index').value, 10);
    const record = (window.loanRecordsData || [])[index];
    if (!record) return alert('❌ Data utang / peminjaman tidak ditemukan.');

    const newStatus = normalizeLoanPaymentStatus(
        document.getElementById('edit-loan-status').value
    );
    const now = new Date().toLocaleString('id-ID', {
        dateStyle: 'short',
        timeStyle: 'short'
    });

    window.loanRecordsData[index] = {
        ...record,
        status: newStatus,
        paidAt: newStatus === 'SUDAH_DIBAYAR' ? now : null,
        updatedAt: now
    };

    await window.saveData();
    window.renderLoanRecords();
    window.closeModal('modal-edit-loan-status');
    alert(`✅ Status pembayaran diubah menjadi ${newStatus === 'SUDAH_DIBAYAR' ? 'SUDAH DIBAYAR' : 'BELUM DIBAYAR'}.`);
};

window.deleteLoanRecord = async function(index) {
    if (!window.isAdminLoggedIn) {
        return alert('❌ Hanya pengurus yang dapat menghapus data utang / peminjaman.');
    }

    const record = (window.loanRecordsData || [])[index];
    if (!record) return alert('❌ Data tidak ditemukan.');

    if (!confirm(`Hapus data utang / peminjaman milik ${record.borrower}?`)) return;

    window.loanRecordsData.splice(index, 1);
    await window.saveData();
    window.renderLoanRecords();
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
                    <button class="btn btn-sm btn-blue" type="button" onclick="window.openSellModal('BMC_TO_KELOMPOK', ${index})">Proses Order</button>
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
                    <button class="btn btn-sm btn-green" type="button" onclick="window.openSellModal('KELOMPOK_TO_BMC', ${index})">Terima / Beli</button>
                </td>
            </tr>
        `;
    });
};

window.openSellModal = function(type, index) {
    const list = type === 'BMC_TO_KELOMPOK' ? window.bmcToKelompokData : window.kelompokToBmcData;
    const itemData = list[index];
    if (!itemData) return;

    document.getElementById('modal-sell-title').innerText = `Proses Order: ${itemData.item} (${itemData.group})`;
    document.getElementById('modal-display-name').value = `${itemData.item} - ${itemData.group}`;
    document.getElementById('modal-item-name').value = itemData.item;
    document.getElementById('modal-price-up').value = itemData.priceWO || itemData.priceW || 0;
    document.getElementById('modal-price-bm').value = itemData.priceWO || itemData.priceW || 0;
    document.getElementById('modal-order-type').value = type;
    document.getElementById('modal-order-group').value = itemData.group || '-';
    document.getElementById('modal-qty').value = 1;

    window.calcModalTotal();
    document.getElementById('modal-sell').classList.add('active');
};

window.calcModalTotal = function() {
    const qty = parseInt(document.getElementById('modal-qty').value) || 1;
    const payType = document.getElementById('modal-pay-type').value;
    const priceUP = parseFloat(document.getElementById('modal-price-up').value) || 0;
    const priceBM = parseFloat(document.getElementById('modal-price-bm').value) || 0;

    const unitPrice = payType === 'UP' ? priceUP : priceBM;
    const total = unitPrice * qty;

    document.getElementById('modal-unit-price').value = payType === 'UP' ? formatRP(unitPrice) : formatUSD(unitPrice);
    document.getElementById('modal-total-price').value = payType === 'UP' ? formatRP(total) : formatUSD(total);
};

window.processTransaction = async function(e) {
    if (e) e.preventDefault();

    const type = document.getElementById('modal-order-type').value;
    const groupName = (document.getElementById('modal-order-group').value || '-').trim();
    const itemName = normalizeItemName(document.getElementById('modal-item-name').value);
    const qty = parseInt(document.getElementById('modal-qty').value, 10) || 1;
    const payType = document.getElementById('modal-pay-type').value;
    const priceUP = parseFloat(document.getElementById('modal-price-up').value) || 0;
    const priceBM = parseFloat(document.getElementById('modal-price-bm').value) || 0;
    const notes = document.getElementById('modal-notes').value.trim() || '-';

    if (type !== 'BMC_TO_KELOMPOK' && type !== 'KELOMPOK_TO_BMC') {
        return alert('❌ Jenis order tidak dikenali. Silakan tutup lalu buka kembali order.');
    }

    const unitPrice = payType === 'UP' ? priceUP : priceBM;
    const total = unitPrice * qty;
    const isBmcToKelompok = type === 'BMC_TO_KELOMPOK';

    if (!window.brangkasState) {
        window.brangkasState = { whiteMoney: 0, blackMoney: 0, redMoney: 0, items: {} };
    }
    if (!window.brangkasState.items) window.brangkasState.items = {};
    if (!Array.isArray(window.orderHistoryData)) window.orderHistoryData = [];

    normalizeBrangkasItems();
    const currentStock = Number(window.brangkasState.items[itemName]) || 0;

    if (isBmcToKelompok) {
        // BMC menjual barang ke kelompok: uang bertambah dan stok berkurang.
        if (payType === 'UP') {
            window.brangkasState.whiteMoney =
                (Number(window.brangkasState.whiteMoney) || 0) + total;
        } else {
            window.brangkasState.blackMoney =
                (Number(window.brangkasState.blackMoney) || 0) + total;
        }

        window.brangkasState.items[itemName] = Math.max(0, currentStock - qty);
    } else {
        // BMC membeli barang dari kelompok: uang berkurang dan stok bertambah.
        if (payType === 'UP') {
            window.brangkasState.whiteMoney = Math.max(
                0,
                (Number(window.brangkasState.whiteMoney) || 0) - total
            );
        } else {
            window.brangkasState.blackMoney = Math.max(
                0,
                (Number(window.brangkasState.blackMoney) || 0) - total
            );
        }

        window.brangkasState.items[itemName] = currentStock + qty;
    }

    recordStockFlow({
        direction: isBmcToKelompok ? 'KELUAR' : 'MASUK',
        source: isBmcToKelompok ? 'Order BMC → Kelompok' : 'Order Kelompok → BMC',
        items: [{ name: itemName, qty }],
        amount: total,
        payType: payType === 'UP' ? 'Uang Putih' : 'Black Money',
        notes: `${groupName} | ${notes}`
    });

    const orderRecord = {
        time: new Date().toLocaleString('id-ID', {
            dateStyle: 'short',
            timeStyle: 'short'
        }),
        direction: type,
        group: groupName,
        item: itemName,
        qty: qty,
        unitPrice: payType === 'UP' ? formatRP(unitPrice) : formatUSD(unitPrice),
        total: payType === 'UP' ? formatRP(total) : formatUSD(total),
        payType: payType === 'UP' ? 'Uang Putih' : 'Black Money',
        notes: notes,
        status: 'PENDING'
    };

    // Order masuk ke panel Riwayat Order, bukan ke transaksi masuk/keluar.
    window.orderHistoryData = [orderRecord, ...window.orderHistoryData];

    await window.saveData();
    renderAll();

    document.getElementById('modal-notes').value = '';
    window.closeModal('modal-sell');

    alert(
        `✅ Order ${isBmcToKelompok ? 'BMC ke Kelompok' : 'Kelompok ke BMC'} ` +
        'berhasil dicatat di Riwayat Order!'
    );
};

window.openCustomOrderModal = function(target) {
    document.getElementById('custom-target-panel').value = target;
    document.getElementById('modal-custom-title').innerText = `Input Custom Order: ${target}`;
    document.getElementById('modal-custom-order').classList.add('active');
};

window.saveCustomOrder = async function(e) {
    if (e) e.preventDefault();
    const target = document.getElementById('custom-target-panel').value;
    const newItem = {
        group: document.getElementById('c-group').value.toUpperCase(),
        category: document.getElementById('c-category').value.toUpperCase() || 'GENERAL',
        item: document.getElementById('c-item').value.toUpperCase(),
        qty: document.getElementById('c-qty').value || '1 PCS',
        priceWO: parseFloat(document.getElementById('c-price-wo').value) || 0,
        priceW: parseFloat(document.getElementById('c-price-w').value) || 0,
        note: document.getElementById('c-note').value || '-',
        ket: '-'
    };

    if (target === 'BMC -> Kelompok') {
        window.bmcToKelompokData.push(newItem);
    } else {
        window.kelompokToBmcData.push(newItem);
    }

    await window.saveData();
    renderAll();
    window.closeModal('modal-custom-order');
    alert('✅ Order Custom Berhasil Ditambahkan!');
};

window.setStockFlowDays = function(value) {
    const days = Number.parseInt(value, 10);
    window.stockFlowChartDays = [7, 14, 30].includes(days) ? days : 7;
    window.renderStockFlowDashboard();
};

window.renderLowStock = function() {
    const container = document.getElementById('low-stock-list');
    const countEl = document.getElementById('low-stock-count');
    if (!container) return;

    normalizeBrangkasItems();
    const catalogMap = new Map((window.memberCatalogData || []).map(item => [normalizeItemName(item.name), item.category]));
    const lowStock = Object.entries(window.brangkasState.items || {})
        .map(([name, qty]) => ({
            name: normalizeItemName(name),
            qty: Number(qty) || 0,
            category: catalogMap.get(normalizeItemName(name)) || 'BARANG BRANGKAS'
        }))
        .filter(item => item.qty <= 30)
        .sort((a, b) => a.qty - b.qty || a.name.localeCompare(b.name));

    if (countEl) countEl.innerText = `${lowStock.length} barang`;
    if (lowStock.length === 0) {
        container.innerHTML = '<div class="dashboard-empty">Tidak ada stok yang menipis.</div>';
        return;
    }

    container.innerHTML = lowStock.map(item => `
        <div class="low-stock-item">
            <div>
                <div class="low-stock-name">${escapeHtml(item.name)}</div>
                <div class="low-stock-category">${escapeHtml(item.category)}</div>
            </div>
            <span class="low-stock-qty ${item.qty === 0 ? 'zero' : ''}">${item.qty} PCS</span>
        </div>
    `).join('');
};

function getMoneyCurrencyCode(payType) {
    const normalized = normalizeTransactionPayType(payType);
    if (normalized === 'Uang Putih') return 'UP';
    if (normalized === 'Black Money') return 'BM';
    if (normalized === 'Red Money') return 'RM';
    return null;
}

function getMoneyFlowRecords() {
    const result = [];

    // Kas manual yang tercatat di Transaksi Masuk/Keluar.
    (window.transactionsData || []).forEach(tx => {
        if (!['PEMASUKAN', 'PENGELUARAN'].includes(tx?.type)) return;
        if (isMemberSaleTransaction(tx)) return;

        const currency = getMoneyCurrencyCode(tx.payType);
        if (!currency) return;
        const amount = parseStoredAmount(tx.total);
        if (amount <= 0) return;

        result.push({
            date: parseIndonesianDateTime(tx.time) || new Date(0),
            direction: tx.type === 'PEMASUKAN' ? 'MASUK' : 'KELUAR',
            currency,
            amount,
            source: tx.item || 'Transaksi Kas'
        });
    });

    // Penjualan anggota dan order kelompok disimpan di stockFlowData.
    (window.stockFlowData || []).forEach(record => {
        const amount = Math.max(0, Number(record?.amount) || 0);
        if (amount <= 0) return;

        const currency = getMoneyCurrencyCode(record.payType);
        if (!currency) return;

        let direction = null;
        if (record.direction === 'PENJUALAN') {
            direction = 'MASUK';
        } else if (record.direction === 'KELUAR' && /Order BMC/i.test(String(record.source || ''))) {
            // BMC menjual barang ke kelompok: kas masuk.
            direction = 'MASUK';
        } else if (record.direction === 'MASUK' && /Order Kelompok/i.test(String(record.source || ''))) {
            // BMC membeli barang dari kelompok: kas keluar.
            direction = 'KELUAR';
        }

        if (!direction) return;
        result.push({
            date: getStockFlowDate(record),
            direction,
            currency,
            amount,
            source: record.source || 'Aktivitas Kas'
        });
    });

    return result;
}

function formatCompactMoney(value, currency) {
    const amount = Math.max(0, Number(value) || 0);
    let compact;
    if (amount >= 1_000_000_000) compact = `${(amount / 1_000_000_000).toFixed(amount >= 10_000_000_000 ? 0 : 1)}M`;
    else if (amount >= 1_000_000) compact = `${(amount / 1_000_000).toFixed(amount >= 10_000_000 ? 0 : 1)}Jt`;
    else if (amount >= 1_000) compact = `${(amount / 1_000).toFixed(amount >= 10_000 ? 0 : 1)}K`;
    else compact = `${Math.round(amount)}`;
    return currency === 'UP' ? `Rp ${compact}` : `$ ${compact}`;
}

window.renderSalesData = function() {
    const tbody = document.getElementById('tbody-sales-data');
    if (!tbody) return;

    const records = (window.stockFlowData || [])
        .map((record, sourceIndex) => ({ record, sourceIndex }))
        .filter(entry => entry.record?.direction === 'PENJUALAN')
        .sort((a, b) => getStockFlowDate(b.record) - getStockFlowDate(a.record))
        .slice(0, 30);

    if (records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="dashboard-empty">Belum ada data penjualan.</td></tr>';
        return;
    }

    tbody.innerHTML = records.map(({ record, sourceIndex }) => {
        const itemText = (record.items || []).map(item => `${item.name} x${item.qty}`).join(', ');
        const payType = normalizeTransactionPayType(record.payType);
        const nominal = payType === 'Uang Putih' ? formatRP(record.amount) : formatUSD(record.amount);
        return `
            <tr>
                <td>${escapeHtml(record.time || '-')}</td>
                <td class="stock-activity-notes">${escapeHtml(record.notes || '-')}</td>
                <td>${escapeHtml(itemText || '-')}</td>
                <td>${Number(record.totalQty) || 0} PCS</td>
                <td><span class="badge badge-black">${escapeHtml(payType)}</span></td>
                <td>${escapeHtml(nominal)}</td>
                <td><div class="sales-action-buttons">
                    <button class="btn btn-sm btn-blue" type="button" onclick="window.openSaleEditModal(${sourceIndex})">Edit</button>
                    <button class="btn btn-sm btn-red" type="button" onclick="window.deleteSaleRecord(${sourceIndex})">Hapus</button>
                </div></td>
            </tr>`;
    }).join('');
};

function parseSalePeople(notes) {
    const text = String(notes || '');
    const buyerMatch = text.match(/Pembeli\s*:\s*([^|]+)/i);
    const sellerMatch = text.match(/Penjual\s*:\s*(.+)$/i);
    return { buyer: buyerMatch ? buyerMatch[1].trim() : '', seller: sellerMatch ? sellerMatch[1].trim() : '' };
}

function getCatalogSaleItem(name) {
    const normalizedName = normalizeItemName(name);
    return (window.memberCatalogData || []).find(item => normalizeItemName(item.name) === normalizedName) || null;
}

function getSaleItemPrice(name, payType) {
    const catalogItem = getCatalogSaleItem(name);
    if (!catalogItem) return 0;
    return payType === 'Black Money' ? Number(catalogItem.priceBM) || 0 : Number(catalogItem.priceUP) || 0;
}

function getSaleMoneyKey(payType) {
    return normalizeTransactionPayType(payType) === 'Black Money' ? 'blackMoney' : 'whiteMoney';
}

function createSaleItemOptions(selectedName = '') {
    const selectedNormalized = normalizeItemName(selectedName);
    const names = (window.memberCatalogData || []).map(item => normalizeItemName(item.name));
    if (selectedNormalized && !names.includes(selectedNormalized)) names.push(selectedNormalized);
    return names.map(name => `<option value="${escapeHtml(name)}" ${name === selectedNormalized ? 'selected' : ''}>${escapeHtml(name)}</option>`).join('');
}

window.renderSaleEditItems = function() {
    const container = document.getElementById('edit-sale-items');
    if (!container) return;
    if (!Array.isArray(window.saleEditDraftItems) || window.saleEditDraftItems.length === 0) {
        window.saleEditDraftItems = [{ name: normalizeItemName(window.memberCatalogData?.[0]?.name || ''), qty: 1 }];
    }
    container.innerHTML = window.saleEditDraftItems.map((item, index) => `
        <div class="sale-edit-item-row">
            <div class="form-group"><label>Jenis Barang</label><select class="form-control" onchange="window.updateSaleEditItem(${index}, 'name', this.value)">${createSaleItemOptions(item.name)}</select></div>
            <div class="form-group"><label>QTY</label><input type="number" class="form-control" min="1" value="${Math.max(1, Number(item.qty) || 1)}" onchange="window.updateSaleEditItem(${index}, 'qty', this.value)" oninput="window.updateSaleEditItem(${index}, 'qty', this.value)"></div>
            <button type="button" class="btn btn-sm btn-red" onclick="window.removeSaleEditItem(${index})">Hapus</button>
        </div>`).join('');
    window.recalculateSaleEditTotal();
};

window.openSaleEditModal = function(sourceIndex) {
    const record = (window.stockFlowData || [])[sourceIndex];
    if (!record || record.direction !== 'PENJUALAN') return alert('❌ Data penjualan tidak ditemukan.');
    const people = parseSalePeople(record.notes);
    document.getElementById('edit-sale-index').value = sourceIndex;
    document.getElementById('edit-sale-buyer').value = people.buyer;
    document.getElementById('edit-sale-seller').value = people.seller;
    document.getElementById('edit-sale-pay-type').value = normalizeTransactionPayType(record.payType) === 'Black Money' ? 'Black Money' : 'Uang Putih';
    window.saleEditDraftItems = mergeStockFlowItems(record.items || []).map(item => ({ ...item }));
    window.renderSaleEditItems();
    document.getElementById('modal-edit-sale').classList.add('active');
};

window.addSaleEditItem = function() {
    if (!Array.isArray(window.saleEditDraftItems)) window.saleEditDraftItems = [];
    window.saleEditDraftItems.push({ name: normalizeItemName(window.memberCatalogData?.[0]?.name || ''), qty: 1 });
    window.renderSaleEditItems();
};

window.removeSaleEditItem = function(index) {
    if (!Array.isArray(window.saleEditDraftItems)) return;
    window.saleEditDraftItems.splice(index, 1);
    window.renderSaleEditItems();
};

window.updateSaleEditItem = function(index, field, value) {
    const item = window.saleEditDraftItems?.[index];
    if (!item) return;
    if (field === 'name') item.name = normalizeItemName(value);
    if (field === 'qty') item.qty = Math.max(1, Number.parseInt(value, 10) || 1);
    window.recalculateSaleEditTotal();
};

window.recalculateSaleEditTotal = function() {
    const payTypeElement = document.getElementById('edit-sale-pay-type');
    const totalElement = document.getElementById('edit-sale-total');
    if (!payTypeElement || !totalElement) return;
    const payType = payTypeElement.value === 'Black Money' ? 'Black Money' : 'Uang Putih';
    const total = mergeStockFlowItems(window.saleEditDraftItems || []).reduce((sum, item) => sum + getSaleItemPrice(item.name, payType) * item.qty, 0);
    totalElement.innerText = payType === 'Black Money' ? formatUSD(total) : formatRP(total);
};

window.saveSaleEdit = async function(e) {
    if (e) e.preventDefault();
    const sourceIndex = Number.parseInt(document.getElementById('edit-sale-index').value, 10);
    const oldRecord = (window.stockFlowData || [])[sourceIndex];
    if (!oldRecord || oldRecord.direction !== 'PENJUALAN') return alert('❌ Data penjualan tidak ditemukan.');
    const buyer = document.getElementById('edit-sale-buyer').value.trim();
    const seller = document.getElementById('edit-sale-seller').value.trim();
    const newPayType = document.getElementById('edit-sale-pay-type').value === 'Black Money' ? 'Black Money' : 'Uang Putih';
    const newItems = mergeStockFlowItems(window.saleEditDraftItems || []);
    if (!buyer || !seller) return alert('Mohon isi nama pembeli dan penjual.');
    if (newItems.length === 0) return alert('Tambahkan minimal satu barang penjualan.');

    normalizeBrangkasItems();
    const oldItems = mergeStockFlowItems(oldRecord.items || []);
    const availableAfterReverse = { ...window.brangkasState.items };
    oldItems.forEach(item => { const name = normalizeItemName(item.name); availableAfterReverse[name] = (Number(availableAfterReverse[name]) || 0) + item.qty; });
    const shortages = newItems.filter(item => (Number(availableAfterReverse[normalizeItemName(item.name)]) || 0) < item.qty);
    if (shortages.length > 0) {
        const details = shortages.map(item => `${item.name}: tersedia ${Number(availableAfterReverse[normalizeItemName(item.name)]) || 0} PCS, dibutuhkan ${item.qty} PCS`).join('\n');
        return alert(`❌ Stok tidak mencukupi untuk perubahan penjualan:\n\n${details}`);
    }

    const newAmount = newItems.reduce((sum, item) => sum + getSaleItemPrice(item.name, newPayType) * item.qty, 0);
    oldItems.forEach(item => { const name = normalizeItemName(item.name); window.brangkasState.items[name] = (Number(window.brangkasState.items[name]) || 0) + item.qty; });
    const oldMoneyKey = getSaleMoneyKey(oldRecord.payType);
    window.brangkasState[oldMoneyKey] = Math.max(0, (Number(window.brangkasState[oldMoneyKey]) || 0) - (Number(oldRecord.amount) || 0));
    newItems.forEach(item => { const name = normalizeItemName(item.name); window.brangkasState.items[name] = (Number(window.brangkasState.items[name]) || 0) - item.qty; });
    const newMoneyKey = getSaleMoneyKey(newPayType);
    window.brangkasState[newMoneyKey] = (Number(window.brangkasState[newMoneyKey]) || 0) + newAmount;

    window.stockFlowData[sourceIndex] = { ...oldRecord, items: newItems, totalQty: newItems.reduce((sum, item) => sum + item.qty, 0), amount: newAmount, payType: newPayType, notes: `Pembeli: ${buyer} | Penjual: ${seller}`, updatedAt: new Date().toISOString() };
    await window.saveData();
    renderAll();
    window.closeModal('modal-edit-sale');
    alert('✅ Data penjualan, stok, dan saldo brangkas berhasil diperbarui.');
};

window.deleteSaleRecord = async function(sourceIndex) {
    const record = (window.stockFlowData || [])[sourceIndex];
    if (!record || record.direction !== 'PENJUALAN') return alert('❌ Data penjualan tidak ditemukan.');
    if (!confirm('Hapus data penjualan ini? Barang akan dikembalikan ke stok dan nominal penjualan akan dikurangi dari saldo brangkas.')) return;
    normalizeBrangkasItems();
    mergeStockFlowItems(record.items || []).forEach(item => { const name = normalizeItemName(item.name); window.brangkasState.items[name] = (Number(window.brangkasState.items[name]) || 0) + item.qty; });
    const moneyKey = getSaleMoneyKey(record.payType);
    window.brangkasState[moneyKey] = Math.max(0, (Number(window.brangkasState[moneyKey]) || 0) - (Number(record.amount) || 0));
    window.stockFlowData.splice(sourceIndex, 1);
    await window.saveData();
    renderAll();
    alert('✅ Data penjualan berhasil dihapus dan stok dikembalikan.');
};

function buildStockMovementRows(direction) {
    normalizeBrangkasItems();
    const records = (window.stockFlowData || [])
        .map((record, sourceIndex) => ({ record, sourceIndex }))
        .filter(entry => entry.record?.direction === direction)
        .sort((a, b) => getStockFlowDate(b.record) - getStockFlowDate(a.record))
        .slice(0, 20);

    if (records.length === 0) {
        const label = direction === 'MASUK' ? 'barang masuk' : 'barang keluar';
        return `<tr><td colspan="7" class="dashboard-empty">Belum ada ${label}.</td></tr>`;
    }

    return records.map(({ record, sourceIndex }) => {
        const itemLines = (record.items || []).map(item =>
            `<div>${escapeHtml(item.name)} x${Number(item.qty) || 0}</div>`
        ).join('');
        const stockLines = (record.items || []).map(item => {
            const current = Number(window.brangkasState.items[normalizeItemName(item.name)]) || 0;
            return `<div><span class="badge ${current <= 30 ? 'badge-red' : 'badge-green'}">${current} PCS</span></div>`;
        }).join('');
        return `
            <tr>
                <td>${escapeHtml(record.time || '-')}</td>
                <td>${escapeHtml(record.source || '-')}</td>
                <td><div class="movement-item-lines">${itemLines || '-'}</div></td>
                <td>${Number(record.totalQty) || 0} PCS</td>
                <td><div class="movement-item-lines">${stockLines || '-'}</div></td>
                <td class="stock-activity-notes">${escapeHtml(record.notes || '-')}</td>
                <td>
                    <div class="movement-action-buttons">
                        <button class="btn btn-sm btn-blue" type="button" onclick="window.openStockMovementEditModal(${sourceIndex})">Edit</button>
                        <button class="btn btn-sm btn-red" type="button" onclick="window.deleteStockMovementRecord(${sourceIndex})">Hapus</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

window.stockMovementEditDraftItems = [];

window.renderStockMovementEditItems = function() {
    const container = document.getElementById('edit-movement-items');
    if (!container) return;

    if (!Array.isArray(window.stockMovementEditDraftItems) || window.stockMovementEditDraftItems.length === 0) {
        window.stockMovementEditDraftItems = [{ name: '', qty: 1 }];
    }

    container.innerHTML = window.stockMovementEditDraftItems.map((item, index) => `
        <div class="movement-edit-item-row">
            <div class="form-group">
                <label>Nama Barang</label>
                <input
                    type="text"
                    class="form-control"
                    value="${escapeHtml(item.name || '')}"
                    placeholder="Contoh: VEST"
                    oninput="window.updateStockMovementEditItem(${index}, 'name', this.value)"
                >
            </div>
            <div class="form-group">
                <label>QTY</label>
                <input
                    type="number"
                    class="form-control"
                    min="1"
                    value="${Math.max(1, Number(item.qty) || 1)}"
                    oninput="window.updateStockMovementEditItem(${index}, 'qty', this.value)"
                >
            </div>
            <button type="button" class="btn btn-sm btn-red" onclick="window.removeStockMovementEditItem(${index})">Hapus</button>
        </div>
    `).join('');
};

window.updateStockMovementEditItem = function(index, field, value) {
    const item = window.stockMovementEditDraftItems?.[index];
    if (!item) return;
    if (field === 'name') item.name = value;
    if (field === 'qty') item.qty = Math.max(1, parseInt(value, 10) || 1);
};

window.addStockMovementEditItem = function() {
    if (!Array.isArray(window.stockMovementEditDraftItems)) window.stockMovementEditDraftItems = [];
    window.stockMovementEditDraftItems.push({ name: '', qty: 1 });
    window.renderStockMovementEditItems();
};

window.removeStockMovementEditItem = function(index) {
    if (!Array.isArray(window.stockMovementEditDraftItems)) return;
    window.stockMovementEditDraftItems.splice(index, 1);
    if (window.stockMovementEditDraftItems.length === 0) {
        window.stockMovementEditDraftItems.push({ name: '', qty: 1 });
    }
    window.renderStockMovementEditItems();
};

window.openStockMovementEditModal = function(sourceIndex) {
    if (!window.isAdminLoggedIn) {
        return alert('❌ Hanya pengurus yang dapat mengedit arus barang.');
    }

    const record = (window.stockFlowData || [])[sourceIndex];
    if (!record || !['MASUK', 'KELUAR'].includes(record.direction)) {
        return alert('❌ Data barang masuk/keluar tidak ditemukan.');
    }

    document.getElementById('edit-movement-index').value = sourceIndex;
    document.getElementById('edit-movement-direction').value = record.direction === 'MASUK' ? 'Barang Masuk' : 'Barang Keluar';
    document.getElementById('edit-movement-source').value = record.source || '';
    document.getElementById('edit-movement-notes').value = record.notes && record.notes !== '-' ? record.notes : '';
    window.stockMovementEditDraftItems = mergeStockFlowItems(record.items || []).map(item => ({ ...item }));
    window.renderStockMovementEditItems();
    document.getElementById('modal-edit-stock-movement').classList.add('active');
};

function calculateStockAfterMovementChange(record, newItems) {
    normalizeBrangkasItems();
    const currentStock = { ...(window.brangkasState.items || {}) };
    const oldItems = mergeStockFlowItems(record.items || []);
    const replacementItems = mergeStockFlowItems(newItems || []);
    const sign = record.direction === 'MASUK' ? 1 : -1;
    const oldMap = Object.fromEntries(oldItems.map(item => [normalizeItemName(item.name), Number(item.qty) || 0]));
    const newMap = Object.fromEntries(replacementItems.map(item => [normalizeItemName(item.name), Number(item.qty) || 0]));
    const names = new Set([...Object.keys(oldMap), ...Object.keys(newMap)]);

    for (const name of names) {
        const current = Number(currentStock[name]) || 0;
        const finalQty = current - (sign * (oldMap[name] || 0)) + (sign * (newMap[name] || 0));
        if (finalQty < 0) {
            return {
                ok: false,
                message: `${name}: stok sekarang ${current} PCS tidak cukup untuk koreksi ini.`
            };
        }
        currentStock[name] = finalQty;
    }

    return { ok: true, stock: currentStock, items: replacementItems };
}

window.saveStockMovementEdit = async function(e) {
    if (e) e.preventDefault();
    if (!window.isAdminLoggedIn) return alert('❌ Hanya pengurus yang dapat mengedit arus barang.');

    const sourceIndex = parseInt(document.getElementById('edit-movement-index').value, 10);
    const record = (window.stockFlowData || [])[sourceIndex];
    if (!record || !['MASUK', 'KELUAR'].includes(record.direction)) {
        return alert('❌ Data barang masuk/keluar tidak ditemukan.');
    }

    const newItems = mergeStockFlowItems(window.stockMovementEditDraftItems || []);
    if (newItems.length === 0) return alert('❌ Masukkan minimal satu barang dengan quantity lebih dari 0.');

    const adjustment = calculateStockAfterMovementChange(record, newItems);
    if (!adjustment.ok) return alert(`❌ Perubahan tidak dapat disimpan:

${adjustment.message}`);

    const newSource = String(document.getElementById('edit-movement-source').value || '').trim() || 'Aktivitas Brangkas';
    const newNotes = String(document.getElementById('edit-movement-notes').value || '').trim() || '-';

    window.brangkasState.items = adjustment.stock;
    window.stockFlowData[sourceIndex] = {
        ...record,
        source: newSource,
        notes: newNotes,
        items: adjustment.items,
        totalQty: adjustment.items.reduce((sum, item) => sum + item.qty, 0),
        updatedAt: new Date().toISOString()
    };

    await window.saveData();
    renderAll();
    window.closeModal('modal-edit-stock-movement');
    alert('✅ Data barang masuk/keluar dan stok brangkas berhasil diperbarui.');
};

window.deleteStockMovementRecord = async function(sourceIndex) {
    if (!window.isAdminLoggedIn) return alert('❌ Hanya pengurus yang dapat menghapus arus barang.');

    const record = (window.stockFlowData || [])[sourceIndex];
    if (!record || !['MASUK', 'KELUAR'].includes(record.direction)) {
        return alert('❌ Data barang masuk/keluar tidak ditemukan.');
    }

    const label = record.direction === 'MASUK' ? 'barang masuk' : 'barang keluar';
    if (!confirm(`Hapus data ${label} ini? Stok brangkas akan dikoreksi otomatis.`)) return;

    const adjustment = calculateStockAfterMovementChange(record, []);
    if (!adjustment.ok) {
        return alert(
            '❌ Data tidak dapat dihapus karena stok saat ini sudah dipakai oleh aktivitas lain.

' +
            adjustment.message
        );
    }

    window.brangkasState.items = adjustment.stock;
    window.stockFlowData.splice(sourceIndex, 1);
    await window.saveData();
    renderAll();
    alert(`✅ Data ${label} berhasil dihapus dan stok brangkas telah dikoreksi.`);
};

window.renderStockMovementPanels = function() {
    const incomingBody = document.getElementById('tbody-stock-incoming');
    const outgoingBody = document.getElementById('tbody-stock-outgoing');
    if (incomingBody) incomingBody.innerHTML = buildStockMovementRows('MASUK');
    if (outgoingBody) outgoingBody.innerHTML = buildStockMovementRows('KELUAR');
};

function drawMoneyFlowChart(canvasId, currency, days) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const parentWidth = canvas.parentElement?.clientWidth || 420;
    const cssHeight = 210;
    const ratio = Math.max(1, window.devicePixelRatio || 1);
    canvas.style.width = `${parentWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    canvas.width = Math.floor(parentWidth * ratio);
    canvas.height = Math.floor(cssHeight * ratio);

    const ctx = canvas.getContext('2d');
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, parentWidth, cssHeight);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dates = [];
    for (let offset = days - 1; offset >= 0; offset -= 1) {
        const date = new Date(today);
        date.setDate(today.getDate() - offset);
        dates.push(date);
    }

    const daily = new Map(dates.map(date => [localDateKey(date), { masuk: 0, keluar: 0 }]));
    getMoneyFlowRecords().forEach(record => {
        if (record.currency !== currency) return;
        const bucket = daily.get(localDateKey(record.date));
        if (!bucket) return;
        if (record.direction === 'MASUK') bucket.masuk += record.amount;
        else bucket.keluar += record.amount;
    });

    const values = dates.map(date => daily.get(localDateKey(date)));
    const maxValue = Math.max(1, ...values.flatMap(value => [value.masuk, value.keluar]));
    const left = 58;
    const right = 10;
    const top = 14;
    const bottom = 38;
    const chartW = Math.max(1, parentWidth - left - right);
    const chartH = cssHeight - top - bottom;
    const style = getComputedStyle(document.documentElement);
    const gridColor = style.getPropertyValue('--border-color').trim() || '#2a2e42';
    const textColor = style.getPropertyValue('--text-muted').trim() || '#9ca3af';
    const inColor = style.getPropertyValue('--accent-green').trim() || '#10b981';
    const outColor = style.getPropertyValue('--accent-red').trim() || '#ef4444';

    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 3; i += 1) {
        const y = top + (chartH * i / 3);
        const amount = maxValue * (1 - i / 3);
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(parentWidth - right, y);
        ctx.stroke();
        ctx.fillStyle = textColor;
        ctx.fillText(formatCompactMoney(amount, currency), left - 7, y);
    }

    const groupW = chartW / dates.length;
    const barW = Math.max(3, Math.min(13, groupW * 0.27));
    values.forEach((value, index) => {
        const center = left + groupW * index + groupW / 2;
        const inH = chartH * value.masuk / maxValue;
        const outH = chartH * value.keluar / maxValue;
        ctx.fillStyle = inColor;
        ctx.fillRect(center - barW - 1, top + chartH - inH, barW, inH);
        ctx.fillStyle = outColor;
        ctx.fillRect(center + 1, top + chartH - outH, barW, outH);
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(formatShortDate(dates[index]), center, top + chartH + 10);
    });
}

window.renderStockFlowDashboard = function() {
    const days = window.stockFlowChartDays || 7;
    const titleEl = document.getElementById('cash-flow-title') || document.getElementById('stock-flow-title');
    if (titleEl) titleEl.innerText = `Arus Kas Brangkas ${days} Hari Terakhir`;

    drawMoneyFlowChart('cash-flow-up-chart', 'UP', days);
    drawMoneyFlowChart('cash-flow-bm-chart', 'BM', days);
    drawMoneyFlowChart('cash-flow-rm-chart', 'RM', days);
    window.renderSalesData();
    window.renderStockMovementPanels();
};

if (!window._stockFlowResizeBound) {
    window._stockFlowResizeBound = true;
    window.addEventListener('resize', () => {
        if (document.getElementById('dashboard')?.classList.contains('active')) {
            window.renderStockFlowDashboard();
        }
    });
}

function renderTransactionRows(tbodyId, transactionType) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;

    const filteredTransactions = (window.transactionsData || [])
        .map((tx, originalIndex) => ({ ...tx, _index: originalIndex }))
        .filter(tx => tx.type === transactionType && !isMemberSaleTransaction(tx) && normalizeTransactionPayType(tx.payType) !== 'BARANG');

    if (filteredTransactions.length === 0) {
        const emptyText = transactionType === 'PEMASUKAN'
            ? 'Belum ada transaksi masuk.'
            : 'Belum ada transaksi keluar.';

        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; color:var(--text-muted);">
                    ${emptyText}
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredTransactions.map(tx => `
        <tr>
            <td style="color:var(--text-muted); font-size:0.85rem;">${escapeHtml(tx.time || '-')}</td>
            <td style="font-weight:600;">${escapeHtml(tx.item || '-')}</td>
            <td>${Number(tx.qty) || 0} PCS</td>
            <td style="font-weight:bold; color:${
                transactionType === 'PEMASUKAN'
                    ? 'var(--accent-green)'
                    : 'var(--accent-red)'
            };">
                ${escapeHtml(tx.total || '-')}
            </td>
            <td><span class="badge badge-black">${escapeHtml(tx.payType || '-')}</span></td>
            <td style="color:var(--text-muted); font-size:0.85rem;">${escapeHtml(tx.notes || '-')}</td>
            <td>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                    <button class="btn btn-sm btn-blue" type="button"
                        onclick="window.openEditTransaction(${tx._index})">
                        Edit
                    </button>
                    <button class="btn btn-sm btn-red" type="button"
                        onclick="window.deleteTransaction(${tx._index})">
                        Hapus
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

window.renderIncomingTransactions = function() {
    renderTransactionRows('tbody-transactions-in', 'PEMASUKAN');
};

window.renderOutgoingTransactions = function() {
    renderTransactionRows('tbody-transactions-out', 'PENGELUARAN');
};

window.renderOrderHistory = function() {
    const bmcToGroupBody = document.getElementById('tbody-order-history-bmc');
    const groupToBmcBody = document.getElementById('tbody-order-history-kelompok');

    if (!bmcToGroupBody || !groupToBmcBody) return;

    normalizeOrderHistoryData();

    const buildRows = (records, emptyText) => {
        if (records.length === 0) {
            return `
                <tr>
                    <td colspan="10" style="text-align:center; color:var(--text-muted);">
                        ${emptyText}
                    </td>
                </tr>
            `;
        }

        return records.map(order => {
            const statusClass = order.status === 'DONE' ? 'badge-green' : 'badge-red';
            return `
                <tr>
                    <td style="color:var(--text-muted); font-size:0.85rem;">
                        ${order.time}
                    </td>
                    <td style="font-weight:bold; color:var(--accent-gold);">
                        ${order.group || '-'}
                    </td>
                    <td style="font-weight:600;">${order.item}</td>
                    <td>${order.qty} PCS</td>
                    <td>${order.unitPrice || '-'}</td>
                    <td style="font-weight:bold; color:var(--accent-green);">
                        ${order.total}
                    </td>
                    <td><span class="badge badge-black">${order.payType}</span></td>
                    <td style="color:var(--text-muted); font-size:0.85rem; max-width:220px;">
                        ${order.notes || '-'}
                    </td>
                    <td><span class="badge ${statusClass}">${order.status}</span></td>
                    <td>
                        <button
                            class="btn btn-sm btn-blue"
                            type="button"
                            onclick="window.openEditOrderHistoryModal(${order._index})"
                        >
                            Edit
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    };

    const enrichedOrders = (window.orderHistoryData || []).map((order, index) => ({
        ...order,
        _index: index
    }));

    const bmcToGroup = enrichedOrders.filter(
        order => order.direction === 'BMC_TO_KELOMPOK'
    );

    const groupToBmc = enrichedOrders.filter(
        order => order.direction === 'KELOMPOK_TO_BMC'
    );

    bmcToGroupBody.innerHTML = buildRows(
        bmcToGroup,
        'Belum ada order BMC ke Kelompok yang diproses.'
    );

    groupToBmcBody.innerHTML = buildRows(
        groupToBmc,
        'Belum ada order Kelompok ke BMC yang diproses.'
    );
};

window.openEditOrderHistoryModal = function(orderIndex) {
    const order = (window.orderHistoryData || [])[orderIndex];
    if (!order) return alert('❌ Data order tidak ditemukan.');

    document.getElementById('edit-order-index').value = orderIndex;
    document.getElementById('edit-order-summary').value = `${order.group || '-'} | ${order.item} | ${order.qty} PCS`;
    document.getElementById('edit-order-status').value = order.status === 'DONE' ? 'DONE' : 'PENDING';
    document.getElementById('edit-order-notes').value = order.notes && order.notes !== '-' ? order.notes : '';
    document.getElementById('modal-edit-order').classList.add('active');
};

window.saveOrderHistoryEdit = async function(e) {
    if (e) e.preventDefault();

    const orderIndex = parseInt(document.getElementById('edit-order-index').value, 10);
    const order = (window.orderHistoryData || [])[orderIndex];
    if (!order) return alert('❌ Data order tidak ditemukan.');

    const newStatus = String(document.getElementById('edit-order-status').value || 'PENDING').toUpperCase();
    const newNotes = String(document.getElementById('edit-order-notes').value || '').trim() || '-';

    window.orderHistoryData[orderIndex] = {
        ...order,
        status: newStatus === 'DONE' ? 'DONE' : 'PENDING',
        notes: newNotes,
        updatedAt: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
    };

    await window.saveData();
    renderAll();
    window.closeModal('modal-edit-order');
    alert('✅ Status dan keterangan order berhasil diperbarui!');
};

window.openEditTransaction = function(transactionIndex) {
    if (!window.isAdminLoggedIn) {
        return alert('❌ Hanya pengurus yang dapat mengedit transaksi.');
    }

    const tx = (window.transactionsData || [])[transactionIndex];
    if (!tx) return alert('❌ Data transaksi tidak ditemukan.');

    document.getElementById('edit-transaction-index').value = String(transactionIndex);
    document.getElementById('edit-transaction-type').value = tx.type || '';
    document.getElementById('edit-transaction-time').value = tx.time || '-';
    document.getElementById('edit-transaction-item').value = tx.item || '';
    document.getElementById('edit-transaction-qty').value = Number(tx.qty) || 0;
    document.getElementById('edit-transaction-amount').value = parseStoredAmount(tx.total);
    document.getElementById('edit-transaction-pay-type').value = normalizeTransactionPayType(tx.payType);
    document.getElementById('edit-transaction-notes').value = tx.notes && tx.notes !== '-' ? tx.notes : '';
    document.getElementById('modal-edit-transaction').classList.add('active');
};

window.saveTransactionEdit = async function(e) {
    if (e) e.preventDefault();

    if (!window.isAdminLoggedIn) {
        return alert('❌ Hanya pengurus yang dapat mengedit transaksi.');
    }

    const transactionIndex = Number.parseInt(
        document.getElementById('edit-transaction-index').value,
        10
    );
    const tx = (window.transactionsData || [])[transactionIndex];
    if (!tx) return alert('❌ Data transaksi tidak ditemukan.');

    const item = String(document.getElementById('edit-transaction-item').value || '').trim();
    const qty = Number.parseInt(document.getElementById('edit-transaction-qty').value, 10);
    const amount = Number.parseInt(document.getElementById('edit-transaction-amount').value, 10);
    const payType = normalizeTransactionPayType(
        document.getElementById('edit-transaction-pay-type').value
    );
    const notes = String(document.getElementById('edit-transaction-notes').value || '').trim() || '-';

    if (!item) return alert('❌ Deskripsi transaksi wajib diisi.');
    if (!Number.isFinite(qty) || qty < 0) return alert('❌ QTY harus berupa angka 0 atau lebih.');
    if (!Number.isFinite(amount) || amount < 0) return alert('❌ Nominal harus berupa angka 0 atau lebih.');

    window.transactionsData[transactionIndex] = {
        ...tx,
        item,
        qty,
        total: formatTransactionAmount(amount, payType),
        payType,
        notes,
        updatedAt: new Date().toISOString()
    };

    await window.saveData();
    renderAll();
    window.closeModal('modal-edit-transaction');
    alert('✅ Data transaksi berhasil diperbarui.');
};

window.deleteTransaction = async function(transactionIndex) {
    if (!window.isAdminLoggedIn) {
        return alert('❌ Hanya pengurus yang dapat menghapus transaksi.');
    }

    const tx = (window.transactionsData || [])[transactionIndex];
    if (!tx) return alert('❌ Data transaksi tidak ditemukan.');

    if (!confirm(`Hapus transaksi ${tx.item || '-'} pada ${tx.time || '-'}?`)) return;

    window.transactionsData.splice(transactionIndex, 1);
    await window.saveData();
    renderAll();
};

window.clearTransactionsByType = async function(transactionType) {
    const label = transactionType === 'PEMASUKAN'
        ? 'transaksi masuk'
        : 'transaksi keluar';

    if (!confirm(`Apakah Anda yakin ingin menghapus seluruh ${label}?`)) return;

    window.transactionsData = (window.transactionsData || []).filter(
        tx => tx.type !== transactionType
    );

    await window.saveData();
    renderAll();
};

window.clearOrderHistory = async function(direction) {
    const label = direction === 'BMC_TO_KELOMPOK'
        ? 'riwayat order BMC ke Kelompok'
        : 'riwayat order Kelompok ke BMC';

    if (!confirm(`Apakah Anda yakin ingin menghapus seluruh ${label}?`)) return;

    window.orderHistoryData = (window.orderHistoryData || []).filter(
        order => order.direction !== direction
    );

    await window.saveData();
    renderAll();
};

// Pindahkan riwayat order lama dari transaksi campuran ke panel khusus.
function migrateLegacyOrderTransactions() {
    if (!Array.isArray(window.transactionsData)) window.transactionsData = [];
    if (!Array.isArray(window.orderHistoryData)) window.orderHistoryData = [];

    const migratedOrders = [];
    const remainingTransactions = [];

    window.transactionsData.forEach(tx => {
        const notes = String(tx.notes || '');
        let direction = null;

        if (
            notes.includes('BMC ➔ Kelompok') ||
            notes.includes('BMC -> Kelompok')
        ) {
            direction = 'BMC_TO_KELOMPOK';
        } else if (
            notes.includes('Kelompok ➔ BMC') ||
            notes.includes('Kelompok -> BMC')
        ) {
            direction = 'KELOMPOK_TO_BMC';
        }

        if (!direction) {
            remainingTransactions.push(tx);
            return;
        }

        const cleanedNotes = notes
            .replace('BMC ➔ Kelompok', '')
            .replace('BMC -> Kelompok', '')
            .replace('Kelompok ➔ BMC', '')
            .replace('Kelompok -> BMC', '')
            .replace(/^\s*\|\s*/, '')
            .trim() || '-';

        migratedOrders.push({
            time: tx.time,
            direction: direction,
            group: '-',
            item: tx.item,
            qty: tx.qty,
            unitPrice: '-',
            total: tx.total,
            payType: tx.payType,
            notes: cleanedNotes,
            status: 'PENDING'
        });
    });

    if (migratedOrders.length === 0) return false;

    window.transactionsData = remainingTransactions;
    window.orderHistoryData = [
        ...migratedOrders,
        ...window.orderHistoryData
    ];

    return true;
}

function migrateLegacyStockTransactions() {
    if (!Array.isArray(window.transactionsData)) window.transactionsData = [];
    if (!Array.isArray(window.stockFlowData)) window.stockFlowData = [];
    let changed = false;
    const remaining = [];

    window.transactionsData.forEach(tx => {
        if (isMemberSaleTransaction(tx)) {
            const items = parseSaleSummary(tx.item);
            if (items.length > 0) {
                const parsedDate = parseIndonesianDateTime(tx.time);
                recordStockFlow({
                    direction: 'PENJUALAN',
                    source: 'Penjualan Anggota',
                    items,
                    amount: parseStoredAmount(tx.total),
                    payType: tx.payType || '-',
                    notes: tx.notes || '-',
                    createdAt: parsedDate ? parsedDate.toISOString() : new Date().toISOString(),
                    time: tx.time || null
                });
                changed = true;
                return;
            }
        }

        if (normalizeTransactionPayType(tx.payType) === 'BARANG' && ['PEMASUKAN', 'PENGELUARAN'].includes(tx.type)) {
            const parsedDate = parseIndonesianDateTime(tx.time);
            recordStockFlow({
                direction: tx.type === 'PEMASUKAN' ? 'MASUK' : 'KELUAR',
                source: 'Input Brangkas (Data Lama)',
                items: [{ name: tx.item, qty: Number(tx.qty) || parseStoredAmount(tx.total) }],
                notes: tx.notes || '-',
                createdAt: parsedDate ? parsedDate.toISOString() : new Date().toISOString(),
                time: tx.time || null
            });
            changed = true;
            return;
        }

        remaining.push(tx);
    });

    if (changed) window.transactionsData = remaining;
    return changed;
}

function renderAll() {
    window.renderBrangkas();
    window.renderMemberCatalog();
    window.renderLoanItemOptions();
    window.renderLoanRecords();
    window.renderStockFlowDashboard();
    window.renderLowStock();
    window.renderBmcToKelompok();
    window.renderKelompokToBmc();
    window.renderOrderHistory();
    window.renderIncomingTransactions();
    window.renderOutgoingTransactions();
}

// SYNC FIREBASE
async function saveDataToCloud() {
    if (!isInitialLoadComplete) {
        console.warn("⚠️ Menunda simpan: Data server sedang dalam proses dimuat...");
        return;
    }
    
    console.log("⏳ Menulis data ke Firestore...");
    try {
        await setDoc(docRef, {
            brangkasState: window.brangkasState,
            bmcToKelompokData: window.bmcToKelompokData,
            kelompokToBmcData: window.kelompokToBmcData,
            transactionsData: window.transactionsData,
            orderHistoryData: window.orderHistoryData,
            loanRecordsData: window.loanRecordsData,
            stockFlowData: window.stockFlowData,
            lastUpdated: new Date().toISOString()
        });
        console.log("✅ Update data ke Firestore BERHASIL.");
    } catch (error) {
        console.error("❌ Gagal simpan ke Firestore:", error);
    }
}
window.saveData = saveDataToCloud;

function initRealtimeSync() {
    const statusEl = document.getElementById('status-koneksi');
    onSnapshot(docRef, (docSnap) => {
        if (statusEl) {
            statusEl.innerText = "⚡ Connected";
            statusEl.style.backgroundColor = "#10b981";
        }
        if (docSnap.exists()) {
            const data = docSnap.data();
            window.brangkasState = data.brangkasState || window.brangkasState;
            window.bmcToKelompokData = data.bmcToKelompokData || window.initialBmcToKelompok;
            window.kelompokToBmcData = data.kelompokToBmcData || window.initialKelompokToBmc;
            window.transactionsData = data.transactionsData || [];
            window.orderHistoryData = data.orderHistoryData || [];
            window.loanRecordsData = Array.isArray(data.loanRecordsData) ? data.loanRecordsData : [];
            window.stockFlowData = Array.isArray(data.stockFlowData) ? data.stockFlowData : [];
            normalizeOrderHistoryData();
            normalizeLoanRecordsData();
        } else {
            console.log("ℹ️ Dokumen Firestore belum ada, membuat dokumen awal...");
            window.orderHistoryData = [];
            window.loanRecordsData = [];
            window.loanDraftItems = [];
            window.stockFlowData = [];
            normalizeOrderHistoryData();
            normalizeLoanRecordsData();
            isInitialLoadComplete = true;
            saveDataToCloud();
        }
        const legacyOrdersMoved = migrateLegacyOrderTransactions();
        const legacyStockMoved = migrateLegacyStockTransactions();
        isInitialLoadComplete = true;
        renderAll();

        if (legacyOrdersMoved || legacyStockMoved) {
            saveDataToCloud();
        }
    }, (error) => {
        console.error("❌ Firebase Realtime Error:", error);
        if (statusEl) {
            statusEl.innerText = "❌ Disconnected";
            statusEl.style.backgroundColor = "#ef4444";
        }
    });
}

// INIT ON LOAD
window.addEventListener('DOMContentLoaded', () => {
    renderAll();
    initRealtimeSync();

    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => e.preventDefault());
    });
});
