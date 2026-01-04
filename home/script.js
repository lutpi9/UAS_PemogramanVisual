// API Configuration
const API_BASE_URL = 'http://localhost:5283/api';

// Shopping Cart System
let cart = [];
let cartCount = 0;
let menuItems = []; // Cache menu items from API

// Load menu items from API
async function loadMenuItems() {
    try {
        const response = await fetch(`${API_BASE_URL}/menu`);
        if (response.ok) {
            menuItems = await response.json();
            console.log('Menu items loaded from API:', menuItems.length);
        }
    } catch (error) {
        console.error('Error loading menu items:', error);
        // Fallback to existing static menu if API fails
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('LupyCanteen script loaded successfully');
    loadMenuItems();
    
    // Test if buttons are working
    const orderButton = document.querySelector('.btn-order');
    if (orderButton) {
        console.log('Order button found:', orderButton);
        
        // Add additional click handler as backup
        orderButton.addEventListener('click', function(e) {
            console.log('Order button clicked');
            if (!e.defaultPrevented) {
                console.log('Navigating to menu.html');
                window.location.href = 'menu.html';
            }
        });
    }
    
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll to menu function
function scrollToMenu() {
    document.getElementById('menu').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Go to menu page function
function goToMenu() {
    console.log('goToMenu function called');
    try {
        window.location.href = 'menu.html';
    } catch (error) {
        console.error('Error navigating to menu:', error);
        // Fallback
        window.location = 'menu.html';
    }
}

// Video modal function (placeholder)
function openVideoModal() {
    alert('Video akan segera tersedia! 🎥\n\nUntuk sementara, silakan jelajahi menu kami yang lezat!');
}

// Add to cart function
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    updateCartCount();
    showCartNotification(name);
}

// Add special menu to cart
function addSpecialToCart() {
    addToCart('Ayam Geprek Keju', 16000);
}

// Update cart count
function updateCartCount() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = cartCount;
}

// Show cart notification
function showCartNotification(itemName) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #FFB3D9 0%, #A8D8EA 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1500;
        animation: slideInRight 0.3s ease-out;
        font-weight: 600;
    `;
    notification.textContent = `${itemName} ditambahkan ke keranjang! 🛒`;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Toggle cart modal
function toggleCart() {
    const modal = document.getElementById('cartModal');
    if (modal.style.display === 'block') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'block';
        updateCartDisplay();
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Keranjang masih kosong</p>';
        cartTotal.textContent = 'Rp 0';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">Rp ${item.price.toLocaleString()}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${index})">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    cartTotal.textContent = `Rp ${total.toLocaleString()}`;
}

// Update quantity
function updateQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    updateCartCount();
    updateCartDisplay();
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    updateCartDisplay();
}

// Clear cart
function clearCart() {
    if (confirm('Yakin ingin mengosongkan keranjang?')) {
        cart = [];
        updateCartCount();
        updateCartDisplay();
    }
}

// Checkout function
async function checkout() {
    if (cart.length === 0) {
        alert('Keranjang masih kosong!');
        return;
    }
    
    try {
        // Prepare order data for API
        const orderData = {
            items: cart.map(item => ({
                menuItemId: getMenuItemId(item.name), // Get ID from cached menu items
                menuItemName: item.name,
                quantity: item.quantity,
                price: item.price
            }))
        };

        // Send order to API
        const response = await fetch(`${API_BASE_URL}/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            const order = await response.json();
            generateReceiptFromOrder(order);
            toggleCart();
            document.getElementById('receiptModal').style.display = 'block';
        } else {
            // Fallback to local receipt generation
            generateReceipt();
            toggleCart();
            document.getElementById('receiptModal').style.display = 'block';
        }
    } catch (error) {
        console.error('Error creating order:', error);
        // Fallback to local receipt generation
        generateReceipt();
        toggleCart();
        document.getElementById('receiptModal').style.display = 'block';
    }
}

// Helper function to get menu item ID
function getMenuItemId(menuName) {
    const menuItem = menuItems.find(item => item.name === menuName);
    return menuItem ? menuItem.id : 0;
}

// Generate receipt from API order response
function generateReceiptFromOrder(order) {
    const receiptDate = new Date(order.orderDate).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    document.getElementById('receiptDate').textContent = receiptDate;
    document.getElementById('receiptNumber').textContent = order.transactionNumber;
    
    let html = '';
    
    order.orderItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        
        html += `
            <div class="receipt-item">
                <span class="receipt-item-name">${item.menuItem.name}</span>
                <span class="receipt-item-qty">${item.quantity}x</span>
                <span class="receipt-item-price">Rp ${itemTotal.toLocaleString()}</span>
            </div>
        `;
    });
    
    document.getElementById('receiptItems').innerHTML = html;
    document.getElementById('receiptTotal').textContent = `Rp ${order.totalAmount.toLocaleString()}`;
}

