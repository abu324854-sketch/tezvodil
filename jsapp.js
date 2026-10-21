const VODIL_CENTER = { lat: 40.1764, lng: 71.7258 };
let map = null;
let marker = null;
let userCoords = { lat: 40.1764, lng: 71.7258 };
let calculatedDistance = 0;
let calculatedDeliveryFee = 5600;

// Firebase Realtime Database ulanishi
const db = firebase.database();

let settings = JSON.parse(localStorage.getItem('tv_settings')) || { 
    orderRate: 4000, 
    extraRate: 1600,
    devName: "Fattoxov Abdulloh Toxirjon o'g'li",
    devPhoto: "dev.jpg",
    devEducation: "TOSHKENT MENEJMENT VA IQTISODIYOT INSTITUTI FARG'ONA CAMPUSI",
    devPhone: "+998 20 000 57 88",
    devLegalText: "Ushbu dastur kodi, funksionalligi yoki 'TezVodil' brendini ruxsatsiz nusxalash O'zbekiston Respublikasining Mualliflik huquqi to'g'risidagi Qonuniga muvofiq javobgarlikka sabab bo'ladi."
};

let products = [];
let cart = [];
let favorites = JSON.parse(localStorage.getItem('tv_favorites')) || [];
let orders = [];
let usersList = [];
let vendorsList = JSON.parse(localStorage.getItem('tv_vendors')) || [];
let currentUser = JSON.parse(localStorage.getItem('tv_current_user')) || null;
let currentVendor = JSON.parse(localStorage.getItem('tv_current_vendor')) || null;

let currentCategory = 'Barchasi';
let showOnlyFavorites = false;

document.addEventListener('DOMContentLoaded', () => {
    initFirebaseRealtimeSync();
    updateProfileUI();
    updateFavUI();
    updateCartUI();

    bindClick('headerDevBtn', openDeveloperModal);
    bindClick('menuDevBtn', openDeveloperModal);
    bindClick('closeDevModalBtn', closeDeveloperModal);
    bindClick('closeDevModalBottomBtn', closeDeveloperModal);

    bindClick('headerAdminBtn', openAdminModal);
    bindClick('adminLoginCheckBtn', checkAdminLogin);
    bindClick('closeAdminBtn', closeAdminPanel);

    bindClick('navHomeBtn', showHomeSection);
    bindClick('navFavBtn', toggleFavoritesOnly);
    bindClick('navCartBtn', openCartModal);
    bindClick('closeCartBtn', closeCartModal);

    bindClick('navOrdersBtn', openOrdersModal);
    bindClick('closeOrdersBtn', closeOrdersModal);
    bindClick('closeOrdersModalBtn', closeOrdersModal);

    bindClick('navMoreBtn', toggleMoreMenu);
    bindClick('menuVendorBtn', openVendorModal);
    bindClick('closeVendorBtn', closeVendorModal);
    bindClick('vendorLoginBtn', loginOrCreateVendor);
    bindClick('logoutVendorBtn', logoutVendor);

    bindClick('menuProfileBtn', openProfileModal);
    bindClick('closeProfileBtn', closeProfileModal);
    bindClick('saveProfileBtn', saveProfile);
    bindClick('logoutProfileBtn', logoutProfile);

    bindClick('checkoutBarBtn', openCheckoutModal);
    bindClick('closeCheckoutBtn', closeCheckoutModal);
    bindClick('getGpsBtn', getCurrentLocation);
    bindClick('saveSettingsBtn', saveSettings);
    bindClick('micSearchBtn', startVoiceSearch);

    bindClick('admTabBtn-orders', () => switchAdminTab('orders'));
    bindClick('admTabBtn-users', () => switchAdminTab('users'));
    bindClick('admTabBtn-products', () => switchAdminTab('products'));
    bindClick('admTabBtn-settings', () => switchAdminTab('settings'));

    const catContainer = document.getElementById('categoriesContainer');
    if (catContainer) {
        catContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.cat-btn');
            if (btn) {
                document.querySelectorAll('.cat-btn').forEach(b => {
                    b.className = "cat-btn bg-white border border-slate-200 text-slate-600 px-3.5 py-1.5 rounded-xl text-[11px] font-bold shrink-0";
                });
                btn.className = "cat-btn bg-slate-900 text-white px-3.5 py-1.5 rounded-xl text-[11px] font-bold shrink-0 shadow-sm";
                filterCategory(btn.dataset.cat);
            }
        });
    }

    const searchElem = document.getElementById('searchInput');
    if (searchElem) searchElem.addEventListener('keyup', applyFilters);

    const addPForm = document.getElementById('addProductForm');
    if (addPForm) addPForm.addEventListener('submit', addNewProduct);

    const orderForm = document.getElementById('orderSubmitForm');
    if (orderForm) orderForm.addEventListener('submit', submitOrder);

    setupPWAInstall();
});

