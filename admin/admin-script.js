// Admin Dashboard JavaScript
const API_BASE = 'http://localhost:5283/api';

// Global variables
let currentUser = null;
let currentPage = 1;
let itemsPerPage = 10;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
    setupEventListeners();
});

// Authentication
function initializeAuth() {
    const userData = localStorage.getItem('lupycanteen_user');
    if (!userData) {
        redirectToLogin();
        return;
    }

    currentUser = JSON.parse(userData);
    if (currentUser.role !== 'Admin' && currentUser.role !== 'Kasir') {
        alert('Akses ditolak. Anda tidak memiliki hak akses admin.');
        redirectToLogin();
        return;
    }

    updateUserInfo();
}

function updateUserInfo() {
    const adminNameEl = document.getElementById('adminName');
    const adminRoleEl = document.getElementById('adminRole');
    
    if (adminNameEl) adminNameEl.textContent = currentUser.fullName;
    if (adminRoleEl) adminRoleEl.textContent = currentUser.role;
}

function redirectToLogin() {
    window.location.href = 'login.html';
}

function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        localStorage.removeItem('lupycanteen_user');
        redirectToLogin();
    }
}

// Event Listeners
function setupEventListeners() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            const sidebar = document.querySelector('.sidebar');
            const menuToggle = document.getElementById('menuToggle');
            
            if (sidebar && !sidebar.contains(e.target) && !menuToggle?.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
}

// API Helper Functions
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('id-ID');
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('id-ID');
}

function showAlert(type, message, containerId = 'alertContainer') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const alert = document.createElement('div');
    alert.className = `alert alert-${type} show`;
    alert.textContent = message;
    
    container.innerHTML = '';
    container.appendChild(alert);
    
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
    }, 5000);
}

function hideAlert(containerId = 'alertContainer') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '';
    }
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Setup modal close events
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    if (e.target.classList.contains('modal-close')) {
        const modal = e.target.closest('.modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }
});

// Table Functions
function createTable(data, columns, containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '<div class="table-container"><table class="data-table"><thead><tr>';
    
    columns.forEach(col => {
        html += `<th>${col.label}</th>`;
    });
    
    if (options.actions) {
        html += '<th>Aksi</th>';
    }
    
    html += '</tr></thead><tbody>';
    
    if (data.length === 0) {
        html += `<tr><td colspan="${columns.length + (options.actions ? 1 : 0)}" class="text-center">Tidak ada data</td></tr>`;
    } else {
        data.forEach(item => {
            html += '<tr>';
            columns.forEach(col => {
                let value = item[col.key];
                if (col.format) {
                    value = col.format(value, item);
                }
                html += `<td>${value}</td>`;
            });
            
            if (options.actions) {
                html += '<td>';
                options.actions.forEach(action => {
                    html += `<button class="btn btn-sm ${action.class}" onclick="${action.onclick}('${item.id || item._id}')">${action.label}</button> `;
                });
                html += '</td>';
            }
            
            html += '</tr>';
        });
    }
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

// Pagination Functions
function createPagination(totalItems, currentPage, itemsPerPage, containerId, onPageChange) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '<div class="pagination">';
    
    // Previous button
    html += `<button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="${onPageChange}(${currentPage - 1})">‹</button>`;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="${onPageChange}(${i})">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += '<span class="pagination-dots">...</span>';
        }
    }
    
    // Next button
    html += `<button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="${onPageChange}(${currentPage + 1})">›</button>`;
    
    html += `<div class="pagination-info">Menampilkan ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalItems)} dari ${totalItems} data</div>`;
    html += '</div>';
    
    container.innerHTML = html;
}

// Search and Filter Functions
function setupSearch(inputId, callback, delay = 500) {
    const input = document.getElementById(inputId);
    if (!input) return;

    let timeout;
    input.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            callback(e.target.value);
        }, delay);
    });
}

function setupFilter(selectId, callback) {
    const select = document.getElementById(selectId);
    if (!select) return;

    select.addEventListener('change', (e) => {
        callback(e.target.value);
    });
}

// Form Validation
function validateForm(formId, rules) {
    const form = document.getElementById(formId);
    if (!form) return false;

    let isValid = true;
    const errors = {};

    Object.keys(rules).forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        const rule = rules[fieldName];
        
        if (!field) return;

        const value = field.value.trim();
        
        // Required validation
        if (rule.required && !value) {
            errors[fieldName] = `${rule.label} wajib diisi`;
            isValid = false;
            return;
        }

        // Min length validation
        if (rule.minLength && value.length < rule.minLength) {
            errors[fieldName] = `${rule.label} minimal ${rule.minLength} karakter`;
            isValid = false;
            return;
        }

        // Email validation
        if (rule.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors[fieldName] = `${rule.label} tidak valid`;
            isValid = false;
            return;
        }

        // Custom validation
        if (rule.custom && !rule.custom(value)) {
            errors[fieldName] = rule.customMessage || `${rule.label} tidak valid`;
            isValid = false;
            return;
        }
    });

    // Display errors
    Object.keys(rules).forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        const errorEl = form.querySelector(`[data-error="${fieldName}"]`);
        
        if (field) {
            field.classList.toggle('error', !!errors[fieldName]);
        }
        
        if (errorEl) {
            errorEl.textContent = errors[fieldName] || '';
            errorEl.style.display = errors[fieldName] ? 'block' : 'none';
        }
    });

    return isValid;
}

// File Upload Helper
function setupFileUpload(inputId, options = {}) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
            alert('Tipe file tidak diizinkan');
            input.value = '';
            return;
        }

        // Validate file size
        if (options.maxSize && file.size > options.maxSize) {
            alert(`Ukuran file maksimal ${options.maxSize / 1024 / 1024}MB`);
            input.value = '';
            return;
        }

        // Preview image
        if (options.previewId && file.type.startsWith('image/')) {
            const preview = document.getElementById(options.previewId);
            if (preview) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        }

        if (options.callback) {
            options.callback(file);
        }
    });
}

// Export Functions
function exportToCSV(data, filename, columns) {
    const csvContent = [
        columns.map(col => col.label).join(','),
        ...data.map(row => 
            columns.map(col => {
                let value = row[col.key];
                if (col.format) {
                    value = col.format(value, row);
                }
                return `"${value}"`;
            }).join(',')
        )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Print Function
function printTable(containerId, title) {
    const content = document.getElementById(containerId);
    if (!content) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>${title}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    h1 { color: #333; }
                    .no-print { display: none; }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                <p>Dicetak pada: ${new Date().toLocaleString('id-ID')}</p>
                ${content.innerHTML}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Loading States
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '<div class="loading">Memuat data...</div>';
    }
}

function hideLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        const loading = container.querySelector('.loading');
        if (loading) {
            loading.remove();
        }
    }
}

// Confirmation Dialog
function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// Toast Notifications
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    switch (type) {
        case 'success':
            toast.style.backgroundColor = '#16a34a';
            break;
        case 'error':
            toast.style.backgroundColor = '#dc2626';
            break;
        case 'warning':
            toast.style.backgroundColor = '#d97706';
            break;
        default:
            toast.style.backgroundColor = '#2563eb';
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Local Storage Helpers
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function getFromLocalStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
}

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}