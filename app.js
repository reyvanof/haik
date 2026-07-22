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
function formatUSD(num) { return (!num || num === 0) ? '$ 0' : '$ ' + Number(num).toLocaleString('en-US'); }

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
                    <td><button class="btn btn-sm btn-red" type="button" onclick="window.deleteBrangkasItem('${itemName}')">Hapus</button></td>
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
                    <button class="btn btn-sm btn-green" type="button" onclick="window.addToCart('${item.name}', ${item.priceBM}, ${item.priceUP})">+ Keranjang</button>
                </td>
            </tr>
        `;
    });
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
                    <button class="btn btn-sm btn-blue" type="button" onclick="window.openOrderModal('BMC_TO_KELOMPOK', ${index})">Proses Order</button>
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
                    <button class="btn btn-sm btn-green" type="button" onclick="window.openOrderModal('KELOMPOK_TO_BMC', ${index})">Terima / Beli</button>
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
                <td><span class="badge badge-black">${tx.payType}</span></td>
                <td style="color:var(--text-muted); font-size:0.85rem;">${tx.notes}</td>
            </tr>
        `;
    });
};

// FITUR KERANJANG BELANJA (MEMBER CATALOG)
window.addToCart = function(name, priceBM, priceUP) {
    const inputQty = prompt(`Masukkan jumlah ${name} yang ingin dibeli:`, "1");
    if (!inputQty) return;
    const qty = parseInt(inputQty);
    if (isNaN(qty) || qty <= 0) return alert("Jumlah barang harus angka positif!");

    const payTypeChoice = prompt(`Pilih Jenis Pembayaran:\n1. Black Money (BM)\n2. Uang Putih (UP)`, "1");
    let payType = 'BM';
    let unitPrice = priceBM;

    if (payTypeChoice === '2') {
        payType = 'UP';
        unitPrice = priceUP;
    } else if (payTypeChoice !== '1') {
        return alert("Pilihan pembayaran tidak valid!");
    }

    const grandTotal = unitPrice * qty;
    window.cartItems.push({
        name,
        qty,
        payType,
        unitPrice,
        grandTotal
    });

    window.renderCart();
    alert(`✅ ${name} (${qty} PCS) berhasil ditambahkan ke keranjang!`);
};

window.renderCart = function() {
    const tbody = document.getElementById('tbody-cart');
    const totalEl = document.getElementById('cart-grand-total');
    if (!tbody) return;

    tbody.innerHTML = '';
    let totalBM = 0;
    let totalUP = 0;

    window.cartItems.forEach((item, index) => {
        if (item.payType === 'BM') totalBM += item.grandTotal;
        if (item.payType === 'UP') totalUP += item.grandTotal;

        const formattedPrice = item.payType === 'BM' ? formatUSD(item.grandTotal) : formatRP(item.grandTotal);

        tbody.innerHTML += `
            <tr>
                <td style="font-weight: 600;">${item.name}</td>
                <td>${item.qty} PCS</td>
                <td><span class="badge badge-black">${item.payType}</span></td>
                <td style="font-weight: bold; color: var(--accent-green);">${formattedPrice}</td>
                <td>
                    <button class="btn btn-sm btn-red" type="button" onclick="window.removeFromCart(${index})">Hapus</button>
                </td>
            </tr>
        `;
    });

    if (totalEl) {
        totalEl.innerText = `Total: ${formatUSD(totalBM)} | ${formatRP(totalUP)}`;
    }
};

window.removeFromCart = function(index) {
    window.cartItems.splice(index, 1);
    window.renderCart();
};

window.checkoutCart = async function() {
    if (window.cartItems.length === 0) return alert("Keranjang belanjaan masih kosong!");

    const buyerName = prompt("Masukkan Nama Pembeli / Member:", "Member BMC");
    if (!buyerName) return;

    window.cartItems.forEach(item => {
        const formattedTotal = item.payType === 'BM' ? formatUSD(item.grandTotal) : formatRP(item.grandTotal);
        const labelPay = item.payType === 'BM' ? 'Black Money' : 'Uang Putih';

        // Pemasukan ke Kas
        if (item.payType === 'BM') window.brangkasState.blackMoney += item.grandTotal;
        if (item.payType === 'UP') window.brangkasState.whiteMoney += item.grandTotal;

        // Pengurangan stok brangkas jika barang tersedia
        if (window.brangkasState.items && window.brangkasState.items[item.name]) {
            window.brangkasState.items[item.name] = Math.max(0, window.brangkasState.items[item.name] - item.qty);
        }

        // Simpan ke Riwayat Transaksi
        window.transactionsData.unshift({
            time: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
            type: 'PEMASUKAN',
            item: `KATALOG: ${item.name}`,
            qty: item.qty,
            total: formattedTotal,
            payType: labelPay,
            notes: `Pembeli: ${buyerName}`
        });
    });

    window.cartItems = [];
    await window.saveData();
    renderAll();
    window.renderCart();
    alert('✅ Checkout Berhasil dan Saldo Telah Diperbarui!');
};