// FIREBASE ORQALI REAL-TIME MA'LUMOTLARNI TINGLASH
function initFirebaseRealtimeSync() {
    db.ref('products').on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
            products = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        } else {
            const defaultProducts = [
                { name: "Sut 1L (Tabiiy)", store: "Fayz Market", price: 11000, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300", category: "Milliy Taomlar" },
                { name: "Qora Daftar 36v", store: "Bilim Kantselyariya", price: 4000, image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300", category: "Barchasi" }
            ];
            defaultProducts.forEach(p => db.ref('products').push(p));
        }
        applyFilters();
        if (currentVendor) updateVendorDashboard();
    });

    db.ref('orders').on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
            orders = Object.keys(data).map(key => ({ firebaseKey: key, ...data[key] }));
        } else {
            orders = [];
        }
        if (currentVendor) updateVendorDashboard();
        renderAdminOrders();
    });

    db.ref('users').on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
            usersList = Object.values(data);
        }
        renderAdminUsers();
    });
}

function bindClick(id, func) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', func);
}

function showHomeSection() {
    closeAdminPanel();
    document.getElementById('moreMenuDropdown').classList.add('hidden');
    applyFilters();
}

function toggleMoreMenu() {
    document.getElementById('moreMenuDropdown').classList.toggle('hidden');
}

function filterCategory(cat) {
    currentCategory = cat;
    applyFilters();
}

function toggleFavoritesOnly() {
    showOnlyFavorites = !showOnlyFavorites;
    const btn = document.getElementById('navFavBtn');
    if (showOnlyFavorites) {
        btn.classList.add('text-red-500');
    } else {
        btn.classList.remove('text-red-500');
    }
    applyFilters();
}

function applyFilters() {
    const q = (document.getElementById('searchInput')?.value || '').toLowerCase();
    let filtered = products.filter(p => p.name.toLowerCase().includes(q) || (p.store && p.store.toLowerCase().includes(q)));
    if (currentCategory !== 'Barchasi') filtered = filtered.filter(p => p.category === currentCategory);
    if (showOnlyFavorites) filtered = filtered.filter(p => favorites.includes(p.id));
    renderProducts(filtered);
}

function toggleFavorite(id) {
    if (favorites.includes(id)) favorites = favorites.filter(x => x !== id);
    else favorites.push(id);
    localStorage.setItem('tv_favorites', JSON.stringify(favorites));
    updateFavUI();
    applyFilters();
}

function updateFavUI() {
    const fElem = document.getElementById('favCount');
    if (fElem) fElem.innerText = favorites.length;
}

function renderProducts(items) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    if (!items || items.length === 0) {
        grid.innerHTML = `<div class="col-span-2 text-center py-12 text-slate-400 text-xs font-bold">Mahsulotlar topilmadi</div>`;
        return;
    }

    items.forEach(p => {
        const isFav = favorites.includes(p.id);
        grid.innerHTML += `
            <div class="bg-white border border-slate-100 rounded-2xl p-2.5 shadow-sm flex flex-col justify-between space-y-2 hover:shadow-md transition relative">
                <button onclick="toggleFavorite('${p.id}')" class="absolute top-4 right-4 bg-white/80 backdrop-blur-sm w-7 h-7 rounded-full flex items-center justify-center shadow text-xs z-10">
                    <i class="${isFav ? 'fa-solid text-red-500' : 'fa-regular text-slate-400'} fa-heart"></i>
                </button>
                <img src="${p.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300'}" class="w-full h-24 object-cover rounded-xl mb-1">
                <div>
                    <span class="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">${p.store || 'Do\'kon'}</span>
                    <h3 class="font-bold text-xs mt-1 text-slate-800 line-clamp-1">${p.name}</h3>
                </div>
                <div class="mt-2 flex items-center justify-between">
                    <span class="text-xs font-black text-emerald-700">${(p.price || 0).toLocaleString()} so'm</span>
                    <button onclick="addToCart('${p.id}')" class="bg-emerald-600 text-white w-7 h-7 rounded-lg text-xs shadow hover:bg-emerald-700 transition"><i class="fa-solid fa-plus"></i></button>
                </div>
            </div>
        `;
    });
}

