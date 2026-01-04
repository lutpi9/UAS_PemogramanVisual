// Main App Script - MENU LOADING COMPLETELY DISABLED
console.log('🚀 LupyCanteen Main App Script Loading... v20250101-CHECKOUT-FIX-V5');
const API_BASE_URL = 'http://localhost:5283/api';
let currentUser = null;
let cart = [];
let cartCount = 0;
let currentSection = 'home';
let menuItems = []; // Cache menu items from API

console.log('🛒 Initial cart state:', cart);
console.log('🛒 Initial cartCount:', cartCount);

// DISABLE ALL MENU LOADING FUNCTIONS
function loadHomepageMenuItems() {
    console.log('🚫 MENU LOADING DISABLED - Using static HTML only');
    return; // Exit immediately
}

function loadMenuItems() {
    console.log('🚫 API MENU LOADING DISABLED');
    return; // Exit immediately
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 LupyCanteen Main App Loading...');
    
    // Force show admin dashboard button
    const adminDashboardBtn = document.getElementById('adminDashboardBtn');
    if (adminDashboardBtn) {
        adminDashboardBtn.style.display = 'flex';
        adminDashboardBtn.style.visibility = 'visible';
        adminDashboardBtn.style.opacity = '1';
        console.log('✅ Admin Dashboard button forced to show');
    }
    
    // Add a small delay to ensure DOM is fully loaded
    setTimeout(() => {
        // Check if user is logged in
        checkAuthentication();
        
        // Initialize app if authenticated
        if (currentUser) {
            initializeApp();
        }
        
        // Force check dashboard button visibility after 1 second
        setTimeout(() => {
            if (adminDashboardBtn) {
                console.log('🔄 Double-checking admin dashboard button visibility...');
                adminDashboardBtn.style.display = 'flex';
                adminDashboardBtn.style.visibility = 'visible';
                adminDashboardBtn.style.opacity = '1';
            }
        }, 1000);
    }, 100);
});

function checkAuthentication() {
    const userData = localStorage.getItem('lupycanteen_user') || sessionStorage.getItem('lupycanteen_user');
    
    console.log('🔍 DEBUG: Checking authentication...');
    console.log('🔍 DEBUG: User data found:', userData ? 'YES' : 'NO');
    
    if (!userData) {
        console.log('❌ No user data found - redirecting to login');
        alert('Silakan login terlebih dahulu.');
        window.location.href = '../index.html';
        return;
    }
    
    try {
        currentUser = JSON.parse(userData);
        console.log('✅ User authenticated:', currentUser.fullName, currentUser.role);
        console.log('🔍 DEBUG: Full user object:', currentUser);
        
        // AUTO-REDIRECT KASIR TO KASIR DASHBOARD
        if (currentUser.role === 'Kasir') {
            console.log('🚀 Kasir detected - auto-redirecting to kasir dashboard...');
            setTimeout(() => {
                window.location.href = 'kasir/kasir-dashboard.html';
            }, 1000);
            return;
        }
        
        updateUserInterface();
    } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('lupycanteen_user');
        sessionStorage.removeItem('lupycanteen_user');
        alert('Data login tidak valid. Silakan login kembali.');
        window.location.href = '../index.html';
    }
}

function updateUserInterface() {
    // Update user info in navigation
    document.getElementById('userName').textContent = currentUser.fullName;
    document.getElementById('userRole').textContent = currentUser.role;
    
    // Debug logging
    console.log('🔍 DEBUG: User role:', currentUser.role);
    console.log('🔍 DEBUG: Is Admin?', currentUser.role === 'Admin');
    console.log('🔍 DEBUG: Is Kasir?', currentUser.role === 'Kasir');
    console.log('🔍 DEBUG: Should show dashboard?', currentUser.role === 'Admin' || currentUser.role === 'Kasir');
    
    // Show admin features for admin/kasir
    if (currentUser.role === 'Admin' || currentUser.role === 'Kasir') {
        console.log('✅ Showing admin dashboard button for admin/kasir');
        
        // Show prominent Admin Dashboard button
        const adminDashboardBtn = document.getElementById('adminDashboardBtn');
        if (adminDashboardBtn) {
            adminDashboardBtn.style.display = 'flex';
            adminDashboardBtn.style.visibility = 'visible';
            adminDashboardBtn.style.opacity = '1';
            console.log('✅ Admin Dashboard button shown');
        } else {
            console.error('❌ Admin Dashboard button element not found!');
        }
        
        // Hide regular user info section for admin users
        const userInfoSection = document.getElementById('userInfoSection');
        if (userInfoSection) {
            userInfoSection.style.display = 'none';
            console.log('✅ User info section hidden for admin');
        }
        
        // Method 2: Dashboard link in main navigation (keep existing)
        const adminNavLink = document.getElementById('adminNavLink');
        if (adminNavLink) {
            // Multiple methods to ensure visibility
            adminNavLink.style.display = 'block';
            adminNavLink.style.visibility = 'visible';
            adminNavLink.style.opacity = '1';
            adminNavLink.classList.add('show-admin');
            adminNavLink.removeAttribute('hidden');
            
            // Force remove any inline styles that might hide it
            adminNavLink.style.removeProperty('display');
            adminNavLink.style.display = 'block';
            
            console.log('✅ Admin nav link in main navigation shown');
        }
        
        // Method 3: Force show after delay (fallback)
        setTimeout(() => {
            const adminDashboardBtnDelayed = document.getElementById('adminDashboardBtn');
            const adminNavLinkDelayed = document.getElementById('adminNavLink');
            
            if (adminDashboardBtnDelayed && adminDashboardBtnDelayed.style.display === 'none') {
                console.log('🔧 Force showing admin dashboard button after delay');
                adminDashboardBtnDelayed.style.display = 'flex';
                adminDashboardBtnDelayed.style.visibility = 'visible';
            }
            
            if (adminNavLinkDelayed && adminNavLinkDelayed.style.display === 'none') {
                console.log('🔧 Force showing admin nav link after delay');
                adminNavLinkDelayed.style.display = 'block';
                adminNavLinkDelayed.style.visibility = 'visible';
                adminNavLinkDelayed.classList.add('show-admin');
            }
        }, 1000);
        
    } else {
        console.log('❌ User is not admin/kasir, showing regular user interface');
        
        // Show regular user info section for non-admin users
        const userInfoSection = document.getElementById('userInfoSection');
        if (userInfoSection) {
            userInfoSection.style.display = 'flex';
            console.log('✅ User info section shown for regular user');
        }
        
        // Hide admin dashboard button for non-admin users
        const adminDashboardBtn = document.getElementById('adminDashboardBtn');
        const adminNavLink = document.getElementById('adminNavLink');
        
        if (adminDashboardBtn) {
            // Keep admin dashboard button visible
            adminDashboardBtn.style.display = 'flex';
        }
        
        if (adminNavLink) {
            adminNavLink.style.display = 'none';
            adminNavLink.classList.remove('show-admin');
        }
    }
    
    // Update hero welcome message
    const heroUserName = document.getElementById('heroUserName');
    if (heroUserName) {
        heroUserName.textContent = currentUser.fullName;
    }
    
    // Update admin welcome name
    const adminWelcomeName = document.getElementById('adminWelcomeName');
    if (adminWelcomeName) {
        adminWelcomeName.textContent = currentUser.fullName;
    }
}

function initializeApp() {
    console.log('Initializing LupyCanteen App...');
    
    // Setup navigation
    setupNavigation();
    
    // Setup cart
    updateCartCount();
    
    // MENU LOADING COMPLETELY DISABLED
    console.log('🚫 Homepage menu loading DISABLED - using static HTML');
    
    // Force dashboard button visibility for admin users
    if (currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Kasir')) {
        console.log('🔧 Force enabling admin dashboard features for admin user');
        setTimeout(() => {
            const adminDashboardBtn = document.getElementById('adminDashboardBtn');
            const adminNavLink = document.getElementById('adminNavLink');
            const userInfoSection = document.getElementById('userInfoSection');
            
            if (adminDashboardBtn) {
                adminDashboardBtn.style.display = 'flex';
                adminDashboardBtn.style.visibility = 'visible';
                console.log('✅ Admin Dashboard button forced to show');
            }
            
            if (userInfoSection) {
                userInfoSection.style.display = 'none';
                console.log('✅ User info section hidden for admin');
            }
            
            if (adminNavLink) {
                adminNavLink.style.display = 'block';
                adminNavLink.style.visibility = 'visible';
                adminNavLink.classList.add('show-admin');
                console.log('✅ Admin nav link forced to show');
                
                // Debug: Check if element is actually visible
                const rect = adminNavLink.getBoundingClientRect();
                console.log('🔍 Admin nav link position:', {
                    width: rect.width,
                    height: rect.height,
                    top: rect.top,
                    left: rect.left,
                    visible: rect.width > 0 && rect.height > 0
                });
            }
            
            // Additional debug: List all navigation elements
            const allNavElements = document.querySelectorAll('.nav-cta > *');
            console.log('🔍 All navigation elements:', Array.from(allNavElements).map(el => ({
                tagName: el.tagName,
                id: el.id,
                className: el.className,
                display: window.getComputedStyle(el).display,
                visibility: window.getComputedStyle(el).visibility
            })));
            
        }, 500);
    }
    
    console.log('LupyCanteen App Ready!');
}

