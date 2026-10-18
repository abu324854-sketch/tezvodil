const VODIL_CENTER = { lat: 40.1764, lng: 71.7258 };
let map, marker;
let userCoords = { lat: 40.1764, lng: 71.7258 };
let calculatedDistance = 0;
let calculatedDeliveryFee = 5600;

// TELEGRAM BOT SOZLAMASI (Ixtiyoriy)
const TELEGRAM_BOT_TOKEN = "SIZNING_BOT_TOKENINGIZ";
const TELEGRAM_CHAT_ID = "SIZNING_CHAT_ID";

let products = JSON.parse(localStorage.getItem('tv_products')) || [
    { id: 1, name: "Sut 1L (Tabiiy)", store: "Fayz Market", price: 11000, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300" },
    { id: 2, name: "Qora Daftar 36v", store: "Bilim Kantselyariya", price: 4000, image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300" }
];
let cart = [];
let orders = JSON.parse(localStorage.getItem('tv_orders')) || [];

document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('productsGrid')) renderProducts(products);
    if(document.getElementById('clientOrdersList')) renderClientOrders();
    if(document.getElementById('courierOrdersList')) renderCourierOrders();
});

function switchMode(mode) {
    document.getElementById('section-client').classList.add('hidden');
    document.getElementById('section-vendor').classList.add('hidden');
    document.getElementById('btn-client').className = "flex-1 py-2.5 rounded-xl text-center hover:bg-gray-50 transition text-gray-500 font-bold text-xs";
    document.getElementById('btn-vendor').className = "flex-1 py-2.5 rounded-xl text-center hover:bg-gray-50 transition text-gray-500 font-bold text-xs";

    if(mode === 'client') {
        document.getElementById('section-client').classList.remove('hidden');
        document.getElementById('btn-client').className = "flex-1 py-2.5 rounded-xl text-center bg-emerald-600 text-white shadow font-bold text-xs";
    } else {
        document.getElementById('section-vendor').classList.remove('hidden');
        document.getElementById('btn-vendor').className = "flex-1 py-2.5 rounded-xl text-center bg-emerald-600 text-white shadow font-bold text-xs";
    }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
    return parseFloat((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1));
}

// TARIF: Zakas qilingan km uchun 4000 so'm, Zakasdan tashqari km uchun 1600 so'm
function calculateDeliveryFee(storeToCustomerKm) {
    const ORDER_RATE = 4000;
    const EXTRA_RATE = 1600;
    const baseDistance = Math.max(storeToCustomerKm, 1.0);
    return Math.round((baseDistance * ORDER_RATE) + (1.0 * EXTRA_RATE));
}

function initMap() {
    if (map) return;
    map = L.map('map').setView([VODIL_CENTER.lat, VODIL_CENTER.lng], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    marker = L.marker([VODIL_CENTER.lat, VODIL_CENTER.lng], { draggable: true }).addTo(map);

    marker.on('dragend', (e) => updateLoc(e.target.getLatLng().lat, e.target.getLatLng().lng));
    map.on('click', (e) => { marker.setLatLng(e.latlng); updateLoc(e.latlng.lat, e.latlng.lng); });
}

function updateLoc(lat, lng) {
    userCoords = { lat, lng };
    calculatedDistance = calculateDistance(VODIL_CENTER.lat, VODIL_CENTER.lng, lat, lng);
    calculatedDeliveryFee = calculateDeliveryFee(calculatedDistance);
    document.getElementById('distDisplay').innerText = `${calculatedDistance} km`;
    document.getElementById('deliveryPriceDisplay').innerText = `${calculatedDeliveryFee.toLocaleString()} so'm`;
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            map.setView([pos.coords.latitude, pos.coords.longitude], 16);
            marker.setLatLng([pos.coords.latitude, pos.coords.longitude]);
            updateLoc(pos.coords.latitude, pos.coords.longitude);
        });
    }
}

function openCheckoutModal() {
    document.getElementById('checkoutModal').classList.remove('hidden');
    setTimeout(() => { initMap(); map.invalidateSize(); }, 200);
}
function closeCheckoutModal() { document.getElementById('checkoutModal').classList.add('hidden'); }

function submitOrder(e) {
    e.preventDefault();
    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const address = document.getElementById('custAddress').value;

    const newOrder = {
        id: Date.now(),
        customer: name,
        phone: phone,
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

    sendTelegramNotification(newOrder);

    alert("Buyurtmangiz muvaffaqiyatli qabul qilindi!");
    cart = [];
    updateCartUI();
    closeCheckoutModal();
    if(document.getElementById('clientOrdersList')) renderClientOrders();
}

function sendTelegramNotification(order) {
    if (TELEGRAM_BOT_TOKEN === "SIZNING_BOT_TOKENINGIZ") return;
    const text = `🚀 Yangi Buyurtma #TEZVODIL\n👤 Mijoz: ${order.customer} (${order.phone})\n📍 Manzil: ${order.address}\n💰 Jami: ${order.total.toLocaleString()} so'm\n🛵 Dostavka: ${order.deliveryFee} so'm (${order.distanceKM} km)`;
    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: text })
    }).catch(err => console.log(err));
}

