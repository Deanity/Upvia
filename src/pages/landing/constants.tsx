import React from 'react';
import { 
  Layers, 
  Brain, 
  Layout, 
  Download, 
  PieChart, 
  BookOpen, 
  Zap, 
  GraduationCap, 
  Users, 
  Target, 
  Briefcase 
} from 'lucide-react';

export const navLinks = [
  { name: 'Fitur', href: '#features' },
  { name: 'Cara Kerja', href: '#how-it-works' },
  { name: 'Target Pengguna', href: '#users' },
  { name: 'Nilai Kami', href: '#values' },
];

export const features = [
  {
    title: "Peta Jalan Belajar AI-Dinamis",
    description: "Jalur belajar langkah-demi-langkah yang dipersonalisasi dengan tujuan harian/mingguan dan tantangan yang dirancang khusus untuk Anda.",
    icon: <Layers className="w-6 h-6" />,
    color: "bg-green-100 text-green-600"
  },
  {
    title: "Asisten Belajar AI (24/7)",
    description: "Tutor pribadi Anda untuk menjawab pertanyaan, membantu debugging, dan menyederhanakan topik kompleks secara real-time.",
    icon: <Brain className="w-6 h-6" />,
    color: "bg-emerald-100 text-emerald-600"
  },
  {
    title: "Antarmuka Belajar Inklusif",
    description: "UI aksesibel yang dirancang untuk semua orang, menampilkan navigasi yang sederhana dan ramah pengguna untuk pengalaman yang mulus.",
    icon: <Layout className="w-6 h-6" />,
    color: "bg-teal-100 text-teal-600"
  },
  {
    title: "Progressive Web App (PWA)",
    description: "Dapat diinstal di perangkat apa pun dengan dukungan offline dan penggunaan data rendah, sehingga Anda bisa belajar di mana saja.",
    icon: <Download className="w-6 h-6" />,
    color: "bg-green-50 text-emerald-500"
  },
  {
    title: "Dasbor Cerdas & Portofolio",
    description: "Lacak kemajuan Anda, simpan proyek Anda, dan bangun portofolio profesional saat Anda belajar.",
    icon: <PieChart className="w-6 h-6" />,
    color: "bg-emerald-50 text-teal-600"
  }
];

export const steps = [
  { title: "Tentukan tujuan Anda", description: "Beri tahu Upvia apa yang ingin Anda capai" },
  { title: "AI menganalisis level Anda", description: "Kami memahami pengetahuan Anda saat ini" },
  { title: "Hasilkan peta jalan", description: "Dapatkan jalur belajar yang dipersonalisasi" },
  { title: "Mulai belajar", description: "Selami modul berukuran kecil" },
  { title: "Selesaikan tantangan", description: "Validasi keterampilan Anda dengan tugas" },
  { title: "Bangun portofolio Anda", description: "Pamerkan karya Anda kepada dunia" }
];

export const targetUsers = [
  { 
    type: "Siswa SMA", 
    description: "Fondasi untuk karier masa depan dan persiapan ujian.",
    icon: <BookOpen className="w-8 h-8" />
  },
  { 
    type: "Siswa SMK", 
    description: "Keterampilan praktis untuk kesiapan industri segera.",
    icon: <Zap className="w-8 h-8" />
  },
  { 
    type: "Mahasiswa", 
    description: "Pendalaman bidang khusus dan penelitian.",
    icon: <GraduationCap className="w-8 h-8" />
  },
  { 
    type: "Pembelajar Mandiri", 
    description: "Jalur yang dikurasi untuk hobi atau perpindahan profesional apa pun.",
    icon: <Users className="w-8 h-8" />
  }
];

export const valuesList = [
  { title: "Pembelajaran Personalisasi", icon: <Target className="w-5 h-5" /> },
  { title: "Topik Fleksibel", icon: <Layers className="w-5 h-5" /> },
  { title: "Sistem Berbasis AI", icon: <Brain className="w-5 h-5" /> },
  { title: "Akses Inklusif", icon: <Layout className="w-5 h-5" /> },
  { title: "Output Siap Karier", icon: <Briefcase className="w-5 h-5" /> }
];