// Load homepage menu items function
function loadHomepageMenuItemsFromAPI() {
    const menuContainer = document.getElementById('homepageMenuContainer') || document.querySelector('.menu-container');
    if (!menuContainer) {
        console.error('Homepage menu container not found!');
        return;
    }
    
    console.log('Menu container found:', menuContainer);
    
    // Check if menu items already exist (static fallback)
    const existingCards = menuContainer.querySelectorAll('.menu-card');
    if (existingCards.length > 0) {
        console.log('Static menu items already present:', existingCards.length);
        
        // Add enhanced functionality to existing cards
        existingCards.forEach(card => {
            // Add hover effects or other enhancements if needed
            card.classList.add('enhanced');
        });
        
        // Menu is already loaded, no need to replace
        return;
    }
    
    // If no static menu exists, load dynamic menu (fallback)
    const homepageMenus = [
        { name: 'Nasi Goreng Spesial', price: 12000, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop', badge: 'Best Seller' },
        { name: 'Mie Goreng Jawa', price: 10000, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop', badge: 'Trending' },
        { name: 'Ayam Katsu Crispy', price: 15000, image: 'https://www.frisianflag.com/storage/app/media/uploaded-files/ayam-katsu-sederhana.jpg', badge: 'New' },
        { name: 'Jus Buah Segar', price: 8000, image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=300&fit=crop' },
        { name: 'Es Teh Manis', price: 5000, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop' },
        { name: 'Soto Ayam', price: 13000, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop' }
    ];
    
    let menuHTML = '';
    homepageMenus.forEach(menu => {
        menuHTML += `
            <div class="menu-card enhanced" data-name="${menu.name}" data-price="${menu.price}" data-category="makanan">
                <div class="menu-image">
                    <img src="${menu.image}" alt="${menu.name}" onerror="this.style.background='linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)'">
                    ${menu.badge ? `<div class="menu-badge ${menu.badge.toLowerCase().replace(' ', '-')}">${menu.badge}</div>` : ''}
                </div>
                <div class="menu-content">
                    <h3 class="menu-title">${menu.name}</h3>
                    <p class="menu-description">${getMenuDescription(menu.name)}</p>
                    <div class="menu-footer">
                        <span class="menu-price">Rp ${menu.price.toLocaleString()}</span>
                        <button class="btn-add" onclick="addToCart('${menu.name}', ${menu.price})">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M10 5V15M5 10H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Add view all button
    menuHTML += `
        <div class="menu-actions">
            <button class="btn-view-all" onclick="showSection('fullMenu')">
                Lihat Semua Menu
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
    `;
    
    menuContainer.innerHTML = menuHTML;
    console.log('Dynamic homepage menu items loaded successfully!');
}

function getMenuDescription(name) {
    const descriptions = {
        'Nasi Goreng Spesial': 'Nasi goreng dengan telur, ayam, dan sayuran segar',
        'Mie Goreng Jawa': 'Mie goreng khas dengan bumbu rempah pilihan',
        'Ayam Katsu Crispy': 'Ayam crispy dengan saus katsu spesial',
        'Jus Buah Segar': 'Jus buah segar tanpa pengawet',
        'Es Teh Manis': 'Es teh manis segar untuk menemani makan',
        'Soto Ayam': 'Soto ayam kuah bening dengan rempah tradisional'
    };
    return descriptions[name] || 'Menu lezat dari LupyCanteen';
}

// Filter menu function
function filterMenu(category) {
    const menuCards = document.querySelectorAll('.menu-card-perfect');
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    // Update active button
    categoryBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter cards
    menuCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
            card.classList.remove('section-hidden');
        } else {
            card.classList.add('section-hidden');
        }
    });
}

function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const onclick = this.getAttribute('onclick');
            
            if (onclick && onclick.includes('showSection')) {
                return; // Let onclick handler work
            }
            
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const sectionName = href.substring(1);
                showSection(sectionName);
            }
        });
    });
}

// Go to Admin Dashboard
function goToAdminDashboard() {
    console.log('🚀 Redirecting to Admin Dashboard...');
    window.location.href = '/admin/admin-dashboard-full.html';
}

// Section management
function showSection(sectionName) {
    console.log('Showing section:', sectionName);
    
    // Special handling for home section based on user role
    if (sectionName === 'home') {
        if (currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Kasir')) {
            console.log('🏠 Admin user accessing home - showing admin dashboard');
            showAdminHomepage();
            return;
        } else {
            console.log('🏠 Regular user accessing home - showing regular homepage');
            showRegularHomepage();
            return;
        }
    }
    
    // Hide all sections using CSS classes instead of inline styles
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('section-hidden');
    });
    
    // Hide dynamic admin dashboard if exists
    const dynamicAdminSection = document.getElementById('dynamicAdminSection');
    if (dynamicAdminSection) {
        dynamicAdminSection.classList.add('section-hidden');
    }
    
    // Show target section
    let targetId = sectionName;
    if (sectionName === 'fullMenu') targetId = 'fullMenu';
    if (sectionName === 'aboutSection') targetId = 'aboutSection';
    if (sectionName === 'contactSection') targetId = 'contactSection';
    if (sectionName === 'adminSection') targetId = 'adminSection';
    
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.remove('section-hidden');
        currentSection = sectionName;
        updateNavigation(sectionName);
        loadSectionData(sectionName);
        window.scrollTo(0, 0);
    } else {
        console.error('Section not found:', targetId);
    }
}

function updateNavigation(activeSection) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current section
    const navMap = {
        'home': 'Beranda',
        'fullMenu': 'Menu',
        'menu': 'Menu',
        'special': 'Special',
        'aboutSection': 'Tentang',
        'about': 'Tentang',
        'contactSection': 'Kontak',
        'contact': 'Kontak',
        'adminSection': 'Dashboard',
        'admin': 'Dashboard'
    };
    
    const targetText = navMap[activeSection];
    if (targetText) {
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.textContent.trim() === targetText) {
                link.classList.add('active');
            }
        });
    }
}

function loadSectionData(sectionName) {
    switch(sectionName) {
        case 'fullMenu':
        case 'menu':
            console.log('Full menu section loaded with static content');
            break;
        case 'adminSection':
        case 'admin':
            if (currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Kasir')) {
                loadAdminDashboard();
            } else {
                alert('Akses ditolak. Anda tidak memiliki hak akses admin.');
                showSection('home');
            }
            break;
    }
}

// Menu management
async function loadFullMenuData() {
    console.log('Loading full menu data...');
    
    const menuGrid = document.getElementById('fullMenuGrid');
    if (!menuGrid) return;
    
    menuGrid.innerHTML = '<div class="menu-loading">Memuat menu...</div>';
    
    try {
        // Load from API first
        const response = await fetch(`${API_BASE_URL}/menu`);
        let apiMenus = [];
        
        if (response.ok) {
            apiMenus = await response.json();
        }
        
        // Static menu items
        const staticMenus = [
            { name: 'Nasi Goreng Spesial', price: 12000, category: 'makanan', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop', badge: 'Best Seller' },
            { name: 'Mie Goreng Jawa', price: 10000, category: 'makanan', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop', badge: 'Trending' },
            { name: 'Ayam Katsu Crispy', price: 15000, category: 'makanan', image: 'https://www.frisianflag.com/storage/app/media/uploaded-files/ayam-katsu-sederhana.jpg', badge: 'New' },
            { name: 'Gado-Gado', price: 11000, category: 'makanan', image: 'https://static.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p2/74/2025/01/27/Gado-Gado-2337756915.jpg' },
            { name: 'Bakso Malang', price: 14000, category: 'makanan', image: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Baso_Malang_Karapitan.JPG' },
            { name: 'Nasi Uduk', price: 9000, category: 'makanan', image: 'https://cdn.yummy.co.id/content-images/images/20200611/J1acgi7BV9YusddDwNjwvRvRvqgw7m2x-31353931383733303935d41d8cd98f00b204e9800998ecf8427e.jpg?x-oss-process=image/resize,w_388,h_388,m_fixed,x-oss-process=image/format,webp' },
            { name: 'Rendang Daging', price: 18000, category: 'makanan', image: 'https://cdn.yummy.co.id/content-images/images/20230329/9IZ0mYzMAQi1EgVsb6cEbqyDCPzvNiyQ-31363830303534363638d41d8cd98f00b204e9800998ecf8427e.jpg?x-oss-process=image/resize,w_388,h_388,m_fixed,x-oss-process=image/format,webp', badge: 'Premium' },
            { name: 'Soto Ayam', price: 13000, category: 'makanan', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop' },
            { name: 'Ayam Geprek Keju', price: 16000, category: 'makanan', image: 'https://www.dapurkobe.co.id/wp-content/uploads/ayam-geprek-keju.jpg', badge: 'Special' },
            
            // Minuman
            { name: 'Jus Buah Segar', price: 8000, category: 'minuman', image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=300&fit=crop' },
            { name: 'Es Teh Manis', price: 5000, category: 'minuman', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop' },
            { name: 'Es Jeruk', price: 6000, category: 'minuman', image: 'https://cdn.yummy.co.id/content-images/images/20201013/WqfCTib25afAXzGCyok7dmAmTKGeGpkM-31363032353730383236d41d8cd98f00b204e9800998ecf8427e.jpg?x-oss-process=image/resize,w_388,h_388,m_fixed,x-oss-process=image/format,webp' },
            { name: 'Kopi Susu', price: 7000, category: 'minuman', image: 'https://cdn.yummy.co.id/content-images/images/20230119/rAvgrbBssoG6rNVTeqyzirA1WhQE7Nkl-31363734313235353439d41d8cd98f00b204e9800998ecf8427e.jpg?x-oss-process=image/resize,w_388,h_388,m_fixed,x-oss-process=image/format,webp' },
            { name: 'Milkshake Coklat', price: 12000, category: 'minuman', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop', badge: 'Trending' },
            { name: 'Air Mineral', price: 3000, category: 'minuman', image: 'https://bosara.sultraprov.go.id/asset/foto_produk/product-tumaka-20230921082444695.jpg' },
            
            // Snack
            { name: 'Pisang Goreng', price: 4000, category: 'snack', image: 'https://cdn.grid.id/crop/0x0:0x0/700x465/smart/filters:format(webp):quality(100)/photo/2025/12/05/pisang-goreng-tandukjpg-20251205043631.jpg' },
            { name: 'Keripik Singkong', price: 5000, category: 'snack', image: 'https://filebroker-cdn.lazada.co.id/kf/Sec3e758b09e246d080879f6b2b919d8bP.jpg' },
            { name: 'Roti Bakar', price: 8000, category: 'snack', image: 'https://djavatoday.com/wp-content/uploads/2024/09/IMG-20240920-WA0052.jpg' }
        ];
        
        // Combine static and API menus
        const allMenus = [...staticMenus, ...apiMenus];
        
        if (allMenus.length === 0) {
            menuGrid.innerHTML = '<div class="menu-loading">Tidak ada menu tersedia</div>';
            return;
        }
        
        let menuHTML = '';
        allMenus.forEach(menu => {
            const isApiMenu = menu.id ? true : false;
            menuHTML += `
                <div class="menu-card" data-name="${menu.name}" data-price="${menu.price}" data-category="${menu.category}">
                    <div class="menu-image">
                        <img src="${menu.imageUrl || menu.image || 'https://via.placeholder.com/400x300'}" alt="${menu.name}" onerror="this.style.background='linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)'">
                        ${menu.badge ? `<div class="menu-badge ${menu.badge.toLowerCase().replace(' ', '-')}">${menu.badge}</div>` : ''}
                        ${isApiMenu ? '<div class="menu-badge api">API</div>' : ''}
                    </div>
                    <div class="menu-content">
                        <h3 class="menu-title">${menu.name}</h3>
                        <p class="menu-description">${menu.description || getMenuDescription(menu.name)}</p>
                        <div class="menu-footer">
                            <span class="menu-price">Rp ${menu.price.toLocaleString()}</span>
                            <div class="menu-actions">
                                <button class="btn-add" onclick="addToCart('${menu.name}', ${menu.price})">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M10 5V15M5 10H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                    </svg>
                                </button>
                                ${isApiMenu ? `
                                    <button class="btn-edit" onclick="editMenuItem('${menu.id}', '${menu.name}', ${menu.price}, '${menu.category}', '${menu.description || ''}')">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z" stroke="currentColor" stroke-width="1.5"/>
                                        </svg>
                                    </button>
                                    <button class="btn-delete" onclick="deleteMenuItem('${menu.id}', '${menu.name}')">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M6 2V1C6 0.4 6.4 0 7 0H9C9.6 0 10 0.4 10 1V2H13C13.6 2 14 2.4 14 3S13.6 4 13 4H12V13C12 14.1 11.1 15 10 15H6C4.9 15 4 14.1 4 13V4H3C2.4 4 2 3.6 2 3S2.4 2 3 2H6ZM6 4V13H10V4H6Z" fill="currentColor"/>
                                        </svg>
                                    </button>
                                ` : `
                                    <button class="btn-edit" onclick="editStaticMenuItem('${menu.name}', ${menu.price}, '${menu.category}')">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z" stroke="currentColor" stroke-width="1.5"/>
                                        </svg>
                                    </button>
                                `}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        menuGrid.innerHTML = menuHTML;
        
    } catch (error) {
        console.error('Error loading full menu:', error);
        menuGrid.innerHTML = '<div class="menu-loading">Error loading menu</div>';
    }
}

// Filter menu function
function filterMenu(category) {
    const menuCards = document.querySelectorAll('.menu-card');
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    // Update active button
    categoryBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter cards
    menuCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

async function loadAdminDashboard() {
    console.log('Loading admin dashboard...');
    
    // Load admin stats
    try {
        // Load menu count
        const menuResponse = await fetch(`${API_BASE_URL}/menu`);
        if (menuResponse.ok) {
            const menus = await menuResponse.json();
            document.getElementById('adminTotalMenus').textContent = menus.length + 18; // Include static menus
        }
        
        // Load order count
        const orderResponse = await fetch(`${API_BASE_URL}/order`);
        if (orderResponse.ok) {
            const orders = await orderResponse.json();
            document.getElementById('adminTotalOrders').textContent = orders.length;
            
            // Calculate revenue
            const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
            document.getElementById('adminTotalRevenue').textContent = `Rp ${totalRevenue.toLocaleString()}`;
        }
        
        // Load user count
        const userResponse = await fetch(`${API_BASE_URL}/user`);
        if (userResponse.ok) {
            const users = await userResponse.json();
            document.getElementById('adminTotalUsers').textContent = users.length;
        }
        
    } catch (error) {
        console.error('Error loading admin stats:', error);
    }
}

// Admin tab management
function showAdminTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.admin-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const targetTab = document.getElementById(`adminTab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Load tab-specific data
    switch(tabName) {
        case 'menu':
            loadAdminMenuData();
            break;
        case 'orders':
            loadAdminOrdersData();
            break;
        case 'users':
            loadAdminUsersData();
            break;
        case 'reports':
            loadAdminReportsData();
            break;
    }
}

async function loadAdminMenuData() {
    const tableBody = document.getElementById('adminMenuTable');
    if (!tableBody) return;
    
    tableBody.innerHTML = '<tr><td colspan="6">Memuat data...</td></tr>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/menu`);
        if (response.ok) {
            const menus = await response.json();
            
            if (menus.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6">Tidak ada data menu dari API</td></tr>';
                return;
            }
            
            let html = '';
            menus.forEach(menu => {
                html += `
                    <tr>
                        <td><img src="${menu.imageUrl || 'https://via.placeholder.com/50x50'}" alt="${menu.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;"></td>
                        <td>${menu.name}</td>
                        <td>${menu.category}</td>
                        <td>Rp ${menu.price.toLocaleString()}</td>
                        <td><span class="status-badge active">Aktif</span></td>
                        <td>
                            <button class="btn-edit-small" onclick="editMenuItem('${menu.id}', '${menu.name}', ${menu.price}, '${menu.category}', '${menu.description || ''}')">Edit</button>
                            <button class="btn-delete-small" onclick="deleteMenuItem('${menu.id}', '${menu.name}')">Hapus</button>
                        </td>
                    </tr>
                `;
            });
            
            tableBody.innerHTML = html;
        }
    } catch (error) {
        console.error('Error loading admin menu data:', error);
        tableBody.innerHTML = '<tr><td colspan="6">Error loading data</td></tr>';
    }
}

async function loadAdminOrdersData() {
    const tableBody = document.getElementById('adminOrdersTable');
    if (!tableBody) return;
    
    tableBody.innerHTML = '<tr><td colspan="7">Memuat data...</td></tr>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/order`);
        if (response.ok) {
            const orders = await response.json();
            
            if (orders.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="7">Tidak ada data pesanan</td></tr>';
                return;
            }
            
            let html = '';
            orders.forEach(order => {
                const orderDate = new Date(order.orderDate).toLocaleDateString('id-ID');
                const itemsCount = order.orderItems ? order.orderItems.length : 0;
                
                html += `
                    <tr>
                        <td>${order.transactionNumber || order.id}</td>
                        <td>${order.customerName}</td>
                        <td>${itemsCount} items</td>
                        <td>Rp ${order.totalAmount.toLocaleString()}</td>
                        <td><span class="status-badge ${order.status.toLowerCase()}">${order.status}</span></td>
                        <td>${orderDate}</td>
                        <td>
                            <button class="btn-view-small" onclick="viewOrderDetails('${order.id}')">Detail</button>
                        </td>
                    </tr>
                `;
            });
            
            tableBody.innerHTML = html;
        }
    } catch (error) {
        console.error('Error loading admin orders data:', error);
        tableBody.innerHTML = '<tr><td colspan="7">Error loading data</td></tr>';
    }
}

async function loadAdminUsersData() {
    const tableBody = document.getElementById('adminUsersTable');
    if (!tableBody) return;
    
    tableBody.innerHTML = '<tr><td colspan="6">Memuat data...</td></tr>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/user`);
        if (response.ok) {
            const users = await response.json();
            
            if (users.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6">Tidak ada data user</td></tr>';
                return;
            }
            
            let html = '';
            users.forEach(user => {
                html += `
                    <tr>
                        <td>${user.username}</td>
                        <td>${user.fullName}</td>
                        <td>${user.email}</td>
                        <td><span class="role-badge ${user.role.toLowerCase()}">${user.role}</span></td>
                        <td><span class="status-badge active">Aktif</span></td>
                        <td>
                            <button class="btn-edit-small" onclick="editUser('${user.id}')">Edit</button>
                            <button class="btn-delete-small" onclick="deleteUser('${user.id}', '${user.username}')">Hapus</button>
                        </td>
                    </tr>
                `;
            });
            
            tableBody.innerHTML = html;
        }
    } catch (error) {
        console.error('Error loading admin users data:', error);
        tableBody.innerHTML = '<tr><td colspan="6">Error loading data</td></tr>';
    }
}

function loadAdminReportsData() {
    // Load reports data
    console.log('Loading admin reports data...');
    
    // Update report values with sample data
    document.getElementById('todaySales').textContent = 'Rp 2.500.000';
    document.getElementById('weeklySales').textContent = 'Rp 15.000.000';
    document.getElementById('topMenu').textContent = 'Nasi Goreng Spesial';
    document.getElementById('totalCustomers').textContent = '150';
}

// Shopping Cart Functions
function addToCart(name, price) {
    console.log(`🛒 addToCart called: ${name} - Rp ${price}`);
    console.log('🛒 Current cart before:', cart);
    
    try {
        // Ensure cart is initialized
        if (!Array.isArray(cart)) {
            cart = [];
            console.log('🛒 Cart was not array, initialized as empty array');
        }
        
        const existingItem = cart.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += 1;
            console.log(`🛒 Updated existing item: ${name} (qty: ${existingItem.quantity})`);
        } else {
            cart.push({
                name: name,
                price: price,
                quantity: 1
            });
            console.log(`🛒 Added new item: ${name}`);
        }
        
        updateCartCount();
        showNotification(`${name} ditambahkan ke keranjang!`, 'success');
        console.log('🛒 Current cart after:', cart);
        
        // Force update cart display if modal is open
        const cartModal = document.getElementById('cartModal');
        if (cartModal && cartModal.style.display === 'block') {
            updateCartDisplay();
        }
        
    } catch (error) {
        console.error('❌ Error in addToCart:', error);
        showNotification(`Error adding ${name}: ${error.message}`, 'error');
        alert(`Error adding ${name}: ${error.message}`);
    }
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartCount();
    updateCartDisplay();
}

function clearCart() {
    if (confirm('Apakah Anda yakin ingin mengosongkan keranjang?')) {
        cart = [];
        updateCartCount();
        updateCartDisplay();
        showNotification('Keranjang dikosongkan!', 'info');
    }
}

function updateCartCount() {
    try {
        // Ensure cart is initialized
        if (!Array.isArray(cart)) {
            cart = [];
            console.log('🛒 Cart was not array in updateCartCount, initialized as empty array');
        }
        
        cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountElement = document.querySelector('.cart-count');
        
        console.log(`🛒 updateCartCount: ${cartCount}`);
        console.log('🛒 cartCountElement:', cartCountElement);
        
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
            cartCountElement.style.display = 'inline';
            cartCountElement.style.visibility = 'visible';
            console.log(`🛒 Cart count updated to: ${cartCount}`);
        } else {
            console.error('❌ .cart-count element not found!');
        }
        
        // Also update any other cart count displays
        const cartCountBtn = document.getElementById('cartCountBtn');
        if (cartCountBtn) {
            cartCountBtn.textContent = cartCount;
        }
        
    } catch (error) {
        console.error('❌ Error in updateCartCount:', error);
    }
}

function toggleCart() {
    console.log('🛒 toggleCart called');
    const cartModal = document.getElementById('cartModal');
    console.log('🛒 cartModal element:', cartModal);
    
    if (!cartModal) {
        console.error('❌ cartModal element not found!');
        showNotification('Error: Cart modal not found!', 'error');
        alert('Error: Cart modal not found!');
        return;
    }
    
    try {
        if (cartModal.style.display === 'block') {
            cartModal.style.display = 'none';
            console.log('🛒 Cart modal closed');
            showNotification('Keranjang ditutup', 'info');
        } else {
            updateCartDisplay();
            cartModal.style.display = 'block';
            console.log('🛒 Cart modal opened');
            console.log('🛒 Current cart:', cart);
            showNotification('Keranjang dibuka', 'info');
        }
    } catch (error) {
        console.error('❌ Error in toggleCart:', error);
        showNotification(`Error opening cart: ${error.message}`, 'error');
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Keranjang masih kosong</p>';
        cartTotal.textContent = 'Rp 0';
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        return `
            <div class="cart-item">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>Rp ${item.price.toLocaleString('id-ID')}</p>
                </div>
                <div class="item-controls">
                    <button onclick="updateQuantity('${item.name}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.name}', 1)">+</button>
                </div>
                <div class="item-total">
                    Rp ${itemTotal.toLocaleString('id-ID')}
                </div>
                <button class="remove-item" onclick="removeFromCart('${item.name}')">×</button>
            </div>
        `;
    }).join('');
    
    cartTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(name);
        } else {
            updateCartCount();
            updateCartDisplay();
        }
    }
}