// MANAJEMEN BRANGKAS (HAPUS BARANG)
window.deleteBrangkasItem = async function(itemName) {
    if (!window.brangkasState.items || !(itemName in window.brangkasState.items)) return;
    
    if (confirm(`Apakah Anda yakin ingin menghapus "${itemName}" dari Brangkas?`)) {
        delete window.brangkasState.items[itemName];
        await window.saveData();
        renderAll();
        alert(`✅ Barang ${itemName} telah dihapus dari Brangkas.`);
    }
};

// MANAJEMEN ADMIN PIN
window.loginAdmin = function() {
    const inputPin = prompt("Masukkan PIN Admin:");
    if (inputPin === window.ADMIN_PIN) {
        window.isAdminLoggedIn = true;
        alert("✅ Login Admin Berhasil!");
        renderAll();
    } else {
        alert("❌ PIN Salah!");
    }
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
        if (docSnap.exists()) {
            const data = docSnap.data();
            window.brangkasState = data.brangkasState || window.brangkasState;
            window.bmcToKelompokData = data.bmcToKelompokData || window.initialBmcToKelompok;
            window.kelompokToBmcData = data.kelompokToBmcData || window.initialKelompokToBmc;
            window.transactionsData = data.transactionsData || [];
        } else {
            saveDataToCloud();
        }
        renderAll();
    });
}

// LOGIKA MODAL TRANSAKSI SESUAI GAMBAR
window.currentActiveOrder = null;

window.openOrderModal = function(type, index) {
    const list = type === 'BMC_TO_KELOMPOK' ? window.bmcToKelompokData : window.kelompokToBmcData;
    const itemData = list[index];
    if (!itemData) return;

    window.currentActiveOrder = { ...itemData, orderType: type };

    const titleEl = document.getElementById('m-order-title');
    if (titleEl) titleEl.innerText = `Transaksi Item: ${itemData.item} dari ${itemData.group}`;
    
    const itemEl = document.getElementById('m-order-item');
    if (itemEl) itemEl.value = `${itemData.item} dari ${itemData.group}`;
    
    const qtyEl = document.getElementById('m-order-qty');
    if (qtyEl) qtyEl.value = 1;
    
    const payEl = document.getElementById('m-order-paytype');
    if (payEl) payEl.value = 'UP';
    
    const notesEl = document.getElementById('m-order-notes');
    if (notesEl) notesEl.value = '';

    window.calcOrderModalTotal();
    const modalEl = document.getElementById('modal-order-panel');
    if (modalEl) modalEl.style.display = 'flex';
};

window.calcOrderModalTotal = function() {
    if (!window.currentActiveOrder) return;
    const qtyInput = document.getElementById('m-order-qty');
    const payTypeInput = document.getElementById('m-order-paytype');
    
    const qty = parseInt(qtyInput ? qtyInput.value : 1) || 1;
    const payType = payTypeInput ? payTypeInput.value : 'UP';
    const unitPrice = window.currentActiveOrder.priceWO || window.currentActiveOrder.priceW || 0;

    const unitPriceFormatted = payType === 'UP' ? formatRP(unitPrice) : formatUSD(unitPrice);
    const grandTotal = unitPrice * qty;
    const grandTotalFormatted = payType === 'UP' ? formatRP(grandTotal) : formatUSD(grandTotal);

    const priceEl = document.getElementById('m-order-unitprice');
    if (priceEl) priceEl.value = unitPriceFormatted;
    
    const totalEl = document.getElementById('m-order-total');
    if (totalEl) totalEl.value = grandTotalFormatted;
};

window.closeOrderModal = function() {
    const modalEl = document.getElementById('modal-order-panel');
    if (modalEl) modalEl.style.display = 'none';
    window.currentActiveOrder = null;
};

