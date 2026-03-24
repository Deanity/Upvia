# Upvia 🚀
### AI-Powered Personalized Learning Platform

[![React](https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61dafb)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.io/)

**Upvia** adalah platform edukasi masa depan yang dirancang untuk memberikan pengalaman belajar yang benar-benar personal. Dengan bantuan AI, Upvia menyusun roadmap belajar, materi teori, dan latihan soal yang disesuaikan khusus untuk kebutuhan dan perkembangan Anda.

---

## ✨ Fitur Unggulan

- 🧠 **AI-Powered Roadmaps**: Hasilkan jalur belajar dinamis berdasarkan topik yang Anda inginkan (misal: "Web Development", "AI Engineering").
- 📚 **Interactive Learning System**: Materi belajar yang terbagi antara Teori dan Latihan Soal interaktif (Gaya Dicoding).
- 🌓 **Global Personalization**: Kontrol penuh atas Tema (Gelap/Terang), Ukuran Font (12px-24px), dan Jenis Font (Sans, Serif, Mono).
- 💼 **Automated Portfolio**: Proyek dan progres belajar Anda otomatis tercatat untuk membangun resume profesional.
- 📱 **PWA Ready**: Dapat diinstal di perangkat Anda untuk akses belajar yang lebih cepat.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4 (Official V4 Engine).
- **Backend/DB**: Supabase (Authentication & Real-time Progress).
- **Intelligence**: Google Gemini AI (Materi & Roadmap Generator).
- **Animations**: Motion (framer-motion).
- **Icons**: Lucide React.

---

## 🚀 Cara Instalasi (Setup)

Ikuti langkah-langkah berikut untuk menjalankan Upvia di perangkat lokal Anda:

### 1. Persiapan
Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) versi terbaru.

### 2. Kloning & Instalasi
```bash
# Instal dependensi
npm install
```

### 3. Konfigurasi Environment
Buat file `.env` di direktori utama dan isi dengan kunci API berikut:
```env
# Google Gemini API Key
GEMINI_API_KEY="kunci-api-gemini-anda"

# Supabase Credentials
VITE_SUPABASE_URL="url-project-supabase-anda"
VITE_SUPABASE_ANON_KEY="anon-key-supabase-anda"
```

### 4. Menjalankan Aplikasi
```bash
# Jalankan mode development
npm run dev
```
Aplikasi akan berjalan di `http://localhost:3000`.

---

## 📖 Panduan Penggunaan

1. **Daftar/Masuk**: Gunakan email atau Google Auth untuk membuat akun.
2. **Buat Roadmap**: Di halaman Dashboard/Roadmap, sampaikan topik apa yang ingin Anda kuasai.
3. **Mulai Belajar**: Buka modul yang dihasilkan, baca teorinya, dan kerjakan latihan soalnya.
4. **Atur Tampilan**: Gunakan tombol melayang (Floating Button) di pojok kiri bawah untuk menyesuaikan kenyamanan visual Anda.

---

## 🤝 Kontribusi
Kami menerima kontribusi dalam bentuk apapun. Silakan buat *pull request* atau laporkan masalah (*issue*) jika Anda menemukan bug.

© 2026 **Upvia AI Team**. All rights reserved.
