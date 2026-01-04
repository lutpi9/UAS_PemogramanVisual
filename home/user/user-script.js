// User Dashboard Script - Customer Experience Focused with Server-Side PDF
console.log('🍱 User Dashboard Loading...');

const API_BASE_URL = 'http://localhost:5283/api';
let currentUser = null;
let cart = [];
let currentSection = 'dashboard';
let userOrders = [];
let favoriteMenus = [];

// Sample menu data with real images - FALLBACK DATA
let menuItems = [
    { 
        id: 1, 
        name: 'Nasi Goreng Spesial', 
        price: 12000, 
        category: 'makanan',
        description: 'Nasi goreng dengan telur, ayam, dan sayuran segar',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop'
    },
    { 
        id: 2, 
        name: 'Mie Goreng Jawa', 
        price: 10000, 
        category: 'makanan',
        description: 'Mie goreng khas dengan bumbu rempah pilihan',
        image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop'
    },
    { 
        id: 3, 
        name: 'Ayam Katsu Crispy', 
        price: 15000, 
        category: 'makanan',
        description: 'Ayam crispy dengan saus katsu spesial',
        image: 'https://www.frisianflag.com/storage/app/media/uploaded-files/ayam-katsu-sederhana.jpg'
    },
    { 
        id: 4, 
        name: 'Gado-Gado', 
        price: 11000, 
        category: 'makanan',
        description: 'Salad sayuran dengan bumbu kacang',
        image: 'https://static.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p2/74/2025/01/27/Gado-Gado-2337756915.jpg'
    },
    { 
        id: 5, 
        name: 'Bakso Malang', 
        price: 14000, 
        category: 'makanan',
        description: 'Bakso dengan kuah kaldu segar',
        image: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Baso_Malang_Karapitan.JPG'
    },
    { 
        id: 6, 
        name: 'Soto Ayam', 
        price: 13000, 
        category: 'makanan',
        description: 'Soto ayam kuah bening dengan rempah tradisional',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop'
    },
    { 
        id: 7, 
        name: 'Es Teh Manis', 
        price: 5000, 
        category: 'minuman',
        description: 'Es teh manis segar untuk menemani makan',
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop'
    },
    { 
        id: 8, 
        name: 'Es Jeruk', 
        price: 6000, 
        category: 'minuman',
        description: 'Jus jeruk segar dengan es batu',
        image: 'https://cdn.yummy.co.id/content-images/images/20201013/WqfCTib25afAXzGCyok7dmAmTKGeGpkM-31363032353730383236d41d8cd98f00b204e9800998ecf8427e.jpg?x-oss-process=image/resize,w_388,h_388,m_fixed,x-oss-process=image/format,webp'
    },
    { 
        id: 9, 
        name: 'Kopi Susu', 
        price: 7000, 
        category: 'minuman',
        description: 'Kopi dengan susu creamy',
        image: 'https://cdn.yummy.co.id/content-images/images/20230119/rAvgrbBssoG6rNVTeqyzirA1WhQE7Nkl-31363734313235353439d41d8cd98f00b204e9800998ecf8427e.jpg?x-oss-process=image/resize,w_388,h_388,m_fixed,x-oss-process=image/format,webp'
    },
    { 
        id: 10, 
        name: 'Jus Buah Segar', 
        price: 8000, 
        category: 'minuman',
        description: 'Jus buah segar tanpa pengawet',
        image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=300&fit=crop'
    },
    { 
        id: 11, 
        name: 'Pisang Goreng', 
        price: 4000, 
        category: 'snack',
        description: 'Pisang goreng crispy dengan gula halus',
        image: 'https://cdn.grid.id/crop/0x0:0x0/700x465/smart/filters:format(webp):quality(100)/photo/2025/12/05/pisang-goreng-tandukjpg-20251205043631.jpg'
    },
    { 
        id: 12, 
        name: 'Keripik Singkong', 
        price: 5000, 
        category: 'snack',
        description: 'Keripik singkong renyah dan gurih',
        image: 'https://filebroker-cdn.lazada.co.id/kf/Sec3e758b09e246d080879f6b2b919d8bP.jpg?nuclear=' + Date.now() + '&cache=bust&force=true&keripik=fixed'
    },
    { 
        id: 13, 
        name: 'Roti Bakar', 
        price: 8000, 
        category: 'snack',
        description: 'Roti bakar dengan selai dan mentega',
        image: 'https://www.frisianflag.com/storage/app/media/uploaded-files/roti-bakar-keju-cokelat.jpg'
    }
];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 User Dashboard Initializing...');
    
    // Check authentication
    checkUserAuth();
    
    // Initialize dashboard
    if (currentUser) {
        initializeDashboard();
        loadUserData();
    }
});

function checkUserAuth() {
    const userData = localStorage.getItem('lupycanteen_user') || sessionStorage.getItem('lupycanteen_user');
    
    if (!userData) {
        alert('Silakan login terlebih dahulu.');
        window.location.href = '../login-first.html';
        return;
    }
    
    try {
        currentUser = JSON.parse(userData);
        
        // Check if user is regular user (not admin or kasir)
        if (currentUser.role === 'Admin') {
            alert('Anda akan diarahkan ke Admin Dashboard.');
            window.location.href = '../home/admin-dashboard.html';
            return;
        } else if (currentUser.role === 'Kasir') {
            alert('Anda akan diarahkan ke Kasir Dashboard.');
            window.location.href = '../kasir/kasir-dashboard.html';
            return;
        }
        
        console.log('✅ User authenticated:', currentUser.fullName);
        updateUserInfo();
        
    } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('lupycanteen_user');
        sessionStorage.removeItem('lupycanteen_user');
        alert('Data login tidak valid. Silakan login kembali.');
        window.location.href = '../login-first.html';
    }
}

