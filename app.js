import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, updateDoc, deleteField, FieldPath, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
// Login Pengurus memakai ID + password tetap yang TIDAK disimpan di Firestore.
// Dengan begitu, akun admin tidak dapat diganti dari menu website dan proses login
// tidak pernah menulis ulang database.
const FIXED_ADMIN_LOGIN = Object.freeze({
    version: 1,
    algorithm: 'PBKDF2-SHA256',
    idSalt: 'Qk1DX0FETUlOX0lEX1Yx',
    idHash: 'kRnENbNuWlUehjtwZNgoEm+ASqmgheHlkpOfMIgEzV4=',
    passwordSalt: 'Qk1DX0FETUlOX1BBU1NXT1JEX1Yx',
    passwordHash: 'rmk3PjHjY//eh+G5eJFRu8tjY6/IJ29pMgRkLLw9Ypg=',
    iterations: 210000
});

window.isAdminLoggedIn = false;
let isInitialLoadComplete = false;
let adminLoginFailedAttempts = 0;
let adminLoginLockedUntil = 0;

// Kredensial yang dipilih pengguna untuk disimpan hanya berada di browser/perangkat ini.
// Data ini tidak pernah dikirim ke atau disimpan di Firestore.
const ADMIN_LOGIN_STORAGE_KEYS = Object.freeze({
    rememberId: 'bmc_admin_remember_id',
    adminId: 'bmc_admin_saved_id',
    rememberPassword: 'bmc_admin_remember_password',
    password: 'bmc_admin_saved_password'
});

function getAdminLoginStorage() {
    try {
        return window.localStorage;
    } catch (error) {
        console.warn('Penyimpanan login browser tidak tersedia:', error);
        return null;
    }
}

function loadRememberedAdminLogin() {
    const storage = getAdminLoginStorage();
    const idInput = document.getElementById('input-admin-id');
    const passwordInput = document.getElementById('input-admin-password');
    const rememberIdInput = document.getElementById('remember-admin-id');
    const rememberPasswordInput = document.getElementById('remember-admin-password');
    if (!storage) return;

    const rememberId = storage.getItem(ADMIN_LOGIN_STORAGE_KEYS.rememberId) === '1';
    const rememberPassword = storage.getItem(ADMIN_LOGIN_STORAGE_KEYS.rememberPassword) === '1';

    if (rememberIdInput) rememberIdInput.checked = rememberId || rememberPassword;
    if (rememberPasswordInput) rememberPasswordInput.checked = rememberPassword;
    if (idInput) idInput.value = (rememberId || rememberPassword)
        ? (storage.getItem(ADMIN_LOGIN_STORAGE_KEYS.adminId) || '')
        : '';
    if (passwordInput) passwordInput.value = rememberPassword
        ? (storage.getItem(ADMIN_LOGIN_STORAGE_KEYS.password) || '')
        : '';
}

function saveRememberedAdminLogin(adminId, password) {
    const storage = getAdminLoginStorage();
    if (!storage) return;

    const rememberIdInput = document.getElementById('remember-admin-id');
    const rememberPasswordInput = document.getElementById('remember-admin-password');
    const rememberPassword = Boolean(rememberPasswordInput?.checked);
    const rememberId = Boolean(rememberIdInput?.checked) || rememberPassword;

    storage.setItem(ADMIN_LOGIN_STORAGE_KEYS.rememberId, rememberId ? '1' : '0');
    storage.setItem(ADMIN_LOGIN_STORAGE_KEYS.rememberPassword, rememberPassword ? '1' : '0');

    if (rememberId) storage.setItem(ADMIN_LOGIN_STORAGE_KEYS.adminId, String(adminId || '').trim());
    else storage.removeItem(ADMIN_LOGIN_STORAGE_KEYS.adminId);

    if (rememberPassword) storage.setItem(ADMIN_LOGIN_STORAGE_KEYS.password, String(password || ''));
    else storage.removeItem(ADMIN_LOGIN_STORAGE_KEYS.password);
}

function bindAdminRememberControls() {
    const rememberIdInput = document.getElementById('remember-admin-id');
    const rememberPasswordInput = document.getElementById('remember-admin-password');

    rememberPasswordInput?.addEventListener('change', () => {
        if (rememberPasswordInput.checked && rememberIdInput) rememberIdInput.checked = true;
    });

    rememberIdInput?.addEventListener('change', () => {
        if (!rememberIdInput.checked && rememberPasswordInput) rememberPasswordInput.checked = false;
    });
}

window.memberCatalogData = [
    { category: 'BODY ARMOR', name: 'VEST', priceBM: 80000, priceUP: 108000, note: '' },
    { category: 'CLASS 1 (SENJATA +15%)', name: 'CERAMIC', priceBM: 95000, priceUP: 110000, note: 'Khusus Senjata +15%' },
    { category: 'CLASS 1 (SENJATA +15%)', name: 'REVOLVER MK2', priceBM: 190000, priceUP: 216000, note: 'Khusus Senjata +15%' },
    { category: 'CLASS 2 (SENJATA +15%)', name: 'SMG', priceBM: 290000, priceUP: 350000, note: 'Khusus Senjata +15%' },
    { category: 'CLASS 2 (SENJATA +15%)', name: 'MICRO SMG', priceBM: 290000, priceUP: 350000, note: 'Khusus Senjata +15%' },
    { category: 'CLASS 2 (SENJATA +15%)', name: 'MINI SMG', priceBM: 250000, priceUP: 290000, note: 'Khusus Senjata +15%' },
    { category: 'CLASS 2 (SENJATA +15%)', name: 'TEC-9', priceBM: 250000, priceUP: 290000, note: 'Khusus Senjata +15%' },
    { category: 'CLASS 3 (SENJATA +15%)', name: 'ASSAULT RIFFLE', priceBM: 590000, priceUP: 615000, note: 'Khusus Senjata +15%' },
    { category: 'CLASS 3 (SENJATA +15%)', name: 'SPECIAL CARBINE', priceBM: 700000, priceUP: 750000, note: 'Khusus Senjata +15%' },
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
    { group: 'H2', category: 'VEST', item: 'VEST', qty: '50 PCS', priceWO: 120000, priceW: 0, note: '-', ket: '-' },
    { group: 'H2', category: 'ROBBERY RESULTS', item: 'SPRING', qty: '70 PCS EACH', priceWO: 5000, priceW: 0, note: '1:1', ket: 'BARTER WITH PLAT BESI' },
    { group: 'H2', category: 'ROBBERY RESULTS', item: 'GEAR', qty: '70 PCS EACH', priceWO: 5000, priceW: 0, note: '1:1', ket: 'BARTER WITH PLAT BESI' },
    { group: 'DVC', category: 'VEST', item: 'VEST', qty: '30 PCS', priceWO: 140000, priceW: 0, note: '-', ket: '-' },
    { group: 'REBELLION', category: 'VEST', item: 'VEST', qty: '30 PCS', priceWO: 150000, priceW: 0, note: '-', ket: '-' },
    { group: 'RDF', category: 'VEST', item: 'VEST', qty: 'UNLIMITED', priceWO: 120000, priceW: 0, note: '-', ket: '-' },
    { group: 'HELLSTAR', category: 'VEST', item: 'VEST', qty: '30 PCS', priceWO: 120000, priceW: 0, note: '-', ket: '-' },
    { group: 'AROGANZ', category: 'VEST', item: 'VEST', qty: '30 PCS', priceWO: 150000, priceW: 0, note: '-', ket: '-' },
    { group: 'FREEMASON', category: 'VEST', item: 'VEST', qty: '30 PCS', priceWO: 150000, priceW: 0, note: '-', ket: '-' },
    { group: 'WTMC', category: 'VEST', item: 'VEST', qty: '20 PCS', priceWO: 120000, priceW: 0, note: '-', ket: '-' },
    { group: 'CAMMORA', category: 'VEST', item: 'VEST', qty: 'TBA', priceWO: 0, priceW: 0, note: '-', ket: 'TBA' },
    { group: 'ADDON BUSINESS', category: 'ROBBERY EQUIPMENT', item: 'DRILL', qty: 'TBA', priceWO: 50000, priceW: 0, note: '-', ket: '-' },
    { group: 'ADDON BUSINESS', category: 'ROBBERY EQUIPMENT', item: 'ALAT ELECTRONIC', qty: 'TBA', priceWO: 65000, priceW: 0, note: '-', ket: '-' },
    { group: 'ADDON BUSINESS', category: 'ROBBERY EQUIPMENT', item: 'ADVANCE LOCKPICK', qty: 'TBA', priceWO: 0, priceW: 0, note: '-', ket: 'TBA' },
    { group: 'ADDON BUSINESS', category: 'ROBBERY EQUIPMENT', item: 'OBENG', qty: 'TBA', priceWO: 0, priceW: 0, note: '-', ket: 'TBA' }
];

window.initialKelompokToBmc = [
    { group: 'HAKUSHIKAI', category: 'CLASS 1', item: 'CERAMIC', qty: '30 PCS', priceWO: 280000, priceW: 0, note: '-', ket: 'TBA' },
    { group: 'HAKUSHIKAI', category: 'CLASS 1', item: 'REVOLVER', qty: '30 PCS', priceWO: 190000, priceW: 175000, note: '-', ket: '-' },
    { group: 'HAKUSHIKAI', category: 'CLASS 2', item: 'TEC - 9', qty: '30 PCS', priceWO: 290000, priceW: 200000, note: '-', ket: '-' },
    { group: 'HAKUSHIKAI', category: 'CLASS 2', item: 'MINI SMG', qty: '30 PCS', priceWO: 290000, priceW: 200000, note: '-', ket: '-' },
    { group: 'HAKUSHIKAI', category: 'CLASS 2', item: 'MICRO SMG', qty: '30 PCS', priceWO: 370000, priceW: 240000, note: '-', ket: '6 KOTAK KARET, 7 SPRING, 6 GEAR' },
    { group: 'HAKUSHIKAI', category: 'CLASS 2', item: 'SMG', qty: '30 PCS', priceWO: 370000, priceW: 240000, note: '-', ket: '8 KOTAK KARET, 8 SPRING, 7 GEAR' },
    { group: 'HAKUSHIKAI', category: 'CLASS 3', item: 'ASSAULT RIFFLE', qty: '3 PCS', priceWO: 400000, priceW: 0, note: '-', ket: 'TBA' },

    { group: 'SHINIGAMI', category: 'CLASS 1', item: 'CERAMIC', qty: 'UNLIMITED SELAGI ADA BAHAN', priceWO: 100000, priceW: 0, note: '-', ket: '-' },
    { group: 'SHINIGAMI', category: 'CLASS 1', item: 'REVOLVER', qty: 'UNLIMITED SELAGI ADA BAHAN', priceWO: 200000, priceW: 0, note: '-', ket: '-' },
    { group: 'SHINIGAMI', category: 'CLASS 2', item: 'TEC - 9', qty: 'UNLIMITED SELAGI ADA BAHAN', priceWO: 250000, priceW: 0, note: '-', ket: '-' },
    { group: 'SHINIGAMI', category: 'CLASS 2', item: 'MINI SMG', qty: 'UNLIMITED SELAGI ADA BAHAN', priceWO: 250000, priceW: 0, note: '-', ket: '-' },
    { group: 'SHINIGAMI', category: 'CLASS 2', item: 'MICRO SMG', qty: 'UNLIMITED SELAGI ADA BAHAN', priceWO: 280000, priceW: 0, note: '-', ket: '-' },
    { group: 'SHINIGAMI', category: 'CLASS 2', item: 'SMG', qty: 'UNLIMITED SELAGI ADA BAHAN', priceWO: 280000, priceW: 0, note: '-', ket: '-' },
    { group: 'SHINIGAMI', category: 'CLASS 3', item: 'ASSAULT RIFFLE', qty: 'UNLIMITED SELAGI ADA BAHAN', priceWO: 470000, priceW: 0, note: '-', ket: '-' },

    { group: 'H2', category: 'CLASS 1', item: 'CERAMIC', qty: '500 PCS', priceWO: 80000, priceW: 0, note: '1:1', ket: '-' },
    { group: 'H2', category: 'CLASS 1', item: 'REVOLVER', qty: '500 PCS', priceWO: 130000, priceW: 0, note: '1:1', ket: '-' },
    { group: 'H2', category: 'CLASS 2', item: 'TEC - 9', qty: '400 PCS', priceWO: 200000, priceW: 0, note: '1:1', ket: '-' },
    { group: 'H2', category: 'CLASS 2', item: 'MINI SMG', qty: '400 PCS', priceWO: 200000, priceW: 0, note: '1:1', ket: '-' },
    { group: 'H2', category: 'CLASS 2', item: 'MICRO SMG', qty: '400 PCS', priceWO: 232000, priceW: 0, note: '1:1', ket: '-' },
    { group: 'H2', category: 'CLASS 2', item: 'SMG', qty: '400 PCS', priceWO: 232000, priceW: 0, note: '1:1', ket: '-' },
    { group: 'H2', category: 'CLASS 3', item: 'ASSAULT RIFFLE', qty: '20-30 PCS', priceWO: 472000, priceW: 0, note: '1:1', ket: '-' },
    { group: 'H2', category: 'CLASS 3', item: 'SPECIAL CARBINE', qty: '20-30 PCS', priceWO: 532000, priceW: 0, note: '1:1', ket: '-' },

    { group: 'CAMMORA', category: 'ILLEGAL ITEMS', item: 'SPRING', qty: '-', priceWO: 14000, priceW: 5000, note: 'Rp12.500', ket: 'SPECIAL: ORDER DIATAS 100 PCS' },
    { group: 'CAMMORA', category: 'ILLEGAL ITEMS', item: 'GEAR', qty: '-', priceWO: 14000, priceW: 5000, note: 'Rp12.500', ket: 'SPECIAL: ORDER DIATAS 100 PCS' },
    { group: 'CAMMORA', category: 'ILLEGAL ITEMS', item: 'PLAT BESI', qty: '-', priceWO: 7000, priceW: 5000, note: '-', ket: '-' },
    { group: 'CAMMORA', category: 'ILLEGAL ITEMS', item: 'BUBUK MESIU', qty: '-', priceWO: 8000, priceW: 5000, note: '-', ket: '-' },
    { group: 'CAMMORA', category: 'ILLEGAL ITEMS', item: 'OLI PELUMAS', qty: '-', priceWO: 7000, priceW: 5000, note: '-', ket: '-' },

    { group: 'CORTEZ', category: 'ILLEGAL ITEMS', item: 'SPRING', qty: '-', priceWO: 0, priceW: 0, note: '-', ket: 'JASA 5-10K / ITEM' },
    { group: 'CORTEZ', category: 'ILLEGAL ITEMS', item: 'PLAT BESI', qty: '-', priceWO: 0, priceW: 0, note: '-', ket: 'JASA 5-10K / ITEM' },
    { group: 'CORTEZ', category: 'ILLEGAL ITEMS', item: 'BUBUK MESIU', qty: '-', priceWO: 0, priceW: 0, note: '-', ket: 'JASA 5-10K / ITEM' },
    { group: 'CORTEZ', category: 'ILLEGAL ITEMS', item: 'OLI PELUMAS', qty: '-', priceWO: 0, priceW: 0, note: '-', ket: 'JASA 5-10K / ITEM' },

    { group: 'REBELLION', category: 'PELURU', item: '9MM', qty: '-', priceWO: 26000, priceW: 0, note: '-', ket: '-' },
    { group: 'REBELLION', category: 'PELURU', item: '44 MAGNUM', qty: '-', priceWO: 40000, priceW: 0, note: '-', ket: '-' },
    { group: 'REBELLION', category: 'PELURU', item: '45 ACP', qty: '-', priceWO: 45000, priceW: 0, note: '-', ket: '-' },
    { group: 'REBELLION', category: 'PELURU', item: '5.56 MM', qty: '-', priceWO: 60000, priceW: 0, note: '-', ket: '-' },

    { group: 'RDF', category: 'PELURU', item: '9MM', qty: '-', priceWO: 34000, priceW: 13000, note: '-', ket: '-' },
    { group: 'RDF', category: 'PELURU', item: '44 MAGNUM', qty: '-', priceWO: 33000, priceW: 15000, note: '-', ket: '-' },
    { group: 'RDF', category: 'PELURU', item: '45 ACP', qty: '-', priceWO: 38000, priceW: 22000, note: '-', ket: '-' },
    { group: 'RDF', category: 'PELURU', item: '5.56 MM', qty: '-', priceWO: 56000, priceW: 33000, note: '-', ket: '-' },

    { group: 'SINGARAJA', category: 'PELURU', item: '9MM', qty: '70 PCS / WEEK', priceWO: 30000, priceW: 0, note: '-', ket: '-' },
    { group: 'SINGARAJA', category: 'PELURU', item: '44 MAGNUM', qty: '70 PCS / WEEK', priceWO: 30000, priceW: 0, note: '-', ket: '-' },
    { group: 'SINGARAJA', category: 'PELURU', item: '45 ACP', qty: '70 PCS / WEEK', priceWO: 30000, priceW: 0, note: '-', ket: '-' },
    { group: 'SINGARAJA', category: 'PELURU', item: '5.56 MM', qty: '70 PCS / WEEK', priceWO: 50000, priceW: 0, note: '-', ket: '-' },

    { group: 'HELLSTAR', category: 'MONEY LAUNDERING', item: 'BLACK MONEY -> RED MONEY', qty: 'CUCI LEBIH DARI 1 JUTA', priceWO: 10, priceW: 0, note: '%', ket: '-' },
    { group: 'AROGANZ', category: 'MONEY LAUNDERING', item: 'RED MONEY -> WHITE MONEY', qty: '-', priceWO: 20, priceW: 0, note: '%', ket: '-' }
];