function addToCart(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    const ex = cart.find(x => x.id === id);
    if (ex) ex.qty++; else cart.push({ ...p, qty: 1 });
    updateCartUI();
}

function changeQty(idx, delta) {
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
    updateCartUI();
}

function updateCartUI() {
    const badge = document.getElementById('cartBadge');
    const tq = cart.reduce((s, i) => s + i.qty, 0);
    const tp = cart.reduce((s, i) => s + (i.price * i.qty), 0);

    if (badge) {
        if (tq > 0) { badge.innerText = tq; badge.classList.remove('hidden'); }
        else { badge.classList.add('hidden'); }
    }

    const list = document.getElementById('cartItemsList');
    const subtotal = document.getElementById('cartSubtotal');

    if (!list) return;
    if (cart.length === 0) {
        list.innerHTML = `<div class="text-center py-8 text-slate-400 text-xs font-bold">Savatcha bo'sh</div>`;
        if (subtotal) subtotal.innerText = "0 so'm";
        return;
    }

    list.innerHTML = cart.map((item, idx) => `
        <div class="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border text-xs">
            <div>
                <p class="font-black text-slate-800">${item.name}</p>
                <p class="text-emerald-600 font-bold">${item.price.toLocaleString()} so'm x ${item.qty}</p>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="changeQty(${idx}, -1)" class="w-6 h-6 bg-slate-200 rounded-lg font-bold">-</button>
                <span class="font-black">${item.qty}</span>
                <button onclick="changeQty(${idx}, 1)" class="w-6 h-6 bg-slate-200 rounded-lg font-bold">+</button>
            </div>
        </div>
    `).join('');

    if (subtotal) subtotal.innerText = tp.toLocaleString() + " so'm";
}

function openCartModal() { document.getElementById('cartModal').classList.remove('hidden'); }
function closeCartModal() { document.getElementById('cartModal').classList.add('hidden'); }

function openProfileModal() {
    document.getElementById('moreMenuDropdown').classList.add('hidden');
    const modal = document.getElementById('profileModal');
    if (!modal) return;
    modal.classList.remove('hidden');

    const formView = document.getElementById('profileFormView');
    const infoView = document.getElementById('profileInfoView');

    if (currentUser) {
        if (formView) formView.classList.add('hidden');
        if (infoView) infoView.classList.remove('hidden');
        document.getElementById('dispUserName').innerText = currentUser.name;
        document.getElementById('dispUserPhone').innerText = currentUser.phone;
        renderUserOrdersHistory();
    } else {
        if (formView) formView.classList.remove('hidden');
        if (infoView) infoView.classList.add('hidden');
    }
}

function closeProfileModal() { document.getElementById('profileModal').classList.add('hidden'); }

function saveProfile() {
    const name = document.getElementById('userNameInput').value.trim();
    const phone = document.getElementById('userPhoneInput').value.trim();

    if (!name || !phone) return alert("Ismingiz va telefoningizni kiriting!");

    currentUser = { name, phone, joinedDate: new Date().toLocaleDateString() };
    localStorage.setItem('tv_current_user', JSON.stringify(currentUser));

    db.ref('users').orderByChild('phone').equalTo(phone).once('snapshot', snap => {
        if (!snap.exists()) {
            db.ref('users').push(currentUser);
        }
    });

    updateProfileUI();
    openProfileModal();
}

function logoutProfile() {
    currentUser = null;
    localStorage.removeItem('tv_current_user');
    updateProfileUI();
    closeProfileModal();
}

function updateProfileUI() {
    const btnText = document.getElementById('bottomProfileText');
    if (btnText) btnText.innerText = currentUser ? currentUser.name.split(' ')[0] : "Profil";
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
    return parseFloat((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1));
}

function calculateDeliveryFee(km) {
    const base = Math.max(km, 1.0);
    return Math.round((base * settings.orderRate) + (1.0 * settings.extraRate));
}