function updateUserInfo() {
    document.getElementById('userName').textContent = currentUser.fullName;
    document.getElementById('welcomeName').textContent = currentUser.fullName;
    document.getElementById('profileName').textContent = currentUser.fullName;
    document.getElementById('profileEmail').textContent = currentUser.email || 'email@example.com';
}

// Load menu from API with safe fallback
async function loadMenuFromAPI() {
    console.log('🔄 Loading menu from API...');
    
    try {
        // Add cache busting parameter
        const cacheBuster = Date.now();
        const response = await fetch(`${API_BASE_URL}/menu?_cb=${cacheBuster}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        
        if (response.ok) {
            const apiMenus = await response.json();
            console.log('✅ API menu loaded:', apiMenus.length, 'items');
            
            
            
            const filteredApiMenus = apiMenus.filter(item => {
                // Check by exact name match (case insensitive)
                const itemNameLower = item.name.toLowerCase();
                const isUnwanted = unwantedMenus.some(unwanted => 
                    itemNameLower === unwanted.toLowerCase()
                );
                
                // Also filter by image URL patterns (bowl images)
                const hasBowlImage = item.imageUrl && (
                    item.imageUrl.includes('bowl') || 
                    item.imageUrl.includes('data:image') ||
                    item.imageUrl.includes('base64')
                );
                
                return !isUnwanted && !hasBowlImage;
            });
            
            // Transform API data to match our format
            const transformedMenus = filteredApiMenus.map((item, index) => ({
                id: item.id || (index + 100), // Use API ID or generate unique ID
                name: item.name || 'Menu Item',
                price: item.price || 0,
                category: item.category || 'makanan',
                description: item.description || '',
                image: item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
            }));
            
            // Merge with existing static data (keep static as fallback)
            const mergedMenus = [...menuItems];
            
            // Add new items from API that don't exist in static data
            transformedMenus.forEach(apiItem => {
                const existsInStatic = mergedMenus.find(staticItem => 
                    staticItem.name.toLowerCase() === apiItem.name.toLowerCase()
                );
                
                if (!existsInStatic) {
                    mergedMenus.push(apiItem);
                    console.log('➕ Added new menu from API:', apiItem.name);
                }
            });
            
            // Update global menuItems
            menuItems = mergedMenus;
            console.log('🔄 Menu updated with API data. Total items:', menuItems.length);
            
            if (filteredApiMenus.length < apiMenus.length) {
                console.log('🚫 Filtered out unwanted menus:', unwantedMenus);
            }
            
            return true;
        } else {
            console.warn('⚠️ API response not OK, using fallback data');
            return false;
        }
    } catch (error) {
        console.warn('⚠️ Failed to load menu from API, using fallback data:', error.message);
        return false;
    }
}

function initializeDashboard() {
    console.log('📊 Initializing user dashboard...');
    
    // Load menu from API first, then continue with initialization
    loadMenuFromAPI().then(() => {
        // Load menu
        loadMenuDisplay();
        
        // Load user orders
        loadUserOrders();
        
        // Load favorites
        loadFavoriteMenus();
        
        // Update cart display
        updateCartDisplay();
        
        console.log('✅ User dashboard initialized');
    }).catch(error => {
        console.error('❌ Error during initialization:', error);
        // Continue with fallback data
        loadMenuDisplay();
        loadUserOrders();
        loadFavoriteMenus();
        updateCartDisplay();
        console.log('✅ User dashboard initialized with fallback data');
    });
}

function loadUserData() {
    // Load user statistics
    const totalOrders = userOrders.length;
    const favoriteMenu = favoriteMenus.length > 0 ? favoriteMenus[0].name : 'Belum ada';
    const memberSince = new Date(currentUser.createdAt || Date.now()).getFullYear();
    
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('favoriteMenu').textContent = favoriteMenu;
    document.getElementById('memberSince').textContent = memberSince;
    
    // Profile stats
    const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
    document.getElementById('profileTotalOrders').textContent = totalOrders;
    document.getElementById('profileTotalSpent').textContent = `Rp ${totalSpent.toLocaleString()}`;
}

function showSection(sectionName) {
    console.log('📍 Showing section:', sectionName);
    
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Hide main dashboard content
    if (sectionName !== 'dashboard') {
        document.querySelector('.welcome-section').style.display = 'none';
        document.querySelector('.quick-actions').style.display = 'none';
    } else {
        document.querySelector('.welcome-section').style.display = 'block';
        document.querySelector('.quick-actions').style.display = 'block';
    }
    
    // Show target section
    if (sectionName !== 'dashboard') {
        const targetSection = document.getElementById(sectionName + 'Section');
        if (targetSection) {
            targetSection.style.display = 'block';
            currentSection = sectionName;
            
            // Load section-specific data
            switch(sectionName) {
                case 'menu':
                    loadMenuDisplay();
                    break;
                case 'orders':
                    loadUserOrders();
                    break;
                case 'favorites':
                    loadFavoriteMenus();
                    break;
                case 'profile':
                    loadUserData();
                    break;
            }
        }
    } else {
        currentSection = 'dashboard';
    }
}

// Menu Functions with enhanced display - FIXED IMAGE HANDLING
function loadMenuDisplay() {
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;
    
    console.log('🍽️ Loading menu with enhanced images...');
    
    let html = '';
    menuItems.forEach((item, index) => {
        // Determine if item is popular (first 5 items)
        const isPopular = index < 5;
        
        html += `
            <div class="menu-item animate-in" data-category="${item.category}" style="animation-delay: ${index * 0.1}s">
                <div class="menu-item-image">
                    <img src="${item.image}" 
                         alt="${item.name}" 
                         loading="lazy"
                         onload="this.parentElement.classList.remove('loading')"
                         onerror="handleImageError(this, '${item.category}')">
                    <div class="category-badge ${item.category}">${item.category.toUpperCase()}</div>
                    ${isPopular ? '<div class="popular-badge">POPULER</div>' : ''}
                </div>
                <div class="menu-item-content">
                    <div class="menu-item-name">${item.name}</div>
                    <div class="menu-item-desc">${item.description}</div>
                    <div class="menu-item-footer">
                        <div class="menu-item-price">Rp ${item.price.toLocaleString()}</div>
                        <button class="btn-add-to-cart" onclick="addToCart(${item.id})" data-item-id="${item.id}">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            Tambah
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    menuGrid.innerHTML = html;
    
    // Add loading class initially
    document.querySelectorAll('.menu-item-image').forEach(img => {
        img.classList.add('loading');
    });
    
    console.log('✅ Menu loaded with', menuItems.length, 'items');
}

// Handle image loading errors with better fallback
function handleImageError(img, category) {
    console.log('⚠️ Image failed to load:', img.src);
    
    const container = img.parentElement;
    container.classList.remove('loading');
    container.classList.add('image-error');
    
    // Create fallback content
    const fallbackHTML = `
        <div class="error-placeholder">
            <div class="error-emoji">${getEmojiForCategory(category)}</div>
            <div class="error-text">Gambar tidak tersedia</div>
        </div>
    `;
    
    // Replace image with fallback
    img.style.display = 'none';
    container.insertAdjacentHTML('beforeend', fallbackHTML);
}

// Helper function to get emoji fallback for categories
function getEmojiForCategory(category) {
    const emojiMap = {
        'makanan': '🍽️',
        'minuman': '🥤',
        'snack': '🍪'
    };
    return emojiMap[category] || '🍽️';
}

function filterMenu(category) {
    const menuItems = document.querySelectorAll('#menuGrid .menu-item');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Update active button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter items
    menuItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function searchMenu() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();
    const menuItems = document.querySelectorAll('#menuGrid .menu-item');
    
    menuItems.forEach(item => {
        const itemName = item.querySelector('.menu-item-name').textContent.toLowerCase();
        const itemDesc = item.querySelector('.menu-item-desc').textContent.toLowerCase();
        
        if (itemName.includes(searchTerm) || itemDesc.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Cart Functions with enhanced feedback
function addToCart(itemId) {
    const menuItem = menuItems.find(item => item.id === itemId);
    if (!menuItem) return;
    
    // Find the button that was clicked
    const button = document.querySelector(`[data-item-id="${itemId}"]`);
    
    // Add visual feedback
    if (button) {
        button.classList.add('adding');
        setTimeout(() => {
            button.classList.remove('adding');
        }, 1000);
    }
    
    const existingItem = cart.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showNotification(`${menuItem.name} ditambahkan ke keranjang!`, 'success');
    
    // Add cart bounce animation
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.classList.add('bounce');
        setTimeout(() => {
            cartBtn.classList.remove('bounce');
        }, 600);
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const cartModalTotal = document.getElementById('cartModalTotal');
    const cartItems = document.getElementById('cartItems');
    
    // Calculate totals
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update header display
    cartCount.textContent = totalItems;
    cartTotal.textContent = `Rp ${totalPrice.toLocaleString()}`;
    cartModalTotal.textContent = `Rp ${totalPrice.toLocaleString()}`;
    
    // Update cart modal
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Keranjang masih kosong</p>';
        return;
    }
    
    let html = '';
    cart.forEach(item => {
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">Rp ${item.price.toLocaleString()}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateCartQuantity(${item.id}, -1)">−</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
}

function updateCartQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== itemId);
    }
    
    updateCartDisplay();
}

function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal.style.display === 'block') {
        cartModal.style.display = 'none';
    } else {
        cartModal.style.display = 'block';
    }
}

function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Apakah Anda yakin ingin mengosongkan keranjang?')) {
        cart = [];
        updateCartDisplay();
        showNotification('Keranjang dikosongkan!', 'info');
    }
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Keranjang masih kosong!', 'error');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderId = 'ORD' + Date.now();
    const orderDate = new Date();
    
    const newOrder = {
        id: orderId,
        items: [...cart],
        total: total,
        status: 'pending',
        date: orderDate.toISOString(),
        customer: currentUser.fullName,
        customerPhone: currentUser.phone || '081234567892',
        paymentMethod: 'cash',
        orderNumber: Math.floor(Math.random() * 1000) + 1
    };
    
    // Save to user orders
    userOrders.unshift(newOrder);
    
    // Send to kasir system (save to localStorage for kasir to see)
    sendOrderToKasir(newOrder);
    
    // Generate and show receipt
    generateReceipt(newOrder);
    
    // Clear cart
    cart = [];
    updateCartDisplay();
    toggleCart();
    
    showNotification(`Pesanan ${orderId} berhasil dibuat! Struk akan ditampilkan.`, 'success');
    
    // Update user data
    loadUserData();
}

