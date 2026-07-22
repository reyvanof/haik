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

// SYSTEM TAB & PERAN
window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.add('active');

    const btnTab = document.querySelector(`[onclick="window.switchTab('${tabId}')"], [onclick="switchTab('${tabId}')"]`);
    if (btnTab) btnTab.classList.add('active');
};

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
                    <button class="btn btn-sm btn-red" type="button" 
                        onclick="window.deleteBrangkasItem('${itemName}')">
                        Hapus
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
    
    const countEl = document.getElementById('stat-item-count');
    if (countEl) countEl.innerText = totalItems + ' PCS';
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
    const buyer = document.getElementById('cart-buyer-name').value;
    const seller = document.getElementById('cart-seller-name').value;
    const payType = document.getElementById('cart-pay-type').value;

    if (!buyer || !seller) return alert('Mohon isi nama Pembeli dan Penjual!');

    let grandTotal = 0;
    let itemSummary = [];

    window.cartItems.forEach(item => {
        const price = payType === 'UP' ? item.priceUP : item.priceBM;
        const subtotal = price * item.qty;
        grandTotal += subtotal;
        itemSummary.push(`${item.name} x${item.qty}`);

        normalizeBrangkasItems();
        const stockItemName = normalizeItemName(item.name);
        const currentStock = Number(window.brangkasState.items[stockItemName]) || 0;
        window.brangkasState.items[stockItemName] = Math.max(0, currentStock - item.qty);
    });

    if (payType === 'UP') window.brangkasState.whiteMoney += grandTotal;
    else window.brangkasState.blackMoney += grandTotal;

    window.transactionsData.unshift({
        time: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
        type: 'PEMASUKAN',
        item: itemSummary.join(', '),
        qty: window.cartItems.reduce((a, b) => a + b.qty, 0),
        total: payType === 'UP' ? formatRP(grandTotal) : formatUSD(grandTotal),
        payType: payType === 'UP' ? 'Uang Putih' : 'Black Money',
        notes: `Pembeli: ${buyer} | Penjual: ${seller}`
    });

    await window.saveData();
    window.clearCart();
    document.getElementById('cart-buyer-name').value = '';
    document.getElementById('cart-seller-name').value = '';
    renderAll();
    alert('✅ Transaksi Keranjang Berhasil Disimpan!');
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
    const qty = parseInt(document.getElementById('b-qty').value) || 0;
    const action = document.getElementById('b-action').value;
    const notes = document.getElementById('b-notes').value || '-';

    if (type === 'item') {
        if (!itemName) return alert('Masukkan nama item!');
        if (!window.brangkasState.items) window.brangkasState.items = {};
        
        let current = window.brangkasState.items[itemName] || 0;
        if (action === 'add') window.brangkasState.items[itemName] = current + qty;
        else if (action === 'sub') window.brangkasState.items[itemName] = Math.max(0, current - qty);
        else if (action === 'set') window.brangkasState.items[itemName] = qty;
    } else {
        let key = type === 'white' ? 'whiteMoney' : (type === 'black' ? 'blackMoney' : 'redMoney');
        let current = window.brangkasState[key] || 0;

        if (action === 'add') window.brangkasState[key] = current + qty;
        else if (action === 'sub') window.brangkasState[key] = Math.max(0, current - qty);
        else if (action === 'set') window.brangkasState[key] = qty;
    }

    let txType = action === 'add' ? 'PEMASUKAN' : (action === 'sub' ? 'PENGELUARAN' : 'UPDATE STOK');
    let label = type === 'white' ? 'Uang Putih' : (type === 'black' ? 'Black Money' : (type === 'red' ? 'Red Money' : itemName));
    let totalFormatted = type === 'white' ? formatRP(qty) : (type === 'item' ? `${qty} PCS` : formatUSD(qty));

    window.transactionsData.unshift({
        time: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
        type: txType,
        item: label,
        qty: type === 'item' ? qty : 1,
        total: totalFormatted,
        payType: type === 'item' ? 'BARANG' : label,
        notes: notes
    });

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

window.calculateLoanTotals = function() {
    const itemSelect = document.getElementById('loan-item');
    const qtyInput = document.getElementById('loan-qty');
    const bmEl = document.getElementById('loan-total-bm');
    const upEl = document.getElementById('loan-total-up');

    if (!itemSelect || !qtyInput || !bmEl || !upEl) return;

    const itemIndex = Number.parseInt(itemSelect.value, 10);
    const qty = Math.max(1, Number.parseInt(qtyInput.value, 10) || 1);
    const item = Number.isInteger(itemIndex) ? window.memberCatalogData[itemIndex] : null;

    const totalBM = item ? (Number(item.priceBM) || 0) * qty : 0;
    const totalUP = item ? (Number(item.priceUP) || 0) * qty : 0;

    bmEl.innerText = formatUSD(totalBM);
    upEl.innerText = formatRP(totalUP);
};

