const VODIL_CENTER = { lat: 40.1764, lng: 71.7258 };
let map = null;
let marker = null;
let userCoords = { lat: 40.1764, lng: 71.7258 };
let calculatedDistance = 0;
let calculatedDeliveryFee = 5600;

let settings = JSON.parse(localStorage.getItem('tv_settings')) || { orderRate: 4000, extraRate: 1600 };
let products = JSON.parse(localStorage.getItem('tv_products')) || [
    { id: 1, name: "Sut 1L (Tabiiy)", store: "Fayz Market", price: 11000, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300" },
    { id: 2, name: "Qora Daftar 36v", store: "Bilim Kantselyariya", price: 4000, image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300" }
];
let cart = [];
let orders = JSON.parse(localStorage.getItem('tv_orders')) || [];
let usersList = JSON.parse(localStorage.getItem('tv_users')) || [];
let currentUser = JSON.parse(localStorage.getItem('tv_current_user')) || null;

// HODISALARNI XATOSIZ BIRIKTIRISH
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('productsGrid')) renderProducts(products);
    updateProfileUI();

    // Event Listeners (To'g'ridan-to'g'ri biriktirish)
    bindClick('profileBtn', openProfileModal);
    bindClick('closeProfileBtn', closeProfileModal);
    bindClick('saveProfileBtn', saveProfile);
    bindClick('logoutProfileBtn', logoutProfile);
    bindClick('directAdminBtn', openAdminPanel);
    bindClick('openAdminFromInfoBtn', openAdminPanel);
    bindClick('closeAdminBtn', closeAdminPanel);

    bindClick('checkoutBarBtn', openCheckoutModal);
    bindClick('closeCheckoutBtn', closeCheckoutModal);
    bindClick('getGpsBtn', getCurrentLocation);
    bindClick('saveSettingsBtn', saveSettings);

    bindClick('admTabBtn-orders', () => switchAdminTab('orders'));
    bindClick('admTabBtn-users', () => switchAdminTab('users'));
    bindClick('admTabBtn-products', () => switchAdminTab('products'));
    bindClick('admTabBtn-settings', () => switchAdminTab('settings'));

    const searchElem = document.getElementById('searchInput');
    if (searchElem) searchElem.addEventListener('keyup', searchProducts);

    const addPForm = document.getElementById('addProductForm');
    if (addPForm) addPForm.addEventListener('submit', addNewProduct);

    const orderForm = document.getElementById('orderSubmitForm');
    if (orderForm) orderForm.addEventListener('submit', submitOrder);
});

function bindClick(id, func) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', func);
}

// PROFIL
function openProfileModal() {
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

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) modal.classList.add('hidden');
}

function saveProfile() {
    const name = document.getElementById('userNameInput').value.trim();
    const phone = document.getElementById('userPhoneInput').value.trim();

    if (!name || !phone) {
        alert("Iltimos, ismingiz va telefon raqamingizni kiriting!");
        return;
    }

    currentUser = { name, phone, joinedDate: new Date().toLocaleDateString() };
    localStorage.setItem('tv_current_user', JSON.stringify(currentUser));

    if (!usersList.some(u => u.phone === phone)) {
        usersList.push(currentUser);
        localStorage.setItem('tv_users', JSON.stringify(usersList));
    }

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
    const btnText = document.getElementById('profileBtnText');
    if (btnText) {
        btnText.innerText = currentUser ? currentUser.name.split(' ')[0] : "Profil";
    }
}

// ADMIN PANEL
function openAdminPanel() {
    closeProfileModal();
    const secClient = document.getElementById('section-client');
    const secAdmin = document.getElementById('section-admin');
    if (secClient) secClient.classList.add('hidden');
    if (secAdmin) secAdmin.classList.remove('hidden');
    renderAdminOrders();
    renderAdminUsers();
}

function closeAdminPanel() {
    const secClient = document.getElementById('section-client');
    const secAdmin = document.getElementById('section-admin');
    if (secAdmin) secAdmin.classList.add('hidden');
    if (secClient) secClient.classList.remove('hidden');
}

function switchAdminTab(tab) {
    ['orders', 'users', 'products', 'settings'].forEach(t => {
        const content = document.getElementById(`admContent-${t}`);
        const btn = document.getElementById(`admTabBtn-${t}`);
        if (content) content.classList.add('hidden');
        if (btn) btn.className = "flex-1 py-2 rounded-xl hover:bg-gray-100";
    });
    const selContent = document.getElementById(`admContent-${tab}`);
    const selBtn = document.getElementById(`admTabBtn-${tab}`);
    if (selContent) selContent.classList.remove('hidden');
    if (selBtn) selBtn.className = "flex-1 py-2 rounded-xl bg-emerald-600 text-white shadow";
}

function renderAdminUsers() {
    const container = document.getElementById('adminUsersList');
    const userCountElem = document.getElementById('userCount');
    if (userCountElem) userCountElem.innerText = usersList.length;
    if (!container) return;

    if (usersList.length === 0) {
        container.innerHTML = `<p class="text-gray-400 text-center py-4">Hozircha ro'yxatdan o'tgan mijozlar yo'q</p>`;
        return;
    }

    container.innerHTML = '';
    usersList.forEach((u, index) => {
        container.innerHTML += `
            <div class="bg-white p-3 rounded-2xl border shadow-sm flex justify-between items-center text-xs">
                <div>
                    <p class="font-bold text-gray-800">${index + 1}. ${u.name}</p>
                    <p class="text-gray-500">${u.phone} — Qo'shilgan: ${u.joinedDate || 'Yaqinda'}</p>
                </div>
                <span class="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-lg font-bold">Faol mijoz</span>
            </div>
        `;
    });
}

