# 📖 Cara Penggunaan LupyCanteen

Panduan lengkap menggunakan sistem LupyCanteen untuk semua jenis pengguna.

## 🚀 Memulai Aplikasi

### 1. Menjalankan Server
```bash
cd LupyCanteen
dotnet run
```

### 2. Mengakses Aplikasi
- Buka browser dan akses: `http://localhost:5283`
- Anda akan melihat halaman login

## 🔐 Login ke Sistem

### Halaman Login
1. **Akses Aplikasi**: Buka `http://localhost:5283`
2. **Pilih Demo Account**: 
   - Klik "👨‍💼 Admin Demo" untuk akun admin
   - Klik "👩‍💼 Kasir Demo" untuk akun kasir
3. **Login**: Klik "Masuk ke LupyCanteen"
4. **Redirect**: Otomatis diarahkan ke aplikasi utama

### Manual Login
- **Username**: Ketik manual (admin, kasir1, customer1)
- **Password**: Ketik manual (admin123, kasir123, customer123)
- **Remember Me**: Centang untuk menyimpan session

## 🏠 Menggunakan Aplikasi Utama

### Navigasi Utama
Setelah login, Anda akan melihat:
- **Beranda**: Halaman utama dengan menu populer
- **Menu**: Katalog lengkap semua menu
- **Special**: Menu spesial minggu ini
- **Tentang**: Informasi tentang LupyCanteen
- **Kontak**: Informasi kontak dan lokasi
- **Dashboard**: (Hanya admin/kasir) Akses dashboard

### User Info
Di pojok kanan atas:
- **Nama User**: Menampilkan nama lengkap
- **Role**: Menampilkan peran (Admin/Kasir/Customer)
- **Dashboard Button**: (Admin/Kasir) Akses dashboard
- **Logout Button**: Keluar dari sistem

## 🛒 Cara Memesan Menu

### 1. Browse Menu
- **Homepage**: Lihat menu populer di beranda
- **Menu Lengkap**: Klik "Menu" di navigasi
- **Filter**: Gunakan filter Makanan/Minuman/Snack
- **Search**: Cari menu berdasarkan nama

### 2. Tambah ke Keranjang
- **Pilih Menu**: Klik tombol "+" pada menu yang diinginkan
- **Notifikasi**: Akan muncul notifikasi "Menu ditambahkan"
- **Cart Counter**: Angka di ikon keranjang akan bertambah

### 3. Kelola Keranjang
- **Buka Cart**: Klik ikon keranjang di pojok kanan
- **Atur Quantity**: Gunakan tombol +/- untuk mengatur jumlah
- **Hapus Item**: Klik tombol "×" untuk menghapus item
- **Kosongkan**: Klik "Kosongkan" untuk mengosongkan keranjang

### 4. Checkout
- **Klik Checkout**: Tombol biru di keranjang
- **Input Data**:
  - Nama pelanggan (otomatis terisi dari user)
  - Nomor telepon (input manual)
- **Konfirmasi**: Klik OK untuk memproses pesanan

### 5. Struk Digital
Setelah checkout berhasil:
- **Struk Otomatis**: Muncul modal struk digital
- **Print**: Klik "Print Struk" untuk mencetak
- **Download PDF**: Klik "Download PDF" untuk simpan file
- **Close**: Klik "×" untuk menutup struk

## 👨‍💼 Dashboard Admin (Admin/Kasir)

### Mengakses Dashboard
1. **Login** sebagai admin atau kasir
2. **Klik "Dashboard"** di navigasi atau tombol dashboard
3. **Pilih Tab** sesuai kebutuhan

### Tab Overview
- **Statistik**: Total menu, pesanan, users, pendapatan
- **Quick Actions**: Tombol cepat untuk aksi umum
- **Real-time Data**: Data terupdate otomatis

### Tab Menu Management
- **Lihat Menu**: Tabel semua menu dari API
- **Tambah Menu**: Klik "➕ Tambah Menu"
  - Input nama, harga, kategori, deskripsi
  - Upload gambar (opsional)
  - Pilih badge (opsional)