function initMap() {
    const mapDiv = document.getElementById('map');
    if (!mapDiv || map) return;
    map = L.map('map').setView([VODIL_CENTER.lat, VODIL_CENTER.lng], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    marker = L.marker([VODIL_CENTER.lat, VODIL_CENTER.lng], { draggable: true }).addTo(map);

    marker.on('dragend', (e) => updateLoc(e.target.getLatLng().lat, e.target.getLatLng().lng));
    map.on('click', (e) => {
        if (marker) marker.setLatLng(e.latlng);
        updateLoc(e.latlng.lat, e.latlng.lng);
    });
}

function updateLoc(lat, lng) {
    userCoords = { lat, lng };
    calculatedDistance = calculateDistance(VODIL_CENTER.lat, VODIL_CENTER.lng, lat, lng);
    calculatedDeliveryFee = calculateDeliveryFee(calculatedDistance);

    const dDisp = document.getElementById('distDisplay');
    const pDisp = document.getElementById('deliveryPriceDisplay');
    if (dDisp) dDisp.innerText = `${calculatedDistance} km`;
    if (pDisp) pDisp.innerText = `${calculatedDeliveryFee.toLocaleString()} so'm`;
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            updateLoc(pos.coords.latitude, pos.coords.longitude);
            if (map && marker) {
                map.setView([pos.coords.latitude, pos.coords.longitude], 16);
                marker.setLatLng([pos.coords.latitude, pos.coords.longitude]);
            }
        });
    }
}

function openCheckoutModal() {
    if (!currentUser) {
        alert("Buyurtma berish uchun avval Profil bo'limidan ismingizni kiriting!");
        closeCartModal();
        openProfileModal();
        return;
    }
    closeCartModal();
    document.getElementById('checkoutModal').classList.remove('hidden');
    setTimeout(() => { initMap(); if (map) map.invalidateSize(); }, 250);
}

function closeCheckoutModal() { document.getElementById('checkoutModal').classList.add('hidden'); }

function submitOrder(e) {
    e.preventDefault();
    const address = document.getElementById('custAddress').value;

    const newOrder = {
        id: Date.now(),
        customer: currentUser.name,
        phone: currentUser.phone,
        address: address,
        coords: userCoords,
        distanceKM: calculatedDistance,
        deliveryFee: calculatedDeliveryFee,
        items: [...cart],
        total: cart.reduce((s, i) => s + (i.price * i.qty), 0),
        status: 'Kutilmoqda'
    };

    db.ref('orders').push(newOrder).then(() => {
        alert("Buyurtmangiz muvaffaqiyatli qabul qilindi va kuryerlarga yuborildi!");
        cart = [];
        updateCartUI();
        closeCheckoutModal();
    });
}

function openOrdersModal() {
    document.getElementById('ordersModal').classList.remove('hidden');
    const container = document.getElementById('clientOrdersList');
    if (!currentUser || !container) return;
    const myOrders = orders.filter(o => o.phone === currentUser.phone);
    if (myOrders.length === 0) {
        container.innerHTML = `<p class="text-gray-400 text-xs text-center py-4">Sizda hali buyurtmalar yo'q</p>`;
        return;
    }
    container.innerHTML = myOrders.map(o => `
        <div class="border p-2.5 rounded-xl space-y-1 bg-slate-50 text-xs">
            <div class="flex justify-between font-bold">
                <span>Jami: ${o.total.toLocaleString()} so'm</span>
                <span class="text-emerald-600">${o.status}</span>
            </div>
            <p class="text-slate-500">Manzil: ${o.address}</p>
        </div>
    `).join('');
}

function closeOrdersModal() { document.getElementById('ordersModal').classList.add('hidden'); }

function renderUserOrdersHistory() {
    const container = document.getElementById('userOrdersHistory');
    if (!currentUser || !container) return;
    const myOrders = orders.filter(o => o.phone === currentUser.phone);
    if (myOrders.length === 0) {
        container.innerHTML = `<p class="text-gray-400 text-xs">Buyurtmalar yo'q</p>`;
        return;
    }
    container.innerHTML = myOrders.map(o => `
        <div class="border p-2 rounded-lg bg-white text-[11px]">
            <div class="flex justify-between font-bold">
                <span>${o.total.toLocaleString()} so'm</span>
                <span class="text-emerald-600">${o.status}</span>
            </div>
        </div>
    `).join('');
}

