// Kasir Dashboard Script
console.log('🍱 Kasir Dashboard Loading...');

const API_BASE_URL = 'http://localhost:5283/api';
let currentUser = null;
let currentOrder = [];
let currentSection = 'dashboard';

// Sample menu data with images - FALLBACK DATA
let menuItems = [
    { 
        id: 1, 
        name: 'Nasi Goreng Spesial', 
        price: 12000, 
        category: 'makanan',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop'
    },
    { 
        id: 2, 
        name: 'Mie Goreng Jawa', 
        price: 10000, 
        category: 'makanan',
        image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop'
    },
    { 
        id: 3, 
        name: 'Ayam Katsu Crispy', 
        price: 15000, 
        category: 'makanan',
        image: 'https://www.frisianflag.com/storage/app/media/uploaded-files/ayam-katsu-sederhana.jpg'
    },
    { 
        id: 4, 
        name: 'Gado-Gado', 
        price: 11000, 
        category: 'makanan',
        image: 'https://static.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p2/74/2025/01/27/Gado-Gado-2337756915.jpg'
    },
    { 
        id: 5, 
        name: 'Bakso Malang', 
        price: 14000, 
        category: 'makanan',
        image: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Baso_Malang_Karapitan.JPG'
    },
    { 
        id: 6, 
        name: 'Soto Ayam', 
        price: 13000, 
        category: 'makanan',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop'
    },
    { 
        id: 7, 
        name: 'Es Teh Manis', 
        price: 5000, 
        category: 'minuman',
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop'
    },
    { 
        id: 8, 
        name: 'Es Jeruk', 
        price: 6000, 
        category: 'minuman',
        image: 'https://cdn.yummy.co.id/content-images/images/20201013/WqfCTib25afAXzGCyok7dmAmTKGeGpkM-31363032353730383236d41d8cd98f00b204e9800998ecf8427e.jpg?x-oss-process=image/resize,w_388,h_388,m_fixed,x-oss-process=image/format,webp'
    },
    { 
        id: 9, 
        name: 'Kopi Susu', 
        price: 7000, 
        category: 'minuman',
        image: 'https://cdn.yummy.co.id/content-images/images/20230119/rAvgrbBssoG6rNVTeqyzirA1WhQE7Nkl-31363734313235353439d41d8cd98f00b204e9800998ecf8427e.jpg?x-oss-process=image/resize,w_388,h_388,m_fixed,x-oss-process=image/format,webp'
    },
    { 
        id: 10, 
        name: 'Jus Buah Segar', 
        price: 8000, 
        category: 'minuman',
        image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=300&fit=crop'
    },
    { 
        id: 11, 
        name: 'Pisang Goreng', 
        price: 4000, 
        category: 'snack',
        image: 'https://cdn.grid.id/crop/0x0:0x0/700x465/smart/filters:format(webp):quality(100)/photo/2025/12/05/pisang-goreng-tandukjpg-20251205043631.jpg'
    },
    { 
        id: 12, 
        name: 'Keripik Singkong', 
        price: 5000, 
        category: 'snack',
        image: 'https://filebroker-cdn.lazada.co.id/kf/Sec3e758b09e246d080879f6b2b919d8bP.jpg'
    },
    { 
        id: 13, 
        name: 'Roti Bakar', 
        price: 8000, 
        category: 'snack',
        image: 'data:image/jpeg;base64,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'
    }
];

// Sample orders data
let ordersData = [
    {
        id: 'ORD001',
        customer: 'Ahmad Rizki',
        items: [
            { name: 'Nasi Goreng Spesial', quantity: 2, price: 12000 },
            { name: 'Es Teh Manis', quantity: 2, price: 5000 }
        ],
        total: 34000,
        status: 'completed',
        time: '10:30'
    },
    {
        id: 'ORD002',
        customer: 'Siti Nurhaliza',
        items: [
            { name: 'Ayam Katsu Crispy', quantity: 1, price: 15000 },
            { name: 'Jus Buah Segar', quantity: 1, price: 8000 }
        ],
        total: 23000,
        status: 'pending',
        time: '11:15'
    }
];