// Send order to kasir system
function sendOrderToKasir(order) {
    try {
        // Get existing kasir orders
        let kasirOrders = JSON.parse(localStorage.getItem('kasir_orders') || '[]');
        
        // Add new order
        kasirOrders.unshift(order);
        
        // Keep only last 50 orders
        if (kasirOrders.length > 50) {
            kasirOrders = kasirOrders.slice(0, 50);
        }
        
        // Save to localStorage for kasir
        localStorage.setItem('kasir_orders', JSON.stringify(kasirOrders));
        
        console.log('✅ Order sent to kasir system:', order.id);
        
        // Also try to send to API if available
        sendOrderToAPI(order);
        
    } catch (error) {
        console.error('Error sending order to kasir:', error);
    }
}

// Send order to API
async function sendOrderToAPI(order) {
    try {
        const response = await fetch(`${API_BASE_URL}/order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerName: order.customer,
                customerPhone: order.customerPhone,
                items: order.items.map(item => ({
                    menuItemId: item.id.toString(),
                    quantity: item.quantity,
                    price: item.price,
                    name: item.name
                })),
                totalAmount: order.total,
                status: 'pending',
                orderDate: order.date
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Order saved to database:', result);
        }
    } catch (error) {
        console.log('⚠️ Could not save to database (offline mode):', error.message);
    }
}

// Generate PDF Receipt
function generateReceipt(order) {
    // Create receipt modal
    const receiptModal = document.createElement('div');
    receiptModal.id = 'receiptModal';
    receiptModal.className = 'receipt-modal';
    receiptModal.innerHTML = `
        <div class="receipt-content">
            <div class="receipt-header">
                <button class="receipt-close" onclick="closeReceipt()">×</button>
                <h2>📄 Struk Pembelian</h2>
            </div>
            <div class="receipt-body" id="receiptBody">
                ${generateReceiptHTML(order)}
            </div>
            <div class="receipt-footer">
                <button class="btn-print" onclick="printReceipt()">
                    🖨️ Cetak Struk
                </button>
                <button class="btn-pdf" onclick="downloadReceiptPDF()">
                    📄 Download PDF
                </button>
                <button class="btn-close" onclick="closeReceipt()">
                    Tutup
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(receiptModal);
    
    // Store current order for PDF generation
    window.currentReceiptOrder = order;
    
    // Show modal
    receiptModal.style.display = 'flex';
}

// Generate receipt HTML - IMPROVED LAYOUT
function generateReceiptHTML(order) {
    const orderDate = new Date(order.date);
    const currentDate = new Date();
    
    return `
        <div class="receipt-paper" id="receiptPaper">
            <!-- Header Section -->
            <div class="receipt-header">
                <div class="logo-section">
                    <div class="logo-icon">🍱</div>
                    <div class="logo-text">LupyCanteen</div>
                    <div class="logo-subtitle">Kantin Sekolah Modern</div>
                </div>
            </div>
            
            <div class="receipt-divider">================================</div>
            
            <!-- Order Information Section -->
            <div class="receipt-info">
                <table class="info-table">
                    <tr>
                        <td class="info-label">No. Pesanan:</td>
                        <td class="info-value"><strong>${order.id}</strong></td>
                    </tr>
                    <tr>
                        <td class="info-label">Tanggal:</td>
                        <td class="info-value">${orderDate.toLocaleDateString('id-ID')}</td>
                    </tr>
                    <tr>
                        <td class="info-label">Waktu:</td>
                        <td class="info-value">${orderDate.toLocaleTimeString('id-ID')}</td>
                    </tr>
                    <tr>
                        <td class="info-label">Pelanggan:</td>
                        <td class="info-value">${order.customer}</td>
                    </tr>
                    <tr>
                        <td class="info-label">No. Antrian:</td>
                        <td class="info-value"><strong>#${order.orderNumber || Math.floor(Math.random() * 1000) + 1}</strong></td>
                    </tr>
                </table>
            </div>
            
            <div class="receipt-divider">================================</div>
            
            <!-- Items Section -->
            <div class="receipt-items">
                <table class="items-table">
                    <thead>
                        <tr class="items-header">
                            <th class="item-col">Item</th>
                            <th class="qty-col">Qty</th>
                            <th class="price-col">Harga</th>
                            <th class="total-col">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => {
                            if (item.quantity > 0) {
                                return `
                                    <tr class="item-row">
                                        <td class="item-name">${item.name}</td>
                                        <td class="item-qty">${item.quantity}x</td>
                                        <td class="item-price">Rp ${item.price.toLocaleString()}</td>
                                        <td class="item-total">Rp ${(item.price * item.quantity).toLocaleString()}</td>
                                    </tr>
                                `;
                            }
                            return '';
                        }).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="receipt-divider">================================</div>
            
            <!-- Total Section -->
            <div class="receipt-total">
                <table class="total-table">
                    <tr class="total-row">
                        <td class="total-label">Subtotal:</td>
                        <td class="total-value">Rp ${order.total.toLocaleString()}</td>
                    </tr>
                    <tr class="total-row">
                        <td class="total-label">Pajak (0%):</td>
                        <td class="total-value">Rp 0</td>
                    </tr>
                    <tr class="total-row final-total">
                        <td class="total-label"><strong>TOTAL:</strong></td>
                        <td class="total-value"><strong>Rp ${order.total.toLocaleString()}</strong></td>
                    </tr>
                </table>
            </div>
            
            <div class="receipt-divider">================================</div>
            
            <!-- Payment Section -->
            <div class="receipt-payment">
                <table class="payment-table">
                    <tr class="payment-row">
                        <td class="payment-label">Metode Bayar:</td>
                        <td class="payment-value">Tunai</td>
                    </tr>
                    <tr class="payment-row">
                        <td class="payment-label">Status:</td>
                        <td class="payment-value status-pending">Menunggu Konfirmasi</td>
                    </tr>
                </table>
            </div>
            
            <div class="receipt-divider">================================</div>
            
            <!-- Footer Section -->
            <div class="receipt-footer">
                <div class="contact-info">
                    <div class="contact-item">
                        <span class="contact-icon">📍</span>
                        <span class="contact-text">Jl. Raya Margamulya, Telukjambe Barat</span>
                    </div>
                    <div class="contact-item">
                        <span class="contact-icon">📞</span>
                        <span class="contact-text">(021) 1234-5678</span>
                    </div>
                    <div class="contact-item">
                        <span class="contact-icon">🌐</span>
                        <span class="contact-text">lupycanteen.com</span>
                    </div>
                </div>
                
                <div class="thank-you">
                    <p class="thank-you-main"><strong>Terima kasih atas kunjungan Anda!</strong></p>
                    <p class="thank-you-sub">Silakan tunjukkan struk ini ke kasir</p>
                    <p class="thank-you-sub">untuk mengambil pesanan Anda.</p>
                </div>
                
                <div class="print-info">
                    <p class="print-time">Struk dicetak pada: ${currentDate.toLocaleString('id-ID')}</p>
                </div>
            </div>
        </div>
        
        <style>
            .receipt-paper {
                width: 300px;
                margin: 0 auto;
                font-family: 'Courier New', monospace;
                font-size: 11px;
                line-height: 1.3;
                color: #000;
                background: #fff;
                padding: 15px;
                border: 1px solid #ddd;
            }
            
            .receipt-header {
                text-align: center;
                margin-bottom: 10px;
            }
            
            .logo-section {
                margin-bottom: 8px;
            }
            
            .logo-icon {
                font-size: 24px;
                margin-bottom: 5px;
            }
            
            .logo-text {
                font-size: 16px;
                font-weight: bold;
                margin: 3px 0;
            }
            
            .logo-subtitle {
                font-size: 10px;
                color: #666;
                margin-bottom: 5px;
            }
            
            .receipt-divider {
                text-align: center;
                margin: 8px 0;
                font-size: 10px;
                color: #333;
            }
            
            .info-table, .items-table, .total-table, .payment-table {
                width: 100%;
                border-collapse: collapse;
                margin: 5px 0;
            }
            
            .info-table td, .payment-table td {
                padding: 2px 0;
                vertical-align: top;
            }
            
            .info-label, .payment-label {
                width: 40%;
                font-size: 10px;
            }
            
            .info-value, .payment-value {
                width: 60%;
                text-align: right;
                font-size: 10px;
            }
            
            .items-table {
                margin: 8px 0;
            }
            
            .items-header th {
                padding: 3px 2px;
                font-size: 9px;
                font-weight: bold;
                border-bottom: 1px solid #333;
                text-align: left;
            }
            
            .item-col { width: 45%; }
            .qty-col { width: 15%; text-align: center; }
            .price-col { width: 20%; text-align: right; }
            .total-col { width: 20%; text-align: right; }
            
            .item-row td {
                padding: 2px;
                font-size: 9px;
                vertical-align: top;
            }
            
            .item-name {
                text-align: left;
                word-wrap: break-word;
            }
            
            .item-qty {
                text-align: center;
            }
            
            .item-price, .item-total {
                text-align: right;
            }
            
            .total-table {
                margin: 8px 0;
            }
            
            .total-row td {
                padding: 2px 0;
                font-size: 10px;
            }
            
            .total-label {
                width: 60%;
                text-align: left;
            }
            
            .total-value {
                width: 40%;
                text-align: right;
            }
            
            .final-total {
                border-top: 1px solid #333;
                padding-top: 3px !important;
                font-size: 11px !important;
            }
            
            .status-pending {
                color: #f59e0b;
                font-weight: bold;
            }
            
            .receipt-footer {
                text-align: center;
                margin-top: 10px;
            }
            
            .contact-info {
                margin: 8px 0;
            }
            
            .contact-item {
                margin: 3px 0;
                font-size: 9px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .contact-icon {
                margin-right: 5px;
            }
            
            .thank-you {
                margin: 10px 0;
            }
            
            .thank-you-main {
                font-size: 10px;
                font-weight: bold;
                margin: 5px 0;
            }
            
            .thank-you-sub {
                font-size: 9px;
                margin: 2px 0;
                color: #555;
            }
            
            .print-info {
                margin-top: 10px;
                border-top: 1px dashed #ccc;
                padding-top: 5px;
            }
            
            .print-time {
                font-size: 8px;
                color: #888;
                font-style: italic;
                margin: 0;
            }
            
            @media print {
                .receipt-paper {
                    border: none;
                    box-shadow: none;
                    margin: 0;
                    padding: 10px;
                }
            }
        </style>
    `;
}

// Print receipt
function printReceipt() {
    const receiptContent = document.getElementById('receiptPaper').innerHTML;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Struk - ${window.currentReceiptOrder.id}</title>
            <style>
                body { 
                    font-family: 'Courier New', monospace; 
                    margin: 0; 
                    padding: 20px;
                    background: white;
                }
                .receipt-paper {
                    max-width: 300px;
                    margin: 0 auto;
                    background: white;
                    padding: 20px;
                    border: 1px solid #ddd;
                }
                .receipt-logo {
                    text-align: center;
                    margin-bottom: 15px;
                }
                .logo-icon { font-size: 24px; }
                .logo-text { 
                    font-size: 18px; 
                    font-weight: bold; 
                    margin: 5px 0;
                }
                .logo-subtitle { 
                    font-size: 12px; 
                    color: #666;
                }
                .receipt-divider {
                    text-align: center;
                    margin: 10px 0;
                    font-size: 12px;
                }
                .info-row, .total-row, .payment-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 5px 0;
                    font-size: 12px;
                }
                .items-header {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 1fr;
                    gap: 5px;
                    font-weight: bold;
                    font-size: 11px;
                    margin-bottom: 5px;
                }
                .item-row {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 1fr;
                    gap: 5px;
                    font-size: 11px;
                    margin: 3px 0;
                }
                .final-total {
                    border-top: 1px solid #333;
                    padding-top: 5px;
                    font-weight: bold;
                }
                .receipt-footer-info {
                    text-align: center;
                    font-size: 10px;
                    line-height: 1.4;
                }
                .status-pending {
                    color: #f59e0b;
                    font-weight: bold;
                }
                @media print {
                    body { margin: 0; padding: 0; }
                    .receipt-paper { border: none; box-shadow: none; }
                }
            </style>
        </head>
        <body>
            <div class="receipt-paper">
                ${receiptContent}
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

// Download PDF receipt - MULTIPLE METHODS with fallbacks
async function downloadReceiptPDF() {
    console.log('📄 Starting PDF generation with multiple methods...');
    
    try {
        const order = window.currentReceiptOrder;
        
        if (!order) {
            showNotification('❌ Data pesanan tidak tersedia', 'error');
            return;
        }
        
        console.log('📄 Generating PDF for order:', order.id);
        showNotification('📄 Membuat PDF struk...', 'info', 2000);
        
        // Method 1: Try jsPDF simple
        if (await tryJsPDFSimple(order)) {
            return;
        }
        
        // Method 2: Try HTML to Canvas to PDF
        if (await tryHTMLToCanvasPDF(order)) {
            return;
        }
        
        // Method 3: Try Print to PDF
        if (tryPrintToPDF(order)) {
            return;
        }
        
        // Fallback: Download as HTML
        downloadReceiptAsHTML(order);
        
    } catch (error) {
        console.error('❌ All PDF methods failed:', error);
        showNotification('❌ Gagal membuat PDF: ' + error.message, 'error');
        downloadReceiptAsText();
    }
}

// Method 1: Simple jsPDF
async function tryJsPDFSimple(order) {
    try {
        console.log('🔄 Trying Method 1: jsPDF Simple...');
        
        // Wait for library to load
        let attempts = 0;
        while (typeof window.jsPDF === 'undefined' && attempts < 5) {
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
        }
        
        if (typeof window.jsPDF === 'undefined') {
            throw new Error('jsPDF not available');
        }
        
        const { jsPDF } = window.jsPDF;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [80, 150]
        });
        
        doc.setFont('courier', 'normal');
        let y = 15;
        const lineHeight = 5;
        
        // Header
        doc.setFontSize(12);
        doc.text('LupyCanteen', 40, y, { align: 'center' });
        y += lineHeight;
        doc.setFontSize(8);
        doc.text('Kantin Sekolah Modern', 40, y, { align: 'center' });
        y += lineHeight * 2;
        
        // Order info
        const orderDate = new Date(order.date);
        doc.text(`No. Pesanan: ${order.id}`, 5, y);
        y += lineHeight;
        doc.text(`Tanggal: ${orderDate.toLocaleDateString('id-ID')}`, 5, y);
        y += lineHeight;
        doc.text(`Waktu: ${orderDate.toLocaleTimeString('id-ID')}`, 5, y);
        y += lineHeight;
        doc.text(`Pelanggan: ${order.customer}`, 5, y);
        y += lineHeight;
        doc.text(`No. Antrian: #${order.orderNumber || 1}`, 5, y);
        y += lineHeight * 2;
        
        // Items
        order.items.forEach(item => {
            if (item.quantity > 0) {
                let itemName = item.name;
                if (itemName.length > 25) {
                    itemName = itemName.substring(0, 25) + '...';
                }
                doc.text(itemName, 5, y);
                y += lineHeight;
                doc.text(`${item.quantity}x Rp ${item.price.toLocaleString()} = Rp ${(item.price * item.quantity).toLocaleString()}`, 5, y);
                y += lineHeight + 1;
            }
        });
        
        y += lineHeight;
        
        // Total
        doc.setFontSize(10);
        doc.text(`TOTAL: Rp ${order.total.toLocaleString()}`, 40, y, { align: 'center' });
        y += lineHeight * 2;
        
        // Payment info
        doc.setFontSize(8);
        doc.text('Metode Bayar: Tunai', 5, y);
        y += lineHeight;
        doc.text('Status: Menunggu Konfirmasi', 5, y);
        y += lineHeight * 2;
        
        // Footer
        doc.text('Jl. Raya Margamulya, Telukjambe Barat', 40, y, { align: 'center' });
        y += lineHeight;
        doc.text('(021) 1234-5678', 40, y, { align: 'center' });
        y += lineHeight;
        doc.text('lupycanteen.com', 40, y, { align: 'center' });
        y += lineHeight * 2;
        doc.text('Terima kasih atas kunjungan Anda!', 40, y, { align: 'center' });
        y += lineHeight;
        doc.text(`Dicetak: ${new Date().toLocaleString('id-ID')}`, 40, y, { align: 'center' });
        
        // Save
        const fileName = `LupyCanteen-Struk-${order.id}.pdf`;
        doc.save(fileName);
        
        console.log('✅ Method 1 (jsPDF Simple) berhasil!');
        showNotification('✅ Struk PDF berhasil didownload! (Method: jsPDF)', 'success');
        return true;
        
    } catch (error) {
        console.log('❌ Method 1 gagal:', error.message);
        return false;
    }
}