// Generate receipt
function generateReceipt() {
    const now = new Date();
    const receiptNumber = 'TRX' + now.getTime().toString().slice(-8);
    const receiptDate = now.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    document.getElementById('receiptDate').textContent = receiptDate;
    document.getElementById('receiptNumber').textContent = receiptNumber;
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="receipt-item">
                <span class="receipt-item-name">${item.name}</span>
                <span class="receipt-item-qty">${item.quantity}x</span>
                <span class="receipt-item-price">Rp ${itemTotal.toLocaleString()}</span>
            </div>
        `;
    });
    
    document.getElementById('receiptItems').innerHTML = html;
    document.getElementById('receiptTotal').textContent = `Rp ${total.toLocaleString()}`;
}

// Close receipt modal
function closeReceipt() {
    document.getElementById('receiptModal').style.display = 'none';
    // Clear cart after successful checkout
    cart = [];
    updateCartCount();
}

// Print receipt
function printReceipt() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const timeStr = now.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
    const receiptNumber = 'TRX' + now.getTime().toString().slice(-8);
    
    let total = 0;
    let itemsHtml = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        itemsHtml += `
            <tr>
                <td style="text-align: left; padding: 2px 0;">${item.name}</td>
                <td style="text-align: center; padding: 2px 5px;">${item.quantity}x</td>
                <td style="text-align: right; padding: 2px 0;">Rp ${itemTotal.toLocaleString()}</td>
            </tr>
        `;
    });
    
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Struk LupyCanteen - ${receiptNumber}</title>
            <style>
                @media print {
                    @page {
                        size: 80mm auto;
                        margin: 5mm;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                    }
                }
                
                body {
                    font-family: 'Courier New', monospace;
                    font-size: 11px;
                    line-height: 1.3;
                    margin: 0;
                    padding: 10px;
                    color: #333;
                    width: 70mm;
                    max-width: 70mm;
                }
                
                .header {
                    text-align: center;
                    margin-bottom: 10px;
                    border-bottom: 1px dashed #333;
                    padding-bottom: 8px;
                }
                
                .logo {
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 3px;
                }
                
                .info {
                    font-size: 9px;
                    line-height: 1.2;
                }
                
                .transaction-info {
                    margin: 8px 0;
                    font-size: 9px;
                    border-bottom: 1px dashed #333;
                    padding-bottom: 5px;
                }
                
                .items-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 8px 0;
                }
                
                .items-table th {
                    font-size: 9px;
                    font-weight: bold;
                    border-bottom: 1px solid #333;
                    padding: 3px 0;
                }
                
                .items-table td {
                    font-size: 10px;
                    vertical-align: top;
                }
                
                .total-section {
                    border-top: 1px dashed #333;
                    padding-top: 5px;
                    margin-top: 8px;
                }
                
                .total-row {
                    font-size: 12px;
                    font-weight: bold;
                    text-align: right;
                    margin: 5px 0;
                }
                
                .footer {
                    text-align: center;
                    margin-top: 10px;
                    font-size: 9px;
                    border-top: 1px dashed #333;
                    padding-top: 8px;
                }
                
                .decoration {
                    text-align: center;
                    margin: 5px 0;
                    font-size: 8px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">🍱 LupyCanteen</div>
                <div class="info">
                    Kantin Sekolah Modern<br>
                    Jl. Raya Margamulya<br>
                    Telukjambe Barat<br>
                    Telp: (021) 123-4567
                </div>
            </div>
            
            <div class="transaction-info">
                <div>Tanggal: ${dateStr}</div>
                <div>Waktu: ${timeStr}</div>
                <div>No. Transaksi: ${receiptNumber}</div>
            </div>
            
            <table class="items-table">
                <thead>
                    <tr>
                        <th style="text-align: left;">Item</th>
                        <th style="text-align: center; width: 25px;">Qty</th>
                        <th style="text-align: right; width: 60px;">Harga</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
            
            <div class="total-section">
                <div class="total-row">TOTAL: Rp ${total.toLocaleString()}</div>
            </div>
            
            <div class="footer">
                <div>Terima kasih atas kunjungan Anda!</div>
                <div>Selamat menikmati makanan 😊</div>
                <div class="decoration">* * * * * * * * * * * * * * * *</div>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Wait a bit for content to load, then print
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

// Download PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 150] // Receipt size - adjusted height
    });
    
    // Set font to helvetica for better readability
    doc.setFont('helvetica');
    
    // Header - Logo and Name
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('LupyCanteen', 40, 12, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Kantin Sekolah Modern', 40, 18, { align: 'center' });
    doc.text('Jl. Raya Margamulya', 40, 22, { align: 'center' });
    doc.text('Telukjambe Barat', 40, 26, { align: 'center' });
    doc.text('Telp: (021) 123-4567', 40, 30, { align: 'center' });
    
    // Divider line
    doc.setLineWidth(0.1);
    doc.line(5, 34, 75, 34);
    
    // Date and transaction info
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const timeStr = now.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
    const receiptNumber = 'TRX' + now.getTime().toString().slice(-8);
    
    doc.setFontSize(7);
    doc.text(`Tanggal: ${dateStr}`, 5, 40);
    doc.text(`Waktu: ${timeStr}`, 5, 44);
    doc.text(`No. Transaksi: ${receiptNumber}`, 5, 48);
    
    // Divider line
    doc.line(5, 51, 75, 51);
    
    // Items header
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('Item', 5, 57);
    doc.text('Qty', 45, 57);
    doc.text('Harga', 75, 57, { align: 'right' });
    
    // Divider line
    doc.line(5, 59, 75, 59);
    
    // Items list
    let yPos = 65;
    let total = 0;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        // Item name (wrap if too long)
        const itemName = item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name;
        doc.text(itemName, 5, yPos);
        doc.text(`${item.quantity}x`, 45, yPos);
        doc.text(`${itemTotal.toLocaleString()}`, 75, yPos, { align: 'right' });
        yPos += 5;
    });
    
    // Total section
    yPos += 3;
    doc.line(5, yPos, 75, yPos);
    yPos += 6;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', 45, yPos);
    doc.text(`Rp ${total.toLocaleString()}`, 75, yPos, { align: 'right' });
    
    // Footer
    yPos += 12;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('Terima kasih atas kunjungan Anda!', 40, yPos, { align: 'center' });
    yPos += 4;
    doc.text('Selamat menikmati makanan', 40, yPos, { align: 'center' });
    
    // Add some decorative elements
    yPos += 8;
    doc.text('* * * * * * * * * * * * * * * *', 40, yPos, { align: 'center' });
    
    // Save PDF with better filename
    const filename = `Struk-LupyCanteen-${dateStr.replace(/\//g, '')}-${receiptNumber}.pdf`;
    doc.save(filename);
}

// Menu filter function
function filterMenu(category) {
    const menuCards = document.querySelectorAll('.menu-card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Update active button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter menu items
    menuCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease-in';
        } else {
            card.style.display = 'none';
        }
    });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const cartModal = document.getElementById('cartModal');
    const receiptModal = document.getElementById('receiptModal');
    const addMenuModal = document.getElementById('addMenuModal');
    const editMenuModal = document.getElementById('editMenuModal');
    
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
    if (event.target === receiptModal) {
        receiptModal.style.display = 'none';
    }
    if (event.target === addMenuModal) {
        addMenuModal.style.display = 'none';
    }
    if (event.target === editMenuModal) {
        editMenuModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Add Menu Functions
function showAddMenuModal() {
    const modal = document.getElementById('addMenuModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function openAddMenuModal() {
    showAddMenuModal();
}

function closeAddMenuModal() {
    const modal = document.getElementById('addMenuModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        document.getElementById('addMenuForm').reset();
        document.getElementById('imagePreview').style.display = 'none';
    }
}

function addNewMenu(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const menuData = {
        name: formData.get('menuName'),
        price: parseInt(formData.get('menuPrice')),
        category: formData.get('menuCategory'),
        description: formData.get('menuDescription'),
        badge: formData.get('menuBadge')
    };
    
    // Create new menu card
    const menuContainer = document.querySelector('.menu-container');
    const newMenuCard = createMenuCard(menuData);
    
    // Add to container with animation
    menuContainer.appendChild(newMenuCard);
    
    // Show success notification
    showMenuAddedNotification(menuData.name);
    
    // Close modal and reset form
    closeAddMenuModal();
    
    // Scroll to new menu
    setTimeout(() => {
        newMenuCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
}

function createMenuCard(menuData) {
    const menuCard = document.createElement('div');
    menuCard.className = 'menu-card new-added';
    menuCard.setAttribute('data-name', menuData.name);
    menuCard.setAttribute('data-price', menuData.price);
    menuCard.setAttribute('data-category', menuData.category);
    
    // Generate random gradient for image placeholder
    const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)'
    ];
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
    
    // Create badge HTML if badge is selected
    let badgeHtml = '';
    if (menuData.badge) {
        const badgeClass = menuData.badge === 'best-seller' ? 'best-seller' : menuData.badge;
        const badgeText = menuData.badge === 'best-seller' ? 'Best Seller' : 
                         menuData.badge.charAt(0).toUpperCase() + menuData.badge.slice(1);
        badgeHtml = `<div class="menu-badge ${badgeClass}">${badgeText}</div>`;
    }
    
    menuCard.innerHTML = `
        <div class="menu-image">
            <img src="../assets/${menuData.name.toLowerCase().replace(/\s+/g, '-')}.jpg" 
                 alt="${menuData.name}" 
                 onerror="this.style.background='${randomGradient}'">
            ${badgeHtml}
        </div>
        <div class="menu-content">
            <h3 class="menu-title">${menuData.name}</h3>
            <p class="menu-description">${menuData.description}</p>
            <div class="menu-footer">
                <span class="menu-price">Rp ${menuData.price.toLocaleString()}</span>
                <button class="btn-add" onclick="addToCart('${menuData.name}', ${menuData.price})">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 5V15M5 10H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    return menuCard;
}

function showMenuAddedNotification(menuName) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1500;
        animation: slideInRight 0.3s ease-out;
        font-weight: 600;
    `;
    notification.textContent = `✅ ${menuName} berhasil ditambahkan!`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Menu Page Specific Functions
function scrollToSection(sectionId) {
    // Update active navigation button
    document.querySelectorAll('.menu-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.menu-nav-btn').classList.add('active');
    
    // Scroll to section
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function scrollToMenu() {
    const makananSection = document.getElementById('makanan');
    if (makananSection) {
        makananSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add menu function for menu page
async function addNewMenuToPage(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const menuData = {
        name: formData.get('menuName'),
        description: formData.get('menuDescription'),
        price: parseInt(formData.get('menuPrice')),
        category: formData.get('menuCategory'),
        badge: formData.get('menuBadge') || null
    };
    
    try {
        // Send to API
        const response = await fetch(`${API_BASE_URL}/menu`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(menuData)
        });

        if (response.ok) {
            const newMenuItem = await response.json();
            
            // Add to local cache
            menuItems.push(newMenuItem);
            
            // Create and add menu card to page
            const categorySection = document.getElementById(menuData.category);
            if (categorySection) {
                const menuGrid = categorySection.querySelector('.menu-grid');
                const newMenuCard = createMenuCardFromAPI(newMenuItem);
                
                menuGrid.appendChild(newMenuCard);
                
                // Show success notification
                showMenuAddedNotification(menuData.name);
                
                // Close modal and reset form
                closeAddMenuModal();
                
                // Scroll to new menu
                setTimeout(() => {
                    newMenuCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        } else {
            throw new Error('Failed to create menu item');
        }
    } catch (error) {
        console.error('Error creating menu item:', error);
        
        // Fallback to local creation
        const categorySection = document.getElementById(menuData.category);
        if (categorySection) {
            const menuGrid = categorySection.querySelector('.menu-grid');
            const newMenuCard = createMenuCard(menuData);
            
            menuGrid.appendChild(newMenuCard);
            showMenuAddedNotification(menuData.name);
            closeAddMenuModal();
            
            setTimeout(() => {
                newMenuCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }
}

// Create menu card from API response
function createMenuCardFromAPI(menuItem) {
    const menuCard = document.createElement('div');
    menuCard.className = 'menu-card new-added';
    menuCard.setAttribute('data-name', menuItem.name);
    menuCard.setAttribute('data-price', menuItem.price);
    menuCard.setAttribute('data-category', menuItem.category);
    
    // Generate random gradient for image placeholder
    const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)'
    ];
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
    
    // Create badge HTML if badge exists
    let badgeHtml = '';
    if (menuItem.badge) {
        const badgeClass = menuItem.badge === 'best-seller' ? 'best-seller' : menuItem.badge;
        const badgeText = menuItem.badge === 'best-seller' ? 'Best Seller' : 
                         menuItem.badge.charAt(0).toUpperCase() + menuItem.badge.slice(1);
        badgeHtml = `<div class="menu-badge ${badgeClass}">${badgeText}</div>`;
    }
    
    menuCard.innerHTML = `
        <div class="menu-image">
            <img src="../assets/${menuItem.name.toLowerCase().replace(/\s+/g, '-')}.jpg" 
                 alt="${menuItem.name}" 
                 onerror="this.style.background='${randomGradient}'">
            ${badgeHtml}
        </div>
        <div class="menu-content">
            <h3 class="menu-title">${menuItem.name}</h3>
            <p class="menu-description">${menuItem.description}</p>
            <div class="menu-footer">
                <span class="menu-price">Rp ${menuItem.price.toLocaleString()}</span>
                <button class="btn-add" onclick="addToCart('${menuItem.name}', ${menuItem.price})">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 5V15M5 10H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    return menuCard;
}

// Update navigation on scroll
window.addEventListener('scroll', () => {
    const sections = ['makanan', 'minuman', 'snack'];
    const navButtons = document.querySelectorAll('.menu-nav-btn');
    
    let currentSection = '';
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom >= 150) {
                currentSection = sectionId;
            }
        }
    });
    
    // Update active navigation
    navButtons.forEach((btn, index) => {
        btn.classList.remove('active');
        if (sections[index] === currentSection) {
            btn.classList.add('active');
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
    }
    
    lastScroll = currentScroll;
});

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Parallax effect for hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Menu card hover effects
document.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// Animate stats on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber && !statNumber.classList.contains('animated')) {
                statNumber.classList.add('animated');
                animateNumber(statNumber);
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-item').forEach(stat => {
    observer.observe(stat);
});

function animateNumber(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasPercent = text.includes('%');
    const hasMin = text.includes('Min');
    
    let finalNumber = parseInt(text.replace(/[^0-9]/g, ''));
    let current = 0;
    const increment = finalNumber / 50;
    const duration = 1500;
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= finalNumber) {
            current = finalNumber;
            clearInterval(timer);
        }
        
        let displayText = Math.floor(current).toString();
        if (hasPlus) displayText += '+';
        if (hasPercent) displayText += '%';
        if (hasMin) displayText += ' Min';
        
        element.textContent = displayText;
    }, stepTime);
}

// Image Upload Functions
function showAddMenuModal() {
    const modal = document.getElementById('addMenuModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function hideAddMenuModal() {
    const modal = document.getElementById('addMenuModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        // Reset form
        document.getElementById('addMenuForm').reset();
        document.getElementById('imagePreview').style.display = 'none';
    }
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    
    if (file) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Format file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP.');
            event.target.value = '';
            return;
        }
        
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran file terlalu besar. Maksimal 5MB.');
            event.target.value = '';
            return;
        }
        
        // Show preview
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
    }
}

async function submitMenuForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Menambahkan...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/menu/with-image`, {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const newMenuItem = await response.json();
            alert('Menu berhasil ditambahkan! 🎉');
            hideAddMenuModal();
            
            // Refresh menu items display
            await refreshMenuItems();
        } else {
            const error = await response.json();
            alert(`Error: ${error.message || 'Gagal menambahkan menu'}`);
        }
    } catch (error) {
        console.error('Error adding menu item:', error);
        alert('Terjadi kesalahan saat menambahkan menu');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Update displayMenuItems function to show images
function displayMenuItems(items = menuItems) {
    const menuContainer = document.getElementById('menuItems');
    if (!menuContainer) return;
    
    menuContainer.innerHTML = '';
    
    items.forEach(item => {
        const menuCard = document.createElement('div');
        menuCard.className = 'menu-item';
        
        const imageUrl = item.imageUrl || '/images/menu/placeholder-food.jpg';
        const badge = item.badge ? `<span class="badge badge-${item.badge}">${item.badge}</span>` : '';
        
        menuCard.innerHTML = `
            <div class="menu-image">
                <img src="${imageUrl}" alt="${item.name}" onerror="this.src='/images/menu/placeholder-food.jpg'">
                ${badge}
            </div>
            <div class="menu-content">
                <h3>${item.name}</h3>
                <p class="menu-description">${item.description}</p>
                <div class="menu-footer">
                    <span class="price">Rp ${item.price.toLocaleString('id-ID')}</span>
                    <button class="btn-add-cart" onclick="addToCart('${item.name}', ${item.price})">
                        <i class="fas fa-plus"></i> Tambah
                    </button>
                </div>
            </div>
        `;
        
        menuContainer.appendChild(menuCard);
    });
}
// Load and display menu items from API
async function loadAndDisplayMenuItems() {
    try {
        const response = await fetch(`${API_BASE_URL}/menu`);
        if (response.ok) {
            const menuItems = await response.json();
            console.log('Menu items loaded:', menuItems.length);
            
            // Group menu items by category
            const categories = {
                makanan: menuItems.filter(item => item.category === 'makanan'),
                minuman: menuItems.filter(item => item.category === 'minuman'),
                snack: menuItems.filter(item => item.category === 'snack')
            };
            
            // Display each category
            displayCategoryItems('makananItems', categories.makanan);
            displayCategoryItems('minumanItems', categories.minuman);
            displayCategoryItems('snackItems', categories.snack);
            
        } else {
            console.error('Failed to load menu items');
        }
    } catch (error) {
        console.error('Error loading menu items:', error);
    }
}

// Display menu items for a specific category (append to existing static menu)
function displayCategoryItems(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Clear existing API items only
    container.innerHTML = '';
    
    // Filter out items that already exist in static menu to avoid duplicates
    const staticMenuNames = [
        // Makanan statis
        'Nasi Goreng Spesial', 'Mie Goreng Jawa', 'Ayam Katsu Crispy', 'Soto Ayam', 
        'Gado-Gado', 'Bakso Malang', 'Nasi Uduk', 'Rendang Daging', 'Ayam Geprek Keju',
        // Minuman statis
        'Jus Buah Segar', 'Es Teh Manis', 'Es Jeruk', 'Kopi Susu', 'Milkshake Coklat', 'Air Mineral',
        // Snack statis
        'Pisang Goreng', 'Keripik Singkong', 'Roti Bakar', 'Donat Mini', 'Martabak Mini', 'Es Krim Cup'
    ];
    
    const newItems = items.filter(item => !staticMenuNames.includes(item.name));
    
    newItems.forEach(item => {
        const menuCard = document.createElement('div');
        menuCard.className = 'menu-card';
        menuCard.setAttribute('data-name', item.name);
        menuCard.setAttribute('data-price', item.price);
        menuCard.setAttribute('data-category', item.category);
        
        const imageUrl = item.imageUrl || '/images/menu/placeholder-food.jpg';
        const badge = item.badge ? `<div class="menu-badge ${item.badge}">${item.badge}</div>` : '';
        
        menuCard.innerHTML = `
            <div class="menu-image">
                <img src="${imageUrl}" alt="${item.name}" onerror="this.style.background='linear-gradient(135deg, #FFB3D9 0%, #A8D8EA 100%)'">
                ${badge}
            </div>
            <div class="menu-content">
                <h3 class="menu-title">${item.name}</h3>
                <p class="menu-description">${item.description}</p>
                <div class="menu-footer">
                    <span class="menu-price">Rp ${item.price.toLocaleString('id-ID')}</span>
                    <div class="menu-actions">
                        <button class="btn-add" onclick="addToCart('${item.name}', ${item.price})">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M10 5V15M5 10H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                        <button class="btn-edit" onclick="editApiMenu('${item.id}', '${item.name}', '${item.description.replace(/'/g, "\\'")}', ${item.price}, '${item.category}', '${item.badge || ''}')" title="Edit Menu">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M12.146 0.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L9.207 10.5H6v-3.207l6.646-6.647zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zM10 3.293L4 9.293V12h2.707l6-6L10 3.293z" fill="currentColor"/>
                                <path d="M2.5 13.5A.5.5 0 0 1 3 13h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" fill="currentColor"/>
                            </svg>
                        </button>
                        <button class="btn-delete" onclick="deleteApiMenu('${item.id}', '${item.name}')" title="Hapus Menu">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" fill="currentColor"/>
                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" fill="currentColor"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(menuCard);
    });
    
    // Show message if no new items
    if (newItems.length === 0) {
        const message = document.createElement('div');
        message.className = 'no-new-items';
        message.style.cssText = `
            grid-column: 1 / -1;
            text-align: center;
            padding: 1rem;
            color: #666;
            font-style: italic;
        `;
        message.textContent = 'Tidak ada menu baru dari API';
        container.appendChild(message);
    }
}

// Initialize menu loading when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load menu items if we're on the menu page
    if (window.location.pathname.includes('menu.html') || document.getElementById('makananItems')) {
        loadAndDisplayMenuItems();
        addEditButtonsToStaticMenus();
    }
});

// Add edit buttons to all static menu items
function addEditButtonsToStaticMenus() {
    // Wait a bit for DOM to be ready
    setTimeout(() => {
        const staticMenuCards = document.querySelectorAll('.menu-card:not([data-api-menu])');
        
        staticMenuCards.forEach(card => {
            const footer = card.querySelector('.menu-footer');
            const addButton = footer.querySelector('.btn-add');
            
            // Skip if edit button already exists
            if (footer.querySelector('.btn-edit')) return;
            
            // Get menu data
            const name = card.getAttribute('data-name');
            const price = card.getAttribute('data-price');
            const category = card.getAttribute('data-category');
            const description = card.querySelector('.menu-description').textContent;
            const badgeElement = card.querySelector('.menu-badge');
            const badge = badgeElement ? badgeElement.className.split(' ').pop() : '';
            
            // Create menu actions container if it doesn't exist
            let actionsContainer = footer.querySelector('.menu-actions');
            if (!actionsContainer) {
                actionsContainer = document.createElement('div');
                actionsContainer.className = 'menu-actions';
                
                // Move add button to actions container
                actionsContainer.appendChild(addButton);
                footer.appendChild(actionsContainer);
            }
            
            // Create edit button
            const editButton = document.createElement('button');
            editButton.className = 'btn-edit';
            editButton.title = 'Edit Menu';
            editButton.onclick = () => editStaticMenu(name, description, parseInt(price), category, badge);
            editButton.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12.146 0.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L9.207 10.5H6v-3.207l6.646-6.647zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zM10 3.293L4 9.293V12h2.707l6-6L10 3.293z" fill="currentColor"/>
                    <path d="M2.5 13.5A.5.5 0 0 1 3 13h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" fill="currentColor"/>
                </svg>
            `;
            
            // Create delete button for static menu (with warning)
            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn-delete';
            deleteButton.title = 'Hapus Menu';
            deleteButton.onclick = () => deleteStaticMenu(name);
            deleteButton.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" fill="currentColor"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" fill="currentColor"/>
                </svg>
            `;
            
            actionsContainer.appendChild(editButton);
            actionsContainer.appendChild(deleteButton);
        });
    }, 500);
}

// Edit Menu Functions
function editStaticMenu(name, description, price, category, badge = '') {
    // For static menu items, we'll create a new API menu item
    showEditMenuModal();
    
    // Fill form with current data
    document.getElementById('editMenuId').value = '';
    document.getElementById('editMenuType').value = 'static';
    document.getElementById('editName').value = name;
    document.getElementById('editDescription').value = description;
    document.getElementById('editPrice').value = price;
    document.getElementById('editCategory').value = category;
    document.getElementById('editBadge').value = badge;
    
    // Store original name for reference
    document.getElementById('editMenuForm').setAttribute('data-original-name', name);
}

function editApiMenu(id, name, description, price, category, badge = '') {
    showEditMenuModal();
    
    // Fill form with current data
    document.getElementById('editMenuId').value = id;
    document.getElementById('editMenuType').value = 'api';
    document.getElementById('editName').value = name;
    document.getElementById('editDescription').value = description;
    document.getElementById('editPrice').value = price;
    document.getElementById('editCategory').value = category;
    document.getElementById('editBadge').value = badge;
}

function showEditMenuModal() {
    const modal = document.getElementById('editMenuModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function hideEditMenuModal() {
    const modal = document.getElementById('editMenuModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        // Reset form
        document.getElementById('editMenuForm').reset();
        document.getElementById('editImagePreview').style.display = 'none';
    }
}

function handleEditImageUpload(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('editImagePreview');
    const previewImg = document.getElementById('editPreviewImg');
    
    if (file) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Format file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP.');
            event.target.value = '';
            return;
        }
        
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran file terlalu besar. Maksimal 5MB.');
            event.target.value = '';
            return;
        }
        
        // Show preview
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
    }
}

async function submitEditMenuForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const menuType = formData.get('menuType');
    const menuId = formData.get('menuId');
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Mengupdate...';
    submitBtn.disabled = true;
    
    try {
        if (menuType === 'static') {
            // For static menu, create new API menu item
            const response = await fetch(`${API_BASE_URL}/menu/with-image`, {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                const newMenuItem = await response.json();
                alert('Menu berhasil diupdate! Menu baru telah ditambahkan ke sistem. 🎉');
                hideEditMenuModal();
                await refreshMenuItems();
            } else {
                const error = await response.json();
                alert(`Error: ${error.message || 'Gagal mengupdate menu'}`);
            }
        } else {
            // For API menu, update existing
            const response = await fetch(`${API_BASE_URL}/menu/${menuId}/with-image`, {
                method: 'PUT',
                body: formData
            });
            
            if (response.ok) {
                const updatedMenuItem = await response.json();
                alert('Menu berhasil diupdate! 🎉');
                hideEditMenuModal();
                await refreshMenuItems();
            } else {
                const error = await response.json();
                alert(`Error: ${error.message || 'Gagal mengupdate menu'}`);
            }
        }
    } catch (error) {
        console.error('Error updating menu item:', error);
        alert('Terjadi kesalahan saat mengupdate menu');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Delete Menu Functions
async function deleteApiMenu(menuId, menuName) {
    if (!confirm(`Yakin ingin menghapus menu "${menuName}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/menu/${menuId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert(`Menu "${menuName}" berhasil dihapus! 🗑️`);
            await refreshMenuItems();
        } else {
            alert('Gagal menghapus menu');
        }
    } catch (error) {
        console.error('Error deleting menu item:', error);
        alert('Terjadi kesalahan saat menghapus menu');
    }
}

function deleteStaticMenu(menuName) {
    // Show a more informative dialog
    const result = confirm(`⚠️ PERHATIAN!\n\nMenu "${menuName}" adalah menu statis yang tidak dapat dihapus secara permanen.\n\nMenu statis berfungsi sebagai template dasar untuk konsistensi tampilan.\n\nJika Anda ingin menghapus menu, silakan:\n1. Edit menu ini untuk membuat versi baru di sistem\n2. Kemudian hapus versi yang ada di sistem\n\nApakah Anda ingin mengedit menu ini sekarang?`);
    
    if (result) {
        // Get menu data and open edit modal
        const menuCard = document.querySelector(`[data-name="${menuName}"]`);
        if (menuCard) {
            const price = menuCard.getAttribute('data-price');
            const category = menuCard.getAttribute('data-category');
            const description = menuCard.querySelector('.menu-description').textContent;
            const badgeElement = menuCard.querySelector('.menu-badge');
            const badge = badgeElement ? badgeElement.className.split(' ').pop() : '';
            
            editStaticMenu(menuName, description, parseInt(price), category, badge);
        }
    }
}

// Refresh menu items after adding new menu
async function refreshMenuItems() {
    await loadAndDisplayMenuItems();
}

// Admin Integration Functions
let currentUser = null;

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
});

function checkAdminAuth() {
    const userData = localStorage.getItem('lupycanteen_user');
    if (userData) {
        try {
            currentUser = JSON.parse(userData);
            if (currentUser.role === 'Admin' || currentUser.role === 'Kasir') {
                showAdminUI();
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('lupycanteen_user');
        }
    }
}

function showAdminUI() {
    document.getElementById('adminLoginBtn').style.display = 'none';
    document.getElementById('adminUserInfo').style.display = 'flex';
    document.getElementById('adminNavLink').style.display = 'block';
    document.getElementById('adminUserName').textContent = currentUser.fullName;
}

function hideAdminUI() {
    document.getElementById('adminLoginBtn').style.display = 'block';
    document.getElementById('adminUserInfo').style.display = 'none';
    document.getElementById('adminNavLink').style.display = 'none';
}

function showAdminLogin() {
    document.getElementById('adminLoginModal').style.display = 'block';
}

function hideAdminLogin() {
    document.getElementById('adminLoginModal').style.display = 'none';
}

async function adminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const result = await response.json();
        
        if (result.success) {
            currentUser = result.data;
            localStorage.setItem('lupycanteen_user', JSON.stringify(currentUser));
            
            if (currentUser.role === 'Admin' || currentUser.role === 'Kasir') {
                showAdminUI();
                hideAdminLogin();
                showAdminDashboard();
                loadDashboardData();
                alert('Login berhasil! Selamat datang ' + currentUser.fullName);
            } else {
                alert('Akses ditolak. Anda tidak memiliki hak akses admin.');
            }
        } else {
            alert('Login gagal: ' + result.message);
        }
    } catch (error) {
        alert('Terjadi kesalahan saat login. Pastikan server berjalan.');
        console.error('Login error:', error);
    }
}

function adminLogout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        currentUser = null;
        localStorage.removeItem('lupycanteen_user');
        hideAdminUI();
        hideAdminDashboard();
        alert('Logout berhasil!');
    }
}

function toggleAdminMenu() {
    if (currentUser) {
        showAdminDashboard();
        loadDashboardData();
    }
}

function showAdminDashboard() {
    document.getElementById('adminDashboardModal').style.display = 'block';
}

function hideAdminDashboard() {
    document.getElementById('adminDashboardModal').style.display = 'none';
}

function showAdminTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.admin-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById('adminTab' + tabName.charAt(0).toUpperCase() + tabName.slice(1)).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Load data for the selected tab
    switch(tabName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'menu':
            loadAdminMenuData();
            break;
        case 'orders':
            loadAdminOrdersData();
            break;
        case 'users':
            loadAdminUsersData();
            break;
    }
}

async function loadDashboardData() {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard/statistics`);
        const result = await response.json();
        
        if (result.success) {
            const data = result.data;
            document.getElementById('dashTotalMenus').textContent = data.overview.totalMenus;
            document.getElementById('dashTotalOrders').textContent = data.overview.totalOrders;
            document.getElementById('dashTotalUsers').textContent = data.overview.totalUsers;
            document.getElementById('dashTotalRevenue').textContent = formatCurrency(data.overview.totalRevenue);
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

async function loadAdminMenuData() {
    try {
        const response = await fetch(`${API_BASE_URL}/menu`);
        const menus = await response.json();
        
        const tbody = document.getElementById('adminMenuTable');
        if (menus && menus.length > 0) {
            tbody.innerHTML = menus.map(menu => `
                <tr>
                    <td><img src="${menu.imageUrl}" alt="${menu.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZjBmMGYwIi8+Cjx0ZXh0IHg9IjI1IiB5PSIyNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSI+Tk88L3RleHQ+Cjwvc3ZnPg=='"></td>
                    <td><strong>${menu.name}</strong><br><small>${menu.description}</small></td>
                    <td><span class="status-badge">${menu.category}</span></td>
                    <td>${formatCurrency(menu.price)}</td>
                    <td><span class="status-badge ${menu.isAvailable ? 'status-active' : 'status-inactive'}">${menu.isAvailable ? 'Aktif' : 'Nonaktif'}</span></td>
                    <td>
                        <button class="btn-edit" onclick="editMenu('${menu.id}')">Edit</button>
                        <button class="btn-delete" onclick="deleteMenu('${menu.id}')">Hapus</button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Tidak ada data menu</td></tr>';
        }
    } catch (error) {
        console.error('Error loading menu data:', error);
        document.getElementById('adminMenuTable').innerHTML = '<tr><td colspan="6" style="text-align: center;">Error loading data</td></tr>';
    }
}

async function loadAdminOrdersData() {
    try {
        const response = await fetch(`${API_BASE_URL}/order`);
        const orders = await response.json();
        
        const tbody = document.getElementById('adminOrdersTable');
        if (orders && orders.length > 0) {
            tbody.innerHTML = orders.map(order => `
                <tr>
                    <td>#${order.id.substring(0, 8)}</td>
                    <td><strong>${order.customerName}</strong><br><small>${order.customerEmail}</small></td>
                    <td>${order.orderItems.length} items</td>
                    <td>${formatCurrency(order.totalAmount)}</td>
                    <td><span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></td>
                    <td>${new Date(order.orderDate).toLocaleDateString('id-ID')}</td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Tidak ada data pesanan</td></tr>';
        }
    } catch (error) {
        console.error('Error loading orders data:', error);
        document.getElementById('adminOrdersTable').innerHTML = '<tr><td colspan="6" style="text-align: center;">Error loading data</td></tr>';
    }
}

async function loadAdminUsersData() {
    try {
        const response = await fetch(`${API_BASE_URL}/user`);
        const users = await response.json();
        
        const tbody = document.getElementById('adminUsersTable');
        if (users && users.length > 0) {
            tbody.innerHTML = users.map(user => `
                <tr>
                    <td><strong>${user.username}</strong></td>
                    <td>${user.fullName}</td>
                    <td>${user.email}</td>
                    <td><span class="status-badge">${user.role}</span></td>
                    <td><span class="status-badge ${user.isActive ? 'status-active' : 'status-inactive'}">${user.isActive ? 'Aktif' : 'Nonaktif'}</span></td>
                    <td>
                        <button class="btn-edit" onclick="editUser('${user.id}')">Edit</button>
                        <button class="btn-delete" onclick="deleteUser('${user.id}')">Hapus</button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Tidak ada data user</td></tr>';
        }
    } catch (error) {
        console.error('Error loading users data:', error);
        document.getElementById('adminUsersTable').innerHTML = '<tr><td colspan="6" style="text-align: center;">Error loading data</td></tr>';
    }
}

// Menu Management Functions
function showAddMenuForm() {
    // This would open a form modal for adding new menu
    alert('Fitur tambah menu akan segera tersedia!\n\nUntuk sementara, gunakan halaman admin terpisah di:\nhttp://localhost:5283/admin/menu-management.html');
}

function editMenu(menuId) {
    alert('Fitur edit menu akan segera tersedia!\n\nUntuk sementara, gunakan halaman admin terpisah di:\nhttp://localhost:5283/admin/menu-management.html');
}

async function deleteMenu(menuId) {
    if (confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/menu/${menuId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('Menu berhasil dihapus!');
                loadAdminMenuData(); // Reload data
            } else {
                alert('Gagal menghapus menu!');
            }
        } catch (error) {
            alert('Terjadi kesalahan saat menghapus menu!');
            console.error('Delete menu error:', error);
        }
    }
}

// User Management Functions
function showAddUserForm() {
    alert('Fitur tambah user akan segera tersedia!\n\nUntuk sementara, gunakan halaman admin terpisah di:\nhttp://localhost:5283/admin/user-management.html');
}

function editUser(userId) {
    alert('Fitur edit user akan segera tersedia!\n\nUntuk sementara, gunakan halaman admin terpisah di:\nhttp://localhost:5283/admin/user-management.html');
}

async function deleteUser(userId) {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('User berhasil dihapus!');
                loadAdminUsersData(); // Reload data
            } else {
                alert('Gagal menghapus user!');
            }
        } catch (error) {
            alert('Terjadi kesalahan saat menghapus user!');
            console.error('Delete user error:', error);
        }
    }
}