// Load orders from user system
function loadUserOrders() {
    try {
        const kasirOrders = JSON.parse(localStorage.getItem('kasir_orders') || '[]');
        
        // Merge with existing orders, avoid duplicates
        kasirOrders.forEach(userOrder => {
            const exists = ordersData.find(order => order.id === userOrder.id);
            if (!exists) {
                // Convert user order format to kasir format
                const kasirOrder = {
                    id: userOrder.id,
                    customer: userOrder.customer,
                    customerPhone: userOrder.customerPhone,
                    items: userOrder.items,
                    total: userOrder.total,
                    status: userOrder.status,
                    time: new Date(userOrder.date).toLocaleTimeString('id-ID', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    }),
                    date: userOrder.date,
                    orderNumber: userOrder.orderNumber,
                    paymentMethod: userOrder.paymentMethod || 'cash',
                    source: 'user_app' // Mark as coming from user app
                };
                
                ordersData.unshift(kasirOrder);
            }
        });
        
        console.log(`📋 Loaded ${kasirOrders.length} orders from user system`);
        
    } catch (error) {
        console.error('Error loading user orders:', error);
    }
}

// Check for new orders periodically
function startOrderMonitoring() {
    // Load orders on start
    loadUserOrders();
    
    // Check for new orders every 10 seconds
    setInterval(() => {
        const previousCount = ordersData.length;
        loadUserOrders();
        
        // Show notification if new orders arrived
        if (ordersData.length > previousCount) {
            const newOrdersCount = ordersData.length - previousCount;
            showNotification(`🔔 ${newOrdersCount} pesanan baru dari aplikasi user!`, 'info');
            
            // Update displays
            updateOrdersDisplay();
            updateDashboardStats();
            
            // Play notification sound (optional)
            playNotificationSound();
        }
    }, 10000); // Check every 10 seconds
}

// Play notification sound for new orders
function playNotificationSound() {
    try {
        // Create audio context for notification sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        console.log('Could not play notification sound:', error);
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Kasir Dashboard Initializing...');
    
    // Check authentication
    checkKasirAuth();
    
    // Initialize dashboard
    if (currentUser) {
        initializeDashboard();
        updateClock();
        updateHeaderClock();
        setInterval(updateClock, 1000);
        setInterval(updateHeaderClock, 1000);
    }
});

function updateHeaderClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    const dateString = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const headerTime = document.getElementById('headerTime');
    const headerDate = document.getElementById('headerDate');
    
    if (headerTime) headerTime.textContent = timeString;
    if (headerDate) headerDate.textContent = dateString;
}

function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    const dateString = now.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    
    const currentTimeEl = document.getElementById('currentTime');
    const currentDateEl = document.getElementById('currentDate');
    
    if (currentTimeEl) currentTimeEl.textContent = timeString;
    if (currentDateEl) currentDateEl.textContent = dateString;
}

function showNotifications() {
    const notifications = [
        '🔔 Pesanan #ORD003 siap diambil',
        '📦 Stok Nasi Goreng tinggal 5 porsi',
        '💰 Target penjualan hari ini tercapai 80%'
    ];
    
    const message = notifications.join('\n');
    alert('📢 Notifikasi:\n\n' + message);
}

function updateStatsPeriod() {
    const period = document.getElementById('statsPeriod').value;
    console.log('📊 Updating stats for period:', period);
    
    // Simulate different data for different periods
    let multiplier = 1;
    switch(period) {
        case 'week': multiplier = 7; break;
        case 'month': multiplier = 30; break;
        default: multiplier = 1;
    }
    
    const baseOrders = ordersData.length;
    const baseRevenue = ordersData.reduce((sum, order) => sum + order.total, 0);
    
    document.getElementById('todayOrders').textContent = baseOrders * multiplier;
    document.getElementById('todayRevenue').textContent = `Rp ${(baseRevenue * multiplier).toLocaleString()}`;
    
    showNotification(`Statistik diperbarui untuk ${period === 'today' ? 'hari ini' : period === 'week' ? 'minggu ini' : 'bulan ini'}`, 'info');
}

function checkKasirAuth() {
    const userData = localStorage.getItem('lupycanteen_user') || sessionStorage.getItem('lupycanteen_user');
    
    if (!userData) {
        alert('Silakan login sebagai kasir terlebih dahulu.');
        window.location.href = '../';
        return;
    }
    
    try {
        currentUser = JSON.parse(userData);
        
        // Check if user is kasir
        if (currentUser.role !== 'Kasir') {
            alert('Akses ditolak. Halaman ini khusus untuk kasir.');
            if (currentUser.role === 'Admin') {
                window.location.href = '../home/admin-dashboard.html';
            } else {
                window.location.href = '../user/user-dashboard.html';
            }
            return;
        }
        
        console.log('✅ Kasir authenticated:', currentUser.fullName);
        updateKasirInfo();
        
    } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('lupycanteen_user');
        sessionStorage.removeItem('lupycanteen_user');
        alert('Data login tidak valid. Silakan login kembali.');
        window.location.href = '../';
    }
}