window.saveLoanRecord = async function(e) {
    if (e) e.preventDefault();

    if (!window.isAdminLoggedIn) {
        return alert('❌ Hanya pengurus yang dapat mengisi utang / peminjaman.');
    }

    const borrower = String(document.getElementById('loan-borrower')?.value || '').trim();
    const lender = String(document.getElementById('loan-lender')?.value || '').trim();
    const itemIndex = Number.parseInt(document.getElementById('loan-item')?.value, 10);
    const qty = Math.max(1, Number.parseInt(document.getElementById('loan-qty')?.value, 10) || 1);
    const item = Number.isInteger(itemIndex) ? window.memberCatalogData[itemIndex] : null;

    if (!borrower || !lender || !item) {
        return alert('❌ Nama peminjam, yang meminjamkan, dan jenis barang wajib diisi.');
    }

    if (!Array.isArray(window.loanRecordsData)) window.loanRecordsData = [];

    const totalBM = (Number(item.priceBM) || 0) * qty;
    const totalUP = (Number(item.priceUP) || 0) * qty;

    window.loanRecordsData.unshift({
        time: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
        borrower,
        lender,
        item: normalizeItemName(item.name),
        qty,
        totalBM,
        totalUP
    });

    await window.saveData();
    window.renderLoanRecords();

    document.getElementById('form-loan')?.reset();
    const qtyInput = document.getElementById('loan-qty');
    if (qtyInput) qtyInput.value = 1;
    window.calculateLoanTotals();

    alert('✅ Data utang / peminjaman berhasil disimpan!');
};

window.renderLoanRecords = function() {
    const tbody = document.getElementById('tbody-loan-records');
    if (!tbody) return;

    const records = Array.isArray(window.loanRecordsData) ? window.loanRecordsData : [];

    if (records.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center; color:var(--text-muted);">
                    Belum ada data utang / peminjaman.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = records.map((record, index) => `
        <tr>
            <td style="color:var(--text-muted); font-size:0.85rem;">${escapeHtml(record.time || '-')}</td>
            <td style="font-weight:700; color:var(--accent-gold);">${escapeHtml(record.borrower || '-')}</td>
            <td>${escapeHtml(record.lender || '-')}</td>
            <td style="font-weight:600;">${escapeHtml(record.item || '-')}</td>
            <td><span class="badge badge-white">${Number(record.qty) || 0} PCS</span></td>
            <td style="font-weight:700; color:var(--accent-purple);">${formatUSD(Number(record.totalBM) || 0)}</td>
            <td style="font-weight:700; color:var(--accent-green);">${formatRP(Number(record.totalUP) || 0)}</td>
            <td>
                <button class="btn btn-sm btn-red" type="button" onclick="window.deleteLoanRecord(${index})">
                    Hapus
                </button>
            </td>
        </tr>
    `).join('');
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

function renderTransactionRows(tbodyId, transactionType) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;

    const filteredTransactions = (window.transactionsData || []).filter(
        tx => tx.type === transactionType
    );

    if (filteredTransactions.length === 0) {
        const emptyText = transactionType === 'PEMASUKAN'
            ? 'Belum ada transaksi masuk.'
            : 'Belum ada transaksi keluar.';

        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; color:var(--text-muted);">
                    ${emptyText}
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredTransactions.map(tx => `
        <tr>
            <td style="color:var(--text-muted); font-size:0.85rem;">${tx.time}</td>
            <td style="font-weight:600;">${tx.item}</td>
            <td>${tx.qty} PCS</td>
            <td style="font-weight:bold; color:${
                transactionType === 'PEMASUKAN'
                    ? 'var(--accent-green)'
                    : 'var(--accent-red)'
            };">
                ${tx.total}
            </td>
            <td><span class="badge badge-black">${tx.payType}</span></td>
            <td style="color:var(--text-muted); font-size:0.85rem;">${tx.notes}</td>
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

function renderAll() {
    window.renderBrangkas();
    window.renderMemberCatalog();
    window.renderLoanItemOptions();
    window.renderLoanRecords();
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
            normalizeOrderHistoryData();
        } else {
            console.log("ℹ️ Dokumen Firestore belum ada, membuat dokumen awal...");
            window.orderHistoryData = [];
            window.loanRecordsData = [];
            normalizeOrderHistoryData();
            isInitialLoadComplete = true;
            saveDataToCloud();
        }
        const legacyOrdersMoved = migrateLegacyOrderTransactions();
        isInitialLoadComplete = true;
        renderAll();

        if (legacyOrdersMoved) {
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
