<!DOCTYPE html>
<html lang="uz" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title id="pageTitle">TezVodil - Onlayn Do'kon</title>
    
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#059669">

    <link rel="icon" type="image/jpeg" href="dev.jpg">
    <link rel="apple-touch-icon" href="dev.jpg">

    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

    <style>
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        body { padding-bottom: env(safe-area-inset-bottom); }
    </style>
</head>
<body class="bg-slate-100 text-slate-800 antialiased min-h-full flex flex-col justify-between overflow-x-hidden selection:bg-emerald-500 selection:text-white">

    <!-- HEADER -->
    <header class="bg-emerald-600 text-white sticky top-0 z-40 shadow-md backdrop-blur-md bg-emerald-600/95 w-full">
        <div class="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center gap-2.5 cursor-pointer" id="headerDevBtn">
                <div class="bg-white/20 p-2 rounded-2xl backdrop-blur-md shadow-inner">
                    <i class="fa-solid fa-bolt text-yellow-300 text-lg animate-pulse"></i>
                </div>
                <div>
                    <h1 id="appHeaderTitle" class="text-base font-black tracking-wide leading-tight">TezVodil</h1>
                    <p id="appHeaderSub" class="text-[10px] text-emerald-100 font-medium">Vodil bo'ylab tezkor dostavka</p>
                </div>
            </div>
            
            <div class="flex items-center gap-2">
                <button id="installAppBtn" class="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-extrabold text-xs px-2.5 py-1.5 rounded-xl shadow flex items-center gap-1 border border-emerald-400/40 hidden">
                    <i class="fa-solid fa-download text-yellow-300"></i> <span>O'rnatish</span>
                </button>

                <button id="headerAdminBtn" class="bg-slate-900 hover:bg-slate-800 active:scale-95 text-amber-400 font-extrabold text-xs px-3 py-1.5 rounded-xl shadow flex items-center gap-1.5 border border-amber-400/30">
                    <i class="fa-solid fa-shield-halved"></i> <span>Admin</span>
                </button>
            </div>
        </div>
    </header>

    <!-- ASOSIY MAZMUN -->
    <main class="max-w-md mx-auto w-full px-4 py-3 space-y-3 flex-1 pb-24">
        
        <!-- QIDIRUV VA OVOZLI QIDIRUV -->
        <div class="relative w-full">
            <input type="text" id="searchInput" placeholder="Taom yoki mahsulotlarni qidirish..." class="w-full bg-white border border-slate-200 pl-9 pr-9 py-2.5 rounded-2xl text-xs font-semibold shadow-sm focus:outline-none focus:border-emerald-500 text-slate-700">
            <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-slate-400 text-xs"></i>
            <button id="micSearchBtn" class="absolute right-3.5 top-2.5 text-slate-400 hover:text-emerald-600">
                <i class="fa-solid fa-microphone text-xs" id="micIcon"></i>
            </button>
        </div>

        <!-- KATEGORIYALAR -->
        <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar w-full" id="categoriesContainer">
            <button data-cat="Barchasi" class="cat-btn bg-slate-900 text-white px-3.5 py-1.5 rounded-xl text-[11px] font-bold shrink-0 shadow-sm">Barchasi</button>
            <button data-cat="Milliy Taomlar" class="cat-btn bg-white border border-slate-200 text-slate-600 px-3.5 py-1.5 rounded-xl text-[11px] font-bold shrink-0">Milliy Taomlar</button>
            <button data-cat="Fast Food" class="cat-btn bg-white border border-slate-200 text-slate-600 px-3.5 py-1.5 rounded-xl text-[11px] font-bold shrink-0">Fast Food</button>
            <button data-cat="Pitsa & Burger" class="cat-btn bg-white border border-slate-200 text-slate-600 px-3.5 py-1.5 rounded-xl text-[11px] font-bold shrink-0">Pitsa & Burger</button>
        </div>

        <!-- KATALOG -->
        <div id="productsGrid" class="grid grid-cols-2 gap-2.5 w-full"></div>
    </main>

    <!-- PASTKI NAVIGATSIYA PANEL -->
    <div class="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-2 shadow-lg">
        <nav class="max-w-md mx-auto flex justify-around items-center">
            
            <button id="navHomeBtn" class="text-emerald-600 text-center text-[10px] font-extrabold flex flex-col items-center">
                <i class="fa-solid fa-house text-base mb-0.5"></i>
                <span>Asosiy</span>
            </button>

            <button id="navFavBtn" class="text-slate-400 hover:text-emerald-600 text-center text-[10px] font-bold flex flex-col items-center relative">
                <i class="fa-solid fa-heart text-base mb-0.5"></i>
                <span>Sevimli</span>
                <span id="favCount" class="absolute -top-1 right-1 bg-red-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">0</span>
            </button>

            <button id="navCartBtn" class="text-slate-400 hover:text-emerald-600 text-center text-[10px] font-bold flex flex-col items-center relative">
                <i class="fa-solid fa-shopping-bag text-base mb-0.5"></i>
                <span>Savatcha</span>
                <span id="cartBadge" class="absolute -top-1 right-1 bg-emerald-600 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center hidden">0</span>
            </button>

            <button id="navOrdersBtn" class="text-slate-400 hover:text-emerald-600 text-center text-[10px] font-bold flex flex-col items-center">
                <i class="fa-solid fa-receipt text-base mb-0.5"></i>
                <span>Tarix</span>
            </button>

            <div class="relative">
                <button id="navMoreBtn" class="text-slate-400 hover:text-emerald-600 text-center text-[10px] font-bold flex flex-col items-center">
                    <i class="fa-solid fa-border-all text-base mb-0.5"></i>
                    <span>Rejimlar</span>
                </button>
                <div id="moreMenuDropdown" class="absolute bottom-12 right-0 bg-slate-900 text-white rounded-2xl p-2 w-40 shadow-2xl space-y-1 hidden border border-slate-800">
                    <button id="menuVendorBtn" class="w-full text-left px-3 py-2 text-xs font-bold hover:bg-slate-800 rounded-xl flex items-center gap-2">
                        <i class="fa-solid fa-store text-amber-400"></i> Do'kon Rejimi
                    </button>
                    <button id="menuProfileBtn" class="w-full text-left px-3 py-2 text-xs font-bold hover:bg-slate-800 rounded-xl flex items-center gap-2 border-t border-slate-800 pt-2">
                        <i class="fa-solid fa-user text-blue-400"></i> Profilim
                    </button>
                    <button id="menuDevBtn" class="w-full text-left px-3 py-2 text-xs font-bold hover:bg-slate-800 rounded-xl flex items-center gap-2">
                        <i class="fa-solid fa-circle-info text-emerald-400"></i> Ilova haqida
                    </button>
                </div>
            </div>

        </nav>
    </div>

    <!-- SAVATCHA MODALI -->
    <div id="cartModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center hidden p-4">
        <div class="bg-white w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div class="flex justify-between items-center border-b pb-3">
                <h3 class="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                    <i class="fa-solid fa-shopping-bag text-emerald-600"></i> Savatcha
                </h3>
                <button id="closeCartBtn" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark text-lg"></i></button>
            </div>
            <div id="cartItemsList" class="space-y-2.5 overflow-y-auto flex-1 pr-1"></div>
            <div class="border-t pt-3 space-y-2">
                <div class="flex justify-between text-xs font-bold text-slate-700">
                    <span>Jami mahsulotlar:</span>
                    <span id="cartSubtotal" class="text-emerald-600">0 so'm</span>
                </div>
                <button id="checkoutBarBtn" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-2xl shadow text-xs transition">
                    Buyurtmani rasmiylashtirish
                </button>
            </div>
        </div>
    </div>

    <!-- CHECKOUT MODALI (XARITA VA DOSTAVKA) -->
    <div id="checkoutModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center hidden p-4">
        <div class="bg-white w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl max-h-[90vh] flex flex-col overflow-y-auto">
            <div class="flex justify-between items-center border-b pb-3">
                <h3 class="font-extrabold text-slate-800 text-sm flex items-center gap-2"><i class="fa-solid fa-location-dot text-emerald-600"></i> Yetkazish manzili</h3>
                <button id="closeCheckoutBtn" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark text-lg"></i></button>
            </div>

            <form id="orderSubmitForm" class="space-y-3">
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Manzil tavsifi</label>
                    <input type="text" id="custAddress" required placeholder="Masalan: Vodil markazi, 12-uy" class="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold">
                </div>
                <div>
                    <div class="flex justify-between items-center mb-1">
                        <label class="block text-xs font-bold text-slate-700">Xaritada belgilang:</label>
                        <button type="button" id="getGpsBtn" class="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg font-bold">GPS Orqali Aniqlash</button>
                    </div>
                    <div id="map" class="w-full h-44 rounded-xl border border-slate-200 shadow-inner"></div>
                </div>
                <div class="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex justify-between text-xs font-bold text-slate-700">
                    <span>Masofa: <b id="distDisplay">0 km</b></span>
                    <span>Yetkazib berish: <b id="deliveryPriceDisplay" class="text-emerald-700">0 so'm</b></span>
                </div>
                <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-2xl shadow text-xs transition">
                    Buyurtmani Tasdiqlash
                </button>
            </form>
        </div>
    </div>

    <!-- PROFIL MODALI -->
    <div id="profileModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center hidden p-4">
        <div class="bg-white w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl">
            <div class="flex justify-between items-center border-b pb-3">
                <h3 class="font-extrabold text-slate-800 text-sm flex items-center gap-2"><i class="fa-solid fa-user text-emerald-600"></i> Mijoz Profili</h3>
                <button id="closeProfileBtn" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark text-lg"></i></button>
            </div>
            
            <div id="profileFormView" class="space-y-3">
                <input type="text" id="userNameInput" required placeholder="Ismingiz" class="w-full bg-slate-50 border px-3 py-2 rounded-xl text-xs font-bold">
                <input type="tel" id="userPhoneInput" required value="+998 " class="w-full bg-slate-50 border px-3 py-2 rounded-xl text-xs font-bold">
                <button id="saveProfileBtn" class="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs shadow">Saqlash</button>
            </div>

            <div id="profileInfoView" class="space-y-3 hidden">
                <div class="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    <p class="font-bold text-xs text-slate-800" id="dispUserName">Mijoz</p>
                    <p class="text-xs text-slate-500" id="dispUserPhone">+998</p>
                </div>
                <div class="space-y-2">
                    <h4 class="font-bold text-xs text-slate-700">Mening Buyurtmalar Tarixim:</h4>
                    <div id="userOrdersHistory" class="space-y-2 max-h-40 overflow-y-auto"></div>
                </div>
                <button id="logoutProfileBtn" class="w-full bg-red-100 text-red-700 font-bold py-2 rounded-xl text-xs">Chiqish</button>
            </div>
        </div>
    </div>

    <!-- BUYURTMALAR MODALI -->
    <div id="ordersModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center hidden p-4">
        <div class="bg-white w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl max-h-[90vh] flex flex-col">
            <div class="flex justify-between items-center border-b pb-3">
                <h3 class="font-extrabold text-slate-800 text-sm flex items-center gap-2"><i class="fa-solid fa-receipt text-emerald-600"></i> Buyurtmalarim</h3>
                <button id="closeOrdersBtn" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark text-lg"></i></button>
            </div>
            <div id="clientOrdersList" class="space-y-3 overflow-y-auto flex-1 pr-1"></div>
            <button id="closeOrdersModalBtn" class="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-xs shadow">Yopish</button>
        </div>
    </div>

    <!-- SOTUVCHI MODALI -->
    <div id="vendorModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center hidden p-4">
        <div class="bg-white w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl max-h-[90vh] flex flex-col overflow-y-auto">
            <div class="flex justify-between items-center border-b pb-3">
                <h3 class="font-extrabold text-slate-800 text-sm flex items-center gap-2"><i class="fa-solid fa-store text-amber-500"></i> Do'kon Kabineti</h3>
                <button id="closeVendorBtn" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark text-lg"></i></button>
            </div>
            
            <div id="vendorLoginForm" class="space-y-3">
                <input type="text" id="vendorStoreNameInput" placeholder="Do'kon nomi" class="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold">
                <input type="password" id="vendorPasswordInput" placeholder="Parol" class="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold">
                <button id="vendorLoginBtn" class="w-full bg-slate-900 text-white font-extrabold py-2.5 rounded-xl text-xs shadow">Kirish / Ro'yxatdan o'tish</button>
            </div>

            <div id="vendorDashboard" class="space-y-4 hidden">
                <div class="bg-amber-50 border border-amber-200 p-3 rounded-xl flex justify-between items-center">
                    <div>
                        <h4 id="vDashTitle" class="font-black text-xs text-amber-900">Do'kon</h4>
                        <p id="vSalesStat" class="text-[10px] text-amber-700 font-bold">Savdo: 0 so'm</p>
                    </div>
                    <button id="logoutVendorBtn" class="text-[10px] bg-red-100 text-red-700 px-2.5 py-1 rounded-lg font-bold">Chiqish</button>
                </div>

                <form id="addProductForm" class="border border-slate-200 p-3.5 rounded-2xl space-y-3">
                    <h4 class="font-extrabold text-xs text-slate-800">📦 Yangi Mahsulot Joylash</h4>
                    <input type="text" id="vName" required placeholder="Mahsulot nomi" class="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold">
                    <input type="number" id="vPrice" required placeholder="Narxi (So'm)" class="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold">
                    <input type="text" id="vStore" placeholder="Do'kon brendi" class="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold">
                    
                    <div class="space-y-1">
                        <label class="block text-[11px] font-bold text-slate-600">Mahsulot rasmi URL yoki fayl:</label>
                        <input type="text" id="vImage" placeholder="https://..." class="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold">
                    </div>

                    <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded-xl text-xs shadow">Joylash</button>
                </form>
            </div>
        </div>
    </div>

    <!-- ADMIN MODALI -->
    <div id="adminModal" class="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center hidden p-3">
        <div class="bg-white w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
            
            <div class="flex justify-between items-center border-b pb-3">
                <div class="flex items-center gap-2">
                    <div class="bg-emerald-600 text-white w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shadow">
                        <i class="fa-solid fa-user-shield"></i>
                    </div>
                    <div>
                        <h3 class="font-black text-slate-900 text-sm leading-tight">TezVodil Admin Portal</h3>
                        <p class="text-[10px] text-slate-400 font-semibold">Tizimni Boshqarish Markazi</p>
                    </div>
                </div>
                <button id="closeAdminBtn" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark text-xl"></i></button>
            </div>

            <!-- AUTH -->
            <div id="adminLoginForm" class="space-y-3 py-6 max-w-xs mx-auto text-center">
                <i class="fa-solid fa-lock text-3xl text-emerald-600 mb-1"></i>
                <p class="text-xs text-slate-500 font-bold">Admin kirish parolini kiriting:</p>
                <input type="password" id="adminPasswordInput" placeholder="••••••••" class="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-xs font-bold text-center tracking-widest focus:outline-none focus:border-emerald-600">
                <button id="adminLoginCheckBtn" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-2xl text-xs shadow-lg transition">Kirish</button>
            </div>

            <!-- DASHBOARD -->
            <div id="adminDashboard" class="space-y-4 hidden flex-1 flex flex-col overflow-hidden">
                <div class="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-2xl text-[9px] font-extrabold text-slate-600">
                    <button id="admTabBtn-orders" class="py-2 rounded-xl bg-emerald-600 text-white shadow transition">Buyurtmalar</button>
                    <button id="admTabBtn-users" class="py-2 rounded-xl hover:bg-white transition">Mijozlar</button>
                    <button id="admTabBtn-products" class="py-2 rounded-xl hover:bg-white transition">Tovarlar</button>
                    <button id="admTabBtn-settings" class="py-2 rounded-xl hover:bg-white transition">Sozlamalar</button>
                </div>

                <div id="admContent-orders" class="space-y-2 overflow-y-auto flex-1 pr-1"><div id="adminOrdersList" class="space-y-2"></div></div>
                <div id="admContent-users" class="space-y-2 overflow-y-auto flex-1 pr-1 hidden">
                    <p class="text-xs font-bold text-slate-500">Jami mijozlar: <span id="userCount">0</span> ta</p>
                    <div id="adminUsersList" class="space-y-2"></div>
                </div>
                <div id="admContent-products" class="space-y-2 overflow-y-auto flex-1 pr-1 hidden"><div id="adminProductsList" class="space-y-2"></div></div>
                <div id="admContent-settings" class="space-y-2 overflow-y-auto flex-1 pr-1 hidden">
                    <div class="bg-slate-50 p-3 rounded-2xl border space-y-2 text-xs">
                        <h5 class="font-bold">Dastur Sozlamalari</h5>
                        <div>
                            <label class="block text-[10px] font-semibold text-slate-500">1 km Yetkazish Narxi:</label>
                            <input type="number" id="setOrderRate" class="w-full border p-2 rounded-xl text-xs font-bold">
                        </div>
                        <div>
                            <label class="block text-[10px] font-semibold text-slate-500">Qo'shimcha Tarikf Narxi:</label>
                            <input type="number" id="setExtraRate" class="w-full border p-2 rounded-xl text-xs font-bold">
                        </div>
                        <button id="saveSettingsBtn" class="w-full bg-emerald-600 text-white py-2 rounded-xl font-bold">Saqlash</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ILOVA HAQIDA MODALI -->
    <div id="developerModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center hidden p-4">
        <div class="bg-white w-full max-w-sm rounded-3xl p-6 text-center space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button id="closeDevModalBtn" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <i class="fa-solid fa-xmark text-xl"></i>
            </button>
            
            <div class="relative w-36 h-44 mx-auto rounded-2xl overflow-hidden border-4 border-emerald-500 shadow-xl bg-slate-100">
                <img id="modalDevPhoto" src="dev.jpg" alt="Fattoxov Abdulloh" class="w-full h-full object-cover">
            </div>

            <div>
                <h3 id="modalDevName" class="font-black text-xl text-slate-800">Fattoxov Abdulloh</h3>
                <p class="text-xs font-extrabold text-emerald-600 uppercase tracking-wider mt-0.5">TezVodil PWA Asoschisi va Dasturchisi</p>
            </div>

            <div class="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-left space-y-1.5 text-xs">
                <p class="font-bold text-emerald-900 flex items-center gap-1.5">
                    <i class="fa-solid fa-graduation-cap text-emerald-600 text-sm"></i> Ta'lim:
                </p>
                <p id="modalDevEducation" class="text-slate-700 font-medium leading-snug">
                    Toshkent menejment va iqtisodiyot instituti Fargʻona filiali (Bakalavr)
                </p>
                
                <div class="pt-2 border-t border-emerald-200/60 flex items-center justify-between">
                    <span class="font-bold text-slate-700">📞 Bog'lanish:</span>
                    <a id="modalDevPhoneLink" href="tel:+998200005788" class="font-black text-emerald-700 hover:underline">
                        <span id="modalDevPhone">+998 20 000 57 88</span>
                    </a>
                </div>
            </div>

            <div class="bg-red-50 border border-red-200 p-3.5 rounded-2xl text-left space-y-1">
                <p class="text-[11px] font-black text-red-700 flex items-center gap-1 uppercase">
                    <i class="fa-solid fa-gavel"></i> Mualliflik Huquqi Himoyalangan:
                </p>
                <p id="modalDevLegalText" class="text-[10px] text-red-600 leading-snug">
                    Ushbu dastur kodi, funksionalligi yoki "TezVodil" brendini ruxsatsiz nusxalash va mualliflik huquqini buzgan holda analog loyihalar yaratish Qonunan man etiladi.
                </p>
            </div>

            <button id="closeDevModalBottomBtn" class="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl shadow hover:bg-emerald-700 transition">Yopish</button>
        </div>
    </div>

    <!-- ASOSIY JS SCRIPT BOG'LANISHI -->
    <script src="app.js"></script>
</body>
</html>