// Utility function for currency formatting
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Close modals when clicking outside
window.onclick = function(event) {
    const adminLoginModal = document.getElementById('adminLoginModal');
    const adminDashboardModal = document.getElementById('adminDashboardModal');
    
    if (event.target === adminLoginModal) {
        hideAdminLogin();
    }
    if (event.target === adminDashboardModal) {
        hideAdminDashboard();
    }
}
// Single Page Application Functions
let currentSection = 'home';
let allMenuItems = [];

// Show specific section
function showSection(sectionName) {
    console.log('Showing section:', sectionName);
    
    // Hide all sections
    const sections = ['home', 'fullMenu', 'aboutSection', 'contactSection', 'adminSection'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            element.style.display = 'none';
        }
    });
    
    // Show selected section
    let targetSection = sectionName;
    if (sectionName === 'menu') targetSection = 'fullMenu';
    if (sectionName === 'about') targetSection = 'aboutSection';
    if (sectionName === 'contact') targetSection = 'contactSection';
    if (sectionName === 'admin') targetSection = 'adminSection';
    
    const element = document.getElementById(targetSection);
    if (element) {
        element.style.display = 'block';
        currentSection = sectionName;
        
        // Update navigation active state
        updateNavigation(sectionName);
        
        // Load section-specific data
        loadSectionData(sectionName);
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        console.log('Section shown:', targetSection);
    } else {
        console.error('Section not found:', targetSection);
    }
}