window.confirmOrderModal = async function() {
    if (!window.currentActiveOrder) return;

    const qtyInput = document.getElementById('m-order-qty');
    const payTypeInput = document.getElementById('m-order-paytype');
    const notesInput = document.getElementById('m-order-notes');

    const qty = parseInt(qtyInput ? qtyInput.value : 1) || 1;
    const payType = payTypeInput ? payTypeInput.value : 'UP'; // UP, BM, RM
    const notes = (notesInput && notesInput.value) ? notesInput.value : '-';
    const unitPrice = window.currentActiveOrder.priceWO || window.currentActiveOrder.priceW || 0;
    const grandTotal = unitPrice * qty;

    const isIncome = window.currentActiveOrder.orderType === 'BMC_TO_KELOMPOK';
    const txType = isIncome ? 'PEMASUKAN' : 'PENGELUARAN';

    // Update Saldo Kas
    if (isIncome) {
        if (payType === 'UP') window.brangkasState.whiteMoney += grandTotal;
        else if (payType === 'BM') window.brangkasState.blackMoney += grandTotal;
        else if (payType === 'RM') window.brangkasState.redMoney += grandTotal;
    } else {
        if (payType === 'UP') window.brangkasState.whiteMoney = Math.max(0, window.brangkasState.whiteMoney - grandTotal);
        else if (payType === 'BM') window.brangkasState.blackMoney = Math.max(0, window.brangkasState.blackMoney - grandTotal);
        else if (payType === 'RM') window.brangkasState.redMoney = Math.max(0, window.brangkasState.redMoney - grandTotal);
    }

    // Penamaan Metode Pembayaran di Rekapan
    let labelPayType = 'Uang Putih';
    let formattedTotal = formatRP(grandTotal);
    if (payType === 'BM') { labelPayType = 'Black Money'; formattedTotal = formatUSD(grandTotal); }
    if (payType === 'RM') { labelPayType = 'Red Money'; formattedTotal = formatUSD(grandTotal); }

    // Catat Riwayat Transaksi
    window.transactionsData.unshift({
        time: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
        type: txType,
        item: `${window.currentActiveOrder.item} (${window.currentActiveOrder.group})`,
        qty: qty,
        total: formattedTotal,
        payType: labelPayType,
        notes: notes
    });

    await window.saveData();
    renderAll();
    window.closeOrderModal();
    alert('✅ Transaksi Berhasil Dicatat!');
};

// FIX UNTUK INPUT DASHBOARD & BRANGKAS AGAR TIDAK REFRESH / PINDAH TAB
window.submitDashboardMoney = async function(event, type) {
    if (event) event.preventDefault(); // Mencegah reload browser

    const amountInput = prompt(`Masukkan Nominal Uang (${type}):`, "100000");
    if (!amountInput) return;
    const nominal = parseInt(amountInput);
    if (isNaN(nominal) || nominal <= 0) return alert("Nominal tidak valid!");

    const pChoice = prompt("Pilih Jenis Uang:\n1. Uang Putih (UP)\n2. Black Money (BM)\n3. Red Money (RM)", "1");
    let payType = 'UP';
    let labelPayType = 'Uang Putih';
    if (pChoice === '2') { payType = 'BM'; labelPayType = 'Black Money'; }
    if (pChoice === '3') { payType = 'RM'; labelPayType = 'Red Money'; }

    const notes = prompt("Keterangan Tambahan / Sumber:", "Kas Dashboard");

    if (type === 'PEMASUKAN') {
        if (payType === 'UP') window.brangkasState.whiteMoney += nominal;
        else if (payType === 'BM') window.brangkasState.blackMoney += nominal;
        else if (payType === 'RM') window.brangkasState.redMoney += nominal;
    } else {
        if (payType === 'UP') window.brangkasState.whiteMoney = Math.max(0, window.brangkasState.whiteMoney - nominal);
        else if (payType === 'BM') window.brangkasState.blackMoney = Math.max(0, window.brangkasState.blackMoney - nominal);
        else if (payType === 'RM') window.brangkasState.redMoney = Math.max(0, window.brangkasState.redMoney - nominal);
    }

    const totalFormatted = payType === 'UP' ? formatRP(nominal) : formatUSD(nominal);

    window.transactionsData.unshift({
        time: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
        type: type,
        item: 'MUTASI KAS BRANGKAS',
        qty: 1,
        total: totalFormatted,
        payType: labelPayType,
        notes: notes || '-'
    });

    await window.saveData();
    renderAll();
    alert(`✅ Saldo Berhasil Diperbarui!`);
};

window.submitBrangkasItem = async function(event) {
    if (event) event.preventDefault(); // Mencegah reload browser

    const itemName = prompt("Masukkan Nama Barang:", "VEST");
    if (!itemName) return;
    const qty = parseInt(prompt("Masukkan Jumlah (Qty):", "10"));
    if (isNaN(qty) || qty <= 0) return alert("Qty tidak valid!");

    if (!window.brangkasState.items) window.brangkasState.items = {};
    window.brangkasState.items[itemName] = (window.brangkasState.items[itemName] || 0) + qty;

    await window.saveData();
    renderAll();
    alert(`✅ Barang ${itemName} (${qty} PCS) Berhasil Ditambahkan ke Brangkas!`);
};

// INIT ON LOAD & EVENT PREVENT REFRESH
window.addEventListener('DOMContentLoaded', () => {
    renderAll();
    initRealtimeSync();

    // Mencegah semua elemen form bawaan melakukan auto-submit / refresh
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => e.preventDefault());
    });
});