- **Edit Menu**: Klik "Edit" pada menu yang ingin diubah
- **Hapus Menu**: Klik "Hapus" dengan konfirmasi

### Tab Order Management
- **Lihat Pesanan**: Tabel semua pesanan customer
- **Detail Pesanan**: Klik "Detail" untuk info lengkap
- **Status Tracking**: Monitor status pesanan
- **Filter**: Filter berdasarkan tanggal atau status

### Tab User Management
- **Lihat Users**: Tabel semua pengguna sistem
- **Tambah User**: Klik "➕ Tambah User"
- **Edit User**: Ubah data pengguna
- **Hapus User**: Hapus akun pengguna
- **Role Management**: Atur peran pengguna

### Tab Reports
- **Penjualan Hari Ini**: Revenue hari ini
- **Penjualan Minggu Ini**: Revenue minggu ini
- **Menu Terlaris**: Menu dengan penjualan tertinggi
- **Total Customer**: Jumlah customer aktif

## 🔄 Fitur Khusus Admin

### Dual Role: Admin + Customer
Admin dan kasir dapat:
1. **Kelola Sistem**: Menggunakan dashboard untuk manajemen
2. **Pesan Menu**: Seperti customer biasa, bisa order makanan
3. **Switch Mode**: Mudah beralih antara dashboard dan ordering

### Contoh Workflow Admin:
1. **Login** sebagai admin
2. **Cek Dashboard**: Lihat statistik dan pesanan
3. **Tambah Menu Baru**: Upload menu spesial hari ini
4. **Order Makan Siang**: Pesan menu untuk diri sendiri
5. **Generate Struk**: Cetak struk untuk arsip

## 📱 Tips Penggunaan

### Untuk Customer
- **Gunakan Filter**: Cari menu lebih cepat dengan filter kategori
- **Cek Special**: Selalu cek menu spesial untuk penawaran terbaik
- **Save Receipt**: Download PDF struk untuk arsip pribadi
- **Remember Me**: Centang untuk tidak perlu login berulang

### Untuk Admin/Kasir
- **Regular Check**: Cek dashboard secara berkala
- **Update Menu**: Selalu update menu sesuai ketersediaan
- **Monitor Orders**: Pantau pesanan untuk pelayanan optimal
- **Backup Data**: Download laporan secara berkala

### Untuk Semua User
- **Logout Aman**: Selalu logout setelah selesai menggunakan
- **Clear Cache**: Jika ada masalah, clear browser cache
- **Update Browser**: Gunakan browser terbaru untuk performa optimal

## 🚨 Troubleshooting

### Masalah Login
- **Cek Credentials**: Pastikan username/password benar
- **Server Running**: Pastikan server berjalan di localhost:5283
- **Clear Storage**: Hapus localStorage jika ada masalah session

### Masalah Loading
- **Refresh Page**: Tekan Ctrl+F5 untuk hard refresh
- **Check Network**: Pastikan koneksi internet stabil
- **Browser Console**: Cek console untuk error messages

### Masalah Upload
- **File Size**: Maksimal 5MB untuk gambar menu
- **File Type**: Hanya JPG, PNG, GIF, WebP yang didukung
- **Permissions**: Pastikan folder wwwroot/images dapat ditulis

### Masalah Database
- **MongoDB Running**: Pastikan MongoDB service berjalan
- **Connection String**: Cek konfigurasi di appsettings.json
- **Collections**: Database akan auto-create jika belum ada

## 📞 Bantuan

Jika mengalami masalah:
1. **Cek Dokumentasi**: Baca README.md untuk info teknis
2. **Console Log**: Buka Developer Tools untuk debug
3. **Restart Server**: Stop dan jalankan ulang dotnet run
4. **Contact Support**: Hubungi admin sistem

---

**Selamat menggunakan LupyCanteen! 🍱**