function openVendorModal() {
    document.getElementById('moreMenuDropdown').classList.add('hidden');
    document.getElementById('vendorModal').classList.remove('hidden');
    if (currentVendor) {
        document.getElementById('vendorLoginForm').classList.add('hidden');
        document.getElementById('vendorDashboard').classList.remove('hidden');
        updateVendorDashboard();
    }
}

function closeVendorModal() { document.getElementById('vendorModal').classList.add('hidden'); }

function loginOrCreateVendor() {
    const storeName = document.getElementById('vendorStoreNameInput').value.trim();
    const pwd = document.getElementById('vendorPasswordInput').value.trim();
    if (!storeName || !pwd) return alert("Ma'lumotlarni to'liq kiriting!");

    currentVendor = { storeName, password: pwd };
    localStorage.setItem('tv_current_vendor', JSON.stringify(currentVendor));

    document.getElementById('vendorLoginForm').classList.add('hidden');
    document.getElementById('vendorDashboard').classList.remove('hidden');
    updateVendorDashboard();
}

function logoutVendor() {
    currentVendor = null;
    localStorage.removeItem('tv_current_vendor');
    document.getElementById('vendorLoginForm').classList.remove('hidden');
    document.getElementById('vendorDashboard').classList.add('hidden');
}

function updateVendorDashboard() {
    if (!currentVendor) return;
    const myProducts = products.filter(p => p.store === currentVendor.storeName);
    let totalSales = 0;
    let completedOrdersCount = 0;
    orders.forEach(o => {
        if (o.items) {
            o.items.forEach(item => {
                if (item.store === currentVendor.storeName) {
                    totalSales += (item.price * item.qty);
                    completedOrdersCount += item.qty;
                }
            });
        }
    });
    document.getElementById('vDashTitle').innerText = currentVendor.storeName;
    document.getElementById('vSalesStat').innerText = `${totalSales.toLocaleString()} so'm`;
    document.getElementById('vOrdersStat').innerText = `${completedOrdersCount} ta`;
    document.getElementById('vProductsStat').innerText = `${myProducts.length} ta`;
    renderVendorProducts(myProducts);
}

function renderVendorProducts(myProducts) {
    const container = document.getElementById('vendorProductsList');
    if (!container) return;
    if (myProducts.length === 0) {
        container.innerHTML = `<p class="text-xs text-slate-400 text-center py-3">Hali mahsulot qo'shmagansiz</p>`;
        return;
    }
    container.innerHTML = myProducts.map(p => `
        <div class="bg-white p-2 rounded-xl border border-slate-200 text-xs flex justify-between items-center shadow-sm">
            <div class="flex items-center gap-2">
                <img src="${p.image}" class="w-10 h-10 object-cover rounded-lg">
                <div>
                    <p class="font-bold text-slate-800">${p.name}</p>
                    <p class="text-emerald-600 font-bold">${p.price.toLocaleString()} so'm</p>
                </div>
            </div>
            <button onclick="deleteVendorProduct('${p.id}')" class="text-red-500 hover:text-red-700 font-bold text-xs p-1">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function deleteVendorProduct(id) {
    if (confirm("Ushbu mahsulotni o'chirmoqchimisiz?")) {
        db.ref('products/' + id).remove().then(() => {
            renderProducts(products);
            updateVendorDashboard();
        });
    }
}

function addNewProduct(e) {
    e.preventDefault();
    const np = {
        name: document.getElementById('vName').value,
        price: parseInt(document.getElementById('vPrice').value),
        store: currentVendor ? currentVendor.storeName : "Do'kon",
        image: document.getElementById('vImage').value || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300",
        category: "Barchasi"
    };

    db.ref('products').push(np).then(() => {
        alert("Mahsulot muvaffaqiyatli qo'shildi!");
        document.getElementById('addProductForm').reset();
        updateVendorDashboard();
    });
}

function openAdminModal() { document.getElementById('adminModal').classList.remove('hidden'); }

function checkAdminLogin() {
    if (document.getElementById('adminPasswordInput').value.trim() === 'tezvodil2026') {
        document.getElementById('adminLoginForm').classList.add('hidden');
        document.getElementById('adminDashboard').classList.remove('hidden');
        switchAdminTab('orders');
        renderAdminOrders();
        renderAdminUsers();
        renderAdminProducts();
    } else alert("Parol noto'g'ri!");
}

function closeAdminPanel() { document.getElementById('adminModal').classList.add('hidden'); }

function switchAdminTab(tab) {
    ['orders', 'users', 'products', 'settings'].forEach(t => {
        const content = document.getElementById(`admContent-${t}`);
        const btn = document.getElementById(`admTabBtn-${t}`);
        if (content) content.classList.add('hidden');
        if (btn) btn.className = "py-2 rounded-xl hover:bg-white transition";
    });
    const selContent = document.getElementById(`admContent-${tab}`);
    const selBtn = document.getElementById(`admTabBtn-${tab}`);
    if (selContent) selContent.classList.remove('hidden');
    if (selBtn) selBtn.className = "py-2 rounded-xl bg-emerald-600 text-white shadow transition";
}

function renderAdminOrders() {
    const container = document.getElementById('adminOrdersList');
    if (!container) return;
    if (orders.length === 0) {
        container.innerHTML = `<p class="text-gray-400 text-center py-4 text-xs">Buyurtmalar yo'q</p>`;
        return;
    }
    container.innerHTML = orders.map(o => `
        <div class="bg-white p-3 rounded-2xl border shadow-sm space-y-1 text-xs">
            <div class="flex justify-between font-bold border-b pb-1">
                <span>👤 ${o.customer} (${o.phone})</span>
                <span class="text-emerald-600">${o.status}</span>
            </div>
            <p>📍 Manzil: ${o.address} (${o.distanceKM} km)</p>
            <p>💰 Summa: ${o.total.toLocaleString()} so'm | Dostavka: ${o.deliveryFee} so'm</p>
        </div>
    `).join('');
}