// Update navigation active state
function updateNavigation(activeSection) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const navMap = {
        'home': 'Beranda',
        'fullMenu': 'Menu',
        'menu': 'Menu',
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

// Load section-specific data
function loadSectionData(sectionName) {
    switch(sectionName) {
        case 'fullMenu':
        case 'menu':
            loadFullMenuData();
            break;
        case 'adminSection':
        case 'admin':
            if (currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Kasir')) {
                loadAdminDashboardData();
            }
            break;
    }
}

// Load full menu data
async function loadFullMenuData() {
    try {
        const response = await fetch(`${API_BASE_URL}/menu`);
        const apiMenus = await response.json();
        
        // Combine static menus with API menus
        const staticMenus = [
            {
                id: 'static-1',
                name: 'Nasi Uduk',
                description: 'Nasi uduk dengan lauk pauk lengkap',
                price: 9000,
                category: 'makanan',
                imageUrl: 'https://cdn.yummy.co.id/content-images/images/20200611/J1acgi7BV9YusddDwNjwvRvRvqgw7m2x-31353931383733303935d41d8cd98f00b204e9800998ecf8427e.jpg?x-oss-process=image/resize,w_388,h_388,m_fixed,x-oss-process=image/format,webp',
                isAvailable: true
            },
            {
                id: 'static-2',
                name: 'Gado-Gado',
                description: 'Gado-gado segar dengan bumbu kacang',
                price: 11000,
                category: 'makanan',
                imageUrl: 'https://static.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p2/74/2025/01/27/Gado-Gado-2337756915.jpg',
                isAvailable: true
            },
            {
                id: 'static-3',
                name: 'Es Teh Manis',
                description: 'Es teh manis segar',
                price: 5000,
                category: 'minuman',
                imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop',
                isAvailable: true
            },
            {
                id: 'static-4',
                name: 'Pisang Goreng',
                description: 'Pisang goreng crispy',
                price: 4000,
                category: 'snack',
                imageUrl: 'https://cdn.grid.id/crop/0x0:0x0/700x465/smart/filters:format(webp):quality(100)/photo/2025/12/05/pisang-goreng-tandukjpg-20251205043631.jpg',
                isAvailable: true
            }
        ];
        
        allMenuItems = [...staticMenus, ...(apiMenus || [])];
        displayMenuItems(allMenuItems);
        
    } catch (error) {
        console.error('Error loading menu data:', error);
        // Fallback to static menus only
        allMenuItems = [
            {
                id: 'static-1',
                name: 'Nasi Uduk',
                description: 'Nasi uduk dengan lauk pauk lengkap',
                price: 9000,
                category: 'makanan',
                imageUrl: 'https://cdn.yummy.co.id/content-images/images/20200611/J1acgi7BV9YusddDwNjwvRvRvqgw7m2x-31353931383733303935d41d8cd98f00b204e9800998ecf8427e.jpg?x-oss-process=image/resize,w_388,h_388,m_fixed,x-oss-process=image/format,webp',
                isAvailable: true
            }
        ];
        displayMenuItems(allMenuItems);
    }
}

// Display menu items
function displayMenuItems(items) {
    const menuGrid = document.getElementById('fullMenuGrid');
    if (!menuGrid) return;
    
    if (items.length === 0) {
        menuGrid.innerHTML = '<div class="menu-loading">Tidak ada menu tersedia</div>';
        return;
    }
    
    menuGrid.innerHTML = items.map(item => `
        <div class="menu-card" data-category="${item.category}">
            <div class="menu-image">
                <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjBmMGYwIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5Ij5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'">
                ${item.badge ? `<div class="menu-badge ${item.badge.toLowerCase()}">${item.badge}</div>` : ''}
                ${!item.isAvailable ? '<div class="menu-badge unavailable">Habis</div>' : ''}
            </div>
            <div class="menu-content">
                <h3 class="menu-title">${item.name}</h3>
                <p class="menu-description">${item.description}</p>
                <div class="menu-footer">
                    <span class="menu-price">${formatCurrency(item.price)}</span>
                    <button class="btn-add" onclick="addToCart('${item.name}', ${item.price})" ${!item.isAvailable ? 'disabled' : ''}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 5V15M5 10H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter menu by category
function filterMenu(category) {
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter items
    const filteredItems = category === 'all' ? allMenuItems : allMenuItems.filter(item => item.category === category);
    displayMenuItems(filteredItems);
}

// Load admin dashboard data
async function loadAdminDashboardData() {
    if (!currentUser || (currentUser.role !== 'Admin' && currentUser.role !== 'Kasir')) {
        return;
    }
    
    // Update welcome name
    const welcomeElement = document.getElementById('adminWelcomeName');
    if (welcomeElement) {
        welcomeElement.textContent = currentUser.fullName;
    }
    
    // Load dashboard statistics
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard/statistics`);
        const result = await response.json();
        
        if (result.success) {
            const data = result.data;
            document.getElementById('adminTotalMenus').textContent = data.overview.totalMenus;
            document.getElementById('adminTotalOrders').textContent = data.overview.totalOrders;
            document.getElementById('adminTotalUsers').textContent = data.overview.totalUsers;
            document.getElementById('adminTotalRevenue').textContent = formatCurrency(data.overview.totalRevenue);
        }
    } catch (error) {
        console.error('Error loading admin dashboard data:', error);
    }
}