window.brangkasState = {
    whiteMoney: 15000000,
    blackMoney: 5000000,
    redMoney: 2000000,
    vaults: {
        BMC: { 'VEST': 25, 'CERAMIC': 10, 'REVOLVER MK2': 5, '9MM': 100 },
        BOSS: {}
    },
    // Alias kompatibilitas untuk data lama. Selalu mengikuti Brangkas BMC.
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
window.lossRecordsData = [];
window.stockFlowChartDays = 7;
window.saleEditDraftItems = [];
window.manualOrderDraftItems = [];
window.vaultSearch = { BMC: '', BOSS: '' };
window.stockMovementSearch = { MASUK: '', KELUAR: '' };

// HELPER FORMAT
function formatRP(num) { return (!num || num === 0) ? 'Rp 0' : 'Rp ' + Number(num).toLocaleString('id-ID'); }
function formatUSD(num) { return (!num || num === 0) ? '$ ' + Number(num).toLocaleString('en-US') : '$ ' + Number(num).toLocaleString('en-US'); }
function normalizeSearchQuery(value) { return String(value || '').toLowerCase().trim(); }


// NOTIFIKASI UI — menggantikan popup alert browser bawaan.
function ensureToastRoot() {
    let root = document.getElementById('bmc-toast-root');
    if (!root && document.body) {
        root = document.createElement('div');
        root.id = 'bmc-toast-root';
        root.className = 'bmc-toast-root';
        root.setAttribute('aria-live', 'polite');
        root.setAttribute('aria-atomic', 'true');
        document.body.appendChild(root);
    }
    return root;
}

window.showBmcToast = function(message, type = 'info', duration = 3200) {
    const root = ensureToastRoot();
    if (!root) return;

    const text = String(message ?? '').replace(/^\s*[✅❌⚠️⏳ℹ️🔒]+\s*/u, '').trim();
    const toast = document.createElement('div');
    toast.className = `bmc-toast bmc-toast-${type}`;

    const icon = document.createElement('span');
    icon.className = 'bmc-toast-icon';
    icon.textContent = type === 'success' ? '✓' : type === 'error' ? '!' : type === 'warning' ? '⚠' : 'i';

    const content = document.createElement('div');
    content.className = 'bmc-toast-content';
    content.textContent = text || 'Notifikasi';

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'bmc-toast-close';
    close.setAttribute('aria-label', 'Tutup notifikasi');
    close.textContent = '×';

    toast.append(icon, content, close);
    root.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    let removed = false;
    const removeToast = () => {
        if (removed) return;
        removed = true;
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 220);
    };

    close.addEventListener('click', removeToast);
    setTimeout(removeToast, Math.max(1500, Number(duration) || 3200));
};

// Semua alert lama tetap berfungsi, tetapi sekarang dirender sebagai toast bertema BMC.
window.alert = function(message) {
    const raw = String(message ?? '');
    let type = 'info';
    if (/✅|berhasil|sukses|success/i.test(raw)) type = 'success';
    else if (/❌|gagal|salah|tidak dapat|tidak ditemukan|tidak mencukupi|hanya/i.test(raw)) type = 'error';
    else if (/⚠️|tunggu|dimuat|terlalu banyak|dikunci/i.test(raw)) type = 'warning';
    window.showBmcToast(raw, type);
};

// KEAMANAN PIN CLIENT-SIDE
function bytesToBase64(bytes) {
    let binary = '';
    bytes.forEach(byte => { binary += String.fromCharCode(byte); });
    return btoa(binary);
}

function base64ToBytes(value) {
    const binary = atob(String(value || ''));
    return Uint8Array.from(binary, char => char.charCodeAt(0));
}

function createRandomSalt() {
    const salt = new Uint8Array(16);
    crypto.getRandomValues(salt);
    return bytesToBase64(salt);
}

async function deriveSecretHash(secret, saltBase64, iterations = 210000) {
    if (!window.crypto?.subtle) {
        throw new Error('Browser tidak mendukung Web Crypto API.');
    }

    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(String(secret)),
        'PBKDF2',
        false,
        ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits({
        name: 'PBKDF2',
        salt: base64ToBytes(saltBase64),
        iterations: Math.max(100000, Number(iterations) || 210000),
        hash: 'SHA-256'
    }, keyMaterial, 256);

    return bytesToBase64(new Uint8Array(derivedBits));
}

function safeStringEqual(left, right) {
    const a = String(left || '');
    const b = String(right || '');
    let difference = a.length ^ b.length;
    const length = Math.max(a.length, b.length);
    for (let index = 0; index < length; index += 1) {
        difference |= (a.charCodeAt(index) || 0) ^ (b.charCodeAt(index) || 0);
    }
    return difference === 0;
}

function normalizeAdminLoginId(value) {
    return String(value || '').trim().toUpperCase();
}

async function verifyAdminCredentials(adminId, password) {
    const normalizedId = normalizeAdminLoginId(adminId);
    const suppliedPassword = String(password || '');

    const [candidateIdHash, candidatePasswordHash] = await Promise.all([
        deriveSecretHash(normalizedId, FIXED_ADMIN_LOGIN.idSalt, FIXED_ADMIN_LOGIN.iterations),
        deriveSecretHash(suppliedPassword, FIXED_ADMIN_LOGIN.passwordSalt, FIXED_ADMIN_LOGIN.iterations)
    ]);

    return safeStringEqual(candidateIdHash, FIXED_ADMIN_LOGIN.idHash)
        && safeStringEqual(candidatePasswordHash, FIXED_ADMIN_LOGIN.passwordHash);
}

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

function recordStockFlow({ direction, source, items, amount = 0, payType = '-', notes = '-', vaultType = VAULT_BMC, createdAt = null, time = null, status = null }) {
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
        vaultType: normalizeVaultType(vaultType),
        items: mergedItems,
        totalQty: mergedItems.reduce((sum, item) => sum + item.qty, 0),
        amount: Math.max(0, Number(amount) || 0),
        payType: String(payType || '-'),
        notes: String(notes || '-').trim() || '-',
        status: normalizedDirection === 'PENJUALAN' ? normalizeSaleStatus(status) : '-'
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

// TIPE BRANGKAS DAN MIGRASI DATA STOK
const VAULT_BMC = 'BMC';
const VAULT_BOSS = 'BOSS';

function normalizeVaultType(value) {
    const normalized = String(value || '').trim().toUpperCase();
    return normalized === VAULT_BOSS || normalized.includes('BOSS') ? VAULT_BOSS : VAULT_BMC;
}

function getVaultLabel(value) {
    return normalizeVaultType(value) === VAULT_BOSS ? 'Brangkas Boss' : 'Brangkas BMC';
}

function normalizeItemObject(sourceItems) {
    const normalizedItems = {};
    Object.entries(sourceItems || {}).forEach(([itemName, qty]) => {
        const normalizedName = normalizeItemName(itemName);
        if (!normalizedName) return;
        normalizedItems[normalizedName] =
            (Number(normalizedItems[normalizedName]) || 0) + (Number(qty) || 0);
    });
    return normalizedItems;
}

function ensureVaultState() {
    if (!window.brangkasState || typeof window.brangkasState !== 'object') {
        window.brangkasState = { whiteMoney: 0, blackMoney: 0, redMoney: 0, items: {}, vaults: {} };
    }

    const legacyItems = normalizeItemObject(window.brangkasState.items || {});
    const sourceVaults = window.brangkasState.vaults && typeof window.brangkasState.vaults === 'object'
        ? window.brangkasState.vaults
        : null;

    if (!sourceVaults) {
        // Semua stok lama dimigrasikan aman ke Brangkas BMC.
        window.brangkasState.vaults = { BMC: legacyItems, BOSS: {} };
    } else {
        window.brangkasState.vaults = {
            BMC: normalizeItemObject(sourceVaults.BMC || sourceVaults.bmc || legacyItems),
            BOSS: normalizeItemObject(sourceVaults.BOSS || sourceVaults.boss || {})
        };
    }

    // Alias kompatibilitas agar kode/data lama tetap membaca stok BMC.
    window.brangkasState.items = window.brangkasState.vaults.BMC;
    return window.brangkasState.vaults;
}

function getVaultItems(vaultType = VAULT_BMC) {
    const vaults = ensureVaultState();
    return vaults[normalizeVaultType(vaultType)];
}

function getCombinedVaultItems() {
    ensureVaultState();
    const combined = {};
    [VAULT_BMC, VAULT_BOSS].forEach(vaultType => {
        Object.entries(getVaultItems(vaultType)).forEach(([name, qty]) => {
            combined[name] = (Number(combined[name]) || 0) + (Number(qty) || 0);
        });
    });
    return combined;
}

// Rapikan seluruh key stok sebelum stok ditambah atau dikurangi.
function normalizeBrangkasItems(vaultType = null) {
    ensureVaultState();
    if (vaultType) {
        const normalizedVault = normalizeVaultType(vaultType);
        window.brangkasState.vaults[normalizedVault] = normalizeItemObject(window.brangkasState.vaults[normalizedVault]);
    } else {
        window.brangkasState.vaults.BMC = normalizeItemObject(window.brangkasState.vaults.BMC);
        window.brangkasState.vaults.BOSS = normalizeItemObject(window.brangkasState.vaults.BOSS);
    }
    window.brangkasState.items = window.brangkasState.vaults.BMC;
}

function normalizeOrderHistoryData() {
    if (!Array.isArray(window.orderHistoryData)) {
        window.orderHistoryData = [];
        return;
    }

    window.orderHistoryData = window.orderHistoryData.map(order => {
        const normalizedItems = Array.isArray(order.items)
            ? order.items.map(item => ({
                name: normalizeItemName(item.name),
                qty: Math.max(1, Number.parseInt(item.qty, 10) || 1),
                unitPrice: Math.max(0, Number(item.unitPrice) || 0)
            })).filter(item => item.name)
            : [];
        const itemSummary = normalizedItems.length
            ? normalizedItems.map(item => `${item.name} x${item.qty}`).join(', ')
            : normalizeItemName(order.item || '-');
        const totalQty = normalizedItems.length
            ? normalizedItems.reduce((sum, item) => sum + item.qty, 0)
            : (Number(order.qty) || 0);
        const totalAmount = normalizedItems.length
            ? normalizedItems.reduce((sum, item) => sum + item.qty * item.unitPrice, 0)
            : (Number(order.totalAmount) || parseStoredAmount(order.total));

        return {
            ...order,
            group: String(order.group || '-').trim() || '-',
            vaultType: normalizeVaultType(order.vaultType || VAULT_BMC),
            item: itemSummary,
            items: normalizedItems,
            qty: totalQty,
            unitPrice: order.unitPrice || (normalizedItems.length > 1 ? 'Multi Harga' : '-'),
            total: order.total || formatUSD(totalAmount),
            totalAmount,
            payType: order.payType || '-',
            notes: String(order.notes || '-').trim() || '-',
            status: String(order.status || 'PENDING').trim().toUpperCase() === 'DONE' ? 'DONE' : 'PENDING',
            moneyApplied: Boolean(order.moneyApplied),
            moneyAppliedAt: order.moneyAppliedAt || null
        };
    });
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
        vaultType: normalizeVaultType(record.vaultType || VAULT_BMC),
        status: normalizeLoanPaymentStatus(record.status),
        paidAt: normalizeLoanPaymentStatus(record.status) === 'SUDAH_DIBAYAR'
            ? (record.paidAt || record.updatedAt || '-')
            : null
    }));
}


function getPriceMasterKey(item) {
    return [item?.group, item?.category, item?.item]
        .map(value => normalizeSearchQuery(value))
        .join('||');
}

function mergePriceMasterData(existingData, masterData) {
    const master = Array.isArray(masterData) ? masterData : [];
    const current = Array.isArray(existingData) ? existingData : [];
    const masterKeys = new Set(master.map(getPriceMasterKey));
    const extras = current.filter(item => !masterKeys.has(getPriceMasterKey(item)));
    return [...master.map(item => ({ ...item })), ...extras.map(item => ({ ...item }))];
}

function syncPriceMasterData() {
    window.bmcToKelompokData = mergePriceMasterData(window.bmcToKelompokData, window.initialBmcToKelompok);
    window.kelompokToBmcData = mergePriceMasterData(window.kelompokToBmcData, window.initialKelompokToBmc);
}