function renderAdminUsers() {
    const container = document.getElementById('adminUsersList');
    const uCount = document.getElementById('userCount');
    if (uCount) uCount.innerText = usersList.length;
    if (!container) return;
    container.innerHTML = usersList.map((u, i) => `
        <div class="bg-white p-2.5 rounded-xl border text-xs flex justify-between items-center">
            <div>
                <p class="font-bold">${i + 1}. ${u.name}</p>
                <p class="text-slate-500">${u.phone}</p>
            </div>
            <span class="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">Mijoz</span>
        </div>
    `).join('');
}

function renderAdminProducts() {
    const container = document.getElementById('adminProductsList');
    if (!container) return;
    container.innerHTML = products.map(p => `
        <div class="bg-white p-2 rounded-xl border text-xs flex justify-between items-center">
            <div>
                <p class="font-bold">${p.name}</p>
                <p class="text-slate-500">${p.store} - ${p.price.toLocaleString()} so'm</p>
            </div>
            <button onclick="deleteProduct('${p.id}')" class="text-red-500 text-xs font-bold"><i class="fa-solid fa-trash"></i></button>
        </div>
    `).join('');
}

function deleteProduct(id) {
    db.ref('products/' + id).remove().then(() => {
        renderProducts(products);
        renderAdminProducts();
    });
}

function saveSettings() {
    settings.orderRate = parseInt(document.getElementById('setOrderRate').value) || 4000;
    settings.extraRate = parseInt(document.getElementById('setExtraRate').value) || 1600;
    alert("Sozlamalar saqlandi!");
}

function openDeveloperModal() {
    document.getElementById('developerModal').classList.remove('hidden');
    document.getElementById('modalDevName').innerText = settings.devName;
    document.getElementById('modalDevEducation').innerText = settings.devEducation;
    document.getElementById('modalDevPhone').innerText = settings.devPhone;
    document.getElementById('modalDevLegalText').innerText = settings.devLegalText;
}

function closeDeveloperModal() { document.getElementById('developerModal').classList.add('hidden'); }

function startVoiceSearch() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return alert("Ovozli qidiruv qo'llab-quvvatlanmaydi!");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'uz-UZ';
    recognition.onresult = function(e) {
        document.getElementById('searchInput').value = e.results[0][0].transcript;
        applyFilters();
    };
    recognition.start();
}

let deferredPrompt = null;
function setupPWAInstall() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        const btn = document.getElementById('installAppBtn');
        if (btn) btn.classList.remove('hidden');
    });

    bindClick('installAppBtn', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            await deferredPrompt.userChoice;
            deferredPrompt = null;
            document.getElementById('installAppBtn').classList.add('hidden');
        }
    });
}