function updateKasirInfo() {
    document.getElementById('kasirName').textContent = currentUser.fullName;
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
    console.log('📊 Initializing kasir dashboard...');
    
    // Load menu from API first, then continue with initialization
    loadMenuFromAPI().then(() => {
        // Start order monitoring for user orders
        startOrderMonitoring();
        
        // Load stats
        loadQuickStats();
        
        // Load menu for POS
        loadPOSMenu();
        
        // Load menu display
        loadMenuDisplay();
        
        // Load orders
        loadOrdersData();
        
        // Load reports
        loadReportsData();
        
        console.log('✅ Kasir dashboard initialized');
    }).catch(error => {
        console.error('❌ Error during initialization:', error);
        // Continue with fallback data
        startOrderMonitoring();
        loadQuickStats();
        loadPOSMenu();
        loadMenuDisplay();
        loadOrdersData();
        loadReportsData();
        console.log('✅ Kasir dashboard initialized with fallback data');
    });
}

function loadQuickStats() {
    // Calculate today's stats
    const todayOrders = ordersData.length;
    const todayRevenue = ordersData.reduce((sum, order) => sum + order.total, 0);
    const totalMenus = menuItems.length;
    
    document.getElementById('todayOrders').textContent = todayOrders;
    document.getElementById('todayRevenue').textContent = `Rp ${todayRevenue.toLocaleString()}`;
    document.getElementById('totalMenus').textContent = totalMenus;
}

function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    document.getElementById('currentTime').textContent = timeString;
}

function showSection(sectionName) {
    console.log('📍 Showing section:', sectionName);
    
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Hide main dashboard content
    if (sectionName !== 'dashboard') {
        document.querySelector('.quick-stats').style.display = 'none';
        document.querySelector('.main-actions').style.display = 'none';
    } else {
        document.querySelector('.quick-stats').style.display = 'grid';
        document.querySelector('.main-actions').style.display = 'block';
    }
    
    // Show target section
    if (sectionName !== 'dashboard') {
        const targetSection = document.getElementById(sectionName + 'Section');
        if (targetSection) {
            targetSection.style.display = 'block';
            currentSection = sectionName;
            
            // Load section-specific data
            switch(sectionName) {
                case 'pos':
                    loadPOSMenu();
                    break;
                case 'orders':
                    loadOrdersData();
                    break;
                case 'menu':
                    loadMenuDisplay();
                    break;
                case 'reports':
                    loadReportsData();
                    break;
            }
        }
    } else {
        currentSection = 'dashboard';
    }
}

// POS Functions with Large Images
function loadPOSMenu() {
    const menuGrid = document.getElementById('posMenuGrid');
    if (!menuGrid) return;
    
    console.log('🍽️ Loading POS menu with large images...');
    
    let html = '';
    menuItems.forEach((item, index) => {
        html += `
            <div class="menu-item" onclick="addToOrder(${item.id})" style="animation-delay: ${index * 0.05}s">
                <div class="menu-item-image">
                    <img src="${item.image}" 
                         alt="${item.name}" 
                         loading="lazy"
                         onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;font-size:3rem;color:#9ca3af;\\'>${getEmojiForCategory(item.category)}</div>'">
                </div>
                <div class="menu-item-content">
                    <div class="menu-item-name">${item.name}</div>
                    <div class="menu-item-price">Rp ${item.price.toLocaleString()}</div>
                </div>
            </div>
        `;
    });
    
    menuGrid.innerHTML = html;
    console.log('✅ POS menu loaded with', menuItems.length, 'items');
}

function addToOrder(itemId) {
    const menuItem = menuItems.find(item => item.id === itemId);
    if (!menuItem) return;
    
    const existingItem = currentOrder.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        currentOrder.push({
            id: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1
        });
    }
    
    updateOrderDisplay();
    showNotification(`${menuItem.name} ditambahkan ke pesanan`, 'success');
}

