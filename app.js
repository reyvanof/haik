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

// HELPER FORMAT
function formatRP(num) { return (!num || num === 0) ? 'Rp 0' : 'Rp ' + Number(num).toLocaleString('id-ID'); }
function formatUSD(num) { return (!num || num === 0) ? '$ ' + Number(num).toLocaleString('en-US') : '$ ' + Number(num).toLocaleString('en-US'); }

// SYSTEM TAB & PERAN
window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.add('active');

    const btnTab = document.querySelector(`[onclick="switchTab('${tabId}')"]`);
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

// FUNGSI HAPUS ITEM
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

        if (window.brangkasState.items[item.name]) {
            window.brangkasState.items[item.name] = Math.max(0, window.brangkasState.items[item.name] - item.qty);
        }
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
    const itemName = document.getElementById('b-item-name').value;
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
    const itemName = document.getElementById('modal-item-name').value;
    const qty = parseInt(document.getElementById('modal-qty').value) || 1;
    const payType = document.getElementById('modal-pay-type').value;
    const priceUP = parseFloat(document.getElementById('modal-price-up').value) || 0;
    const priceBM = parseFloat(document.getElementById('modal-price-bm').value) || 0;
    const notes = document.getElementById('modal-notes').value || '-';

    const unitPrice = payType === 'UP' ? priceUP : priceBM;
    const total = unitPrice * qty;
    const isIncome = type === 'BMC_TO_KELOMPOK';

    if (isIncome) {
        if (payType === 'UP') window.brangkasState.whiteMoney += total;
        else window.brangkasState.blackMoney += total;
    } else {
        if (payType === 'UP') window.brangkasState.whiteMoney = Math.max(0, window.brangkasState.whiteMoney - total);
        else window.brangkasState.blackMoney = Math.max(0, window.brangkasState.blackMoney - total);
    }

    window.transactionsData.unshift({
        time: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
        type: isIncome ? 'PEMASUKAN' : 'PENGELUARAN',
        item: itemName,
        qty: qty,
        total: payType === 'UP' ? formatRP(total) : formatUSD(total),
        payType: payType === 'UP' ? 'Uang Putih' : 'Black Money',
        notes: notes
    });

    await window.saveData();
    renderAll();
    window.closeModal('modal-sell');
    alert('✅ Transaksi Berhasil Processed!');
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
                <td><span class="badge badge-black">${tx.payType}</span></td>
                <td style="color:var(--text-muted); font-size:0.85rem;">${tx.notes}</td>
            </tr>
        `;
    });
};

window.clearTransactions = async function() {
    if (confirm('Apakah Anda yakin ingin menghapus seluruh riwayat transaksi?')) {
        window.transactionsData = [];
        await window.saveData();
        renderAll();
    }
};

function renderAll() {
    window.renderBrangkas();
    window.renderMemberCatalog();
    window.renderBmcToKelompok();
    window.renderKelompokToBmc();
    window.renderTransactions();
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
            lastUpdated: new Date().toISOString()
        }, { merge: true });
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
        } else {
            console.log("ℹ️ Dokumen Firestore belum ada, membuat dokumen awal...");
            isInitialLoadComplete = true;
            saveDataToCloud();
        }
        
        isInitialLoadComplete = true;
        renderAll();
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