// Method 2: HTML to Canvas to PDF
async function tryHTMLToCanvasPDF(order) {
    try {
        console.log('🔄 Trying Method 2: HTML to Canvas to PDF...');
        
        if (typeof window.jsPDF === 'undefined' || typeof html2canvas === 'undefined') {
            throw new Error('Required libraries not available');
        }
        
        // Create temporary receipt element
        const receiptHTML = generateReceiptHTML(order);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = receiptHTML;
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.width = '300px';
        tempDiv.style.fontFamily = 'Courier New, monospace';
        tempDiv.style.fontSize = '12px';
        tempDiv.style.lineHeight = '1.4';
        tempDiv.style.backgroundColor = 'white';
        tempDiv.style.padding = '20px';
        document.body.appendChild(tempDiv);
        
        const canvas = await html2canvas(tempDiv, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
        });
        
        document.body.removeChild(tempDiv);
        
        const { jsPDF } = window.jsPDF;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [80, 150]
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 70;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        doc.addImage(imgData, 'PNG', 5, 5, imgWidth, Math.min(imgHeight, 140));
        
        const fileName = `LupyCanteen-Struk-${order.id}.pdf`;
        doc.save(fileName);
        
        console.log('✅ Method 2 (HTML to Canvas) berhasil!');
        showNotification('✅ Struk PDF berhasil didownload! (Method: HTML2Canvas)', 'success');
        return true;
        
    } catch (error) {
        console.log('❌ Method 2 gagal:', error.message);
        return false;
    }
}