function updateOrderDisplay() {
    const orderItems = document.getElementById('orderItems');
    const orderTotal = document.getElementById('orderTotal');
    
    if (currentOrder.length === 0) {
        orderItems.innerHTML = '<p class="empty-order">🛒 Belum ada item dipilih<br><small>Klik menu di sebelah kiri untuk menambah item</small></p>';
        orderTotal.textContent = 'Rp 0';
        return;
    }
    
    let total = 0;
    let html = '';
    
    currentOrder.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="order-item">
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price-unit">Rp ${item.price.toLocaleString()} / item</div>
                </div>
                <div class="item-quantity">
                    <button class="qty-btn" onclick="updateOrderQuantity(${item.id}, -1)">−</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateOrderQuantity(${item.id}, 1)">+</button>
                </div>
                <div class="item-total">Rp ${itemTotal.toLocaleString()}</div>
            </div>
        `;
    });
    
    orderItems.innerHTML = html;
    orderTotal.textContent = `Rp ${total.toLocaleString()}`;
}

function updateOrderQuantity(itemId, change) {
    const item = currentOrder.find(item => item.id === itemId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        currentOrder = currentOrder.filter(item => item.id !== itemId);
    }
    
    updateOrderDisplay();
}

function clearOrder() {
    if (currentOrder.length === 0) return;
    
    if (confirm('Apakah Anda yakin ingin menghapus semua item?')) {
        currentOrder = [];
        updateOrderDisplay();
        showNotification('Pesanan dikosongkan', 'info');
    }
}

function processOrder() {
    if (currentOrder.length === 0) {
        showNotification('Tidak ada item untuk diproses', 'error');
        return;
    }
    
    const customerName = prompt('Nama pelanggan:');
    if (!customerName) return;
    
    const total = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderId = 'ORD' + String(ordersData.length + 1).padStart(3, '0');
    
    const newOrder = {
        id: orderId,
        customer: customerName,
        items: [...currentOrder],
        total: total,
        status: 'pending',
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    
    ordersData.unshift(newOrder);
    
    // Clear current order
    currentOrder = [];
    updateOrderDisplay();
    
    // Update stats
    loadQuickStats();
    
    showNotification(`Pesanan ${orderId} berhasil diproses!`, 'success');
    
    // Print receipt (simulation)
    setTimeout(() => {
        if (confirm('Cetak struk untuk pesanan ini?')) {
            printReceipt(newOrder);
        }
    }, 1000);
}

function printReceipt(order) {
    let receiptContent = `
=================================
        LUPYCANTEEN
     Struk Pembayaran
=================================
No. Pesanan: ${order.id}
Pelanggan: ${order.customer}
Waktu: ${order.time}
Kasir: ${currentUser.fullName}
---------------------------------
`;

    order.items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        receiptContent += `${item.name}\n`;
        receiptContent += `${item.quantity} x Rp ${item.price.toLocaleString()} = Rp ${itemTotal.toLocaleString()}\n\n`;
    });

    receiptContent += `---------------------------------
TOTAL: Rp ${order.total.toLocaleString()}
=================================
    Terima kasih atas kunjungan
         Anda di LupyCanteen!
=================================`;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Struk - ${order.id}</title>
            <style>
                body { font-family: 'Courier New', monospace; font-size: 12px; margin: 20px; }
                pre { white-space: pre-wrap; }
            </style>
        </head>
        <body>
            <pre>${receiptContent}</pre>
            <script>
                window.onload = function() {
                    window.print();
                    window.close();
                }
            </script>
        </body>
        </html>
    `);
}

