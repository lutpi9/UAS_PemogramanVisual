👩‍💻 Pengembang

| Keterangan | Detail |
|-------------|---------|
| **Nama** | Lutpiah Ainus Shiddik |
| **NIM** | 312310474 |
| **Kelas** | TI.23.A.5 |
| **Mata Kuliah** | Pemrograman Visual (Desktop) |
| **Proyek** | Ujian Akhir Semester (UAS) |
| **Link YouTube** | https://youtu.be/bF75aXlileI?si=GmsStKTdxpMt-KCK |

# 🍽️ LupyCanteen
### Web-Based Canteen Management System

---

## 📌 Deskripsi Proyek
**LupyCanteen** adalah aplikasi manajemen kantin/restoran berbasis web yang dirancang untuk membantu pengelolaan operasional secara terintegrasi.  
Sistem ini memungkinkan admin atau manager untuk mengelola menu, pesanan, pengguna, serta laporan transaksi melalui satu dashboard terpusat.

Aplikasi ini dikembangkan menggunakan **ASP.NET** dan dijalankan menggunakan **IIS (Internet Information Services)** sebagai web server, serta mengombinasikan **SQL Server** dan **MongoDB** sebagai sistem basis data.

---

## 🎯 Tujuan Proyek
- Mendigitalisasi proses pengelolaan kantin/restoran
- Mempermudah manajemen menu dan pesanan
- Meningkatkan efisiensi pencatatan transaksi
- Menjadi media pembelajaran pengembangan sistem informasi berbasis web
- Sebagai proyek akademik dan portofolio pengembang

---

## 🛠️ Teknologi yang Digunakan
- **Backend**: ASP.NET Core (C#)
- **Frontend**: HTML, CSS, JavaScript
- **Web Server**: IIS (Internet Information Services)
- **Database Relasional**: SQL Server
- **Database NoSQL**: MongoDB
- **Tools & Framework**:
  - Entity Framework Core
  - Visual Studio
  - .NET SDK

---

## ⭐ Fitur Utama
- 🔐 Manajemen User (Admin, Kasir, Karyawan)
- 📋 Manajemen Menu & Kategori
- 🛒 Sistem Pemesanan (Order)
- 💳 Proses Checkout
- 📊 Laporan Transaksi
- 🧑‍💼 Manajemen Data Karyawan
- ⚙️ Dashboard Admin Terpusat

---

## 🗄️ Struktur Database

### 📌 SQL Server (Relasional)
Digunakan untuk data terstruktur:
- Users
- Roles
- Orders
- OrderDetails
- Employees
- Transactions

### 📌 MongoDB (NoSQL)
Digunakan untuk data fleksibel dan dinamis:
- Menus
- MenuVariants
- Settings
- DynamicOrders

---

## 🏗️ Arsitektur Sistem

### 📐 Diagram Arsitektur Sistem


---

## 🏗️ Penjelasan Arsitektur Sistem

- 👤 **User** mengakses sistem melalui browser
- 🌐 **IIS (Internet Information Services)** berfungsi sebagai web server
- ⚙️ **ASP.NET Core** menangani logika bisnis aplikasi
- 🗄️ **SQL Server** menyimpan data relasional dan terstruktur
- 📦 **MongoDB** menyimpan data fleksibel dan dinamis

---

## ▶️ Cara Menjalankan Aplikasi

### 1️⃣ Clone Repository
```bash
git clone https://github.com/username/LupyCanteen.git
```

### 2️⃣ Buka Project

- Buka project menggunakan **Visual Studio**
- Pastikan **.NET SDK** telah terinstall

---

### 3️⃣ Konfigurasi Database

- Atur **connection string SQL Server** pada file `appsettings.json`
- Pastikan **MongoDB service** sudah berjalan

---

### 4️⃣ Restore, Build, dan Run

```bash
dotnet restore
dotnet build
dotnet run
```

🔹 **Alternatif Menjalankan Aplikasi**

Aplikasi juga dapat dijalankan langsung menggunakan **IIS / IIS Express** melalui **Visual Studio** tanpa menjalankan perintah CLI.

---

## ✅ Kesimpulan

**LupyCanteen** merupakan sistem manajemen kantin berbasis web yang dirancang untuk mendukung pengelolaan operasional restoran secara modern dan terintegrasi.

Dengan memanfaatkan **ASP.NET**, **IIS**, **SQL Server**, dan **MongoDB**, sistem ini mampu mengelola data secara efisien, fleksibel, dan terstruktur.

Proyek ini diharapkan dapat menjadi **solusi digital manajemen kantin**, sekaligus sebagai **media pembelajaran dan portofolio pengembangan aplikasi web**.

---

