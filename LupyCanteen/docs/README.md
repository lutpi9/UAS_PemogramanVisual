# 🍱 LupyCanteen - Sistem Kantin Sekolah Modern

Sistem manajemen kantin sekolah yang lengkap dengan fitur login-first, dashboard admin, dan sistem pemesanan terintegrasi.

## ✨ Fitur Utama

### 🔐 Sistem Autentikasi
- **Login-First System**: Pengguna harus login sebelum mengakses aplikasi
- **Role-Based Access**: Admin, Kasir, dan Customer dengan hak akses berbeda
- **Session Management**: Dukungan "Remember Me" dengan localStorage/sessionStorage
- **Demo Accounts**: Akun demo untuk testing

### 🏠 Aplikasi Utama (Setelah Login)
- **Single Page Application**: Navigasi seamless antar section
- **Homepage**: Tampilan utama dengan menu populer
- **Menu Lengkap**: Katalog menu dengan filter kategori
- **Shopping Cart**: Keranjang belanja dengan checkout
- **Receipt System**: Struk digital dengan print dan PDF
- **About & Contact**: Informasi kantin dan kontak

### 👨‍💼 Dashboard Admin
- **Overview**: Statistik penjualan dan data sistem
- **Menu Management**: CRUD menu dengan upload gambar
- **Order Management**: Tracking pesanan customer
- **User Management**: Kelola akun pengguna
- **Reports**: Laporan penjualan dan analitik

### 🛒 Sistem Pemesanan
- **Add to Cart**: Tambah menu ke keranjang
- **Quantity Control**: Atur jumlah item
- **Checkout Process**: Proses pemesanan dengan data customer
- **Receipt Generation**: Struk otomatis dengan detail lengkap
- **Print & PDF**: Export struk dalam format print dan PDF

## 🚀 Teknologi

### Backend (.NET 8)
- **ASP.NET Core Web API**: RESTful API
- **MongoDB**: Database NoSQL
- **Entity Framework**: ORM untuk data access
- **File Upload**: Sistem upload gambar menu
- **CORS**: Cross-origin resource sharing

### Frontend (HTML/CSS/JS)
- **Vanilla JavaScript**: Tanpa framework, performa optimal
- **Responsive Design**: Mobile-friendly
- **Modern CSS**: Gradient, animations, flexbox/grid
- **PDF Generation**: jsPDF untuk export struk
- **Local Storage**: Session persistence

## 📁 Struktur Project

```
LupyCanteen/
├── LupyCanteen/                 # Backend .NET
│   ├── Controllers/             # API Controllers
│   ├── Services/               # Business Logic
│   ├── Models/                 # Data Models & DTOs
│   ├── Data/                   # Database Context
│   └── wwwroot/                # Static files & uploads
├── home/                       # Frontend Files
│   ├── index.html              # Login Page (Default)
│   ├── main-app.html           # Main Application
│   ├── main-app-script.js      # Main App Logic
│   ├── style.css               # Styles
│   ├── menu.html               # Menu Page (Legacy)
│   ├── about.html              # About Page (Legacy)
│   └── contact.html            # Contact Page (Legacy)
├── admin/                      # Admin Dashboard (Legacy)
└── docs/                       # Documentation
```

## 🔧 Setup & Installation

### Prerequisites
- .NET 8 SDK
- MongoDB (local atau cloud)
- Modern web browser

### Installation Steps

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd LupyCanteen
   ```

2. **Setup Backend**
   ```bash
   cd LupyCanteen
   dotnet restore
   dotnet build
   ```

3. **Configure Database**
   - Update connection string di `appsettings.json`
   - MongoDB akan auto-create database dan collections

4. **Run Application**
   ```bash
   dotnet run
   ```

5. **Access Application**
   - Open browser: `http://localhost:5283`
   - Login dengan demo accounts

## 👥 Demo Accounts

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Access**: Full dashboard + ordering

### Kasir Account
- **Username**: `kasir1`
- **Password**: `kasir123`
- **Access**: Dashboard + ordering

### Customer Account
- **Username**: `customer1`
- **Password**: `customer123`
- **Access**: Ordering only

## 🎯 User Flow

### 1. Login Process
1. Akses `http://localhost:5283`
2. Klik tombol demo atau input manual
3. Klik "Masuk ke LupyCanteen"
4. Redirect ke main application

### 2. Main Application
1. **Homepage**: Lihat menu populer
2. **Menu**: Browse semua menu dengan filter
3. **Shopping Cart**: Tambah item, atur quantity
4. **Checkout**: Input data customer, generate receipt
5. **Admin** (jika admin/kasir): Akses dashboard

### 3. Admin Dashboard
1. **Overview**: Lihat statistik sistem
2. **Menu Management**: Tambah/edit/hapus menu
3. **Order Management**: Track pesanan customer
4. **User Management**: Kelola akun pengguna
5. **Reports**: Analisis penjualan

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/user` - Get all users
- `POST /api/user` - Create user

### Menu Management
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Create menu item
- `POST /api/menu/with-image` - Create menu with image
- `PUT /api/menu/{id}` - Update menu item
- `DELETE /api/menu/{id}` - Delete menu item

### Order Management
- `GET /api/order` - Get all orders
- `POST /api/order` - Create order
- `GET /api/order/{id}` - Get order by ID

### System
- `GET /api` - API status and info

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#A8D8EA` (Soft blue)
- **Primary Pink**: `#FFB3D9` (Soft pink)
- **Text Dark**: `#333333`
- **Text Light**: `#666666`
- **Background**: `#FFFFFF`
- **Success**: `#4ade80`
- **Error**: `#ef4444`

### Typography
- **Primary Font**: Poppins (Google Fonts)
- **Secondary Font**: Outfit (Google Fonts)
- **Monospace**: Courier New (for receipts)

### Components
- **Gradient Buttons**: Blue to pink gradient
- **Cards**: White background with shadow
- **Modals**: Centered with backdrop
- **Forms**: Rounded inputs with focus states

## 📱 Responsive Design

- **Desktop**: Full layout dengan sidebar
- **Tablet**: Adapted layout
- **Mobile**: Stack layout, touch-friendly buttons

## 🔒 Security Features

- **Input Validation**: Server-side validation
- **Authentication**: Session-based auth
- **Role-Based Access**: Different access levels
- **File Upload Security**: Type and size validation
- **CORS Configuration**: Controlled cross-origin access

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String,
  password: String, // Hashed
  fullName: String,
  email: String,
  role: String, // Admin, Kasir, Customer
  createdAt: Date
}
```

### MenuItems Collection
```javascript
{
  _id: ObjectId,
  name: String,
  price: Number,
  category: String, // makanan, minuman, snack
  description: String,
  imageUrl: String,
  badge: String, // Optional
  createdAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  transactionNumber: String,
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  orderItems: [
    {
      menuItemName: String,
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: Number,
  status: String,
  orderDate: Date
}
```

## 🚀 Deployment

### Development
```bash
cd LupyCanteen
dotnet run
```

### Production
```bash
dotnet publish -c Release
# Deploy to IIS, Azure, atau hosting provider
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

© 2025 LupyCanteen. All rights reserved.

## 📞 Support

Untuk bantuan dan support:
- **Email**: admin@lupycanteen.com
- **Phone**: (021) 123-4567
- **Address**: Jl. Raya Margamulya, Telukjambe Barat

---

**Dibuat dengan ❤️ untuk siswa-siswi tercinta**