// WORKING CHECKOUT FUNCTIONS - INTEGRATED FROM FINAL SOLUTION
let keranjangBelanja = [];
let totalHarga = 0;
let nomorTransaksi = '';

// Fungsi tambah ke keranjang yang bekerja
function tambahKeKeranjang(nama, harga) {
    console.log('🛒 TAMBAH KE KERANJANG:', nama, harga);
    
    // Cari item yang sudah ada
    const itemAda = keranjangBelanja.find(item => item.nama === nama);
    
    if (itemAda) {
        itemAda.jumlah += 1;
    } else {
        keranjangBelanja.push({
            nama: nama,
            harga: harga,
            jumlah: 1
        });
    }
    
    updateCartDisplay();
    updateCartCount();
    
    // Show success message
    const totalItems = keranjangBelanja.reduce((sum, item) => sum + item.jumlah, 0);
    alert('✅ ' + nama + ' berhasil ditambahkan ke keranjang!\n\nTotal item: ' + totalItems);
}

// Update cart count
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        const totalItems = keranjangBelanja.reduce((sum, item) => sum + item.jumlah, 0);
        cartCountElement.textContent = totalItems;
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItemsElement = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    
    if (!cartItemsElement || !cartTotalElement) return;
    
    if (keranjangBelanja.length === 0) {
        cartItemsElement.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">Keranjang kosong</div>';
        cartTotalElement.textContent = 'Rp 0';
        return;
    }
    
    let html = '';
    totalHarga = 0;
    
    keranjangBelanja.forEach((item, index) => {
        const subtotal = item.harga * item.jumlah;
        totalHarga += subtotal;
        
        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
                <div>
                    <strong>${item.nama}</strong><br>
                    <small>Rp ${item.harga.toLocaleString()} per item</small>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <button onclick="kurangiJumlah(${index})" style="background: #ff6b6b; color: white; border: none; width: 25px; height: 25px; border-radius: 50%; cursor: pointer;">-</button>
                    <span>${item.jumlah}</span>
                    <button onclick="tambahJumlah(${index})" style="background: #4CAF50; color: white; border: none; width: 25px; height: 25px; border-radius: 50%; cursor: pointer;">+</button>
                </div>
                <div><strong>Rp ${subtotal.toLocaleString()}</strong></div>
            </div>
        `;
    });
    
    cartItemsElement.innerHTML = html;
    cartTotalElement.textContent = 'Rp ' + totalHarga.toLocaleString();
}

// Tambah jumlah item
function tambahJumlah(index) {
    keranjangBelanja[index].jumlah += 1;
    updateCartDisplay();
    updateCartCount();
}

// Kurangi jumlah item
function kurangiJumlah(index) {
    if (keranjangBelanja[index].jumlah > 1) {
        keranjangBelanja[index].jumlah -= 1;
    } else {
        keranjangBelanja.splice(index, 1);
    }
    updateCartDisplay();
    updateCartCount();
}

// Toggle cart modal
function toggleCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        if (modal.style.display === 'none' || modal.style.display === '') {
            updateCartDisplay();
            modal.style.display = 'block';
        } else {
            modal.style.display = 'none';
        }
    }
}

// Clear cart
function clearCart() {
    if (keranjangBelanja.length === 0) {
        alert('Keranjang sudah kosong!');
        return;
    }
    
    if (confirm('Yakin ingin mengosongkan keranjang?')) {
        keranjangBelanja = [];
        totalHarga = 0;
        updateCartDisplay();
        updateCartCount();
        alert('✅ Keranjang berhasil dikosongkan!');
    }
}

// Generate nomor transaksi
function generateNomorTransaksi() {
    const now = new Date();
    const tahun = now.getFullYear().toString().substr(-2);
    const bulan = (now.getMonth() + 1).toString().padStart(2, '0');
    const tanggal = now.getDate().toString().padStart(2, '0');
    const jam = now.getHours().toString().padStart(2, '0');
    const menit = now.getMinutes().toString().padStart(2, '0');
    const detik = now.getSeconds().toString().padStart(2, '0');
    
    return 'LC' + tahun + bulan + tanggal + jam + menit + detik;
}

// Working checkout function
async function checkout() {
    if (keranjangBelanja.length === 0) {
        alert('❌ Keranjang kosong! Silakan pilih menu terlebih dahulu.');
        return;
    }
    
    // Generate nomor transaksi
    nomorTransaksi = generateNomorTransaksi();
    
    // Show receipt modal
    showReceiptModal();
    
    // Close cart modal
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.style.display = 'none';
    }
}

// Show receipt modal
function showReceiptModal() {
    const modal = document.getElementById('receiptModal');
    const content = document.getElementById('receiptContent');
    
    if (!modal || !content) {
        alert('✅ Checkout berhasil!\n\nNo. Transaksi: ' + nomorTransaksi + '\nTotal: Rp ' + totalHarga.toLocaleString());
        return;
    }
    
    const now = new Date();
    const tanggal = now.toLocaleDateString('id-ID');
    const waktu = now.toLocaleTimeString('id-ID');
    
    let html = `
        <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 15px;">
            <h2>🍱 LupyCanteen</h2>
            <p>Kantin Sekolah Modern<br>Jl. Raya Margamulya, Telukjambe Barat<br>Telp: (021) 123-4567</p>
        </div>
        
        <div style="margin-bottom: 15px;">
            <div>Tanggal: ${tanggal}</div>
            <div>Waktu: ${waktu}</div>
            <div>No. Transaksi: ${nomorTransaksi}</div>
            <div>Pelanggan: Guest</div>
        </div>
        
        <div style="border-top: 1px solid #333; border-bottom: 1px solid #333; padding: 10px 0;">
    `;
    
    keranjangBelanja.forEach(item => {
        const subtotal = item.harga * item.jumlah;
        html += `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>${item.nama}</span>
                <span>${item.jumlah}x Rp ${item.harga.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span></span>
                <span><strong>Rp ${subtotal.toLocaleString()}</strong></span>
            </div>
        `;
    });
    
    html += `
        </div>
        
        <div style="text-align: center; font-weight: bold; font-size: 1.2rem; margin: 15px 0;">
            TOTAL BAYAR: Rp ${totalHarga.toLocaleString()}
        </div>
        
        <div style="text-align: center; margin-top: 15px; border-top: 1px solid #333; padding-top: 15px;">
            Terima kasih atas kunjungan Anda!<br>
            Selamat menikmati makanan 😊<br>
            © 2025 LupyCanteen
        </div>
    `;
    
    content.innerHTML = html;
    modal.style.display = 'block';
}

// Close receipt modal
function closeReceipt() {
    const modal = document.getElementById('receiptModal');
    if (modal) {
        modal.style.display = 'none';
        
        if (confirm('Checkout berhasil! Kosongkan keranjang untuk transaksi berikutnya?')) {
            clearCart();
        }
    }
}

// Print receipt
function printReceipt() {
    window.print();
}

// Download PDF (simple version)
function downloadPDF() {
    alert('📄 Fitur download PDF akan segera tersedia!\n\nUntuk sementara, gunakan Print (Ctrl+P) dan pilih "Save as PDF".');
}
    const customerPhone = prompt('Nomor telepon:') || '081234567890';
    
    if (!customerName) {
        alert('Nama pelanggan harus diisi!');
        return;
    }
    
    // Payment method selection
    const paymentMethod = prompt('Metode pembayaran:\n1. Tunai\n2. Transfer\n3. E-Wallet\nPilih (1/2/3):');
    const paymentMethods = { '1': 'Tunai', '2': 'Transfer', '3': 'E-Wallet' };
    const selectedPayment = paymentMethods[paymentMethod] || 'Tunai';
    
    try {
        const orderData = {
            customerName: customerName,
            customerEmail: customerEmail,
            customerPhone: customerPhone,
            orderItems: cart.map(item => ({
                menuItemName: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
            paymentMethod: selectedPayment,
            status: 'Completed',
            orderDate: new Date().toISOString()
        };
        
        const response = await fetch(`${API_BASE_URL}/order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        
        if (response.ok) {
            const result = await response.json();
            showDualReceipt(orderData, result.id);
            toggleCart(); // Close cart modal
        } else {
            alert('Gagal memproses pesanan. Silakan coba lagi.');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Terjadi kesalahan saat checkout.');
    }
}

// Global variable for current order data
let currentOrderData = null;

// Show dual receipt options (Customer & Cashier)
function showDualReceipt(orderData, orderId) {
    currentOrderData = orderData;
    const receiptContent = document.getElementById('receiptContent');
    const receiptNumber = orderId || 'RC' + Date.now().toString().slice(-6);
    
    receiptContent.innerHTML = '<div class="receipt-selection"><h3>Pilih Jenis Struk</h3><div class="receipt-options"><button class="btn-receipt-customer" onclick="showCustomerReceipt(\'' + receiptNumber + '\')">👤 Struk Pembeli</button><button class="btn-receipt-cashier" onclick="showCashierReceipt(\'' + receiptNumber + '\')">💼 Struk Kasir</button></div></div>';
    
    document.getElementById('receiptModal').style.display = 'block';
}

// Customer Receipt
function showCustomerReceipt(receiptNumber, orderDataStr) {
    const orderData = JSON.parse(orderDataStr);
    const receiptContent = document.getElementById('receiptContent');
    const now = new Date();
    
    receiptContent.innerHTML = `
        <div class="receipt-header customer-receipt">
            <div class="receipt-logo">
                <span class="logo-icon">🍱</span>
                <span class="logo-text">LupyCanteen</span>
            </div>
            <div class="receipt-info">
                <p><strong>STRUK PEMBELI</strong></p>
                <p>Kantin Sekolah Modern</p>
                <p>Jl. Raya Margamulya, Telukjambe Barat</p>
                <p>Telp: (021) 123-4567</p>
            </div>
            <div class="receipt-divider"></div>
        </div>
        <div class="receipt-body">
            <div class="receipt-date">
                <p>Tanggal: ${now.toLocaleDateString('id-ID')}</p>
                <p>Waktu: ${now.toLocaleTimeString('id-ID')}</p>
                <p>No. Transaksi: ${receiptNumber}</p>
            </div>
            <div class="receipt-divider"></div>
            <div class="receipt-customer">
                <p><strong>Pelanggan: ${orderData.customerName}</strong></p>
                <p>Email: ${orderData.customerEmail}</p>
                <p>Telepon: ${orderData.customerPhone}</p>
            </div>
            <div class="receipt-divider"></div>
            <div class="receipt-items">
                <div class="items-header">
                    <span>Item</span>
                    <span>Qty</span>
                    <span>Harga</span>
                </div>
                ${orderData.orderItems.map(item => `
                    <div class="receipt-item">
                        <div class="item-name">${item.menuItemName}</div>
                        <div class="item-qty">${item.quantity}x</div>
                        <div class="item-price">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</div>
                    </div>
                `).join('')}
            </div>
            <div class="receipt-divider"></div>
            <div class="receipt-payment">
                <div class="payment-row">
                    <span>Subtotal:</span>
                    <span>Rp ${orderData.totalAmount.toLocaleString('id-ID')}</span>
                </div>
                <div class="payment-row">
                    <span>Metode Bayar:</span>
                    <span>${orderData.paymentMethod}</span>
                </div>
            </div>
            <div class="receipt-divider"></div>
            <div class="receipt-total">
                <div class="total-row">
                    <span><strong>TOTAL BAYAR:</strong></span>
                    <span><strong>Rp ${orderData.totalAmount.toLocaleString('id-ID')}</strong></span>
                </div>
            </div>
            <div class="receipt-footer customer-footer">
                <p>🙏 Terima kasih atas kunjungan Anda!</p>
                <p>🍽️ Selamat menikmati makanan</p>
                <p>📞 Kritik & Saran: (021) 123-4567</p>
                <p>© 2025 LupyCanteen - Kantin Sekolah Modern</p>
            </div>
        </div>
        <div class="receipt-actions">
            <button class="btn-print" onclick="printCustomerReceipt('${receiptNumber}', '${orderDataStr}')">🖨️ Print</button>
            <button class="btn-pdf" onclick="downloadCustomerPDF('${receiptNumber}', '${orderDataStr}')">📄 Download PDF</button>
            <button class="btn-back" onclick="showDualReceipt(${orderDataStr}, '${receiptNumber}')">← Kembali</button>
        </div>
    `;
}

// Cashier Receipt
function showCashierReceipt(receiptNumber, orderDataStr) {
    const orderData = JSON.parse(orderDataStr);
    const receiptContent = document.getElementById('receiptContent');
    const now = new Date();
    
    receiptContent.innerHTML = `
        <div class="receipt-header cashier-receipt">
            <div class="receipt-logo">
                <span class="logo-icon">🍱</span>
                <span class="logo-text">LupyCanteen</span>
            </div>
            <div class="receipt-info">
                <p><strong>STRUK KASIR - INTERNAL</strong></p>
                <p>Kantin Sekolah Modern</p>
                <p>Jl. Raya Margamulya, Telukjambe Barat</p>
                <p>Telp: (021) 123-4567</p>
            </div>
            <div class="receipt-divider"></div>
        </div>
        <div class="receipt-body">
            <div class="receipt-date">
                <p>Tanggal: ${now.toLocaleDateString('id-ID')}</p>
                <p>Waktu: ${now.toLocaleTimeString('id-ID')}</p>
                <p>No. Transaksi: ${receiptNumber}</p>
                <p><strong>Kasir: ${currentUser.fullName}</strong></p>
                <p>Role: ${currentUser.role}</p>
            </div>
            <div class="receipt-divider"></div>
            <div class="receipt-customer">
                <p><strong>Data Pelanggan:</strong></p>
                <p>Nama: ${orderData.customerName}</p>
                <p>Email: ${orderData.customerEmail}</p>
                <p>Telepon: ${orderData.customerPhone}</p>
            </div>
            <div class="receipt-divider"></div>
            <div class="receipt-items">
                <div class="items-header">
                    <span>Item</span>
                    <span>Qty</span>
                    <span>@Harga</span>
                    <span>Total</span>
                </div>
                ${orderData.orderItems.map(item => `
                    <div class="receipt-item cashier-item">
                        <div class="item-name">${item.menuItemName}</div>
                        <div class="item-qty">${item.quantity}</div>
                        <div class="item-unit-price">Rp ${item.price.toLocaleString('id-ID')}</div>
                        <div class="item-total-price">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</div>
                    </div>
                `).join('')}
            </div>
            <div class="receipt-divider"></div>
            <div class="receipt-summary">
                <div class="summary-row">
                    <span>Total Item:</span>
                    <span>${orderData.orderItems.reduce((sum, item) => sum + item.quantity, 0)} pcs</span>
                </div>
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>Rp ${orderData.totalAmount.toLocaleString('id-ID')}</span>
                </div>
                <div class="summary-row">
                    <span>Pajak (0%):</span>
                    <span>Rp 0</span>
                </div>
                <div class="summary-row">
                    <span>Metode Bayar:</span>
                    <span>${orderData.paymentMethod}</span>
                </div>
            </div>
            <div class="receipt-divider"></div>
            <div class="receipt-total">
                <div class="total-row">
                    <span><strong>TOTAL PENJUALAN:</strong></span>
                    <span><strong>Rp ${orderData.totalAmount.toLocaleString('id-ID')}</strong></span>
                </div>
            </div>
            <div class="receipt-footer cashier-footer">
                <p>📊 Laporan Penjualan Internal</p>
                <p>🔒 Dokumen Rahasia - Hanya untuk Kasir</p>
                <p>📈 Untuk Rekap Harian & Laporan</p>
                <p>© 2025 LupyCanteen - Internal System</p>
            </div>
        </div>
        <div class="receipt-actions">
            <button class="btn-print" onclick="printCashierReceipt('${receiptNumber}', '${orderDataStr}')">🖨️ Print</button>
            <button class="btn-pdf" onclick="downloadCashierPDF('${receiptNumber}', '${orderDataStr}')">📄 Download PDF</button>
            <button class="btn-back" onclick="showDualReceipt(${orderDataStr}, '${receiptNumber}')">← Kembali</button>
        </div>
    `;
}

function closeReceipt() {
    document.getElementById('receiptModal').style.display = 'none';
    // Clear cart after successful checkout
    cart = [];
    updateCartCount();
}

// Print Customer Receipt
function printCustomerReceipt(receiptNumber, orderDataStr) {
    const orderData = JSON.parse(orderDataStr);
    const now = new Date();
    
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Struk Pembeli - LupyCanteen</title>
            <style>
                @media print {
                    @page { size: 80mm auto; margin: 0; }
                    body { font-family: monospace; font-size: 11px; margin: 0; padding: 8px; }
                }
                body { font-family: monospace; font-size: 11px; width: 80mm; margin: 0 auto; }
                .receipt-header { text-align: center; margin-bottom: 10px; }
                .receipt-divider { border-top: 1px dashed #000; margin: 8px 0; }
                .receipt-item { display: flex; justify-content: space-between; margin: 3px 0; }
                .receipt-total { font-weight: bold; font-size: 12px; text-align: center; }
                .receipt-footer { text-align: center; margin-top: 10px; font-size: 10px; }
            </style>
        </head>
        <body>
            <div class="receipt-header">
                <h3>🍱 LupyCanteen</h3>
                <p>STRUK PEMBELI</p>
                <p>Kantin Sekolah Modern</p>
                <p>Jl. Raya Margamulya, Telukjambe Barat</p>
                <p>Telp: (021) 123-4567</p>
            </div>
            <div class="receipt-divider"></div>
            <p>Tanggal: ${now.toLocaleDateString('id-ID')}</p>
            <p>Waktu: ${now.toLocaleTimeString('id-ID')}</p>
            <p>No. Transaksi: ${receiptNumber}</p>
            <div class="receipt-divider"></div>
            <p><strong>Pelanggan: ${orderData.customerName}</strong></p>
            <p>Email: ${orderData.customerEmail}</p>
            <p>Telepon: ${orderData.customerPhone}</p>
            <div class="receipt-divider"></div>
            ${orderData.orderItems.map(item => `
                <div class="receipt-item">
                    <span>${item.menuItemName}</span>
                    <span>${item.quantity}x</span>
                    <span>Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
            `).join('')}
            <div class="receipt-divider"></div>
            <p>Metode Bayar: ${orderData.paymentMethod}</p>
            <div class="receipt-total">
                <p>TOTAL BAYAR: Rp ${orderData.totalAmount.toLocaleString('id-ID')}</p>
            </div>
            <div class="receipt-footer">
                <p>🙏 Terima kasih atas kunjungan Anda!</p>
                <p>🍽️ Selamat menikmati makanan</p>
                <p>© 2025 LupyCanteen</p>
            </div>
        </body>
        </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

// Print Cashier Receipt
function printCashierReceipt(receiptNumber, orderDataStr) {
    const orderData = JSON.parse(orderDataStr);
    const now = new Date();
    
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Struk Kasir - LupyCanteen</title>
            <style>
                @media print {
                    @page { size: 80mm auto; margin: 0; }
                    body { font-family: monospace; font-size: 10px; margin: 0; padding: 8px; }
                }
                body { font-family: monospace; font-size: 10px; width: 80mm; margin: 0 auto; }
                .receipt-header { text-align: center; margin-bottom: 10px; }
                .receipt-divider { border-top: 1px dashed #000; margin: 8px 0; }
                .receipt-item { display: flex; justify-content: space-between; margin: 2px 0; font-size: 9px; }
                .receipt-total { font-weight: bold; font-size: 11px; text-align: center; }
                .receipt-footer { text-align: center; margin-top: 10px; font-size: 9px; }
            </style>
        </head>
        <body>
            <div class="receipt-header">
                <h3>🍱 LupyCanteen</h3>
                <p><strong>STRUK KASIR - INTERNAL</strong></p>
                <p>Kantin Sekolah Modern</p>
                <p>Jl. Raya Margamulya, Telukjambe Barat</p>
            </div>
            <div class="receipt-divider"></div>
            <p>Tanggal: ${now.toLocaleDateString('id-ID')}</p>
            <p>Waktu: ${now.toLocaleTimeString('id-ID')}</p>
            <p>No. Transaksi: ${receiptNumber}</p>
            <p><strong>Kasir: ${currentUser.fullName}</strong></p>
            <div class="receipt-divider"></div>
            <p><strong>Data Pelanggan:</strong></p>
            <p>Nama: ${orderData.customerName}</p>
            <p>Email: ${orderData.customerEmail}</p>
            <p>Telepon: ${orderData.customerPhone}</p>
            <div class="receipt-divider"></div>
            ${orderData.orderItems.map(item => `
                <div class="receipt-item">
                    <span>${item.menuItemName}</span>
                    <span>${item.quantity}x${item.price.toLocaleString('id-ID')}</span>
                    <span>Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
            `).join('')}
            <div class="receipt-divider"></div>
            <p>Total Item: ${orderData.orderItems.reduce((sum, item) => sum + item.quantity, 0)} pcs</p>
            <p>Metode Bayar: ${orderData.paymentMethod}</p>
            <div class="receipt-total">
                <p>TOTAL PENJUALAN: Rp ${orderData.totalAmount.toLocaleString('id-ID')}</p>
            </div>
            <div class="receipt-footer">
                <p>📊 Laporan Penjualan Internal</p>
                <p>🔒 Dokumen Rahasia - Hanya untuk Kasir</p>
                <p>© 2025 LupyCanteen - Internal System</p>
            </div>
        </body>
        </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

// Download Customer PDF
function downloadCustomerPDF(receiptNumber, orderDataStr) {
    const orderData = JSON.parse(orderDataStr);
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 200]
    });
    
    const now = new Date();
    
    // Header
    doc.setFontSize(14);
    doc.text('🍱 LupyCanteen', 40, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text('STRUK PEMBELI', 40, 22, { align: 'center' });
    doc.text('Kantin Sekolah Modern', 40, 28, { align: 'center' });
    doc.text('Jl. Raya Margamulya, Telukjambe Barat', 40, 33, { align: 'center' });
    doc.text('Telp: (021) 123-4567', 40, 38, { align: 'center' });
    
    // Transaction info
    doc.text(`Tanggal: ${now.toLocaleDateString('id-ID')}`, 5, 48);
    doc.text(`Waktu: ${now.toLocaleTimeString('id-ID')}`, 5, 53);
    doc.text(`No. Transaksi: ${receiptNumber}`, 5, 58);
    
    // Customer info
    doc.text(`Pelanggan: ${orderData.customerName}`, 5, 68);
    doc.text(`Email: ${orderData.customerEmail}`, 5, 73);
    doc.text(`Telepon: ${orderData.customerPhone}`, 5, 78);
    
    // Items
    let yPos = 88;
    orderData.orderItems.forEach(item => {
        doc.text(`${item.menuItemName}`, 5, yPos);
        doc.text(`${item.quantity}x Rp ${item.price.toLocaleString('id-ID')}`, 5, yPos + 4);
        doc.text(`Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`, 55, yPos + 4);
        yPos += 12;
    });
    
    // Payment & Total
    yPos += 5;
    doc.text(`Metode Bayar: ${orderData.paymentMethod}`, 5, yPos);
    doc.setFontSize(12);
    doc.text(`TOTAL: Rp ${orderData.totalAmount.toLocaleString('id-ID')}`, 40, yPos + 10, { align: 'center' });
    
    // Footer
    doc.setFontSize(9);
    doc.text('Terima kasih atas kunjungan Anda!', 40, yPos + 20, { align: 'center' });
    doc.text('Selamat menikmati makanan', 40, yPos + 25, { align: 'center' });
    doc.text('© 2025 LupyCanteen', 40, yPos + 30, { align: 'center' });
    
    doc.save(`Struk-Pembeli-${receiptNumber}.pdf`);
}

// Download Cashier PDF
function downloadCashierPDF(receiptNumber, orderDataStr) {
    const orderData = JSON.parse(orderDataStr);
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 220]
    });
    
    const now = new Date();
    
    // Header
    doc.setFontSize(14);
    doc.text('🍱 LupyCanteen', 40, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text('STRUK KASIR - INTERNAL', 40, 22, { align: 'center' });
    doc.text('Kantin Sekolah Modern', 40, 28, { align: 'center' });
    doc.text('Jl. Raya Margamulya, Telukjambe Barat', 40, 33, { align: 'center' });
    
    // Transaction info
    doc.text(`Tanggal: ${now.toLocaleDateString('id-ID')}`, 5, 43);
    doc.text(`Waktu: ${now.toLocaleTimeString('id-ID')}`, 5, 48);
    doc.text(`No. Transaksi: ${receiptNumber}`, 5, 53);
    doc.text(`Kasir: ${currentUser.fullName}`, 5, 58);
    doc.text(`Role: ${currentUser.role}`, 5, 63);
    
    // Customer info
    doc.text('Data Pelanggan:', 5, 73);
    doc.text(`Nama: ${orderData.customerName}`, 5, 78);
    doc.text(`Email: ${orderData.customerEmail}`, 5, 83);
    doc.text(`Telepon: ${orderData.customerPhone}`, 5, 88);
    
    // Items
    let yPos = 98;
    orderData.orderItems.forEach(item => {
        doc.text(`${item.menuItemName}`, 5, yPos);
        doc.text(`${item.quantity}x @ Rp ${item.price.toLocaleString('id-ID')}`, 5, yPos + 4);
        doc.text(`Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`, 55, yPos + 4);
        yPos += 12;
    });
    
    // Summary
    yPos += 5;
    const totalItems = orderData.orderItems.reduce((sum, item) => sum + item.quantity, 0);
    doc.text(`Total Item: ${totalItems} pcs`, 5, yPos);
    doc.text(`Metode Bayar: ${orderData.paymentMethod}`, 5, yPos + 5);
    doc.text(`Subtotal: Rp ${orderData.totalAmount.toLocaleString('id-ID')}`, 5, yPos + 10);
    doc.text('Pajak (0%): Rp 0', 5, yPos + 15);
    
    // Total
    doc.setFontSize(12);
    doc.text(`TOTAL PENJUALAN: Rp ${orderData.totalAmount.toLocaleString('id-ID')}`, 40, yPos + 25, { align: 'center' });
    
    // Footer
    doc.setFontSize(9);
    doc.text('Laporan Penjualan Internal', 40, yPos + 35, { align: 'center' });
    doc.text('Dokumen Rahasia - Hanya untuk Kasir', 40, yPos + 40, { align: 'center' });
    doc.text('© 2025 LupyCanteen - Internal System', 40, yPos + 45, { align: 'center' });
    
    doc.save(`Struk-Kasir-${receiptNumber}.pdf`);
}

// Generate customer receipt PDF
function generateCustomerReceiptPDF(orderData, receiptNumber) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const now = new Date();
    
    // Add total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    doc.setFontSize(12);
    doc.text(`TOTAL: Rp ${total.toLocaleString('id-ID')}`, 40, yPos + 10, { align: 'center' });
    
    // Save PDF
    const filename = `Struk-LupyCanteen-${now.toISOString().slice(0, 10)}-${receiptNumber}.pdf`;
    doc.save(filename);
}

// Menu management functions
function showAddMenuModal() {
    document.getElementById('addMenuModal').style.display = 'block';
}

function closeAddMenuModal() {
    document.getElementById('addMenuModal').style.display = 'none';
    document.getElementById('addMenuForm').reset();
    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview) {
        imagePreview.style.display = 'none';
    }
}