// Show admin tab
function showAdminTab(tabName) {
    // Hide all admin tabs
    document.querySelectorAll('.admin-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.admin-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const targetTab = document.getElementById('adminTab' + tabName.charAt(0).toUpperCase() + tabName.slice(1));
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Add active class to clicked button
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Load tab-specific data
    switch(tabName) {
        case 'overview':
            loadAdminDashboardData();
            break;
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

// Load admin reports data
async function loadAdminReportsData() {
    try {
        // Mock data for now - you can implement real API calls
        document.getElementById('todaySales').textContent = formatCurrency(150000);
        document.getElementById('weeklySales').textContent = formatCurrency(1200000);
        document.getElementById('topMenu').textContent = 'Nasi Uduk';
        document.getElementById('totalCustomers').textContent = '45';
    } catch (error) {
        console.error('Error loading reports data:', error);
    }
}

// Enhanced admin login to redirect to admin section
async function adminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const result = await response.json();
        
        if (result.success) {
            currentUser = result.data;
            localStorage.setItem('lupycanteen_user', JSON.stringify(currentUser));
            
            if (currentUser.role === 'Admin' || currentUser.role === 'Kasir') {
                showAdminUI();
                hideAdminLogin();
                
                // Show admin section
                showSection('adminSection');
                
                alert('Login berhasil! Selamat datang ' + currentUser.fullName);
            } else {
                alert('Akses ditolak. Anda tidak memiliki hak akses admin.');
            }
        } else {
            alert('Login gagal: ' + result.message);
        }
    } catch (error) {
        alert('Terjadi kesalahan saat login. Pastikan server berjalan.');
        console.error('Login error:', error);
    }
}

// Enhanced admin logout
function adminLogout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        currentUser = null;
        localStorage.removeItem('lupycanteen_user');
        hideAdminUI();
        
        // Redirect to home
        showSection('home');
        
        alert('Logout berhasil!');
    }
}