function renderClientOrders() {
    const container = document.getElementById('clientOrdersList');
    if(orders.length === 0) return;
    container.innerHTML = '';
    orders.forEach(o => {
        container.innerHTML += `
            <div class="border p-3 rounded-xl space-y-2">
                <div class="flex justify-between font-bold">
                    <span>Jami: ${o.total.toLocaleString()} so'm</span>
                    <span class="text-emerald-600">${o.status}</span>
                </div>
                <div class="flex justify-between text-[10px] text-gray-500 pt-1 border-t">
                    <span class="${o.status==='Kutilmoqda'?'text-emerald-600 font-bold':''}">1. Qabul qilindi</span>
                    <span class="${o.status==='Tayyorlanmoqda'?'text-emerald-600 font-bold':''}">2. Tayyorlanmoqda</span>
                    <span class="${o.status==="Yo'lda"?'text-emerald-600 font-bold':''}">3. Yo'lda</span>
                    <span class="${o.status==='Yetkazildi'?'text-emerald-600 font-bold':''}">4. Yetkazildi</span>
                </div>
            </div>
        `;
    });
}

function renderCourierOrders() {
    const container = document.getElementById('courierOrdersList');
    if(!container) return;
    container.innerHTML = '';
    orders.forEach(o => {
        const mapUrl = `https://www.google.com/maps?q=${o.coords.lat},${o.coords.lng}`;
        container.innerHTML += `
            <div class="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-2 text-xs">
                <div class="flex justify-between items-center border-b border-slate-700 pb-2">
                    <span class="text-emerald-400 font-bold">+${o.deliveryFee.toLocaleString()} so'm (${o.distanceKM} km)</span>
                    <span class="text-amber-400 font-bold">${o.status}</span>
                </div>
                <p><strong>👤 Mijoz:</strong> ${o.customer} (${o.phone})</p>
                <p><strong>📍 Mo'ljal:</strong> ${o.address}</p>
                <p><strong>💰 Mahsulotlar:</strong> ${o.total.toLocaleString()} so'm</p>
                
                <div class="flex gap-2 pt-2">
                    <a href="${mapUrl}" target="_blank" class="bg-emerald-600/30 text-emerald-400 border border-emerald-500/50 py-2 px-3 rounded-xl font-bold flex-1 text-center">
                        📍 Xaritada ko'rish
                    </a>
                    <button onclick="updateOrderStatus(${o.id}, 'Yo\\'lda')" class="bg-blue-600 py-2 px-3 rounded-xl font-bold flex-1">Yo'ldaman</button>
                    <button onclick="updateOrderStatus(${o.id}, 'Yetkazildi')" class="bg-emerald-600 py-2 px-3 rounded-xl font-bold flex-1">Yetkazdim</button>
                </div>
            </div>
        `;
    });
}

function updateOrderStatus(id, status) {
    const o = orders.find(x => x.id === id);
    if(o) {
        o.status = status;
        localStorage.setItem('tv_orders', JSON.stringify(orders));
        alert("Status yangilandi: " + status);
        location.reload();
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
    alert("Mahsulot do'konga qo'shildi!");
    document.getElementById('vName').value = '';
    document.getElementById('vPrice').value = '';
    switchMode('client');
    renderProducts(products);
}

function renderProducts(items) {
    const grid = document.getElementById('productsGrid');
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
    const ex = cart.find(x => x.id === id);
    if(ex) ex.qty++; else cart.push({...p, qty: 1});
    updateCartUI();
}

function updateCartUI() {
    const bar = document.getElementById('cartBar');
    const cnt = document.getElementById('cartCount');
    const tot = document.getElementById('cartTotal');
    const tq = cart.reduce((s,i)=>s+i.qty,0);
    const tp = cart.reduce((s,i)=>s+(i.price*i.qty),0);
    if(tq > 0) {
        bar.classList.remove('hidden');
        cnt.innerText = tq;
        tot.innerText = `${tp.toLocaleString()} so'm`;
    } else {
        bar.classList.add('hidden');
    }
}

function searchProducts() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    renderProducts(products.filter(p => p.name.toLowerCase().includes(q) || p.store.toLowerCase().includes(q)));
}