// Method 3: Print to PDF
function tryPrintToPDF(order) {
    try {
        console.log('🔄 Trying Method 3: Print to PDF...');
        
        const receiptContent = generateReceiptHTML(order);
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>LupyCanteen Struk - ${order.id}</title>
                <style>
                    body { 
                        font-family: 'Courier New', monospace; 
                        margin: 0; 
                        padding: 20px;
                        background: white;
                        font-size: 12px;
                        line-height: 1.4;
                    }
                    .receipt-paper {
                        max-width: 300px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ddd;
                    }
                    @media print {
                        body { margin: 0; padding: 10px; }
                        .receipt-paper { border: none; }
                    }
                </style>
            </head>
            <body>
                <div class="receipt-paper">${receiptContent}</div>
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            if (confirm('Apakah Anda ingin membuka dialog print untuk save as PDF?')) {
                                window.print();
                            }
                        }, 1000);
                    };
                </script>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        
        console.log('✅ Method 3 (Print to PDF) berhasil!');
        showNotification('✅ Jendela print dibuka! Pilih "Save as PDF" untuk download.', 'success');
        return true;
        
    } catch (error) {
        console.log('❌ Method 3 gagal:', error.message);
        return false;
    }
}

// Fallback: Download as HTML
function downloadReceiptAsHTML(order) {
    try {
        console.log('🔄 Fallback: Download as HTML...');
        
        const receiptContent = generateReceiptHTML(order);
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>LupyCanteen Struk - ${order.id}</title>
    <style>
        body { 
            font-family: 'Courier New', monospace; 
            margin: 0; 
            padding: 20px;
            background: white;
            font-size: 12px;
            line-height: 1.4;
        }
        .receipt-paper {
            max-width: 300px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
        }
        .print-btn {
            text-align: center;
            margin: 20px 0;
            page-break-inside: avoid;
        }
        .print-btn button {
            padding: 10px 20px;
            font-size: 16px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        @media print {
            body { margin: 0; padding: 10px; }
            .receipt-paper { border: none; }
            .print-btn { display: none; }
        }
    </style>
</head>
<body>
    <div class="receipt-paper">${receiptContent}</div>
    <div class="print-btn">
        <button onclick="window.print()">🖨️ Print to PDF</button>
        <p><small>Klik tombol di atas, lalu pilih "Save as PDF"</small></p>
    </div>
</body>
</html>`;
        
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `LupyCanteen-Struk-${order.id}.html`;
        link.click();
        URL.revokeObjectURL(url);
        
        console.log('✅ HTML file downloaded successfully');
        showNotification('✅ Struk HTML berhasil didownload! Buka file dan print to PDF.', 'success');
        
    } catch (error) {
        console.error('❌ HTML download gagal:', error);
        showNotification('❌ Gagal download HTML: ' + error.message, 'error');
    }
}

// Helper function to download blob - SIMPLIFIED
function downloadBlob(blob, filename) {
    try {
        // Simple and reliable download method
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Cleanup
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        
        console.log('✅ Blob download triggered successfully');
        
    } catch (error) {
        console.error('❌ Blob download failed:', error);
        throw error;
    }
}

// Fallback function to download receipt as text (if PDF fails)
function downloadReceiptAsText() {
    console.log('📄 Fallback: Downloading as text file');
    
    try {
        const order = window.currentReceiptOrder;
        if (!order) {
            showNotification('❌ Data pesanan tidak tersedia', 'error');
            return;
        }
        
        const orderDate = new Date(order.date);
        
        // Create text content
        let receiptText = `🍱 LupyCanteen\n`;
        receiptText += `Kantin Sekolah Modern\n\n`;
        receiptText += `================================\n\n`;
        receiptText += `No. Pesanan: ${order.id}\n`;
        receiptText += `Tanggal: ${orderDate.toLocaleDateString('id-ID')}\n`;
        receiptText += `Waktu: ${orderDate.toLocaleTimeString('id-ID')}\n`;
        receiptText += `Pelanggan: ${order.customer}\n`;
        if (order.orderNumber) {
            receiptText += `No. Antrian: #${order.orderNumber}\n`;
        }
        receiptText += `\n================================\n\n`;
        
        // Items
        order.items.forEach(item => {
            if (item.quantity > 0) {
                receiptText += `${item.name}\n`;
                receiptText += `${item.quantity}x Rp ${item.price.toLocaleString()} = Rp ${(item.price * item.quantity).toLocaleString()}\n\n`;
            }
        });
        
        receiptText += `================================\n\n`;
        receiptText += `TOTAL: Rp ${order.total.toLocaleString()}\n\n`;
        receiptText += `Metode Bayar: Tunai\n`;
        receiptText += `Status: Menunggu Konfirmasi\n\n`;
        receiptText += `================================\n\n`;
        receiptText += `📍 Jl. Raya Margamulya, Telukjambe Barat\n`;
        receiptText += `📞 (021) 1234-5678\n`;
        receiptText += `🌐 lupycanteen.com\n\n`;
        receiptText += `Terima kasih atas kunjungan Anda!\n`;
        receiptText += `Tunjukkan struk ini ke kasir\n\n`;
        receiptText += `Dicetak pada: ${new Date().toLocaleString('id-ID')}\n`;
        
        // Create blob and download
        const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
        downloadBlob(blob, `Struk-${order.id}.txt`);
        
        console.log('✅ Text file downloaded successfully');
        showNotification('✅ Struk berhasil didownload sebagai file text!', 'success');
        
    } catch (error) {
        console.error('❌ Text download error:', error);
        showNotification('❌ Gagal mendownload struk: ' + error.message, 'error');
    }
}