// Override the original toggleAdminMenu function
function toggleAdminMenu() {
    if (currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Kasir')) {
        showSection('adminSection');
    } else {
        showAdminLogin();
    }
}

// Add menu modal functions (simplified)
function showAddMenuModal() {
    alert('Fitur tambah menu akan segera tersedia!\n\nUntuk sementara, gunakan halaman admin terpisah di:\nhttp://localhost:5283/admin/menu-management.html');
}

function showAddUserModal() {
    alert('Fitur tambah user akan segera tersedia!\n\nUntuk sementara, gunakan halaman admin terpisah di:\nhttp://localhost:5283/admin/user-management.html');
}

// Initialize single page application
document.addEventListener('DOMContentLoaded', function() {
    console.log('LupyCanteen Unified System Loading...');
    
    // Check admin auth
    checkAdminAuth();
    
    // Load initial section data
    loadSectionData('home');
    
    // Handle navigation clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const onclick = this.getAttribute('onclick');
            
            console.log('Nav link clicked:', href, onclick);
            
            if (onclick && onclick.includes('showSection')) {
                // Let the onclick handler work
                return;
            }
            
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const sectionName = href.substring(1);
                console.log('Navigating to section:', sectionName);
                
                if (sectionName === 'menu') {
                    showSection('fullMenu');
                } else if (sectionName === 'about') {
                    showSection('aboutSection');
                } else if (sectionName === 'contact') {
                    showSection('contactSection');
                } else if (sectionName === 'admin') {
                    showSection('adminSection');
                } else {
                    showSection(sectionName);
                }
            }
        });
    });
    
    // Add test buttons for debugging
    console.log('Available sections:', ['home', 'fullMenu', 'aboutSection', 'contactSection', 'adminSection']);
    
    // Test section visibility
    const sections = ['home', 'fullMenu', 'aboutSection', 'contactSection', 'adminSection'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        console.log(`Section ${section}:`, element ? 'Found' : 'Not found');
    });
    
    // Handle browser back/forward
    window.addEventListener('popstate', function(e) {
        const hash = window.location.hash.substring(1);
        if (hash) {
            showSection(hash);
        } else {
            showSection('home');
        }
    });
    
    console.log('LupyCanteen Unified System Ready!');
});