async function addNewMenu(event) {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('name', document.getElementById('menuName').value);
    formData.append('price', document.getElementById('menuPrice').value);
    formData.append('category', document.getElementById('menuCategory').value);
    formData.append('description', document.getElementById('menuDescription').value);
    formData.append('badge', document.getElementById('menuBadge').value);
    
    const imageFile = document.getElementById('menuImage').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/menu/with-image`, {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            showNotification('Menu berhasil ditambahkan!', 'success');
            closeAddMenuModal();
            loadFullMenuData(); // Refresh menu display
            loadAdminMenuData(); // Refresh admin table
        } else {
            const error = await response.text();
            showNotification('Gagal menambahkan menu: ' + error, 'error');
        }
    } catch (error) {
        console.error('Error adding menu:', error);
        showNotification('Terjadi kesalahan saat menambahkan menu', 'error');
    }
}

// Image preview for add menu
document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('menuImage');
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const previewImg = document.getElementById('previewImg');
                    const imagePreview = document.getElementById('imagePreview');
                    if (previewImg && imagePreview) {
                        previewImg.src = e.target.result;
                        imagePreview.style.display = 'block';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

// Edit and delete functions
async function editMenuItem(id, name, price, category, description) {
    const newName = prompt('Nama menu:', name);
    const newPrice = prompt('Harga:', price);
    const newCategory = prompt('Kategori (makanan/minuman/snack):', category);
    const newDescription = prompt('Deskripsi:', description);
    
    if (newName && newPrice && newCategory) {
        try {
            const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newName,
                    price: parseInt(newPrice),
                    category: newCategory,
                    description: newDescription
                })
            });
            
            if (response.ok) {
                showNotification('Menu berhasil diupdate!', 'success');
                loadFullMenuData();
                loadAdminMenuData();
            } else {
                showNotification('Gagal mengupdate menu', 'error');
            }
        } catch (error) {
            console.error('Error updating menu:', error);
            showNotification('Terjadi kesalahan saat mengupdate menu', 'error');
        }
    }
}

async function deleteMenuItem(id, name) {
    if (confirm(`Apakah Anda yakin ingin menghapus menu "${name}"?`)) {
        try {
            const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                showNotification('Menu berhasil dihapus!', 'success');
                loadFullMenuData();
                loadAdminMenuData();
            } else {
                showNotification('Gagal menghapus menu', 'error');
            }
        } catch (error) {
            console.error('Error deleting menu:', error);
            showNotification('Terjadi kesalahan saat menghapus menu', 'error');
        }
    }
}

function editStaticMenuItem(name, price, category) {
    alert(`Menu "${name}" adalah menu statis.\nUntuk mengedit, silakan tambahkan sebagai menu baru melalui API.`);
}

// Logout function
function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        localStorage.removeItem('lupycanteen_user');
        sessionStorage.removeItem('lupycanteen_user');
        showNotification('Logout berhasil!', 'success');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    // Simple alert for immediate feedback
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Create simple toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 1500;
        font-weight: 600;
        max-width: 300px;
        font-size: 14px;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 3000);
}

// Debug function to force show dashboard link (can be called from console)
function forceShowDashboard() {
    console.log('🔧 FORCE SHOW DASHBOARD - Manual trigger');
    
    const adminNavLink = document.getElementById('adminNavLink');
    const adminDashboardBtn = document.getElementById('adminDashboardBtn');
    const userInfoSection = document.getElementById('userInfoSection');
    
    if (adminDashboardBtn) {
        // Show prominent Admin Dashboard button
        adminDashboardBtn.style.display = 'flex';
        adminDashboardBtn.style.visibility = 'visible';
        adminDashboardBtn.style.opacity = '1';
        console.log('✅ Admin Dashboard button forced to show');
        
        // Check computed styles
        const computed = window.getComputedStyle(adminDashboardBtn);
        console.log('🔍 Admin Dashboard button computed styles:', {
            display: computed.display,
            visibility: computed.visibility,
            opacity: computed.opacity
        });
        
        showNotification('Admin Dashboard button forced to show! Check navigation bar.', 'success');
    } else {
        console.error('❌ Admin Dashboard button element not found!');
        showNotification('Admin Dashboard button element not found!', 'error');
    }
    
    if (userInfoSection) {
        // Hide user info section for admin
        userInfoSection.style.display = 'none';
        console.log('✅ User info section hidden for admin');
    }
    
    if (adminNavLink) {
        // Remove all hiding styles
        adminNavLink.style.display = 'block';
        adminNavLink.style.visibility = 'visible';
        adminNavLink.style.opacity = '1';
        adminNavLink.classList.add('show-admin');
        adminNavLink.removeAttribute('hidden');
        
        console.log('✅ Dashboard link forced to show');
        console.log('🔍 Element styles:', {
            display: adminNavLink.style.display,
            visibility: adminNavLink.style.visibility,
            opacity: adminNavLink.style.opacity,
            classList: adminNavLink.classList.toString()
        });
        
        // Check computed styles
        const computed = window.getComputedStyle(adminNavLink);
        console.log('🔍 Computed styles:', {
            display: computed.display,
            visibility: computed.visibility,
            opacity: computed.opacity
        });
    }
}

// Show Admin Dashboard as Homepage for Admin Users
function showAdminHomepage() {
    console.log('🏠 Displaying Admin Dashboard as homepage');
    
    // Hide regular homepage sections
    const heroSection = document.getElementById('home');
    const featuresSection = document.querySelector('.features');
    const menuSection = document.getElementById('menu');
    const specialSection = document.getElementById('special');
    
    if (heroSection) heroSection.classList.add('section-hidden');
    if (featuresSection) featuresSection.classList.add('section-hidden');
    if (menuSection) menuSection.classList.add('section-hidden');
    if (specialSection) specialSection.classList.add('section-hidden');
    
    // Show admin section
    const adminSection = document.getElementById('adminSection');
    if (adminSection) {
        adminSection.style.display = 'block';
        loadAdminDashboard();
    } else {
        console.error('❌ Admin section not found, creating dynamic admin dashboard');
        createDynamicAdminDashboard();
    }
    
    // Update navigation active state
    updateNavigationForAdmin();
}

// Show Regular Homepage for Non-Admin Users
function showRegularHomepage() {
    console.log('🏠 Displaying regular homepage for non-admin user');
    
    // Show regular homepage sections
    const heroSection = document.getElementById('home');
    const featuresSection = document.querySelector('.features');
    const menuSection = document.getElementById('menu');
    const specialSection = document.getElementById('special');
    
    if (heroSection) heroSection.classList.remove('section-hidden');
    if (featuresSection) featuresSection.classList.remove('section-hidden');
    if (menuSection) menuSection.classList.remove('section-hidden');
    if (specialSection) specialSection.classList.remove('section-hidden');
    
    // Hide admin section
    const adminSection = document.getElementById('adminSection');
    if (adminSection) {
        adminSection.classList.add('section-hidden');
    }
    
    // Update navigation active state
    updateNavigationForUser();
}

// Update Navigation Active State for Admin
function updateNavigationForAdmin() {
    // Remove active from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Set Dashboard as active
    const adminNavLink = document.getElementById('adminNavLink');
    if (adminNavLink) {
        adminNavLink.classList.add('active');
    }
}

// Update Navigation Active State for Regular User
function updateNavigationForUser() {
    // Remove active from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Set Beranda as active
    const homeNavLink = document.querySelector('.nav-link[href="#home"]');
    if (homeNavLink) {
        homeNavLink.classList.add('active');
    }
}

// Create Dynamic Admin Dashboard if section doesn't exist
function createDynamicAdminDashboard() {
    const mainContent = document.querySelector('body');
    
    const adminDashboard = document.createElement('section');
    adminDashboard.id = 'dynamicAdminSection';
    adminDashboard.className = 'admin-homepage';
    adminDashboard.innerHTML = `
        <div class="container" style="margin-top: 100px; padding: 40px 20px;">
            <div class="admin-welcome-header" style="text-align: center; margin-bottom: 40px;">
                <h1 style="font-size: 2.5rem; font-weight: 800; color: #333; margin-bottom: 10px;">
                    🎛️ Admin Dashboard
                </h1>
                <p style="color: #666; font-size: 1.2rem;">
                    Selamat datang, <strong>${currentUser.fullName}</strong>! Kelola LupyCanteen dengan mudah.
                </p>
            </div>

            <div class="admin-stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 40px;">
                <div class="stat-card" style="background: linear-gradient(135deg, #A8D8EA 0%, #FFB3D9 100%); color: white; padding: 30px; border-radius: 16px; text-align: center; box-shadow: 0 8px 25px rgba(168, 216, 234, 0.3);">
                    <div style="font-size: 3rem; margin-bottom: 10px;">🍽️</div>
                    <div style="font-size: 2rem; font-weight: 800; margin-bottom: 5px;" id="adminTotalMenus">45</div>
                    <div style="font-size: 1rem; opacity: 0.9;">Total Menu</div>
                </div>
                
                <div class="stat-card" style="background: linear-gradient(135deg, #FFB3D9 0%, #A8D8EA 100%); color: white; padding: 30px; border-radius: 16px; text-align: center; box-shadow: 0 8px 25px rgba(255, 179, 217, 0.3);">
                    <div style="font-size: 3rem; margin-bottom: 10px;">📦</div>
                    <div style="font-size: 2rem; font-weight: 800; margin-bottom: 5px;" id="adminTotalOrders">128</div>
                    <div style="font-size: 1rem; opacity: 0.9;">Orders Hari Ini</div>
                </div>
                
                <div class="stat-card" style="background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%); color: white; padding: 30px; border-radius: 16px; text-align: center; box-shadow: 0 8px 25px rgba(74, 222, 128, 0.3);">
                    <div style="font-size: 3rem; margin-bottom: 10px;">👥</div>
                    <div style="font-size: 2rem; font-weight: 800; margin-bottom: 5px;" id="adminTotalUsers">1,234</div>
                    <div style="font-size: 1rem; opacity: 0.9;">Total Users</div>
                </div>
                
                <div class="stat-card" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; border-radius: 16px; text-align: center; box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);">
                    <div style="font-size: 3rem; margin-bottom: 10px;">💰</div>
                    <div style="font-size: 2rem; font-weight: 800; margin-bottom: 5px;" id="adminTotalRevenue">Rp 2.5M</div>
                    <div style="font-size: 1rem; opacity: 0.9;">Revenue Hari Ini</div>
                </div>
            </div>

            <div class="admin-quick-actions" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 40px;">
                <div class="action-card" style="background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 15px;">🍽️</div>
                    <h3 style="font-size: 1.3rem; font-weight: 700; color: #333; margin-bottom: 10px;">Kelola Menu</h3>
                    <p style="color: #666; margin-bottom: 20px;">Tambah, edit, atau hapus menu makanan dan minuman</p>
                    <button onclick="showSection('adminSection')" style="background: linear-gradient(135deg, #A8D8EA 0%, #FFB3D9 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; font-weight: 600; cursor: pointer;">
                        Kelola Menu
                    </button>
                </div>
                
                <div class="action-card" style="background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 15px;">📊</div>
                    <h3 style="font-size: 1.3rem; font-weight: 700; color: #333; margin-bottom: 10px;">Lihat Laporan</h3>
                    <p style="color: #666; margin-bottom: 20px;">Analisis penjualan dan statistik bisnis</p>
                    <button onclick="showAdminTab('reports')" style="background: linear-gradient(135deg, #FFB3D9 0%, #A8D8EA 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; font-weight: 600; cursor: pointer;">
                        Lihat Laporan
                    </button>
                </div>
                
                <div class="action-card" style="background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 15px;">👥</div>
                    <h3 style="font-size: 1.3rem; font-weight: 700; color: #333; margin-bottom: 10px;">Kelola User</h3>
                    <p style="color: #666; margin-bottom: 20px;">Manajemen pengguna dan hak akses</p>
                    <button onclick="showAdminTab('users')" style="background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; font-weight: 600; cursor: pointer;">
                        Kelola User
                    </button>
                </div>
            </div>

            <div class="admin-navigation-help" style="background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); text-align: center;">
                <h3 style="font-size: 1.3rem; font-weight: 700; color: #333; margin-bottom: 15px;">🧭 Navigasi Admin</h3>
                <p style="color: #666; margin-bottom: 20px;">Sebagai admin, Anda juga bisa mengakses fitur customer seperti melihat menu dan memesan makanan.</p>
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <button onclick="showRegularHomepage()" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 20px; font-weight: 600; cursor: pointer;">
                        🏠 Lihat Homepage Customer
                    </button>
                    <button onclick="window.location.href='menu-rapi.html'" style="background: linear-gradient(135deg, #A8D8EA 0%, #FFB3D9 100%); color: white; border: none; padding: 10px 20px; border-radius: 20px; font-weight: 600; cursor: pointer;">
                        🍽️ Lihat Menu
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Insert after navigation
    const navbar = document.querySelector('.navbar');
    if (navbar && navbar.nextSibling) {
        navbar.parentNode.insertBefore(adminDashboard, navbar.nextSibling);
    } else {
        mainContent.appendChild(adminDashboard);
    }
    
    // Load real data
    loadAdminDashboard();
}