function saveSettings() {
    settings.orderRate = parseInt(document.getElementById('setOrderRate').value) || 4000;
    settings.extraRate = parseInt(document.getElementById('setExtraRate').value) || 1600;
    localStorage.setItem('tv_settings', JSON.stringify(settings));
    alert("Sozlamalar saqlandi!");
}

// MAP VA BUYURTMA
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
    return parseFloat((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1));
}

function calculateDeliveryFee(storeToCustomerKm) {
    const baseDistance = Math.max(storeToCustomerKm, 1.0);
    return Math.round((baseDistance * settings.orderRate) + (1.0 * settings.extraRate));
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
        openProfileModal();
        return;
    }
    const modal = document.getElementById('checkoutModal');
    if (modal) modal.classList.remove('hidden');
    setTimeout(() => { initMap(); if (map) map.invalidateSize(); }, 250);
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) modal.classList.add('hidden');
}

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

    orders.push(newOrder);
    localStorage.setItem('tv_orders', JSON.stringify(orders));

    alert("Buyurtmangiz muvaffaqiyatli qabul qilindi!");
    cart = [];
    updateCartUI();
    closeCheckoutModal();
}

function renderUserOrdersHistory() {
    const container = document.getElementById('userOrdersHistory');
    if (!currentUser || !container) return;
    const myOrders = orders.filter(o => o.phone === currentUser.phone);
    if (myOrders.length === 0) {
        container.innerHTML = `<p class="text-gray-400">Sizda hali buyurtmalar yo'q</p>`;
        return;
    }
    container.innerHTML = '';
    myOrders.forEach(o => {
        container.innerHTML += `
            <div class="border p-2.5 rounded-xl space-y-1 bg-gray-50 text-[11px]">
                <div class="flex justify-between font-bold">
                    <span>Jami: ${o.total.toLocaleString()} so'm</span>
                    <span class="text-emerald-600">${o.status}</span>
                </div>
                <p class="text-gray-500">Manzil: ${o.address}</p>
            </div>
        `;
    });
}

function renderAdminOrders() {
    const container = document.getElementById('adminOrdersList');
    if (!container) return;
    if (orders.length === 0) {
        container.innerHTML = `<p class="text-gray-400 text-center py-4">Hozircha buyurtmalar yo'q</p>`;
        return;
    }
    container.innerHTML = '';
    orders.forEach(o => {
        container.innerHTML += `
            <div class="bg-white p-3 rounded-2xl border shadow-sm space-y-1 text-xs">
                <div class="flex justify-between font-bold border-b pb-1">
                    <span>👤 ${o.customer} (${o.phone})</span>
                    <span class="text-emerald-600">${o.status}</span>
                </div>
                <p>📍 Manzil: ${o.address} (${o.distanceKM} km)</p>
                <p>💰 Summa: ${o.total.toLocaleString()} so'm | Dostavka: ${o.deliveryFee} so'm</p>
            </div>
        `;
    });
}

function renderProducts(items) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    items.forEach(p => {
        grid.innerHTML += `
            <div class="bg-white border rounded-2xl p-2.5 shadow-sm flex flex-col justify-between">
                <div>
                    <img src="${p.image}" class="w-full h-24 object-cover rounded-xl mb-2">
                    <span class="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">${p.store}</span>
                    <h3 class="font-bold text-xs mt-1">${p.name}</h3>
                </div>
                <div class="mt-2 flex items-center justify-between">
                    <span class="text-xs font-black text-emerald-700">${p.price.toLocaleString()} so'm</span>
                    <button onclick="addToCart(${p.id})" class="bg-emerald-600 text-white w-7 h-7 rounded-lg text-xs"><i class="fa-solid fa-plus"></i></button>
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

function updateCartUI() {
    const bar = document.getElementById('cartBar');
    const cnt = document.getElementById('cartCount');
    const tot = document.getElementById('cartTotal');
    if (!bar) return;
    const tq = cart.reduce((s, i) => s + i.qty, 0);
    const tp = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    if (tq > 0) {
        bar.classList.remove('hidden');
        if (cnt) cnt.innerText = tq;
        if (tot) tot.innerText = `${tp.toLocaleString()} so'm`;
    } else {
        bar.classList.add('hidden');
    }
}

function addNewProduct(e) {
    e.preventDefault();
    const np = {
        id: Date.now(),
        name: document.getElementById('vName').value,
        price: parseInt(document.getElementById('vPrice').value),
        store: document.getElementById('vStore').value,
        image: document.getElementById('vImage').value
    };
    products.push(np);
    localStorage.setItem('tv_products', JSON.stringify(products));
    alert("Mahsulot qo'shildi!");
    renderProducts(products);
}

function searchProducts() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    renderProducts(products.filter(p => p.name.toLowerCase().includes(q) || p.store.toLowerCase().includes(q)));
}