// Update the original goToMenu function
function goToMenu() {
    showSection('fullMenu');
}

// Update scroll to menu function
function scrollToMenu() {
    showSection('fullMenu');
}
// Debug functions
function toggleDebug() {
    const debugInfo = document.getElementById('debugInfo');
    if (debugInfo) {
        debugInfo.style.display = debugInfo.style.display === 'none' ? 'block' : 'none';
    }
}

function updateDebugInfo() {
    const currentSectionDebug = document.getElementById('currentSectionDebug');
    const currentUserDebug = document.getElementById('currentUserDebug');
    const sectionsDebug = document.getElementById('sectionsDebug');
    
    if (currentSectionDebug) {
        currentSectionDebug.textContent = currentSection;
    }
    
    if (currentUserDebug) {
        currentUserDebug.textContent = currentUser ? currentUser.fullName : 'Guest';
    }
    
    if (sectionsDebug) {
        const sections = ['home', 'fullMenu', 'aboutSection', 'contactSection', 'adminSection'];
        const status = sections.map(section => {
            const element = document.getElementById(section);
            const isVisible = element && element.style.display !== 'none';
            return `${section}: ${isVisible ? 'Visible' : 'Hidden'}`;
        }).join(', ');
        sectionsDebug.textContent = status;
    }
}