function normalizeLossRecordsData() {
    if (!Array.isArray(window.lossRecordsData)) {
        window.lossRecordsData = [];
        return;
    }

    window.lossRecordsData = window.lossRecordsData.map(record => {
        const isMoneyRecord = String(record.lossType || '').toUpperCase() === 'MONEY'
            || ['whiteMoney', 'blackMoney', 'redMoney'].includes(record.moneyKey);

        if (isMoneyRecord) {
            const moneyKey = ['whiteMoney', 'blackMoney', 'redMoney'].includes(record.moneyKey)
                ? record.moneyKey
                : 'whiteMoney';
            const moneyLabel = moneyKey === 'blackMoney'
                ? 'Black Money'
                : (moneyKey === 'redMoney' ? 'Red Money' : 'Uang Putih');
            return {
                ...record,
                id: record.id || `loss_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                createdAt: record.createdAt || new Date().toISOString(),
                time: record.time || new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
                lossType: 'MONEY',
                moneyKey,
                moneyLabel,
                item: moneyLabel,
                amount: Math.max(0, Number(record.amount ?? record.qty) || 0),
                beforeAmount: Math.max(0, Number(record.beforeAmount ?? record.beforeQty) || 0),
                afterAmount: Math.max(0, Number(record.afterAmount ?? record.afterQty) || 0),
                reason: String(record.reason || '-').trim() || '-',
                notes: String(record.notes || '-').trim() || '-'
            };
        }

        return {
            ...record,
            id: record.id || `loss_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            createdAt: record.createdAt || new Date().toISOString(),
            time: record.time || new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
            lossType: 'ITEM',
            vaultType: normalizeVaultType(record.vaultType || VAULT_BOSS),
            item: normalizeItemName(record.item || ''),
            qty: Math.max(1, Number(record.qty) || 1),
            beforeQty: Math.max(0, Number(record.beforeQty) || 0),
            afterQty: Math.max(0, Number(record.afterQty) || 0),
            reason: String(record.reason || '-').trim() || '-',
            notes: String(record.notes || '-').trim() || '-'
        };
    }).filter(record => record.lossType === 'MONEY' || record.item);
}

function getLossMoneyConfig(lossType) {
    const type = String(lossType || '').toUpperCase();
    if (type === 'BLACK') return { key: 'blackMoney', label: 'Black Money', currency: 'USD' };
    if (type === 'RED') return { key: 'redMoney', label: 'Red Money', currency: 'USD' };
    return { key: 'whiteMoney', label: 'Uang Putih', currency: 'IDR' };
}

function formatLossMoney(amount, moneyKey) {
    return moneyKey === 'whiteMoney' ? formatRP(amount) : formatUSD(amount);
}

window.toggleLossType = function() {
    const lossType = String(document.getElementById('loss-type')?.value || 'ITEM').toUpperCase();
    const isItem = lossType === 'ITEM';
    const vaultGroup = document.getElementById('loss-vault-group');
    const itemGroup = document.getElementById('loss-item-group');
    const amountLabel = document.getElementById('loss-amount-label');
    const amountInput = document.getElementById('loss-item-qty');

    if (vaultGroup) vaultGroup.style.display = isItem ? '' : 'none';
    if (itemGroup) itemGroup.style.display = isItem ? '' : 'none';

    if (amountLabel) {
        if (isItem) amountLabel.textContent = 'Jumlah Loss (PCS)';
        else {
            const money = getLossMoneyConfig(lossType);
            amountLabel.textContent = money.currency === 'IDR' ? 'Nominal Loss (Rp)' : 'Nominal Loss ($)';
        }
    }

    if (amountInput) {
        amountInput.placeholder = isItem ? 'Contoh: 3' : 'Masukkan nominal loss';
        amountInput.min = '1';
    }

    if (isItem) window.renderLossItemOptions();
};

window.renderLossItemOptions = function() {
    const select = document.getElementById('loss-item-name');
    const lossType = String(document.getElementById('loss-type')?.value || 'ITEM').toUpperCase();
    if (!select || lossType !== 'ITEM') return;

    const vaultType = normalizeVaultType(document.getElementById('loss-vault-type')?.value || VAULT_BOSS);
    const currentValue = select.value;
    const items = Object.entries(getVaultItems(vaultType) || {})
        .sort((a, b) => a[0].localeCompare(b[0], 'id'));

    if (items.length === 0) {
        select.innerHTML = '<option value="">Tidak ada stok tersedia</option>';
        return;
    }

    select.innerHTML = items.map(([name, qty]) =>
        `<option value="${escapeHtml(name)}">${escapeHtml(name)} (${qty} PCS)</option>`
    ).join('');

    if (items.some(([name]) => name === currentValue)) {
        select.value = currentValue;
    }
};

window.addLossRecord = async function() {
    if (!window.isAdminLoggedIn) return alert('❌ Hanya pengurus yang dapat mencatat loss.');
    ensureVaultState();

    const lossType = String(document.getElementById('loss-type')?.value || 'ITEM').toUpperCase();
    const rawAmount = Math.max(1, Number.parseInt(document.getElementById('loss-item-qty')?.value, 10) || 0);
    const reason = String(document.getElementById('loss-reason')?.value || '').trim() || 'Loss';
    const notes = String(document.getElementById('loss-note')?.value || '').trim() || '-';

    if (!rawAmount) return alert('❌ Jumlah / nominal loss wajib diisi.');

    const now = new Date();
    let lossRecord;

    if (lossType === 'ITEM') {
        const vaultType = normalizeVaultType(document.getElementById('loss-vault-type')?.value || VAULT_BOSS);
        const item = normalizeItemName(document.getElementById('loss-item-name')?.value || '');
        if (!item) return alert('❌ Pilih barang yang akan dicatat sebagai loss.');

        const vaultItems = getVaultItems(vaultType);
        const currentQty = Number(vaultItems[item]) || 0;
        if (currentQty < rawAmount) {
            return alert(`❌ Stok ${item} di ${getVaultLabel(vaultType)} hanya ${currentQty} PCS.`);
        }

        const afterQty = currentQty - rawAmount;
        if (afterQty > 0) vaultItems[item] = afterQty;
        else delete vaultItems[item];
        normalizeBrangkasItems(vaultType);

        lossRecord = {
            id: `loss_${now.getTime()}_${Math.random().toString(36).slice(2, 7)}`,
            createdAt: now.toISOString(),
            time: now.toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
            lossType: 'ITEM',
            vaultType,
            item,
            qty: rawAmount,
            beforeQty: currentQty,
            afterQty,
            reason,
            notes
        };

        recordStockFlow({
            direction: 'KELUAR',
            source: 'Loss Barang',
            items: [{ name: item, qty: rawAmount }],
            notes: `${reason}${notes && notes !== '-' ? ' | ' + notes : ''}`,
            vaultType,
            createdAt: lossRecord.createdAt,
            time: lossRecord.time
        });
    } else {
        const money = getLossMoneyConfig(lossType);
        const currentAmount = Math.max(0, Number(window.brangkasState[money.key]) || 0);
        if (currentAmount < rawAmount) {
            return alert(`❌ Saldo ${money.label} hanya ${formatLossMoney(currentAmount, money.key)}.`);
        }

        const afterAmount = currentAmount - rawAmount;
        window.brangkasState[money.key] = afterAmount;

        lossRecord = {
            id: `loss_${now.getTime()}_${Math.random().toString(36).slice(2, 7)}`,
            createdAt: now.toISOString(),
            time: now.toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
            lossType: 'MONEY',
            moneyKey: money.key,
            moneyLabel: money.label,
            item: money.label,
            amount: rawAmount,
            beforeAmount: currentAmount,
            afterAmount,
            reason,
            notes
        };
    }

    if (!Array.isArray(window.lossRecordsData)) window.lossRecordsData = [];
    window.lossRecordsData.unshift(lossRecord);

    await saveDataToCloud();
    renderAll();
    const amountInput = document.getElementById('loss-item-qty');
    if (amountInput) amountInput.value = '';
    const reasonInput = document.getElementById('loss-reason');
    if (reasonInput) reasonInput.value = '';
    const noteInput = document.getElementById('loss-note');
    if (noteInput) noteInput.value = '';
    window.toggleLossType();

    if (lossRecord.lossType === 'MONEY') {
        alert(`✅ Loss ${lossRecord.moneyLabel} sebesar ${formatLossMoney(lossRecord.amount, lossRecord.moneyKey)} berhasil dicatat.`);
    } else {
        alert(`✅ Loss ${lossRecord.item} x${lossRecord.qty} dari ${getVaultLabel(lossRecord.vaultType)} berhasil dicatat.`);
    }
};

window.editLossRecord = async function(lossId) {
    if (!window.isAdminLoggedIn) return alert('❌ Hanya pengurus yang dapat mengedit loss.');
    normalizeLossRecordsData();
    const record = (window.lossRecordsData || []).find(item => item.id === lossId);
    if (!record) return alert('❌ Data loss tidak ditemukan.');

    const newReason = prompt('Ubah alasan loss:', record.reason || '-') ?? record.reason;
    const newNotes = prompt('Ubah catatan tambahan:', record.notes || '-') ?? record.notes;

    if (record.lossType === 'MONEY') {
        const oldAmount = Math.max(0, Number(record.amount) || 0);
        const newAmount = Math.max(1, Number.parseInt(prompt(`Ubah nominal loss ${record.moneyLabel}:`, oldAmount), 10) || 0);
        if (!newAmount) return;

        const currentBalance = Math.max(0, Number(window.brangkasState[record.moneyKey]) || 0);
        const restoredBalance = currentBalance + oldAmount;
        if (restoredBalance < newAmount) {
            return alert(`❌ Saldo ${record.moneyLabel} tidak mencukupi untuk koreksi ini.`);
        }

        const afterAmount = restoredBalance - newAmount;
        window.brangkasState[record.moneyKey] = afterAmount;
        record.amount = newAmount;
        record.beforeAmount = restoredBalance;
        record.afterAmount = afterAmount;
    } else {
        const newQty = Math.max(1, Number.parseInt(prompt(`Ubah jumlah loss untuk ${record.item}:`, record.qty), 10) || 0);
        if (!newQty) return;

        ensureVaultState();
        const vaultItems = getVaultItems(record.vaultType);
        const currentStockNow = Number(vaultItems[record.item]) || 0;
        const restoredStock = currentStockNow + (Number(record.qty) || 0);
        if (restoredStock < newQty) {
            return alert(`❌ Setelah koreksi, stok ${record.item} di ${getVaultLabel(record.vaultType)} tetap tidak mencukupi.`);
        }

        const afterQty = restoredStock - newQty;
        if (afterQty > 0) vaultItems[record.item] = afterQty;
        else delete vaultItems[record.item];
        normalizeBrangkasItems(record.vaultType);

        record.qty = newQty;
        record.beforeQty = restoredStock;
        record.afterQty = afterQty;
    }

    record.reason = String(newReason || '-').trim() || '-';
    record.notes = String(newNotes || '-').trim() || '-';
    record.updatedAt = new Date().toISOString();

    await saveDataToCloud();
    renderAll();
    alert('✅ Data loss berhasil diubah.');
};

window.deleteLossRecord = async function(lossId) {
    if (!window.isAdminLoggedIn) return alert('❌ Hanya pengurus yang dapat menghapus loss.');
    normalizeLossRecordsData();
    const index = (window.lossRecordsData || []).findIndex(item => item.id === lossId);
    if (index === -1) return alert('❌ Data loss tidak ditemukan.');
    const record = window.lossRecordsData[index];

    const label = record.lossType === 'MONEY'
        ? `${record.moneyLabel} ${formatLossMoney(record.amount, record.moneyKey)}`
        : `${record.item} x${record.qty}`;
    if (!confirm(`Hapus data loss ${label}?`)) return;

    if (record.lossType === 'MONEY') {
        window.brangkasState[record.moneyKey] = (Number(window.brangkasState[record.moneyKey]) || 0) + (Number(record.amount) || 0);
    } else {
        const vaultItems = getVaultItems(record.vaultType);
        vaultItems[record.item] = (Number(vaultItems[record.item]) || 0) + (Number(record.qty) || 0);
        normalizeBrangkasItems(record.vaultType);
    }

    window.lossRecordsData.splice(index, 1);
    await saveDataToCloud();
    renderAll();
    alert('✅ Data loss dihapus dan saldo / stok dikembalikan.');
};

window.renderLossRecords = function() {
    const tbody = document.getElementById('tbody-loss-records');
    if (!tbody) return;
    normalizeLossRecordsData();
    const records = Array.isArray(window.lossRecordsData) ? [...window.lossRecordsData] : [];
    if (records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; color:var(--text-muted);">Belum ada data loss.</td></tr>';
        return;
    }

    records.sort((a, b) => {
        const da = new Date(a.createdAt || 0).getTime();
        const db = new Date(b.createdAt || 0).getTime();
        return db - da;
    });

    let currentDateKey = '';
    let html = '';
    records.forEach(record => {
        const recordDate = new Date(record.createdAt || Date.now());
        const dateKey = localDateKey(recordDate);
        if (dateKey !== currentDateKey) {
            currentDateKey = dateKey;
            html += `<tr><td colspan="9" style="background:rgba(245,158,11,0.10); color:var(--accent-gold); font-weight:700;">📅 ${recordDate.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</td></tr>`;
        }

        const timePart = recordDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const notes = [record.reason, record.notes].filter(Boolean).join(' • ');
        const isMoney = record.lossType === 'MONEY';
        const source = isMoney ? 'Brangkas' : getVaultLabel(record.vaultType);
        const typeLabel = isMoney ? record.moneyLabel : record.item;
        const lossDisplay = isMoney ? formatLossMoney(record.amount, record.moneyKey) : `${record.qty} PCS`;
        const beforeDisplay = isMoney ? formatLossMoney(record.beforeAmount, record.moneyKey) : `${record.beforeQty} PCS`;
        const afterDisplay = isMoney ? formatLossMoney(record.afterAmount, record.moneyKey) : `${record.afterQty} PCS`;

        html += `
            <tr>
                <td>${escapeHtml(recordDate.toLocaleDateString('id-ID'))}</td>
                <td>${escapeHtml(timePart)}</td>
                <td><span class="badge badge-black">${escapeHtml(source)}</span></td>
                <td style="font-weight:700;">${escapeHtml(typeLabel)}</td>
                <td>${escapeHtml(lossDisplay)}</td>
                <td><span class="badge badge-blue">${escapeHtml(beforeDisplay)}</span></td>
                <td><span class="badge badge-red">${escapeHtml(afterDisplay)}</span></td>
                <td>${escapeHtml(notes || '-')}</td>
                <td style="display:flex; gap:6px; flex-wrap:wrap;">
                    <button class="btn btn-sm btn-blue" type="button" onclick="window.editLossRecord('${record.id}')">Edit</button>
                    <button class="btn btn-sm btn-red" type="button" onclick="window.deleteLossRecord('${record.id}')">Hapus</button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
};

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
    const roleSelect = document.getElementById('user-role');
    const role = roleSelect?.value || 'member';

    if (role === 'admin' && !window.isAdminLoggedIn) {
        const idInput = document.getElementById('input-admin-id');
        loadRememberedAdminLogin();
        document.getElementById('modal-pin')?.classList.add('active');
        setTimeout(() => {
            const passwordInput = document.getElementById('input-admin-password');
            if (idInput?.value) passwordInput?.focus();
            else idInput?.focus();
        }, 50);
        return;
    }

    if (role === 'member') {
        window.isAdminLoggedIn = false;
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.setProperty('display', 'none', 'important');
        });
        window.switchTab('member-catalog');
    }
};

window.submitAdminLogin = async function(event) {
    if (event) event.preventDefault();

    const now = Date.now();
    if (now < adminLoginLockedUntil) {
        const remaining = Math.ceil((adminLoginLockedUntil - now) / 1000);
        return alert(`⏳ Terlalu banyak percobaan. Coba lagi dalam ${remaining} detik.`);
    }

    const idInput = document.getElementById('input-admin-id');
    const passwordInput = document.getElementById('input-admin-password');
    const adminId = String(idInput?.value || '').trim();
    const password = String(passwordInput?.value || '');

    if (!adminId || !password) {
        return alert('Masukkan ID Admin dan Password.');
    }

    const submitButton = document.getElementById('btn-submit-admin-login');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Memeriksa...';
    }

    try {
        const valid = await verifyAdminCredentials(adminId, password);
        if (!valid) {
            adminLoginFailedAttempts += 1;

            if (adminLoginFailedAttempts >= 5) {
                adminLoginLockedUntil = Date.now() + (5 * 60 * 1000);
                adminLoginFailedAttempts = 0;
                alert('❌ ID atau password salah. Login dikunci selama 5 menit.');
            } else {
                alert(`❌ ID atau password salah. Percobaan ${adminLoginFailedAttempts}/5.`);
            }
            return;
        }

        adminLoginFailedAttempts = 0;
        adminLoginLockedUntil = 0;
        window.isAdminLoggedIn = true;
        saveRememberedAdminLogin(adminId, password);

        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.setProperty('display', 'inline-block', 'important');
        });

        document.getElementById('modal-pin')?.classList.remove('active');
        const rememberId = Boolean(document.getElementById('remember-admin-id')?.checked);
        const rememberPassword = Boolean(document.getElementById('remember-admin-password')?.checked);
        if (idInput && !rememberId && !rememberPassword) idInput.value = '';
        if (passwordInput && !rememberPassword) passwordInput.value = '';
        window.switchTab('dashboard');
    } catch (error) {
        console.error('Gagal memverifikasi akun Pengurus:', error);
        alert('❌ Login tidak dapat diverifikasi. Pastikan website dibuka melalui HTTPS.');
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Masuk';
        }
    }
};

// Alias agar pemanggilan lama tidak merusak halaman jika masih tersimpan di cache browser.
window.submitAdminPin = window.submitAdminLogin;

window.openChangePinModal = function() {
    alert('🔒 ID dan password Admin dikunci dan tidak dapat diganti dari website.');
};

window.openForgotPinModal = function() {
    alert('🔒 Tidak ada fitur reset akun dari website. Hubungi pemilik repository untuk mengganti kredensial.');
};

window.changeAdminPin = function(event) {
    if (event) event.preventDefault();
    alert('🔒 Perubahan akun Admin dari website dinonaktifkan.');
};

window.resetAdminPinWithRecovery = function(event) {
    if (event) event.preventDefault();
    alert('🔒 Reset akun Admin dari website dinonaktifkan.');
};

window.backToAdminLogin = function() {
    document.getElementById('modal-pin')?.classList.add('active');
};

window.cancelAdminAuth = function() {
    document.getElementById('modal-pin')?.classList.remove('active');
    const roleSelect = document.getElementById('user-role');
    if (roleSelect) roleSelect.value = 'member';
    window.handleRoleChange();
};

window.closeModal = function(modalId) {
    document.getElementById(modalId).classList.remove('active');
};

// RENDER FUNCTIONS - TERBARU
window.renderBrangkas = function() {
    ensureVaultState();

    const wEl = document.getElementById('stat-white-money');
    if (wEl) wEl.innerText = formatRP(window.brangkasState.whiteMoney);
    const bEl = document.getElementById('stat-black-money');
    if (bEl) bEl.innerText = formatUSD(window.brangkasState.blackMoney);
    const rEl = document.getElementById('stat-red-money');
    if (rEl) rEl.innerText = formatUSD(window.brangkasState.redMoney);

    const totalItems = [VAULT_BMC, VAULT_BOSS].reduce((total, vaultType) => {
        return total + Object.values(getVaultItems(vaultType)).reduce((sum, qty) => sum + (Number(qty) || 0), 0);
    }, 0);

    const renderVaultRows = (tbodyId, vaultType) => {
        const tbody = document.getElementById(tbodyId);
        if (!tbody) return;
        const items = getVaultItems(vaultType);
        const entries = Object.entries(items).sort(([a], [b]) => a.localeCompare(b));
        const query = normalizeSearchQuery(window.vaultSearch?.[vaultType] || '');
        const filteredEntries = !query
            ? entries
            : entries.filter(([itemName, qty]) => normalizeSearchQuery(`${itemName} ${qty} ${getVaultLabel(vaultType)}`).includes(query));

        if (filteredEntries.length === 0) {
            if (entries.length === 0) {
                tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:var(--text-muted);">Belum ada barang di ${getVaultLabel(vaultType)}.</td></tr>`;
            } else {
                tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:var(--text-muted);">Tidak ada barang yang cocok dengan pencarian.</td></tr>`;
            }
            return;
        }

        tbody.innerHTML = filteredEntries.map(([itemName, qty]) => `
            <tr>
                <td style="font-weight:600;">${escapeHtml(itemName)}</td>
                <td><span class="badge badge-green">${Number(qty) || 0} PCS</span></td>
                <td>
                    <div style="display:flex; gap:8px; flex-wrap:wrap;">
                        <button class="btn btn-sm btn-blue" type="button"
                            onclick="window.openEditBrangkasItem('${vaultType}', decodeURIComponent('${encodeURIComponent(itemName)}'))">
                            Edit
                        </button>
                        <button class="btn btn-sm btn-red" type="button"
                            onclick="window.deleteBrangkasItem('${vaultType}', decodeURIComponent('${encodeURIComponent(itemName)}'))">
                            Hapus
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    };

    renderVaultRows('tbody-brangkas-items-bmc', VAULT_BMC);
    renderVaultRows('tbody-brangkas-items-boss', VAULT_BOSS);

    const legacyBody = document.getElementById('tbody-brangkas-items');
    if (legacyBody) {
        legacyBody.innerHTML = `
            <tr><td colspan="3" style="text-align:center; color:var(--text-muted);">
                Gunakan panel Brangkas BMC dan Brangkas Boss pada versi terbaru.
            </td></tr>`;
    }

    const countEl = document.getElementById('stat-item-count');
    if (countEl) countEl.innerText = totalItems + ' PCS';
};

window.setVaultSearch = function(vaultType, value) {
    const normalizedVault = normalizeVaultType(vaultType);
    window.vaultSearch[normalizedVault] = String(value || '');
    window.renderBrangkas();
};

window.openEditBrangkasItem = function(vaultType, itemName) {
    if (!window.isAdminLoggedIn) {
        return alert('❌ Hanya pengurus yang dapat mengedit stok brangkas.');
    }

    const normalizedVault = normalizeVaultType(vaultType);
    normalizeBrangkasItems(normalizedVault);
    const items = getVaultItems(normalizedVault);
    const normalizedName = normalizeItemName(itemName);
    if (items[normalizedName] === undefined) {
        return alert('❌ Barang tidak ditemukan di stok brangkas.');
    }

    document.getElementById('edit-stock-vault-type').value = normalizedVault;
    document.getElementById('edit-stock-item-name').value = normalizedName;
    document.getElementById('edit-stock-qty').value = Number(items[normalizedName]) || 0;
    document.getElementById('modal-edit-stock').classList.add('active');
};

window.saveBrangkasItemEdit = async function(e) {
    if (e) e.preventDefault();

    if (!window.isAdminLoggedIn) {
        return alert('❌ Hanya pengurus yang dapat mengedit stok brangkas.');
    }

    const vaultType = normalizeVaultType(document.getElementById('edit-stock-vault-type').value);
    const itemName = normalizeItemName(document.getElementById('edit-stock-item-name').value);
    const newQty = Number.parseInt(document.getElementById('edit-stock-qty').value, 10);

    if (!itemName || !Number.isFinite(newQty) || newQty < 0) {
        return alert('❌ Quantity harus berupa angka 0 atau lebih.');
    }

    const items = getVaultItems(vaultType);
    if (items[itemName] === undefined) {
        return alert('❌ Barang tidak ditemukan di stok brangkas.');
    }

    const previousQty = Number(items[itemName]) || 0;
    items[itemName] = newQty;

    const difference = newQty - previousQty;
    if (difference !== 0) {
        recordStockFlow({
            direction: difference > 0 ? 'MASUK' : 'KELUAR',
            source: 'Koreksi Stok',
            vaultType,
            items: [{ name: itemName, qty: Math.abs(difference) }],
            notes: `Quantity dikoreksi dari ${previousQty} menjadi ${newQty} PCS`
        });
    }

    await window.saveData();
    renderAll();
    window.closeModal('modal-edit-stock');
    alert(`✅ Quantity ${itemName} di ${getVaultLabel(vaultType)} berhasil diubah menjadi ${newQty} PCS.`);
};

window.deleteBrangkasItem = async function(vaultType, itemName) {
    if (!window.isAdminLoggedIn) {
        return alert('❌ Hanya pengurus yang dapat menghapus stok brangkas.');
    }

    if (!isInitialLoadComplete) {
        return alert('⏳ Data Firebase masih dimuat. Tunggu sampai status Connected lalu coba lagi.');
    }

    const normalizedVault = normalizeVaultType(vaultType);
    const normalizedName = normalizeItemName(itemName);
    const items = getVaultItems(normalizedVault);

    if (items[normalizedName] === undefined) {
        return alert('❌ Gagal: Item tidak ditemukan di sistem.');
    }

    if (!confirm(`Yakin ingin menghapus ${normalizedName} dari ${getVaultLabel(normalizedVault)}?`)) return;

    const previousQty = Number(items[normalizedName]) || 0;
    saveLocalSafetyBackup('before-delete-stock-item');

    // Hapus dari state lokal terlebih dahulu agar tampilan langsung berubah.
    delete items[normalizedName];
    if (normalizedVault === VAULT_BMC) {
        window.brangkasState.items = window.brangkasState.vaults.BMC;
    }
    renderAll();

    try {
        // setDoc(..., { merge:true }) tidak menghapus key map yang sudah ada di Firestore.
        // Karena itu penghapusan stok harus memakai deleteField pada path item yang tepat.
        const updateArgs = [
            new FieldPath('brangkasState', 'vaults', normalizedVault, normalizedName),
            deleteField()
        ];

        // Hapus juga alias data lama untuk Brangkas BMC agar item tidak muncul kembali.
        if (normalizedVault === VAULT_BMC) {
            updateArgs.push(
                new FieldPath('brangkasState', 'items', normalizedName),
                deleteField()
            );
        }

        updateArgs.push('lastUpdated', new Date().toISOString());
        await updateDoc(docRef, ...updateArgs);

        alert(`✅ ${normalizedName} berhasil dihapus dari ${getVaultLabel(normalizedVault)}.`);
    } catch (error) {
        console.error('❌ Gagal menghapus stok dari Firestore:', error);

        // Kembalikan data lokal jika penyimpanan ke server gagal.
        items[normalizedName] = previousQty;
        if (normalizedVault === VAULT_BMC) {
            window.brangkasState.items = window.brangkasState.vaults.BMC;
        }
        renderAll();
        alert('❌ Stok gagal dihapus dari Firebase. Periksa koneksi atau Firestore Rules, lalu coba lagi.');
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

function getMemberSaleUnitInfo(itemName) {
    const normalizedName = normalizeItemName(itemName);
    const catalogItem = (window.memberCatalogData || []).find(
        item => normalizeItemName(item.name) === normalizedName
    );
    const note = String(catalogItem?.note || '');
    const clipMatch = note.match(/(\d+)\s*PCS\s*\/\s*PER\s*CLIP/i);
    const pcsPerClip = clipMatch ? Math.max(1, Number.parseInt(clipMatch[1], 10) || 1) : 1;
    return {
        isClip: pcsPerClip > 1,
        pcsPerClip,
        saleUnitLabel: pcsPerClip > 1 ? 'CLIP' : 'PCS'
    };
}

function convertSaleQtyToStockQty(itemName, saleQty) {
    const info = getMemberSaleUnitInfo(itemName);
    return Math.max(0, Number(saleQty) || 0) * info.pcsPerClip;
}

function convertStoredStockQtyToSaleQty(itemName, storedQty) {
    const info = getMemberSaleUnitInfo(itemName);
    const qty = Math.max(0, Number(storedQty) || 0);
    // Data baru disimpan dalam PCS. Data lama yang masih bernilai kecil
    // dipertahankan sebagai jumlah clip agar tetap bisa diedit dengan wajar.
    if (info.isClip && qty >= info.pcsPerClip && qty % info.pcsPerClip === 0) {
        return qty / info.pcsPerClip;
    }
    return qty;
}

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
        const unitInfo = getMemberSaleUnitInfo(item.name);
        grandTotal += subtotal;

        tbody.innerHTML += `
            <tr>
                <td>
                    <div>${item.name}</div>
                    ${unitInfo.isClip
                        ? `<div style="font-size:0.72rem; color:var(--text-muted); margin-top:3px;">1 CLIP = ${unitInfo.pcsPerClip} PCS</div>`
                        : ''}
                </td>
                <td>
                    <div style="display:flex; align-items:center; gap:6px; min-width:92px;">
                        <input type="number" value="${item.qty}" min="1" style="width:56px;" class="form-control" onchange="window.updateCartQty(${index}, this.value)">
                        <span style="font-size:0.72rem; color:var(--text-muted);">${unitInfo.saleUnitLabel}</span>
                    </div>
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
    // Penjualan anggota selalu mengambil stok dari Brangkas Boss.
    const vaultType = VAULT_BOSS;

    if (!buyer || !seller) return alert('Mohon isi nama Pembeli dan Penjual!');

    const vaultItems = getVaultItems(vaultType);
    const shortages = window.cartItems.filter(item => {
        const stockName = normalizeItemName(item.name);
        const requiredStockQty = convertSaleQtyToStockQty(item.name, item.qty);
        return (Number(vaultItems[stockName]) || 0) < requiredStockQty;
    });
    if (shortages.length > 0) {
        const details = shortages.map(item => {
            const stockName = normalizeItemName(item.name);
            const unitInfo = getMemberSaleUnitInfo(item.name);
            const requiredStockQty = convertSaleQtyToStockQty(item.name, item.qty);
            const requestedText = unitInfo.isClip
                ? `${item.qty} CLIP (${requiredStockQty} PCS)`
                : `${requiredStockQty} PCS`;
            return `${stockName}: stok ${Number(vaultItems[stockName]) || 0} PCS, diminta ${requestedText}`;
        }).join('\n');
        return alert(`❌ Stok ${getVaultLabel(vaultType)} tidak mencukupi:

${details}`);
    }

    let grandTotal = 0;
    const soldItems = [];

    window.cartItems.forEach(item => {
        const price = payType === 'UP' ? item.priceUP : item.priceBM;
        // Harga katalog tetap dihitung per clip untuk item peluru.
        const subtotal = price * item.qty;
        grandTotal += subtotal;
        const stockItemName = normalizeItemName(item.name);
        const stockQty = convertSaleQtyToStockQty(item.name, item.qty);
        // Riwayat Data Penjualan dan stok selalu disimpan dalam PCS.
        soldItems.push({ name: stockItemName, qty: stockQty });
        vaultItems[stockItemName] = (Number(vaultItems[stockItemName]) || 0) - stockQty;
    });

    if (payType === 'UP') window.brangkasState.whiteMoney += grandTotal;
    else window.brangkasState.blackMoney += grandTotal;

    recordStockFlow({
        direction: 'PENJUALAN',
        source: 'Penjualan Anggota',
        vaultType,
        items: soldItems,
        amount: grandTotal,
        payType: payType === 'UP' ? 'Uang Putih' : 'Black Money',
        status: 'DONE',
        notes: `Pembeli: ${buyer} | Penjual: ${seller}`
    });

    await window.saveData();
    window.clearCart();
    document.getElementById('cart-buyer-name').value = '';
    document.getElementById('cart-seller-name').value = '';
    renderAll();
    alert(`✅ Penjualan berhasil disimpan dari ${getVaultLabel(vaultType)}. Jumlah peluru pada Data Penjualan tercatat dalam PCS.`);
};

// LOGIKA INPUT/TARIK KAS & STOK
window.toggleBrangkasType = function() {
    const type = document.getElementById('b-type').value;
    const itemGroup = document.getElementById('group-b-item-name');
    const vaultGroup = document.getElementById('group-b-vault-type');
    if (type === 'item') {
        if (itemGroup) itemGroup.style.display = 'block';
        if (vaultGroup) vaultGroup.style.display = 'block';
    } else {
        if (itemGroup) itemGroup.style.display = 'none';
        if (vaultGroup) vaultGroup.style.display = 'none';
    }
};

window.saveBrangkas = async function(e) {
    if (e) e.preventDefault();

    if (!isInitialLoadComplete) {
        return alert('⏳ Data Firebase masih dimuat. Tunggu sampai status Connected lalu coba lagi.');
    }

    const type = document.getElementById('b-type').value;
    const itemName = normalizeItemName(document.getElementById('b-item-name').value);
    const qty = Number.parseInt(document.getElementById('b-qty').value, 10);
    const action = document.getElementById('b-action').value;
    const notes = document.getElementById('b-notes').value.trim() || '-';

    if (!Number.isFinite(qty) || qty < 0) {
        return alert(type === 'item' ? '❌ Quantity harus berupa angka 0 atau lebih.' : '❌ Nominal harus berupa angka 0 atau lebih.');
    }

    // Snapshot lokal untuk rollback jika Firebase menolak/gagal menyimpan.
    const beforeBrangkasState = JSON.parse(JSON.stringify(window.brangkasState));
    const beforeTransactionsData = JSON.parse(JSON.stringify(window.transactionsData || []));
    const beforeStockFlowData = JSON.parse(JSON.stringify(window.stockFlowData || []));

    if (type === 'item') {
        const vaultType = normalizeVaultType(document.getElementById('b-vault-type')?.value || VAULT_BMC);
        if (!itemName) return alert('❌ Masukkan nama item.');
        const vaultItems = getVaultItems(vaultType);

        const current = Number(vaultItems[itemName]) || 0;
        if (action === 'sub' && qty > current) {
            return alert(`❌ Stok ${itemName} di ${getVaultLabel(vaultType)} hanya ${current} PCS.`);
        }

        let updated = current;
        if (action === 'add') updated = current + qty;
        else if (action === 'sub') updated = current - qty;
        else if (action === 'set') updated = qty;
        vaultItems[itemName] = Math.max(0, updated);

        const difference = updated - current;
        if (difference !== 0) {
            recordStockFlow({
                direction: difference > 0 ? 'MASUK' : 'KELUAR',
                source: action === 'set' ? 'Set Ulang Stok' : 'Input Brangkas',
                vaultType,
                items: [{ name: itemName, qty: Math.abs(difference) }],
                notes
            });
        }
    } else {
        const key = type === 'white' ? 'whiteMoney' : (type === 'black' ? 'blackMoney' : 'redMoney');
        const current = Math.max(0, Number(window.brangkasState[key]) || 0);

        if (action !== 'set' && qty <= 0) {
            return alert('❌ Nominal harus lebih dari 0.');
        }
        if (action === 'sub' && qty > current) {
            const label = type === 'white' ? 'Uang Putih' : (type === 'black' ? 'Black Money' : 'Red Money');
            const currentText = type === 'white' ? formatRP(current) : formatUSD(current);
            return alert(`❌ Saldo ${label} hanya ${currentText}.`);
        }

        let updated = current;
        if (action === 'add') updated = current + qty;
        else if (action === 'sub') updated = current - qty;
        else if (action === 'set') updated = qty;
        window.brangkasState[key] = Math.max(0, updated);

        const txType = action === 'add' ? 'PEMASUKAN' : (action === 'sub' ? 'PENGELUARAN' : 'UPDATE STOK');
        const label = type === 'white' ? 'Uang Putih' : (type === 'black' ? 'Black Money' : 'Red Money');
        const totalFormatted = type === 'white' ? formatRP(qty) : formatUSD(qty);
        const now = new Date();

        window.transactionsData.unshift({
            createdAt: now.toISOString(),
            time: now.toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
            type: txType,
            item: label,
            qty: 1,
            total: totalFormatted,
            amount: qty,
            payType: label,
            balanceBefore: current,
            balanceAfter: updated,
            notes
        });
    }

    // Render langsung agar Set Ulang terlihat saat itu juga.
    renderAll();

    const saved = await window.saveData();
    if (!saved) {
        window.brangkasState = beforeBrangkasState;
        ensureVaultState();
        window.transactionsData = beforeTransactionsData;
        window.stockFlowData = beforeStockFlowData;
        renderAll();
        return;
    }

    const actionLabel = action === 'add' ? 'Deposit berhasil disimpan.'
        : action === 'sub' ? 'Withdraw berhasil disimpan.'
        : 'Total brangkas berhasil diset ulang.';
    window.showBmcToast(actionLabel, 'success');

    const qtyInput = document.getElementById('b-qty');
    const noteInput = document.getElementById('b-notes');
    if (qtyInput) qtyInput.value = '';
    if (noteInput) noteInput.value = '';
}


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
    const vaultType = normalizeVaultType(document.getElementById('loan-vault-type')?.value || VAULT_BMC);
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
    const vaultItems = getVaultItems(vaultType);

    const stockShortages = items.filter(item => {
        const stockName = normalizeItemName(item.name);
        return (Number(vaultItems[stockName]) || 0) < item.qty;
    });

    if (stockShortages.length > 0) {
        const shortageMessage = stockShortages.map(item => {
            const stockName = normalizeItemName(item.name);
            return `${stockName}: stok ${Number(vaultItems[stockName]) || 0} PCS, diminta ${item.qty} PCS`;
        }).join('\n');

        return alert(`❌ Stok ${getVaultLabel(vaultType)} tidak mencukupi:

${shortageMessage}

Tambahkan stok terlebih dahulu atau kurangi quantity.`);
    }

    items.forEach(item => {
        const stockName = normalizeItemName(item.name);
        vaultItems[stockName] = (Number(vaultItems[stockName]) || 0) - item.qty;
    });

    recordStockFlow({
        direction: 'KELUAR',
        source: 'Utang / Peminjaman',
        vaultType,
        items: items.map(item => ({ name: item.name, qty: item.qty })),
        amount: total,
        payType: payType === 'BM' ? 'Black Money' : 'Uang Putih',
        notes: `Peminjam: ${borrower} | Yang meminjamkan: ${lender}`
    });

    window.loanRecordsData.unshift({
        time: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
        borrower,
        lender,
        vaultType,
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

    alert(`✅ Data utang / peminjaman dari ${getVaultLabel(vaultType)} berhasil disimpan!`);
};

window.renderLoanRecords = function() {
    const tbody = document.getElementById('tbody-loan-records');
    if (!tbody) return;

    normalizeLoanRecordsData();
    const records = Array.isArray(window.loanRecordsData) ? window.loanRecordsData : [];

    if (records.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align:center; color:var(--text-muted);">
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
                <td><span class="badge badge-black">${getVaultLabel(record.vaultType || VAULT_BMC)}</span></td>
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

    if (!Array.isArray(window.bmcToKelompokData) || window.bmcToKelompokData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; color:var(--text-muted);">Belum ada data harga BMC ke Kelompok.</td></tr>';
        return;
    }

    tbody.innerHTML = window.bmcToKelompokData.map((item, index) => `
        <tr>
            <td style="font-weight: bold; color: var(--accent-gold);">${escapeHtml(item.group || '-')}</td>
            <td><span class="badge badge-black">${escapeHtml(item.category || '-')}</span></td>
            <td style="font-weight: 600;">${escapeHtml(item.item || '-')}</td>
            <td><span class="badge badge-white">${escapeHtml(item.qty || '-')}</span></td>
            <td style="color: var(--accent-green);">${item.priceWO ? formatRP(item.priceWO) : '-'}</td>
            <td style="color: var(--accent-blue);">${item.priceW ? formatRP(item.priceW) : '-'}</td>
            <td style="color: var(--accent-red); font-size: 0.85rem;">${escapeHtml(item.note || '-')}</td>
            <td style="color: var(--text-muted); font-size: 0.85rem;">${escapeHtml(item.ket || '-')}</td>
            <td>
                <div style="display:flex; gap:6px; flex-wrap:wrap;">
                    <button class="btn btn-sm btn-blue" type="button" onclick="window.openPriceDataEdit('BMC_TO_KELOMPOK', ${index})">Edit</button>
                    <button class="btn btn-sm btn-red" type="button" onclick="window.deletePriceData('BMC_TO_KELOMPOK', ${index})">Hapus</button>
                </div>
            </td>
        </tr>
    `).join('');
};

window.renderKelompokToBmc = function() {
    const tbody = document.getElementById('tbody-kelompok-to-bmc');
    if (!tbody) return;

    if (!Array.isArray(window.kelompokToBmcData) || window.kelompokToBmcData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; color:var(--text-muted);">Belum ada data harga Kelompok ke BMC.</td></tr>';
        return;
    }

    tbody.innerHTML = window.kelompokToBmcData.map((item, index) => `
        <tr>
            <td style="font-weight: bold; color: var(--accent-gold);">${escapeHtml(item.group || '-')}</td>
            <td><span class="badge badge-black">${escapeHtml(item.category || '-')}</span></td>
            <td style="font-weight: 600;">${escapeHtml(item.item || '-')}</td>
            <td><span class="badge badge-white">${escapeHtml(item.qty || '-')}</span></td>
            <td style="color: var(--accent-green);">${item.priceWO ? formatRP(item.priceWO) : '-'}</td>
            <td style="color: var(--accent-blue);">${item.priceW ? formatRP(item.priceW) : '-'}</td>
            <td style="color: var(--accent-red); font-size: 0.85rem;">${escapeHtml(item.note || '-')}</td>
            <td style="color: var(--text-muted); font-size: 0.85rem;">${escapeHtml(item.ket || '-')}</td>
            <td>
                <div style="display:flex; gap:6px; flex-wrap:wrap;">
                    <button class="btn btn-sm btn-blue" type="button" onclick="window.openPriceDataEdit('KELOMPOK_TO_BMC', ${index})">Edit</button>
                    <button class="btn btn-sm btn-red" type="button" onclick="window.deletePriceData('KELOMPOK_TO_BMC', ${index})">Hapus</button>
                </div>
            </td>
        </tr>
    `).join('');
};


function getManualOrderReferenceList() {
    const type = document.getElementById('modal-order-type')?.value;
    return type === 'BMC_TO_KELOMPOK'
        ? (window.bmcToKelompokData || [])
        : (window.kelompokToBmcData || []);
}

function getManualOrderReferencePrice(record) {
    if (!record) return 0;
    const withoutService = Math.max(0, Number(record.priceWO) || 0);
    const withService = Math.max(0, Number(record.priceW) || 0);
    return withoutService > 0 ? withoutService : withService;
}

function findManualOrderReference(groupName, itemName) {
    const group = normalizeItemName(groupName);
    const item = normalizeItemName(itemName);
    if (!item) return null;

    const list = getManualOrderReferenceList();
    const exactMatch = list.find(record =>
        normalizeItemName(record.group) === group && normalizeItemName(record.item) === item
    );
    if (exactMatch) return exactMatch;

    const sameItem = list.filter(record => normalizeItemName(record.item) === item);
    return sameItem.length === 1 ? sameItem[0] : null;
}

window.populateManualOrderReferenceOptions = function() {
    const list = getManualOrderReferenceList();
    const groupDatalist = document.getElementById('manual-order-group-options');
    const itemDatalist = document.getElementById('manual-order-item-options');

    if (groupDatalist) {
        const groups = [...new Set(list.map(record => normalizeItemName(record.group)).filter(Boolean))]
            .sort((a, b) => a.localeCompare(b));
        groupDatalist.innerHTML = groups.map(group => `<option value="${escapeHtml(group)}"></option>`).join('');
    }

    if (itemDatalist) {
        const selectedGroup = normalizeItemName(document.getElementById('modal-order-group')?.value);
        const source = selectedGroup
            ? list.filter(record => normalizeItemName(record.group) === selectedGroup)
            : list;
        const items = [...new Set(source.map(record => normalizeItemName(record.item)).filter(Boolean))]
            .sort((a, b) => a.localeCompare(b));
        itemDatalist.innerHTML = items.map(item => `<option value="${escapeHtml(item)}"></option>`).join('');
    }
};

window.previewManualOrderEntryTotal = function() {
    const qty = Math.max(1, Number.parseInt(document.getElementById('modal-qty')?.value, 10) || 1);
    const unitPrice = Math.max(0, Number(document.getElementById('modal-unit-price-input')?.value) || 0);
    const subtotalElement = document.getElementById('manual-order-entry-subtotal');
    if (subtotalElement) subtotalElement.textContent = formatUSD(qty * unitPrice);
};

window.markManualOrderPriceAsManual = function() {
    const priceInput = document.getElementById('modal-unit-price-input');
    if (priceInput) priceInput.dataset.manualPrice = 'true';
    const sourceElement = document.getElementById('manual-order-price-source');
    if (sourceElement) sourceElement.textContent = 'Harga satuan diedit manual.';
};

window.handleManualOrderReferenceChange = function() {
    window.populateManualOrderReferenceOptions();

    const groupName = document.getElementById('modal-order-group')?.value;
    const itemName = document.getElementById('modal-item-name')?.value;
    const priceInput = document.getElementById('modal-unit-price-input');
    const sourceElement = document.getElementById('manual-order-price-source');
    if (!priceInput) return;

    const match = findManualOrderReference(groupName, itemName);
    if (match) {
        const referencePrice = getManualOrderReferencePrice(match);
        priceInput.value = referencePrice;
        priceInput.dataset.manualPrice = 'false';
        if (sourceElement) {
            const matchedGroup = normalizeItemName(match.group) || '-';
            const matchedItem = normalizeItemName(match.item) || '-';
            sourceElement.textContent = referencePrice > 0
                ? `Harga otomatis: ${matchedGroup} • ${matchedItem} = ${formatUSD(referencePrice)} per item.`
                : `Data harga ditemukan untuk ${matchedGroup} • ${matchedItem}, tetapi harganya masih 0/TBA.`;
        }
    } else {
        if (priceInput.dataset.manualPrice !== 'true') priceInput.value = 0;
        if (sourceElement) {
            sourceElement.textContent = itemName
                ? 'Data harga belum ditemukan. Harga satuan masih bisa diisi manual.'
                : 'Ketik nama kelompok dan barang. Harga akan diambil otomatis dari data harga.';
        }
    }

    window.previewManualOrderEntryTotal();
};

window.openManualOrderProcess = function(type) {
    if (type !== 'BMC_TO_KELOMPOK' && type !== 'KELOMPOK_TO_BMC') {
        return alert('❌ Jenis order tidak dikenali.');
    }

    const isBmcToKelompok = type === 'BMC_TO_KELOMPOK';
    document.getElementById('modal-sell-title').innerText = isBmcToKelompok
        ? 'Proses Order Manual: BMC ➔ Kelompok'
        : 'Proses Order Manual: Kelompok ➔ BMC';
    document.getElementById('modal-order-type').value = type;
    document.getElementById('modal-order-group').value = '';
    document.getElementById('modal-item-name').value = '';
    document.getElementById('modal-qty').value = 1;
    document.getElementById('modal-unit-price-input').value = 0;
    document.getElementById('modal-unit-price-input').dataset.manualPrice = 'false';
    document.getElementById('modal-pay-type').value = 'RM';
    document.getElementById('modal-vault-type').value = 'BOSS';
    document.getElementById('modal-notes').value = '';
    window.manualOrderDraftItems = [];
    window.populateManualOrderReferenceOptions();
    const priceSource = document.getElementById('manual-order-price-source');
    if (priceSource) priceSource.textContent = 'Ketik nama kelompok dan barang. Harga akan diambil otomatis dari data harga.';
    window.renderManualOrderDraftItems();
    window.previewManualOrderEntryTotal();
    window.calcModalTotal();
    document.getElementById('modal-sell').classList.add('active');
};

// Kompatibilitas: fungsi lama tetap tersedia, tetapi hanya membuka proses manual.
window.openSellModal = function(type) {
    window.openManualOrderProcess(type);
};

window.addManualOrderDraftItem = function() {
    const nameInput = document.getElementById('modal-item-name');
    const qtyInput = document.getElementById('modal-qty');
    const priceInput = document.getElementById('modal-unit-price-input');
    const itemName = normalizeItemName(nameInput?.value);
    const qty = Math.max(1, Number.parseInt(qtyInput?.value, 10) || 1);
    const unitPrice = Math.max(0, Number(priceInput?.value) || 0);

    if (!itemName) return alert('❌ Masukkan nama barang terlebih dahulu.');
    if (!Array.isArray(window.manualOrderDraftItems)) window.manualOrderDraftItems = [];

    const existing = window.manualOrderDraftItems.find(item =>
        normalizeItemName(item.name) === itemName && Number(item.unitPrice) === unitPrice
    );

    if (existing) {
        existing.qty += qty;
    } else {
        window.manualOrderDraftItems.push({ name: itemName, qty, unitPrice });
    }

    if (nameInput) nameInput.value = '';
    if (qtyInput) qtyInput.value = 1;
    if (priceInput) {
        priceInput.value = 0;
        priceInput.dataset.manualPrice = 'false';
    }
    const priceSource = document.getElementById('manual-order-price-source');
    if (priceSource) priceSource.textContent = 'Pilih barang berikutnya. Harga akan diambil otomatis dari data harga.';
    window.populateManualOrderReferenceOptions();
    window.previewManualOrderEntryTotal();
    window.renderManualOrderDraftItems();
    window.calcModalTotal();
};

window.updateManualOrderDraftItem = function(index, field, value) {
    const item = window.manualOrderDraftItems?.[index];
    if (!item) return;

    if (field === 'name') item.name = normalizeItemName(value);
    if (field === 'qty') item.qty = Math.max(1, Number.parseInt(value, 10) || 1);
    if (field === 'unitPrice') item.unitPrice = Math.max(0, Number(value) || 0);

    window.renderManualOrderDraftItems();
    window.calcModalTotal();
};

window.removeManualOrderDraftItem = function(index) {
    if (!Array.isArray(window.manualOrderDraftItems)) window.manualOrderDraftItems = [];
    window.manualOrderDraftItems.splice(index, 1);
    window.renderManualOrderDraftItems();
    window.calcModalTotal();
};

window.renderManualOrderDraftItems = function() {
    const tbody = document.getElementById('tbody-manual-order-items');
    if (!tbody) return;

    const items = Array.isArray(window.manualOrderDraftItems) ? window.manualOrderDraftItems : [];
    if (items.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center; color:var(--text-muted);">
                    Belum ada barang ditambahkan.
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = items.map((item, index) => {
        const subtotal = (Number(item.unitPrice) || 0) * (Number(item.qty) || 0);
        return `
            <tr>
                <td>
                    <input
                        type="text"
                        class="form-control manual-mini-input"
                        value="${escapeHtml(item.name)}"
                        onchange="window.updateManualOrderDraftItem(${index}, 'name', this.value)"
                    >
                </td>
                <td>
                    <input
                        type="number"
                        class="form-control manual-mini-input"
                        min="1"
                        value="${Number(item.qty) || 1}"
                        onchange="window.updateManualOrderDraftItem(${index}, 'qty', this.value)"
                    >
                </td>
                <td>
                    <input
                        type="number"
                        class="form-control manual-mini-input"
                        min="0"
                        value="${Number(item.unitPrice) || 0}"
                        onchange="window.updateManualOrderDraftItem(${index}, 'unitPrice', this.value)"
                    >
                </td>
                <td style="font-weight:700; color:var(--accent-green);">${formatUSD(subtotal)}</td>
                <td>
                    <button type="button" class="btn btn-sm btn-red" onclick="window.removeManualOrderDraftItem(${index})">Hapus</button>
                </td>
            </tr>`;
    }).join('');
};

window.calcModalTotal = function() {
    const total = (window.manualOrderDraftItems || []).reduce((sum, item) => {
        return sum + (Math.max(1, Number(item.qty) || 1) * Math.max(0, Number(item.unitPrice) || 0));
    }, 0);

    const totalInput = document.getElementById('modal-total-price');
    if (totalInput) totalInput.value = formatUSD(total);
};

window.processTransaction = async function(e) {
    if (e) e.preventDefault();

    const type = document.getElementById('modal-order-type').value;
    const groupName = String(document.getElementById('modal-order-group').value || '').trim();
    const notes = document.getElementById('modal-notes').value.trim() || '-';

    if (type !== 'BMC_TO_KELOMPOK' && type !== 'KELOMPOK_TO_BMC') {
        return alert('❌ Jenis order tidak dikenali. Silakan tutup lalu buka kembali form order manual.');
    }
    if (!groupName) return alert('❌ Nama kelompok wajib diisi.');

    // Jika pengguna sudah mengisi kolom tetapi belum menekan tombol Tambah,
    // masukkan item tersebut secara otomatis saat form disimpan.
    const pendingName = normalizeItemName(document.getElementById('modal-item-name')?.value);
    if (pendingName) {
        const pendingQty = Math.max(1, Number.parseInt(document.getElementById('modal-qty')?.value, 10) || 1);
        const pendingPrice = Math.max(0, Number(document.getElementById('modal-unit-price-input')?.value) || 0);
        if (!Array.isArray(window.manualOrderDraftItems)) window.manualOrderDraftItems = [];
        window.manualOrderDraftItems.push({ name: pendingName, qty: pendingQty, unitPrice: pendingPrice });
    }

    const items = (window.manualOrderDraftItems || [])
        .map(item => ({
            name: normalizeItemName(item.name),
            qty: Math.max(1, Number.parseInt(item.qty, 10) || 1),
            unitPrice: Math.max(0, Number(item.unitPrice) || 0)
        }))
        .filter(item => item.name);

    if (items.length === 0) return alert('❌ Tambahkan minimal satu barang ke order.');

    const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
    const totalAmount = items.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
    const itemSummary = items.map(item => `${item.name} x${item.qty}`).join(', ');
    const unitPriceSummary = items.length === 1
        ? formatUSD(items[0].unitPrice)
        : 'Multi Harga';

    if (!Array.isArray(window.orderHistoryData)) window.orderHistoryData = [];

    const orderRecord = {
        time: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
        direction: type,
        group: groupName,
        vaultType: VAULT_BOSS,
        item: itemSummary,
        items,
        qty: totalQty,
        unitPrice: unitPriceSummary,
        total: formatUSD(totalAmount),
        totalAmount,
        payType: 'Red Money',
        notes,
        status: 'PENDING',
        manualOrder: true,
        moneyApplied: false,
        moneyAppliedAt: null
    };

    // Order manual hanya dicatat sebagai PENDING. Stok tidak diubah dan Red Money
    // belum diproses sampai status order diubah menjadi DONE.
    window.orderHistoryData = [orderRecord, ...window.orderHistoryData];

    await window.saveData();
    renderAll();
    window.closeModal('modal-sell');
    window.manualOrderDraftItems = [];
    alert(`✅ Order manual dengan ${items.length} jenis barang berhasil dicatat sebagai PENDING. Red Money belum berubah. Total: ${orderRecord.total}`);
};

function getPriceDataList(targetType) {
    return targetType === 'BMC_TO_KELOMPOK'
        ? window.bmcToKelompokData
        : window.kelompokToBmcData;
}

function getPriceTargetLabel(targetType) {
    return targetType === 'BMC_TO_KELOMPOK'
        ? 'BMC -> Kelompok'
        : 'Kelompok -> BMC';
}

window.openCustomOrderModal = function(target) {
    const targetType = target === 'BMC -> Kelompok' ? 'BMC_TO_KELOMPOK' : 'KELOMPOK_TO_BMC';
    document.getElementById('custom-target-panel').value = targetType;
    document.getElementById('custom-edit-index').value = '-1';
    document.getElementById('modal-custom-title').innerText = `Tambah Data Harga: ${getPriceTargetLabel(targetType)}`;
    document.getElementById('c-group').value = '';
    document.getElementById('c-category').value = '';
    document.getElementById('c-item').value = '';
    document.getElementById('c-qty').value = '';
    document.getElementById('c-price-wo').value = '';
    document.getElementById('c-price-w').value = '';
    document.getElementById('c-note').value = '';
    document.getElementById('c-ket').value = '';
    document.getElementById('modal-custom-order').classList.add('active');
};

window.openPriceDataEdit = function(targetType, index) {
    const list = getPriceDataList(targetType);
    const item = list?.[index];
    if (!item) return alert('❌ Data harga tidak ditemukan.');

    document.getElementById('custom-target-panel').value = targetType;
    document.getElementById('custom-edit-index').value = String(index);
    document.getElementById('modal-custom-title').innerText = `Edit Data Harga: ${getPriceTargetLabel(targetType)}`;
    document.getElementById('c-group').value = item.group || '';
    document.getElementById('c-category').value = item.category || '';
    document.getElementById('c-item').value = item.item || '';
    document.getElementById('c-qty').value = item.qty || '';
    document.getElementById('c-price-wo').value = Number(item.priceWO) || 0;
    document.getElementById('c-price-w').value = Number(item.priceW) || 0;
    document.getElementById('c-note').value = item.note === '-' ? '' : (item.note || '');
    document.getElementById('c-ket').value = item.ket === '-' ? '' : (item.ket || '');
    document.getElementById('modal-custom-order').classList.add('active');
};

window.deletePriceData = async function(targetType, index) {
    const list = getPriceDataList(targetType);
    const item = list?.[index];
    if (!item) return alert('❌ Data harga tidak ditemukan.');

    const confirmed = confirm(`Hapus data harga ${item.item || '-'} untuk ${item.group || '-'}?`);
    if (!confirmed) return;

    list.splice(index, 1);
    await window.saveData();
    renderAll();
    alert('✅ Data harga berhasil dihapus.');
};

window.saveCustomOrder = async function(e) {
    if (e) e.preventDefault();

    const targetType = document.getElementById('custom-target-panel').value;
    const editIndex = Number.parseInt(document.getElementById('custom-edit-index').value, 10);
    const group = document.getElementById('c-group').value.trim().toUpperCase();
    const itemName = document.getElementById('c-item').value.trim().toUpperCase();

    if (!group) return alert('❌ Nama kelompok wajib diisi.');
    if (!itemName) return alert('❌ Nama barang wajib diisi.');

    const priceItem = {
        group,
        category: document.getElementById('c-category').value.trim().toUpperCase() || 'GENERAL',
        item: itemName,
        qty: document.getElementById('c-qty').value.trim() || '1 PCS',
        priceWO: Math.max(0, Number(document.getElementById('c-price-wo').value) || 0),
        priceW: Math.max(0, Number(document.getElementById('c-price-w').value) || 0),
        note: document.getElementById('c-note').value.trim() || '-',
        ket: document.getElementById('c-ket').value.trim() || '-'
    };

    const list = getPriceDataList(targetType);
    if (!Array.isArray(list)) return alert('❌ Target data harga tidak dikenali.');

    const isEditing = Number.isInteger(editIndex) && editIndex >= 0 && editIndex < list.length;
    if (isEditing) list[editIndex] = priceItem;
    else list.push(priceItem);

    await window.saveData();
    renderAll();
    window.closeModal('modal-custom-order');
    alert(isEditing ? '✅ Data harga berhasil diperbarui.' : '✅ Data harga custom berhasil ditambahkan.');
};

window.setStockFlowDays = function(value) {
    const days = Number.parseInt(value, 10);
    window.stockFlowChartDays = [7, 14, 30].includes(days) ? days : 7;
    window.renderStockFlowDashboard();
};

window.renderLowStock = function() { return; };

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

    // Loss uang dicatat sebagai kas keluar.
    (window.lossRecordsData || []).forEach(record => {
        if (String(record?.lossType || '').toUpperCase() !== 'MONEY') return;
        const amount = Math.max(0, Number(record?.amount) || 0);
        if (amount <= 0) return;

        const currency = record.moneyKey === 'whiteMoney' ? 'UP'
            : (record.moneyKey === 'blackMoney' ? 'BM' : (record.moneyKey === 'redMoney' ? 'RM' : null));
        if (!currency) return;

        const date = record?.createdAt ? new Date(record.createdAt) : (parseIndonesianDateTime(record?.time) || new Date(0));
        result.push({
            date: Number.isNaN(date.getTime()) ? new Date(0) : date,
            direction: 'KELUAR',
            currency,
            amount,
            source: record.moneyLabel ? `Loss ${record.moneyLabel}` : 'Loss Uang'
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

    const historicalStockSnapshots = buildHistoricalStockSnapshots();
    const historicalSaleCashSnapshots = buildHistoricalSaleCashSnapshots();
    const records = (window.stockFlowData || [])
        .map((record, sourceIndex) => ({ record, sourceIndex }))
        .filter(entry => entry.record?.direction === 'PENJUALAN')
        .sort((a, b) => getStockFlowDate(b.record) - getStockFlowDate(a.record))
        .slice(0, 30);

    if (records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" class="dashboard-empty">Belum ada data penjualan.</td></tr>';
        return;
    }

    tbody.innerHTML = records.map(({ record, sourceIndex }) => {
        const itemText = (record.items || []).map(item => `${item.name} x${item.qty}`).join(', ');
        const payType = normalizeTransactionPayType(record.payType);
        const nominal = payType === 'Uang Putih' ? formatRP(record.amount) : formatUSD(record.amount);
        const vaultType = normalizeVaultType(record.vaultType || VAULT_BOSS);
        const saleStatus = normalizeSaleStatus(record.status);
        const balanceAtThatTime = historicalSaleCashSnapshots.get(sourceIndex);
        const balanceText = balanceAtThatTime === undefined
            ? '-'
            : formatCashBalanceAtThatTime(balanceAtThatTime, payType);
        const balanceClass = balanceAtThatTime === undefined || Number(balanceAtThatTime) <= 0
            ? 'badge-red'
            : 'badge-green';
        const stockSnapshot = historicalStockSnapshots.get(sourceIndex) || {};
        const remainingStockHtml = (record.items || []).length
            ? (record.items || []).map(item => {
                const itemName = normalizeItemName(item.name);
                const stockAtThatTime = Number(stockSnapshot[itemName]) || 0;
                const badgeClass = stockAtThatTime <= 30 ? 'badge-red' : 'badge-green';
                return `<div style="margin-bottom:4px;"><span class="badge ${badgeClass}">${escapeHtml(item.name)}: ${stockAtThatTime} PCS</span></div>`;
            }).join('')
            : '-';

        return `
            <tr>
                <td>${escapeHtml(record.time || '-')}</td>
                <td><span class="badge badge-black">${getVaultLabel(vaultType)}</span></td>
                <td class="stock-activity-notes">${escapeHtml(record.notes || '-')}</td>
                <td>${escapeHtml(itemText || '-')}</td>
                <td>${Number(record.totalQty) || 0} PCS</td>
                <td><span class="badge badge-black">${escapeHtml(payType)}</span></td>
                <td>${escapeHtml(nominal)}</td>
                <td>${getSaleStatusBadge(saleStatus)}</td>
                <td><span class="badge ${balanceClass}">${escapeHtml(balanceText)}</span></td>
                <td><div class="movement-item-lines">${remainingStockHtml}</div></td>
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

function normalizeSaleStatus(status) {
    const value = String(status || '').trim().toUpperCase();
    return value === 'PENDING' ? 'PENDING' : 'DONE';
}

function getSaleStatusBadge(status) {
    const normalized = normalizeSaleStatus(status);
    if (normalized === 'PENDING') return '<span class="badge badge-red">PENDING</span>';
    return '<span class="badge badge-green">DONE</span>';
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
    container.innerHTML = window.saleEditDraftItems.map((item, index) => {
        const unitInfo = getMemberSaleUnitInfo(item.name);
        return `
        <div class="sale-edit-item-row">
            <div class="form-group"><label>Jenis Barang</label><select class="form-control" onchange="window.updateSaleEditItem(${index}, 'name', this.value)">${createSaleItemOptions(item.name)}</select></div>
            <div class="form-group">
                <label>QTY (${unitInfo.saleUnitLabel})</label>
                <input type="number" class="form-control" min="1" value="${Math.max(1, Number(item.qty) || 1)}" onchange="window.updateSaleEditItem(${index}, 'qty', this.value)" oninput="window.updateSaleEditItem(${index}, 'qty', this.value)">
                ${unitInfo.isClip ? `<div style="font-size:0.72rem; color:var(--text-muted); margin-top:4px;">1 CLIP = ${unitInfo.pcsPerClip} PCS</div>` : ''}
            </div>
            <button type="button" class="btn btn-sm btn-red" onclick="window.removeSaleEditItem(${index})">Hapus</button>
        </div>`;
    }).join('');
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
    document.getElementById('edit-sale-status').value = normalizeSaleStatus(record.status);
    document.getElementById('edit-sale-vault-type').value = normalizeVaultType(record.vaultType || VAULT_BMC);
    window.saleEditDraftItems = mergeStockFlowItems(record.items || []).map(item => ({
        name: item.name,
        qty: Math.max(1, convertStoredStockQtyToSaleQty(item.name, item.qty))
    }));
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
    if (field === 'name') {
        item.name = normalizeItemName(value);
        window.renderSaleEditItems();
        return;
    }
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
    const newStatus = normalizeSaleStatus(document.getElementById('edit-sale-status').value);
    const oldVaultType = normalizeVaultType(oldRecord.vaultType || VAULT_BMC);
    const newVaultType = normalizeVaultType(document.getElementById('edit-sale-vault-type').value);
    // Draft edit memakai satuan jual: CLIP untuk peluru, PCS untuk barang lain.
    const newSaleItems = mergeStockFlowItems(window.saleEditDraftItems || []);
    // Data stok dan Data Penjualan disimpan dalam PCS.
    const newStockItems = mergeStockFlowItems(newSaleItems.map(item => ({
        name: item.name,
        qty: convertSaleQtyToStockQty(item.name, item.qty)
    })));
    if (!buyer || !seller) return alert('Mohon isi nama pembeli dan penjual.');
    if (newSaleItems.length === 0) return alert('Tambahkan minimal satu barang penjualan.');

    ensureVaultState();
    const vaults = {
        BMC: { ...getVaultItems(VAULT_BMC) },
        BOSS: { ...getVaultItems(VAULT_BOSS) }
    };
    const oldItems = mergeStockFlowItems(oldRecord.items || []);

    // Kembalikan stok penjualan lama yang memang tersimpan dalam PCS.
    oldItems.forEach(item => {
        const name = normalizeItemName(item.name);
        vaults[oldVaultType][name] = (Number(vaults[oldVaultType][name]) || 0) + item.qty;
    });

    const shortages = newStockItems.filter(item =>
        (Number(vaults[newVaultType][normalizeItemName(item.name)]) || 0) < item.qty
    );
    if (shortages.length > 0) {
        const details = shortages.map(item => {
            const available = Number(vaults[newVaultType][normalizeItemName(item.name)]) || 0;
            const unitInfo = getMemberSaleUnitInfo(item.name);
            const matchingSaleItem = newSaleItems.find(saleItem => normalizeItemName(saleItem.name) === normalizeItemName(item.name));
            const requested = unitInfo.isClip
                ? `${matchingSaleItem?.qty || 0} CLIP (${item.qty} PCS)`
                : `${item.qty} PCS`;
            return `${item.name}: tersedia ${available} PCS, dibutuhkan ${requested}`;
        }).join('\n');
        return alert(`❌ Stok ${getVaultLabel(newVaultType)} tidak mencukupi untuk perubahan penjualan:

${details}`);
    }

    // Harga peluru tetap dihitung berdasarkan jumlah clip.
    const newAmount = newSaleItems.reduce(
        (sum, item) => sum + getSaleItemPrice(item.name, newPayType) * item.qty,
        0
    );
    const oldMoneyKey = getSaleMoneyKey(oldRecord.payType);
    window.brangkasState[oldMoneyKey] = Math.max(0, (Number(window.brangkasState[oldMoneyKey]) || 0) - (Number(oldRecord.amount) || 0));

    newStockItems.forEach(item => {
        const name = normalizeItemName(item.name);
        vaults[newVaultType][name] = (Number(vaults[newVaultType][name]) || 0) - item.qty;
    });

    const newMoneyKey = getSaleMoneyKey(newPayType);
    window.brangkasState[newMoneyKey] = (Number(window.brangkasState[newMoneyKey]) || 0) + newAmount;
    window.brangkasState.vaults = vaults;
    window.brangkasState.items = window.brangkasState.vaults.BMC;

    window.stockFlowData[sourceIndex] = {
        ...oldRecord,
        vaultType: newVaultType,
        items: newStockItems,
        totalQty: newStockItems.reduce((sum, item) => sum + item.qty, 0),
        amount: newAmount,
        payType: newPayType,
        status: newStatus,
        notes: `Pembeli: ${buyer} | Penjual: ${seller}`,
        updatedAt: new Date().toISOString()
    };
    await window.saveData();
    renderAll();
    window.closeModal('modal-edit-sale');
    alert('✅ Data penjualan diperbarui. Jumlah clip dikonversi otomatis menjadi PCS pada stok dan riwayat.');
};

window.deleteSaleRecord = async function(sourceIndex) {
    const record = (window.stockFlowData || [])[sourceIndex];
    if (!record || record.direction !== 'PENJUALAN') return alert('❌ Data penjualan tidak ditemukan.');
    if (!confirm('Hapus data penjualan ini? Barang akan dikembalikan ke stok dan nominal penjualan akan dikurangi dari saldo brangkas.')) return;

    const vaultType = normalizeVaultType(record.vaultType || VAULT_BMC);
    const vaultItems = getVaultItems(vaultType);
    mergeStockFlowItems(record.items || []).forEach(item => {
        const name = normalizeItemName(item.name);
        vaultItems[name] = (Number(vaultItems[name]) || 0) + item.qty;
    });
    const moneyKey = getSaleMoneyKey(record.payType);
    window.brangkasState[moneyKey] = Math.max(0, (Number(window.brangkasState[moneyKey]) || 0) - (Number(record.amount) || 0));
    window.stockFlowData.splice(sourceIndex, 1);
    await window.saveData();
    renderAll();
    alert(`✅ Data penjualan dihapus dan barang dikembalikan ke ${getVaultLabel(vaultType)}.`);
};

function buildHistoricalStockSnapshots() {
    ensureVaultState();

    // Mulai dari stok terkini, lalu mundur transaksi demi transaksi.
    // Dengan begitu setiap baris menyimpan gambaran sisa stok tepat setelah
    // transaksi pada baris tersebut selesai, bukan stok terkini hari ini.
    const runningStock = {
        BMC: { ...getVaultItems(VAULT_BMC) },
        BOSS: { ...getVaultItems(VAULT_BOSS) }
    };
    const snapshots = new Map();

    const orderedRecords = (window.stockFlowData || [])
        .map((record, sourceIndex) => ({ record, sourceIndex }))
        .sort((a, b) => {
            const dateDifference = getStockFlowDate(b.record) - getStockFlowDate(a.record);
            return dateDifference !== 0 ? dateDifference : a.sourceIndex - b.sourceIndex;
        });

    orderedRecords.forEach(({ record, sourceIndex }) => {
        const vaultType = normalizeVaultType(record?.vaultType || VAULT_BMC);
        const mergedItems = mergeStockFlowItems(record?.items || []);
        const stockAfterTransaction = {};

        mergedItems.forEach(item => {
            const itemName = normalizeItemName(item.name);
            stockAfterTransaction[itemName] = Number(runningStock[vaultType][itemName]) || 0;
        });
        snapshots.set(sourceIndex, stockAfterTransaction);

        // Mundurkan efek transaksi untuk memperoleh stok pada transaksi yang lebih lama.
        mergedItems.forEach(item => {
            const itemName = normalizeItemName(item.name);
            const qty = Number(item.qty) || 0;
            const current = Number(runningStock[vaultType][itemName]) || 0;

            if (record.direction === 'MASUK') {
                runningStock[vaultType][itemName] = current - qty;
            } else if (record.direction === 'KELUAR' || record.direction === 'PENJUALAN') {
                runningStock[vaultType][itemName] = current + qty;
            }
        });
    });

    return snapshots;
}

function buildStockMovementRows(direction) {
    ensureVaultState();
    const historicalStockSnapshots = buildHistoricalStockSnapshots();
    const searchQuery = normalizeSearchQuery(window.stockMovementSearch?.[direction] || '');
    const records = (window.stockFlowData || [])
        .map((record, sourceIndex) => ({ record, sourceIndex }))
        .filter(entry => {
            const recordDirection = entry.record?.direction;
            if (direction === 'MASUK') return recordDirection === 'MASUK';
            return recordDirection === 'KELUAR' || recordDirection === 'PENJUALAN';
        })
        .filter(({ record }) => {
            if (!searchQuery) return true;
            const vaultType = normalizeVaultType(record.vaultType || VAULT_BMC);
            const itemsText = (record.items || []).map(item => `${item.name} ${Number(item.qty) || 0}`).join(' ');
            const haystack = [record.time, getVaultLabel(vaultType), record.source, record.notes, itemsText, record.totalQty].join(' ');
            return normalizeSearchQuery(haystack).includes(searchQuery);
        })
        .sort((a, b) => getStockFlowDate(b.record) - getStockFlowDate(a.record))
        .slice(0, 20);

    if (records.length === 0) {
        const label = direction === 'MASUK' ? 'barang masuk' : 'barang keluar';
        const message = searchQuery
            ? `Tidak ada ${label} yang cocok dengan pencarian.`
            : `Belum ada ${label}.`;
        return `<tr><td colspan="8" class="dashboard-empty">${message}</td></tr>`;
    }

    return records.map(({ record, sourceIndex }) => {
        const vaultType = normalizeVaultType(record.vaultType || VAULT_BMC);
        const stockSnapshot = historicalStockSnapshots.get(sourceIndex) || {};
        const itemLines = (record.items || []).map(item =>
            `<div>${escapeHtml(item.name)} x${Number(item.qty) || 0}</div>`
        ).join('');
        const stockLines = (record.items || []).map(item => {
            const itemName = normalizeItemName(item.name);
            const stockAtThatTime = Number(stockSnapshot[itemName]) || 0;
            return `<div><span class="badge ${stockAtThatTime <= 30 ? 'badge-red' : 'badge-green'}">${stockAtThatTime} PCS</span></div>`;
        }).join('');
        return `
            <tr>
                <td>${escapeHtml(record.time || '-')}</td>
                <td><span class="badge badge-black">${getVaultLabel(vaultType)}</span></td>
                <td>${escapeHtml(record.source || '-')}</td>
                <td><div class="movement-item-lines">${itemLines || '-'}</div></td>
                <td>${Number(record.totalQty) || 0} PCS</td>
                <td><div class="movement-item-lines">${stockLines || '-'}</div></td>
                <td class="stock-activity-notes">${escapeHtml(record.notes || '-')}</td>
                <td>
                    <div class="movement-action-buttons">
                        ${record.direction === 'PENJUALAN'
                            ? `<button class="btn btn-sm btn-blue" type="button" onclick="window.openSaleEditModal(${sourceIndex})">Edit</button>
                               <button class="btn btn-sm btn-red" type="button" onclick="window.deleteSaleRecord(${sourceIndex})">Hapus</button>`
                            : `<button class="btn btn-sm btn-blue" type="button" onclick="window.openStockMovementEditModal(${sourceIndex})">Edit</button>
                               <button class="btn btn-sm btn-red" type="button" onclick="window.deleteStockMovementRecord(${sourceIndex})">Hapus</button>`}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

window.setStockMovementSearch = function(direction, value) {
    window.stockMovementSearch[direction] = String(value || '');
    window.renderStockMovementPanels();
};

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
    document.getElementById('edit-movement-vault-type').value = normalizeVaultType(record.vaultType || VAULT_BMC);
    document.getElementById('edit-movement-source').value = record.source || '';
    document.getElementById('edit-movement-notes').value = record.notes && record.notes !== '-' ? record.notes : '';
    window.stockMovementEditDraftItems = mergeStockFlowItems(record.items || []).map(item => ({ ...item }));
    window.renderStockMovementEditItems();
    document.getElementById('modal-edit-stock-movement').classList.add('active');
};

function calculateStockAfterMovementChange(record, newItems, newVaultType = null) {
    ensureVaultState();
    const oldVaultType = normalizeVaultType(record.vaultType || VAULT_BMC);
    const targetVaultType = normalizeVaultType(newVaultType || oldVaultType);
    const vaults = {
        BMC: { ...getVaultItems(VAULT_BMC) },
        BOSS: { ...getVaultItems(VAULT_BOSS) }
    };
    const oldItems = mergeStockFlowItems(record.items || []);
    const replacementItems = mergeStockFlowItems(newItems || []);
    const sign = record.direction === 'MASUK' ? 1 : -1;

    // Batalkan efek data lama pada brangkas asal.
    for (const item of oldItems) {
        const name = normalizeItemName(item.name);
        const current = Number(vaults[oldVaultType][name]) || 0;
        const reversed = current - (sign * item.qty);
        if (reversed < 0) {
            return { ok: false, message: `${name} di ${getVaultLabel(oldVaultType)} tidak cukup untuk membatalkan data lama.` };
        }
        vaults[oldVaultType][name] = reversed;
    }

    // Terapkan data baru pada brangkas pilihan.
    for (const item of replacementItems) {
        const name = normalizeItemName(item.name);
        const current = Number(vaults[targetVaultType][name]) || 0;
        const finalQty = current + (sign * item.qty);
        if (finalQty < 0) {
            return { ok: false, message: `${name}: stok ${getVaultLabel(targetVaultType)} ${current} PCS tidak cukup untuk koreksi ini.` };
        }
        vaults[targetVaultType][name] = finalQty;
    }

    return { ok: true, vaults, items: replacementItems, vaultType: targetVaultType };
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

    const newVaultType = normalizeVaultType(document.getElementById('edit-movement-vault-type').value);
    const adjustment = calculateStockAfterMovementChange(record, newItems, newVaultType);
    if (!adjustment.ok) return alert(`❌ Perubahan tidak dapat disimpan:

${adjustment.message}`);

    const newSource = String(document.getElementById('edit-movement-source').value || '').trim() || 'Aktivitas Brangkas';
    const newNotes = String(document.getElementById('edit-movement-notes').value || '').trim() || '-';

    window.brangkasState.vaults = adjustment.vaults;
    window.brangkasState.items = window.brangkasState.vaults.BMC;
    window.stockFlowData[sourceIndex] = {
        ...record,
        vaultType: adjustment.vaultType,
        source: newSource,
        notes: newNotes,
        items: adjustment.items,
        totalQty: adjustment.items.reduce((sum, item) => sum + item.qty, 0),
        updatedAt: new Date().toISOString()
    };

    await window.saveData();
    renderAll();
    window.closeModal('modal-edit-stock-movement');
    alert('✅ Data barang masuk/keluar, tipe brangkas, dan stok berhasil diperbarui.');
};

window.deleteStockMovementRecord = async function(sourceIndex) {
    if (!window.isAdminLoggedIn) return alert('❌ Hanya pengurus yang dapat menghapus arus barang.');

    const record = (window.stockFlowData || [])[sourceIndex];
    if (!record || !['MASUK', 'KELUAR'].includes(record.direction)) {
        return alert('❌ Data barang masuk/keluar tidak ditemukan.');
    }

    const label = record.direction === 'MASUK' ? 'barang masuk' : 'barang keluar';
    if (!confirm(`Hapus data ${label} ini? Sistem akan mencoba mengoreksi stok otomatis.`)) return;

    const adjustment = calculateStockAfterMovementChange(record, [], record.vaultType || VAULT_BMC);

    if (!adjustment.ok) {
        const deleteHistoryOnly = confirm(
            '⚠️ Stok saat ini tidak cukup untuk membatalkan perubahan dari data lama ini.\n\n' +
            adjustment.message +
            '\n\nTekan OK untuk menghapus RIWAYAT SAJA tanpa mengubah stok sekarang.\n' +
            'Tekan Batal untuk membiarkan data tetap ada.'
        );

        if (!deleteHistoryOnly) return;

        window.stockFlowData.splice(sourceIndex, 1);
        await window.saveData();
        renderAll();
        alert(`✅ Riwayat ${label} berhasil dihapus. Stok sekarang tidak diubah.`);
        return;
    }

    window.brangkasState.vaults = adjustment.vaults;
    window.brangkasState.items = window.brangkasState.vaults.BMC;
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


function getCashBalanceKey(payType) {
    const normalized = normalizeTransactionPayType(payType);
    if (normalized === 'Uang Putih') return 'whiteMoney';
    if (normalized === 'Black Money') return 'blackMoney';
    if (normalized === 'Red Money') return 'redMoney';
    return null;
}

function formatCashBalanceAtThatTime(amount, payType) {
    const normalized = normalizeTransactionPayType(payType);
    const safeAmount = Math.max(0, Number(amount) || 0);
    return normalized === 'Uang Putih' ? formatRP(safeAmount) : formatUSD(safeAmount);
}

function getTransactionCashDate(tx) {
    if (tx?.createdAt) {
        const createdDate = new Date(tx.createdAt);
        if (!Number.isNaN(createdDate.getTime())) return createdDate;
    }
    if (tx?.updatedAt) {
        const updatedDate = new Date(tx.updatedAt);
        if (!Number.isNaN(updatedDate.getTime())) return updatedDate;
    }
    return parseIndonesianDateTime(tx?.time) || new Date(0);
}

function buildHistoricalSaleCashSnapshots() {
    const runningBalance = {
        whiteMoney: Number(window.brangkasState?.whiteMoney) || 0,
        blackMoney: Number(window.brangkasState?.blackMoney) || 0,
        redMoney: Number(window.brangkasState?.redMoney) || 0
    };
    const snapshots = new Map();
    const cashEvents = [];

    // Kas manual tetap ikut dihitung agar saldo penjualan lama mencerminkan
    // posisi saldo setelah seluruh aktivitas kas yang terjadi pada waktunya.
    (window.transactionsData || []).forEach((tx, transactionIndex) => {
        if (!['PEMASUKAN', 'PENGELUARAN'].includes(tx?.type)) return;
        if (isMemberSaleTransaction(tx)) return;
        const balanceKey = getCashBalanceKey(tx?.payType);
        if (!balanceKey) return;
        const amount = Math.max(0, parseStoredAmount(tx?.total));
        if (amount <= 0) return;

        cashEvents.push({
            eventType: 'TRANSACTION',
            sourceIndex: transactionIndex,
            balanceKey,
            effect: tx.type === 'PEMASUKAN' ? amount : -amount,
            date: getTransactionCashDate(tx),
            sequence: transactionIndex
        });
    });

    // Loss uang juga ikut dihitung agar sisa saldo penjualan historis tetap akurat.
    (window.lossRecordsData || []).forEach((record, sourceIndex) => {
        if (String(record?.lossType || '').toUpperCase() !== 'MONEY') return;
        const balanceKey = String(record?.moneyKey || '');
        if (!['whiteMoney', 'blackMoney', 'redMoney'].includes(balanceKey)) return;
        const amount = Math.max(0, Number(record?.amount) || 0);
        if (amount <= 0) return;
        const lossDate = record?.createdAt ? new Date(record.createdAt) : (parseIndonesianDateTime(record?.time) || new Date(0));

        cashEvents.push({
            eventType: 'LOSS',
            sourceIndex,
            balanceKey,
            effect: -amount,
            date: Number.isNaN(lossDate.getTime()) ? new Date(0) : lossDate,
            sequence: sourceIndex
        });
    });

    (window.stockFlowData || []).forEach((record, sourceIndex) => {
        const balanceKey = getCashBalanceKey(record?.payType);
        const amount = Math.max(0, Number(record?.amount) || 0);
        if (!balanceKey || amount <= 0) return;

        let effect = 0;
        if (record.direction === 'PENJUALAN') {
            effect = amount;
        } else if (record.direction === 'KELUAR' && /Order BMC/i.test(String(record.source || ''))) {
            effect = amount;
        } else if (record.direction === 'MASUK' && /Order Kelompok/i.test(String(record.source || ''))) {
            effect = -amount;
        }
        if (effect === 0) return;

        cashEvents.push({
            eventType: 'STOCK_FLOW',
            sourceIndex,
            direction: record.direction,
            balanceKey,
            effect,
            date: getStockFlowDate(record),
            sequence: sourceIndex
        });
    });

    (window.orderHistoryData || []).forEach((order, sourceIndex) => {
        if (!order?.manualOrder || !order?.moneyApplied) return;
        const amount = getManualOrderAmount(order);
        if (amount <= 0) return;

        const appliedDate = order.moneyAppliedAt
            ? new Date(order.moneyAppliedAt)
            : (parseIndonesianDateTime(order.updatedAt || order.time) || new Date(0));

        cashEvents.push({
            eventType: 'MANUAL_ORDER',
            sourceIndex,
            balanceKey: 'redMoney',
            effect: order.direction === 'KELOMPOK_TO_BMC' ? -amount : amount,
            date: Number.isNaN(appliedDate.getTime()) ? new Date(0) : appliedDate,
            sequence: sourceIndex
        });
    });

    cashEvents.sort((a, b) => {
        const dateDifference = b.date - a.date;
        if (dateDifference !== 0) return dateDifference;
        if (a.eventType === b.eventType) return a.sequence - b.sequence;
        const priority = { MANUAL_ORDER: 0, LOSS: 1, STOCK_FLOW: 2, TRANSACTION: 3 };
        return (priority[a.eventType] ?? 9) - (priority[b.eventType] ?? 9);
    });

    cashEvents.forEach(event => {
        const currentBalance = Number(runningBalance[event.balanceKey]) || 0;
        if (event.eventType === 'STOCK_FLOW' && event.direction === 'PENJUALAN') {
            snapshots.set(event.sourceIndex, currentBalance);
        }
        runningBalance[event.balanceKey] = currentBalance - event.effect;
    });

    return snapshots;
}

function buildHistoricalCashSnapshots() {
    const runningBalance = {
        whiteMoney: Number(window.brangkasState?.whiteMoney) || 0,
        blackMoney: Number(window.brangkasState?.blackMoney) || 0,
        redMoney: Number(window.brangkasState?.redMoney) || 0
    };
    const snapshots = new Map();
    const cashEvents = [];

    // Transaksi kas manual yang tampil pada tab Transaksi Masuk/Keluar.
    (window.transactionsData || []).forEach((tx, transactionIndex) => {
        if (!['PEMASUKAN', 'PENGELUARAN'].includes(tx?.type)) return;
        if (isMemberSaleTransaction(tx)) return;
        const balanceKey = getCashBalanceKey(tx?.payType);
        if (!balanceKey) return;
        const amount = Math.max(0, parseStoredAmount(tx?.total));
        if (amount <= 0) return;

        cashEvents.push({
            eventType: 'TRANSACTION',
            sourceIndex: transactionIndex,
            balanceKey,
            effect: tx.type === 'PEMASUKAN' ? amount : -amount,
            date: getTransactionCashDate(tx),
            sequence: transactionIndex
        });
    });

    // Loss uang juga mengurangi saldo kas dan harus ikut dalam rekonstruksi histori.
    (window.lossRecordsData || []).forEach((record, sourceIndex) => {
        if (String(record?.lossType || '').toUpperCase() !== 'MONEY') return;
        const balanceKey = String(record?.moneyKey || '');
        if (!['whiteMoney', 'blackMoney', 'redMoney'].includes(balanceKey)) return;
        const amount = Math.max(0, Number(record?.amount) || 0);
        if (amount <= 0) return;
        const lossDate = record?.createdAt ? new Date(record.createdAt) : (parseIndonesianDateTime(record?.time) || new Date(0));

        cashEvents.push({
            eventType: 'LOSS',
            sourceIndex,
            balanceKey,
            effect: -amount,
            date: Number.isNaN(lossDate.getTime()) ? new Date(0) : lossDate,
            sequence: sourceIndex
        });
    });

    // Penjualan anggota dan order lama yang memang sudah mengubah saldo kas.
    (window.stockFlowData || []).forEach((record, sourceIndex) => {
        const balanceKey = getCashBalanceKey(record?.payType);
        const amount = Math.max(0, Number(record?.amount) || 0);
        if (!balanceKey || amount <= 0) return;

        let effect = 0;
        if (record.direction === 'PENJUALAN') {
            effect = amount;
        } else if (record.direction === 'KELUAR' && /Order BMC/i.test(String(record.source || ''))) {
            effect = amount;
        } else if (record.direction === 'MASUK' && /Order Kelompok/i.test(String(record.source || ''))) {
            effect = -amount;
        }
        if (effect === 0) return;

        cashEvents.push({
            eventType: 'STOCK_FLOW',
            sourceIndex,
            balanceKey,
            effect,
            date: getStockFlowDate(record),
            sequence: sourceIndex
        });
    });

    // Order manual baru mengubah Red Money ketika status sudah DONE.
    (window.orderHistoryData || []).forEach((order, sourceIndex) => {
        if (!order?.manualOrder || !order?.moneyApplied) return;
        const amount = getManualOrderAmount(order);
        if (amount <= 0) return;

        const appliedDate = order.moneyAppliedAt
            ? new Date(order.moneyAppliedAt)
            : (parseIndonesianDateTime(order.updatedAt || order.time) || new Date(0));

        cashEvents.push({
            eventType: 'MANUAL_ORDER',
            sourceIndex,
            balanceKey: 'redMoney',
            effect: order.direction === 'KELOMPOK_TO_BMC' ? -amount : amount,
            date: Number.isNaN(appliedDate.getTime()) ? new Date(0) : appliedDate,
            sequence: sourceIndex
        });
    });

    // Urutkan dari transaksi terbaru ke yang lebih lama, lalu mundurkan efeknya.
    cashEvents.sort((a, b) => {
        const dateDifference = b.date - a.date;
        if (dateDifference !== 0) return dateDifference;
        if (a.eventType === b.eventType) return a.sequence - b.sequence;
        const priority = { MANUAL_ORDER: 0, LOSS: 1, STOCK_FLOW: 2, TRANSACTION: 3 };
        return (priority[a.eventType] ?? 9) - (priority[b.eventType] ?? 9);
    });

    cashEvents.forEach(event => {
        const currentBalance = Number(runningBalance[event.balanceKey]) || 0;
        if (event.eventType === 'TRANSACTION') {
            snapshots.set(event.sourceIndex, currentBalance);
        }
        // Mundurkan transaksi untuk memperoleh saldo setelah transaksi yang lebih lama.
        runningBalance[event.balanceKey] = currentBalance - event.effect;
    });

    return snapshots;
}

function renderTransactionRows(tbodyId, transactionType) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;

    const historicalCashSnapshots = buildHistoricalCashSnapshots();
    const filteredTransactions = (window.transactionsData || [])
        .map((tx, originalIndex) => ({ ...tx, _index: originalIndex }))
        .filter(tx => tx.type === transactionType && !isMemberSaleTransaction(tx) && normalizeTransactionPayType(tx.payType) !== 'BARANG');

    if (filteredTransactions.length === 0) {
        const emptyText = transactionType === 'PEMASUKAN'
            ? 'Belum ada transaksi masuk.'
            : 'Belum ada transaksi keluar.';

        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center; color:var(--text-muted);">
                    ${emptyText}
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredTransactions.map(tx => {
        const hasStoredBalanceAfter = tx.balanceAfter !== undefined
            && tx.balanceAfter !== null
            && Number.isFinite(Number(tx.balanceAfter));
        const balanceAtThatTime = hasStoredBalanceAfter
            ? Number(tx.balanceAfter)
            : historicalCashSnapshots.get(tx._index);
        const balanceText = balanceAtThatTime === undefined
            ? '-'
            : formatCashBalanceAtThatTime(balanceAtThatTime, tx.payType);
        const balanceClass = Number(balanceAtThatTime) <= 0 ? 'badge-red' : 'badge-green';

        return `
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
                <td><span class="badge ${balanceClass}">${escapeHtml(balanceText)}</span></td>
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
        `;
    }).join('');
}

window.renderIncomingTransactions = function() {
    renderTransactionRows('tbody-transactions-in', 'PEMASUKAN');
};

window.renderOutgoingTransactions = function() {
    renderTransactionRows('tbody-transactions-out', 'PENGELUARAN');
};


function getManualOrderAmount(order) {
    if (Number.isFinite(Number(order?.totalAmount))) {
        return Math.max(0, Number(order.totalAmount) || 0);
    }
    if (Array.isArray(order?.items) && order.items.length) {
        return order.items.reduce((sum, item) => {
            return sum + (Math.max(1, Number(item.qty) || 1) * Math.max(0, Number(item.unitPrice) || 0));
        }, 0);
    }
    return Math.max(0, parseStoredAmount(order?.total));
}

function getManualOrderCashEffectLabel(order) {
    return order?.direction === 'KELOMPOK_TO_BMC'
        ? 'dikurangi dari Red Money'
        : 'ditambahkan ke Red Money';
}

function applyManualOrderRedMoney(order) {
    if (!order?.manualOrder) return { ok: true, applied: false };

    const amount = getManualOrderAmount(order);
    if (amount <= 0) {
        return { ok: true, applied: false };
    }

    const current = Number(window.brangkasState.redMoney) || 0;
    if (order.direction === 'KELOMPOK_TO_BMC') {
        if (current < amount) {
            return {
                ok: false,
                message: `❌ Red Money tidak mencukupi. Saldo saat ini ${formatUSD(current)}, sedangkan total order ${formatUSD(amount)}.`
            };
        }
        window.brangkasState.redMoney = current - amount;
    } else {
        window.brangkasState.redMoney = current + amount;
    }

    return { ok: true, applied: true, amount };
}

function reverseManualOrderRedMoney(order) {
    if (!order?.manualOrder || !order?.moneyApplied) return { ok: true, reversed: false };

    const amount = getManualOrderAmount(order);
    if (amount <= 0) return { ok: true, reversed: false };

    const current = Number(window.brangkasState.redMoney) || 0;
    if (order.direction === 'KELOMPOK_TO_BMC') {
        // Pembelian yang dibatalkan: uang dikembalikan.
        window.brangkasState.redMoney = current + amount;
    } else {
        // Penjualan yang dibatalkan: pemasukan sebelumnya ditarik kembali.
        if (current < amount) {
            return {
                ok: false,
                message: `❌ Status tidak dapat dikembalikan ke PENDING karena Red Money saat ini ${formatUSD(current)}, lebih kecil dari pemasukan order ${formatUSD(amount)}.`
            };
        }
        window.brangkasState.redMoney = current - amount;
    }

    return { ok: true, reversed: true, amount };
}

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
                    <td style="font-weight:600;">
                        ${Array.isArray(order.items) && order.items.length
                            ? order.items.map(item => `<div>${escapeHtml(item.name)} x${item.qty} @ ${formatUSD(item.unitPrice)}</div>`).join('')
                            : escapeHtml(order.item || '-')}
                    </td>
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
    const moneyNote = document.getElementById('edit-order-money-note');
    if (moneyNote) {
        if (order.manualOrder) {
            const amount = getManualOrderAmount(order);
            moneyNote.innerText = order.moneyApplied
                ? `Red Money sudah diproses sebesar ${formatUSD(amount)}. Mengubah status kembali ke PENDING akan membalikkan perubahan saldo.`
                : `Selama status PENDING, Red Money tidak berubah. Saat status menjadi DONE, total ${formatUSD(amount)} akan ${getManualOrderCashEffectLabel(order)}.`;
        } else {
            moneyNote.innerText = 'Perubahan status data lama ini tidak mengubah saldo Red Money.';
        }
    }
    document.getElementById('modal-edit-order').classList.add('active');
};

window.saveOrderHistoryEdit = async function(e) {
    if (e) e.preventDefault();

    const orderIndex = parseInt(document.getElementById('edit-order-index').value, 10);
    const order = (window.orderHistoryData || [])[orderIndex];
    if (!order) return alert('❌ Data order tidak ditemukan.');

    const oldStatus = order.status === 'DONE' ? 'DONE' : 'PENDING';
    const newStatus = String(document.getElementById('edit-order-status').value || 'PENDING').toUpperCase() === 'DONE'
        ? 'DONE'
        : 'PENDING';
    const newNotes = String(document.getElementById('edit-order-notes').value || '').trim() || '-';
    let moneyApplied = Boolean(order.moneyApplied);
    let moneyAppliedAt = order.moneyAppliedAt || null;
    let cashMessage = '';

    if (order.manualOrder) {
        // PENDING/DONE hanya memengaruhi Red Money; stok tetap tidak disentuh.
        if (newStatus === 'DONE' && !moneyApplied) {
            const result = applyManualOrderRedMoney(order);
            if (!result.ok) return alert(result.message);
            if (result.applied) {
                moneyApplied = true;
                moneyAppliedAt = new Date().toISOString();
                cashMessage = ` Red Money ${getManualOrderCashEffectLabel(order)} sebesar ${formatUSD(result.amount)}.`;
            }
        } else if (newStatus === 'PENDING' && moneyApplied) {
            const result = reverseManualOrderRedMoney(order);
            if (!result.ok) return alert(result.message);
            if (result.reversed) {
                moneyApplied = false;
                moneyAppliedAt = null;
                cashMessage = ` Perubahan Red Money sebesar ${formatUSD(result.amount)} telah dibatalkan.`;
            }
        }
    }

    window.orderHistoryData[orderIndex] = {
        ...order,
        vaultType: order.manualOrder ? VAULT_BOSS : order.vaultType,
        payType: order.manualOrder ? 'Red Money' : order.payType,
        status: newStatus,
        notes: newNotes,
        moneyApplied,
        moneyAppliedAt,
        updatedAt: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
    };

    await window.saveData();
    renderAll();
    window.closeModal('modal-edit-order');
    alert(`✅ Status dan keterangan order berhasil diperbarui.${cashMessage}`);
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
                    status: 'DONE',
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
    window.renderLossItemOptions();
    window.toggleLossType();
    window.renderLossRecords();
    window.renderStockFlowDashboard();
    window.renderLowStock();
    window.renderBmcToKelompok();
    window.renderKelompokToBmc();
    window.renderOrderHistory();
    window.renderIncomingTransactions();
    window.renderOutgoingTransactions();
}

// BACKUP KESELAMATAN LOKAL
function getCurrentAppDataSnapshot() {
    return {
        brangkasState: window.brangkasState,
        bmcToKelompokData: window.bmcToKelompokData,
        kelompokToBmcData: window.kelompokToBmcData,
        transactionsData: window.transactionsData,
        orderHistoryData: window.orderHistoryData,
        loanRecordsData: window.loanRecordsData,
        lossRecordsData: window.lossRecordsData,
        stockFlowData: window.stockFlowData
};
}

function saveLocalSafetyBackup(source = 'manual') {
    try {
        localStorage.setItem('bmc_safety_backup_latest', JSON.stringify({
            savedAt: new Date().toISOString(),
            source,
            data: getCurrentAppDataSnapshot()
        }));
    } catch (error) {
        console.warn('⚠️ Backup lokal tidak dapat disimpan:', error);
    }
}


// SYNC FIREBASE
async function saveDataToCloud() {
    if (!isInitialLoadComplete) {
        console.warn("⚠️ Menunda simpan: Data server sedang dalam proses dimuat...");
        return false;
    }
    
    ensureVaultState();
    window.stockFlowData = (Array.isArray(window.stockFlowData) ? window.stockFlowData : []).map(record => ({
        ...record,
        vaultType: normalizeVaultType(record.vaultType || VAULT_BMC)
    }));
    saveLocalSafetyBackup('before-cloud-write');
    console.log("⏳ Menulis data ke Firestore...");
    try {
        await setDoc(docRef, {
            brangkasState: window.brangkasState,
            bmcToKelompokData: window.bmcToKelompokData,
            kelompokToBmcData: window.kelompokToBmcData,
            transactionsData: window.transactionsData,
            orderHistoryData: window.orderHistoryData,
            loanRecordsData: window.loanRecordsData,
            lossRecordsData: window.lossRecordsData,
            stockFlowData: window.stockFlowData,
            lastUpdated: new Date().toISOString()
        }, { merge: true });
        console.log("✅ Update data ke Firestore BERHASIL.");
        return true;
    } catch (error) {
        console.error("❌ Gagal simpan ke Firestore:", error);
        window.showBmcToast('Data gagal disimpan ke Firebase. Periksa koneksi atau Firestore Rules.', 'error', 5000);
        return false;
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
            window._vaultMigrationNeeded = !data.brangkasState?.vaults;
            window.brangkasState = data.brangkasState || window.brangkasState;
            ensureVaultState();
            window.bmcToKelompokData = Array.isArray(data.bmcToKelompokData) ? data.bmcToKelompokData : window.initialBmcToKelompok;
            window.kelompokToBmcData = Array.isArray(data.kelompokToBmcData) ? data.kelompokToBmcData : window.initialKelompokToBmc;
            syncPriceMasterData();
            window.transactionsData = data.transactionsData || [];
            window.orderHistoryData = data.orderHistoryData || [];
            window.loanRecordsData = Array.isArray(data.loanRecordsData) ? data.loanRecordsData : [];
            window.lossRecordsData = Array.isArray(data.lossRecordsData) ? data.lossRecordsData : [];
            window.stockFlowData = (Array.isArray(data.stockFlowData) ? data.stockFlowData : []).map(record => ({
                ...record,
                vaultType: normalizeVaultType(record.vaultType || VAULT_BMC)
            }));
            normalizeOrderHistoryData();
            normalizeLoanRecordsData();
            normalizeLossRecordsData();
            saveLocalSafetyBackup('cloud-snapshot-loaded');
        } else {
            console.log("ℹ️ Dokumen Firestore belum ada, membuat dokumen awal...");
            window.orderHistoryData = [];
            window.loanRecordsData = [];
            window.lossRecordsData = [];
            window.loanDraftItems = [];
            window.stockFlowData = [];
            ensureVaultState();
            syncPriceMasterData();
            normalizeOrderHistoryData();
            normalizeLoanRecordsData();
            normalizeLossRecordsData();
            isInitialLoadComplete = true;
            saveDataToCloud();
        }
        const legacyOrdersMoved = migrateLegacyOrderTransactions();
        const legacyStockMoved = migrateLegacyStockTransactions();
        const vaultMigrationNeeded = Boolean(window._vaultMigrationNeeded);
        window._vaultMigrationNeeded = false;
        isInitialLoadComplete = true;
        renderAll();

        if (legacyOrdersMoved || legacyStockMoved || vaultMigrationNeeded) {
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
    bindAdminRememberControls();
    loadRememberedAdminLogin();

    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => e.preventDefault());
    });
});