// Close receipt modal
function closeReceipt() {
    const receiptModal = document.getElementById('receiptModal');
    if (receiptModal) {
        receiptModal.remove();
    }
    window.currentReceiptOrder = null;
}

// Orders Functions
function loadUserOrders() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    if (userOrders.length === 0) {
        ordersList.innerHTML = `
            <div class="order-item">
                <div style="text-align: center; padding: 2rem; color: #6b7280;">
                    <h3>Belum ada pesanan</h3>
                    <p>Mulai pesan menu favorit Anda sekarang!</p>
                    <button class="btn-add-to-cart" onclick="showSection('menu')" style="margin-top: 1rem;">
                        Lihat Menu
                    </button>
                </div>
            </div>
        `;
        return;
    }
    
    let html = '';
    userOrders.forEach(order => {
        html += `
            <div class="order-item">
                <div class="order-header">
                    <div class="order-id">${order.id}</div>
                    <div class="order-status ${order.status}">${order.status}</div>
                </div>
                <div class="order-items-list">
                    ${order.items.map(item => `
                        <div class="order-item-detail">
                            <span>${item.name} x${item.quantity}</span>
                            <span>Rp ${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-total">
                    Total: Rp ${order.total.toLocaleString()}
                </div>
                <div style="margin-top: 1rem; font-size: 0.9rem; color: #6b7280;">
                    ${new Date(order.date).toLocaleString('id-ID')}
                </div>
            </div>
        `;
    });
    
    ordersList.innerHTML = html;
}

// Favorites Functions
function loadFavoriteMenus() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    if (!favoritesGrid) return;
    
    // Get most ordered items as favorites
    const itemCounts = {};
    userOrders.forEach(order => {
        order.items.forEach(item => {
            itemCounts[item.id] = (itemCounts[item.id] || 0) + item.quantity;
        });
    });
    
    favoriteMenus = Object.keys(itemCounts)
        .map(id => {
            const menuItem = menuItems.find(item => item.id == id);
            return { ...menuItem, orderCount: itemCounts[id] };
        })
        .sort((a, b) => b.orderCount - a.orderCount)
        .slice(0, 6);
    
    if (favoriteMenus.length === 0) {
        favoritesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #6b7280;">
                <h3>Belum ada menu favorit</h3>
                <p>Menu yang sering Anda pesan akan muncul di sini</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    favoriteMenus.forEach(item => {
        html += `
            <div class="menu-item">
                <div class="menu-item-image">${item.image}</div>
                <div class="menu-item-content">
                    <div class="menu-item-name">${item.name}</div>
                    <div class="menu-item-desc">Dipesan ${item.orderCount} kali</div>
                    <div class="menu-item-footer">
                        <div class="menu-item-price">Rp ${item.price.toLocaleString()}</div>
                        <button class="btn-add-to-cart" onclick="addToCart(${item.id})">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            Tambah
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    favoritesGrid.innerHTML = html;
}

// Profile Functions
function editProfile() {
    const newName = prompt('Nama baru:', currentUser.fullName);
    const newEmail = prompt('Email baru:', currentUser.email || '');
    
    if (newName && newName !== currentUser.fullName) {
        currentUser.fullName = newName;
        updateUserInfo();
        showNotification('Profil berhasil diperbarui!', 'success');
        
        // Update localStorage
        localStorage.setItem('lupycanteen_user', JSON.stringify(currentUser));
    }
    
    if (newEmail && newEmail !== currentUser.email) {
        currentUser.email = newEmail;
        updateUserInfo();
        
        // Update localStorage
        localStorage.setItem('lupycanteen_user', JSON.stringify(currentUser));
    }
}

function changePassword() {
    const currentPassword = prompt('Password saat ini:');
    const newPassword = prompt('Password baru:');
    const confirmPassword = prompt('Konfirmasi password baru:');
    
    if (newPassword && newPassword === confirmPassword) {
        showNotification('Password berhasil diubah!', 'success');
    } else if (newPassword !== confirmPassword) {
        showNotification('Konfirmasi password tidak cocok!', 'error');
    }
}

// Refresh menu data manually
function refreshMenuData() {
    console.log('🔄 Manual menu refresh initiated...');
    
    // Show loading state
    const refreshBtn = document.querySelector('.btn-refresh');
    const originalHTML = refreshBtn.innerHTML;
    refreshBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="animation: spin 1s linear infinite;">
            <path d="M1 4V10H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3.51 15A9 9 0 1 0 6 5L1 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Refreshing...</span>
    `;
    refreshBtn.disabled = true;
    
    // Load menu from API
    loadMenuFromAPI().then((success) => {
        if (success) {
            // Reload menu display
            loadMenuDisplay();
            
            showNotification('✅ Menu berhasil di-refresh dari database!', 'success');
            console.log('✅ Manual menu refresh completed successfully');
        } else {
            showNotification('⚠️ Gagal refresh menu, menggunakan data lokal', 'warning');
            console.log('⚠️ Manual menu refresh failed, using local data');
        }
        
        // Reset button
        refreshBtn.innerHTML = originalHTML;
        refreshBtn.disabled = false;
    }).catch(error => {
        console.error('❌ Manual menu refresh error:', error);
        showNotification('❌ Error saat refresh menu', 'error');
        
        // Reset button
        refreshBtn.innerHTML = originalHTML;
        refreshBtn.disabled = false;
    });
}

// Utility Functions
function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        localStorage.removeItem('lupycanteen_user');
        sessionStorage.removeItem('lupycanteen_user');
        showNotification('Logout berhasil!', 'success');
        setTimeout(() => {
            window.location.href = '../../';
        }, 1500);
    }
}

function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.getElementById('notification');
    
    // Create notification if it doesn't exist
    if (!notification) {
        const notif = document.createElement('div');
        notif.id = 'notification';
        notif.className = 'notification';
        document.body.appendChild(notif);
    }
    
    const notificationEl = document.getElementById('notification');
    notificationEl.textContent = message;
    notificationEl.className = `notification ${type} show`;
    
    // Auto hide after duration
    setTimeout(() => {
        notificationEl.classList.remove('show');
    }, duration);
    
    // Also log to console for debugging
    console.log(`[${type.toUpperCase()}] ${message}`);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC to go back to dashboard
    if (e.key === 'Escape' && currentSection !== 'dashboard') {
        showSection('dashboard');
    }
    
    // Ctrl+K for search
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
});

// Add smooth scrolling
document.documentElement.style.scrollBehavior = 'smooth';

// Close cart modal when clicking outside
document.addEventListener('click', function(e) {
    const cartModal = document.getElementById('cartModal');
    if (e.target === cartModal) {
        toggleCart();
    }
});

console.log('✅ User Dashboard Script Loaded');