// Make function available globally for console debugging
window.forceShowDashboard = forceShowDashboard;
window.showAdminHomepage = showAdminHomepage;
window.showRegularHomepage = showRegularHomepage;

function addSpecialToCart() {
    addToCart('Ayam Geprek Keju', 16000);
}

function openVideoModal() {
    alert('Video akan segera tersedia! 🎥\n\nUntuk sementara, silakan jelajahi menu kami yang lezat!');
}

// Close modals when clicking outside
window.onclick = function(event) {
    const cartModal = document.getElementById('cartModal');
    const receiptModal = document.getElementById('receiptModal');
    const addMenuModal = document.getElementById('addMenuModal');
    
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
    if (event.target === receiptModal) {
        receiptModal.style.display = 'none';
    }
    if (event.target === addMenuModal) {
        addMenuModal.style.display = 'none';
    }
};

// DEBUG FUNCTIONS FOR TROUBLESHOOTING
console.log('🔧 DEBUG: All checkout functions loaded');

// Test function to verify checkout system
function testCheckoutSystem() {
    console.log('🧪 TESTING CHECKOUT SYSTEM');
    
    // Test 1: Add item to cart
    console.log('Test 1: Adding Nasi Goreng to cart...');
    tambahKeKeranjang('Nasi Goreng Test', 12000);
    
    // Test 2: Check cart contents
    console.log('Test 2: Cart contents:', keranjangBelanja);
    
    // Test 3: Test checkout
    console.log('Test 3: Testing checkout...');
    if (keranjangBelanja.length > 0) {
        checkout();
    } else {
        console.log('❌ Cart is empty, cannot test checkout');
    }
}

// Make functions globally available
window.tambahKeKeranjang = tambahKeKeranjang;
window.toggleCart = toggleCart;
window.clearCart = clearCart;
window.checkout = checkout;
window.testCheckoutSystem = testCheckoutSystem;

console.log('✅ All checkout functions are now globally available');
console.log('🔧 To test the system, open browser console and run: testCheckoutSystem()');