// Add keyboard shortcut for debug
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        toggleDebug();
    }
});

// Update debug info when section changes
const originalShowSection = showSection;
showSection = function(sectionName) {
    originalShowSection(sectionName);
    updateDebugInfo();
};
// Enhanced Auth System
function showLoginForm() {
    showSection('loginSection');
}

function hideLoginForm() {
    showSection('home');
}

// Handle main login form
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Show loading state
    const submitBtn = document.querySelector('.btn-login-submit');
    const buttonText = document.getElementById('loginButtonText');
    const spinner = document.getElementById('loginSpinner');
    
    submitBtn.disabled = true;
    buttonText.style.display = 'none';
    spinner.style.display = 'block';
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const result = await response.json();
        
        if (result.success) {
            currentUser = result.data;
            
            // Save to localStorage
            if (rememberMe) {
                localStorage.setItem('lupycanteen_user', JSON.stringify(currentUser));
            } else {
                sessionStorage.setItem('lupycanteen_user', JSON.stringify(currentUser));
            }
            
            // Update UI
            updateAuthUI();
            
            // Redirect based on role
            if (currentUser.role === 'Admin' || currentUser.role === 'Kasir') {
                showSection('adminSection');
                loadAdminDashboardData();
                showNotification('Login berhasil! Selamat datang di Dashboard Admin.', 'success');
            } else {
                showSection('home');
                showNotification('Login berhasil! Selamat datang ' + currentUser.fullName, 'success');
            }
            
            // Clear form
            document.getElementById('mainLoginForm').reset();
            
        } else {
            showNotification('Login gagal: ' + result.message, 'error');
        }
    } catch (error) {
        showNotification('Terjadi kesalahan saat login. Pastikan server berjalan.', 'error');
        console.error('Login error:', error);
    } finally {
        // Reset loading state
        submitBtn.disabled = false;
        buttonText.style.display = 'block';
        spinner.style.display = 'none';
    }
}

// Fill demo account credentials
function fillDemoAccount(type) {
    if (type === 'admin') {
        document.getElementById('loginUsername').value = 'admin';
        document.getElementById('loginPassword').value = 'admin123';
    } else if (type === 'kasir') {
        document.getElementById('loginUsername').value = 'kasir1';
        document.getElementById('loginPassword').value = 'kasir123';
    }
    
    showNotification('Demo credentials filled! Click "Masuk" to login.', 'info');
}

// Update auth UI
function updateAuthUI() {
    const guestState = document.getElementById('guestState');
    const loggedInState = document.getElementById('loggedInState');
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');
    const dashboardBtn = document.getElementById('dashboardBtn');
    const adminNavLink = document.getElementById('adminNavLink');
    
    if (currentUser) {
        // Show logged in state
        guestState.style.display = 'none';
        loggedInState.style.display = 'block';
        
        // Update user info
        userName.textContent = currentUser.fullName;
        userRole.textContent = currentUser.role;
        
        // Show dashboard button for admin/kasir
        if (currentUser.role === 'Admin' || currentUser.role === 'Kasir') {
            dashboardBtn.style.display = 'flex';
            adminNavLink.style.display = 'block';
        } else {
            dashboardBtn.style.display = 'none';
            adminNavLink.style.display = 'none';
        }
    } else {
        // Show guest state
        guestState.style.display = 'block';
        loggedInState.style.display = 'none';
        adminNavLink.style.display = 'none';
    }
}

// Go to dashboard
function goToDashboard() {
    if (currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Kasir')) {
        showSection('adminSection');
        loadAdminDashboardData();
    } else {
        showNotification('Akses ditolak. Anda tidak memiliki hak akses admin.', 'error');
    }
}

// Enhanced logout
function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        currentUser = null;
        localStorage.removeItem('lupycanteen_user');
        sessionStorage.removeItem('lupycanteen_user');
        
        // Update UI
        updateAuthUI();
        
        // Redirect to home
        showSection('home');
        
        showNotification('Logout berhasil!', 'success');
    }
}

// Enhanced auth check
function checkAdminAuth() {
    // Check localStorage first, then sessionStorage
    let userData = localStorage.getItem('lupycanteen_user') || sessionStorage.getItem('lupycanteen_user');
    
    if (userData) {
        try {
            currentUser = JSON.parse(userData);
            updateAuthUI();
            console.log('User logged in:', currentUser.fullName, currentUser.role);
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('lupycanteen_user');
            sessionStorage.removeItem('lupycanteen_user');
            currentUser = null;
            updateAuthUI();
        }
    } else {
        currentUser = null;
        updateAuthUI();
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Placeholder functions for register and forgot password
function showRegisterForm() {
    showNotification('Fitur registrasi akan segera tersedia!', 'info');
}

function showForgotPassword() {
    showNotification('Fitur lupa password akan segera tersedia!', 'info');
}

// Override the original admin functions to use new auth system
const originalAdminLogin = adminLogin;
adminLogin = function(event) {
    // Redirect to main login form instead
    showLoginForm();
};

const originalAdminLogout = adminLogout;
adminLogout = function() {
    logout();
};

// Update initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('LupyCanteen Unified System Loading...');
    
    // Check auth first
    checkAdminAuth();
    
    // Load initial section data
    loadSectionData('home');
    
    // Handle navigation clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const onclick = this.getAttribute('onclick');
            
            console.log('Nav link clicked:', href, onclick);
            
            if (onclick && onclick.includes('showSection')) {
                // Let the onclick handler work
                return;
            }
            
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const sectionName = href.substring(1);
                console.log('Navigating to section:', sectionName);
                
                if (sectionName === 'menu') {
                    showSection('fullMenu');
                } else if (sectionName === 'about') {
                    showSection('aboutSection');
                } else if (sectionName === 'contact') {
                    showSection('contactSection');
                } else if (sectionName === 'admin') {
                    // Check if user is logged in and has admin access
                    if (currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Kasir')) {
                        showSection('adminSection');
                        loadAdminDashboardData();
                    } else {
                        showLoginForm();
                    }
                } else {
                    showSection(sectionName);
                }
            }
        });
    });
    
    // Add test buttons for debugging
    console.log('Available sections:', ['home', 'loginSection', 'fullMenu', 'aboutSection', 'contactSection', 'adminSection']);
    
    // Test section visibility
    const sections = ['home', 'loginSection', 'fullMenu', 'aboutSection', 'contactSection', 'adminSection'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        console.log(`Section ${section}:`, element ? 'Found' : 'Not found');
    });
    
    // Handle browser back/forward
    window.addEventListener('popstate', function(e) {
        const hash = window.location.hash.substring(1);
        if (hash) {
            showSection(hash);
        } else {
            showSection('home');
        }
    });
    
    console.log('LupyCanteen Unified System Ready!');
});