// Orders Management
function loadOrdersData() {
    const tableBody = document.getElementById('ordersTableBody');
    if (!tableBody) return;
    
    if (ordersData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8">Belum ada pesanan hari ini</td></tr>';
        return;
    }
    
    let html = '';
    ordersData.forEach(order => {
        const itemsCount = order.items.length;
        const statusClass = order.status.toLowerCase();
        const sourceIcon = order.source === 'user_app' ? '📱' : '🏪';
        const sourceText = order.source === 'user_app' ? 'App' : 'Kasir';
        
        html += `
            <tr class="${order.source === 'user_app' ? 'user-order' : ''}">
                <td>${order.id}</td>
                <td>
                    ${order.customer}
                    ${order.customerPhone ? `<br><small>${order.customerPhone}</small>` : ''}
                </td>
                <td>${itemsCount} items</td>
                <td>Rp ${order.total.toLocaleString()}</td>
                <td><span class="status-badge ${statusClass}">${order.status}</span></td>
                <td>${order.time}</td>
                <td>
                    <span class="source-badge" title="Sumber: ${sourceText}">
                        ${sourceIcon} ${sourceText}
                    </span>
                </td>
                <td>
                    <button onclick="viewOrderDetails('${order.id}')" class="btn-detail">Detail</button>
                    ${order.status === 'pending' ? `
                        <button onclick="updateOrderStatus('${order.id}', 'processing')" class="btn-process">Proses</button>
                    ` : ''}
                    ${order.status === 'processing' ? `
                        <button onclick="updateOrderStatus('${order.id}', 'completed')" class="btn-complete">Selesai</button>
                    ` : ''}
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

function updateOrderStatus(orderId, newStatus) {
    const order = ordersData.find(o => o.id === orderId);
    if (!order) return;
    
    order.status = newStatus;
    
    // Update in localStorage if it's a user order
    if (order.source === 'user_app') {
        try {
            let kasirOrders = JSON.parse(localStorage.getItem('kasir_orders') || '[]');
            const orderIndex = kasirOrders.findIndex(o => o.id === orderId);
            if (orderIndex !== -1) {
                kasirOrders[orderIndex].status = newStatus;
                localStorage.setItem('kasir_orders', JSON.stringify(kasirOrders));
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    }
    
    // Refresh display
    loadOrdersData();
    loadQuickStats();
    
    // Show notification
    const statusText = {
        'processing': 'sedang diproses',
        'completed': 'selesai',
        'cancelled': 'dibatalkan'
    };
    
    showNotification(`Pesanan ${orderId} ${statusText[newStatus]}!`, 'success');
}

function viewOrderDetails(orderId) {
    const order = ordersData.find(o => o.id === orderId);
    if (!order) return;
    
    // Create modal for order details
    const modal = document.createElement('div');
    modal.className = 'order-detail-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>📋 Detail Pesanan</h3>
                <button onclick="this.closest('.order-detail-modal').remove()" class="modal-close">×</button>
            </div>
            <div class="modal-body">
                <div class="order-info">
                    <div class="info-group">
                        <label>ID Pesanan:</label>
                        <span>${order.id}</span>
                    </div>
                    <div class="info-group">
                        <label>Pelanggan:</label>
                        <span>${order.customer}</span>
                    </div>
                    ${order.customerPhone ? `
                        <div class="info-group">
                            <label>No. Telepon:</label>
                            <span>${order.customerPhone}</span>
                        </div>
                    ` : ''}
                    <div class="info-group">
                        <label>Waktu Pesan:</label>
                        <span>${order.time}</span>
                    </div>
                    <div class="info-group">
                        <label>Status:</label>
                        <span class="status-badge ${order.status.toLowerCase()}">${order.status}</span>
                    </div>
                    <div class="info-group">
                        <label>Sumber:</label>
                        <span>${order.source === 'user_app' ? '📱 Aplikasi User' : '🏪 Kasir'}</span>
                    </div>
                    ${order.orderNumber ? `
                        <div class="info-group">
                            <label>No. Antrian:</label>
                            <span><strong>#${order.orderNumber}</strong></span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="order-items">
                    <h4>📦 Item Pesanan:</h4>
                    <div class="items-list">
                        ${order.items.map(item => `
                            <div class="item-detail">
                                <div class="item-info">
                                    <span class="item-name">${item.name}</span>
                                    <span class="item-qty">${item.quantity}x</span>
                                </div>
                                <div class="item-prices">
                                    <span class="item-price">Rp ${item.price.toLocaleString()}</span>
                                    <span class="item-total">Rp ${(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="order-total">
                        <div class="total-line">
                            <span>Total Pesanan:</span>
                            <span><strong>Rp ${order.total.toLocaleString()}</strong></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                ${order.status === 'pending' ? `
                    <button onclick="updateOrderStatus('${order.id}', 'processing'); this.closest('.order-detail-modal').remove();" class="btn-process">
                        🔄 Mulai Proses
                    </button>
                ` : ''}
                ${order.status === 'processing' ? `
                    <button onclick="updateOrderStatus('${order.id}', 'completed'); this.closest('.order-detail-modal').remove();" class="btn-complete">
                        ✅ Tandai Selesai
                    </button>
                ` : ''}
                <button onclick="this.closest('.order-detail-modal').remove()" class="btn-close">
                    Tutup
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Update dashboard stats to include user orders
function updateDashboardStats() {
    loadQuickStats();
}

// Menu Display with Large Images
function loadMenuDisplay() {
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;
    
    console.log('🍽️ Loading kasir menu with large images...');
    
    let html = '';
    menuItems.forEach((item, index) => {
        html += `
            <div class="menu-item" data-category="${item.category}" onclick="addToOrder(${item.id})" style="animation-delay: ${index * 0.1}s">
                <div class="menu-item-image">
                    <img src="${item.image}" 
                         alt="${item.name}" 
                         loading="lazy"
                         onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;font-size:3rem;color:#9ca3af;\\'>${getEmojiForCategory(item.category)}</div>'">
                </div>
                <div class="menu-item-content">
                    <div class="menu-item-name">${item.name}</div>
                    <div class="menu-item-price">Rp ${item.price.toLocaleString()}</div>
                    <div style="margin-top: 0.5rem; font-size: 0.8rem; color: #666; text-transform: capitalize; background: #f3f4f6; padding: 4px 8px; border-radius: 12px; display: inline-block;">
                        ${item.category}
                    </div>
                </div>
            </div>
        `;
    });
    
    menuGrid.innerHTML = html;
    console.log('✅ Kasir menu loaded with', menuItems.length, 'items');
}

// Helper function for emoji fallback
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

// Reports
function loadReportsData() {
    const todaySales = ordersData.reduce((sum, order) => sum + order.total, 0);
    const todayTransactions = ordersData.length;
    
    // Find top menu
    const menuCount = {};
    ordersData.forEach(order => {
        order.items.forEach(item => {
            menuCount[item.name] = (menuCount[item.name] || 0) + item.quantity;
        });
    });
    
    const topMenu = Object.keys(menuCount).reduce((a, b) => 
        menuCount[a] > menuCount[b] ? a : b, 'Tidak ada data'
    );
    
    document.getElementById('reportTodaySales').textContent = `Rp ${todaySales.toLocaleString()}`;
    document.getElementById('reportTodayTransactions').textContent = todayTransactions;
    document.getElementById('reportTopMenu').textContent = topMenu;
    
    // Load recent transactions
    const transactionsList = document.getElementById('recentTransactionsList');
    if (ordersData.length === 0) {
        transactionsList.innerHTML = '<p>Belum ada transaksi hari ini</p>';
        return;
    }
    
    let html = '';
    ordersData.slice(0, 5).forEach(order => {
        html += `
            <div style="padding: 0.75rem; border-bottom: 1px solid #e9ecef; display: flex; justify-content: space-between;">
                <div>
                    <strong>${order.id}</strong> - ${order.customer}<br>
                    <small>${order.time}</small>
                </div>
                <div style="text-align: right;">
                    <strong>Rp ${order.total.toLocaleString()}</strong><br>
                    <span class="status-badge ${order.status}">${order.status}</span>
                </div>
            </div>
        `;
    });
    
    transactionsList.innerHTML = html;
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
            // Reload menu displays
            loadPOSMenu();
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

// Cleanup unwanted menu items from database
async function cleanupUnwantedMenus() {
    console.log('🧹 Manual menu cleanup initiated...');
    
    if (!confirm('Apakah Anda yakin ingin menghapus menu yang tidak diinginkan dari database?\n\nMenu yang akan dihapus:\n- Churros Coklat\n- Kue Cubit Rainbow\n- Risoles\n- Sate Ayam Spesial\n- Es Camour Segar\n- Jus Alpuket\n- Dan menu lainnya yang tidak sesuai')) {
        return;
    }
    
    // Show loading state
    const cleanupBtn = document.querySelector('.btn-cleanup');
    const originalHTML = cleanupBtn.innerHTML;
    cleanupBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="animation: spin 1s linear infinite;">
            <path d="M3 6H5H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2C10.5304 2 11.0391 2.21071 11.4142 2.58579C11.7893 2.96086 12 3.46957 12 4V6M15 6V16C15 16.5304 14.7893 17.0391 14.4142 17.4142C14.0391 17.7893 13.5304 18 13 18H7C6.46957 18 5.96086 17.7893 5.58579 17.4142C5.21071 17.0391 5 16.5304 5 16V6H15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Cleaning...</span>
    `;
    cleanupBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/menu/cleanup-unwanted`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Cleanup completed:', result);
            
            showNotification(`✅ ${result.message}`, 'success');
            
            // Refresh menu after cleanup
            setTimeout(() => {
                refreshMenuData();
            }, 1000);
            
        } else {
            const error = await response.text();
            console.error('❌ Cleanup failed:', error);
            showNotification('❌ Gagal membersihkan menu dari database', 'error');
        }
        
    } catch (error) {
        console.error('❌ Cleanup error:', error);
        showNotification('❌ Error saat membersihkan menu', 'error');
    } finally {
        // Reset button
        cleanupBtn.innerHTML = originalHTML;
        cleanupBtn.disabled = false;
    }
}

// Delete specific menu item by name
async function deleteSateAyamSpesial() {
    console.log('🗑️ Deleting Sate Ayam Spesial...');
    
    if (!confirm('Apakah Anda yakin ingin menghapus "Sate Ayam Spesial" dari database?')) {
        return;
    }
    
    // Show loading state
    const deleteBtn = document.querySelector('.btn-delete-sate');
    const originalHTML = deleteBtn.innerHTML;
    deleteBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="animation: spin 1s linear infinite;">
            <path d="M10 2L3 7L10 12L17 7L10 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Menghapus...</span>
    `;
    deleteBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/menu/by-name/Sate Ayam Spesial`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Sate Ayam Spesial deleted:', result);
            
            showNotification(`✅ ${result.message}`, 'success');
            
            // Refresh menu after deletion
            setTimeout(() => {
                refreshMenuData();
            }, 1000);
            
        } else {
            const error = await response.text();
            console.error('❌ Delete failed:', error);
            showNotification('❌ Gagal menghapus Sate Ayam Spesial', 'error');
        }
        
    } catch (error) {
        console.error('❌ Delete error:', error);
        showNotification('❌ Error saat menghapus menu', 'error');
    } finally {
        // Reset button
        deleteBtn.innerHTML = originalHTML;
        deleteBtn.disabled = false;
    }
}

// Utility Functions
function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        localStorage.removeItem('lupycanteen_user');
        sessionStorage.removeItem('lupycanteen_user');
        showNotification('Logout berhasil!', 'success');
        setTimeout(() => {
            // Fixed logout redirect path - from kasir/ folder to root
            console.log('🔄 Kasir logout - redirecting to homepage...');
            window.location.href = '../';
        }, 1500);
    }
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC to go back to dashboard
    if (e.key === 'Escape' && currentSection !== 'dashboard') {
        showSection('dashboard');
    }
    
    // F1 for POS
    if (e.key === 'F1') {
        e.preventDefault();
        showSection('pos');
    }
    
    // F2 for Orders
    if (e.key === 'F2') {
        e.preventDefault();
        showSection('orders');
    }
    
    // F3 for Menu
    if (e.key === 'F3') {
        e.preventDefault();
        showSection('menu');
    }
    
    // F4 for Reports
    if (e.key === 'F4') {
        e.preventDefault();
        showSection('reports');
    }
    
    // Ctrl+P for print (in POS section)
    if (e.ctrlKey && e.key === 'p' && currentSection === 'pos') {
        e.preventDefault();
        if (currentOrder.length > 0) {
            processOrder();
        }
    }
});

// Add smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';

// Add loading states
function showLoading(elementId, message = 'Memuat...') {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div class="loading">${message}</div>`;
    }
}

// Enhanced notification system
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

// Add performance monitoring
const performanceMonitor = {
    startTime: Date.now(),
    
    logAction: function(action) {
        const elapsed = Date.now() - this.startTime;
        console.log(`⚡ ${action} completed in ${elapsed}ms`);
        this.startTime = Date.now();
    }
};

// Enhanced error handling
window.addEventListener('error', function(e) {
    console.error('💥 Dashboard Error:', e.error);
    showNotification('Terjadi kesalahan sistem. Silakan refresh halaman.', 'error', 5000);
});

// Add service worker for offline capability (basic)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Register service worker for offline functionality
        console.log('🔧 Service Worker support detected');
    });
}

console.log('✅ Kasir Dashboard Script Loaded - Enhanced Version');