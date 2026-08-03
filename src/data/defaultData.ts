import { ConfigData } from '../types';
import image1 from "../assets/photos/image.png";

export const DEFAULT_CONFIG: ConfigData = {
  partnerName: 'Shafa Azahra',
  senderName: 'someone who loves you',
  mainTitle: 'HAPPY GIRLFRIEND DAY SHAFA AZAHRA',
  customSubtitle: 'Terima kasih telah hadir dan mewarnai setiap detiknya. You are my entire universe! ✨',
  loveLetterTitle: 'FAVORITE PERSON',
  loveLetterBody: `Haii sayangkuu..

Terimakasih yaa udah dateng di hidup aku, aku always bersyukur bisa ketemu kamu, dan aku juga always bangga punya kamu.
makasihh jugaa udah selalu support akuu, selalu temenin aku, kamuu udah jadi rumahh buat aku, kamu udahh lebihh lebih buat akuu sayangg..

Rasa sayangku ke kamuu akan terlalu panjang dan gaa adaa ujungnya kalo semua di ketik hehehe.
Intinya akuu sayangg sama kamuu. 
LOVEE YOUU ADEEE`,
  musicUrl: 'https://assets.anytourl.com/uploads/d3deb9196e20a4e9ae564a2e74839199.mp3',
  useSynthAudio: false,
  planetColor: '#00f0ff', // electric cyan planet core
  atmosphereColor: '#38bdf8', // sky blue glow
  // =========================================================================
  // 📸 DAFTAR FOTO POLAROID GALAKSI (Ukuran ideal: Square 600x600 px)
  // Ganti nilai 'url' di bawah ini dengan link foto pacar kamu!
  // Bisa menggunakan link dari Google Drive (direct link), Imgur, Postimages, dll.
  // =========================================================================
  photos: [
    {
      id: 'p1',
      // ⬇️ GANTI LINK FOTO 1 DI SINI
      url: '/src/assets/photos/foto1.jpeg',
      caption: 'ini urr soo prettyy babee',
      date: '28 Agst 2026',
      orbitRadius: 4.8,
      orbitSpeed: 0.003,
      orbitTiltX: 0.2,
      orbitTiltZ: 0.1,
      selfRotationSpeed: 0.005,
    },
    {
      id: 'p2',
      // ⬇️ GANTI LINK FOTO 2 DI SINI
      url: '/src/assets/photos/foto2.jpeg',
      caption: 'ini kamu lucu banget  😊',
      date: '29 april 2026',
      orbitRadius: 5.6,
      orbitSpeed: -0.0025,
      orbitTiltX: -0.3,
      orbitTiltZ: 0.4,
      selfRotationSpeed: -0.004,
    },
    {
      id: 'p3',
      // ⬇️ GANTI LINK FOTO 3 DI SINI
      url: '/src/assets/photos/foto3.jpeg',
      caption: 'ini after tragedi lv haha lucu 🌸',
      date: '26 Juli 2026',
      orbitRadius: 6.4,
      orbitSpeed: 0.002,
      orbitTiltX: 0.5,
      orbitTiltZ: -0.2,
      selfRotationSpeed: 0.006,
    },
    {
      id: 'p4',
      // ⬇️ GANTI LINK FOTO 4 DI SINI
      url: '/src/assets/photos/foto4.jpeg',
      caption: 'inii gila kamuu cantikk bangett',
      date: '14 Juni 2026',
      orbitRadius: 7.2,
      orbitSpeed: -0.0018,
      orbitTiltX: -0.1,
      orbitTiltZ: -0.5,
      selfRotationSpeed: -0.003,
    },
    {
      id: 'p5',
      // ⬇️ GANTI LINK FOTO 5 DI SINI
      url: '/src/assets/photos/foto5.jpeg',
      caption: 'Ini kamu habis nemenin aku volly hihi 💕',
      date: '10 Juli 2026',
      orbitRadius: 5.2,
      orbitSpeed: 0.0035,
      orbitTiltX: 0.4,
      orbitTiltZ: 0.3,
      selfRotationSpeed: 0.004,
    },
    {
      id: 'p6',
      // ⬇️ GANTI LINK FOTO 6 DI SINI
      url: '/src/assets/photos/foto6.jpeg',
      caption: 'emm arghhh ini aku cakep bet, ehh kamu jugaa cantikk heheh ✨',
      date: '3 Maret 2026',
      orbitRadius: 6.0,
      orbitSpeed: -0.0028,
      orbitTiltX: -0.4,
      orbitTiltZ: 0.2,
      selfRotationSpeed: -0.005,
    },
    {
      id: 'p7',
      // ⬇️ GANTI LINK FOTO 7 DI SINI
      url: '/src/assets/photos/foto7.jpeg',
      caption: 'inii kita lagi cfd',
      date: '12 Juli 2026',
      orbitRadius: 6.8,
      orbitSpeed: 0.0022,
      orbitTiltX: 0.15,
      orbitTiltZ: -0.35,
      selfRotationSpeed: 0.003,
    },
    {
      id: 'p8',
      // ⬇️ GANTI LINK FOTO 8 DI SINI
      url: '/src/assets/photos/foto8.jpeg',
      caption: 'ini di ungaran, ini foto lucu bangt nyakk',
      date: '31 Mei 2026',
      orbitRadius: 7.6,
      orbitSpeed: -0.0015,
      orbitTiltX: -0.25,
      orbitTiltZ: -0.15,
      selfRotationSpeed: -0.004,
    },
    {
      id: 'p9',
      // ⬇️ GANTI LINK FOTO 9 DI SINI
      url: '/src/assets/photos/foto9.jpeg',
      caption: 'inii di prau, cantikk banget yakk sayangnya aku',
      date: '15 Mei 2026',
      orbitRadius: 5.0,
      orbitSpeed: 0.0027,
      orbitTiltX: -0.35,
      orbitTiltZ: 0.5,
      selfRotationSpeed: 0.005,
    },
    {
      id: 'p10',
      // ⬇️ GANTI LINK FOTO 10 DI SINI
      url: '/src/assets/photos/foto10.jpeg',
      caption: 'My prettey girlfriend im so in lovee with youuu🌌',
      date: '2 Febuari 2026 (kmu kirim hihi)',
      orbitRadius: 5.8,
      orbitSpeed: -0.0021,
      orbitTiltX: 0.3,
      orbitTiltZ: -0.4,
      selfRotationSpeed: -0.003,
    },
    {
      id: 'p11',
      // ⬇️ GANTI LINK FOTO 11 DI SINI
      url: '/src/assets/photos/foto11.jpeg',
      caption: 'Lowkey so proud and grateful i found you. ngl',
      date: '13 Febuari 2026',
      orbitRadius: 6.6,
      orbitSpeed: 0.0019,
      orbitTiltX: -0.15,
      orbitTiltZ: 0.1,
      selfRotationSpeed: 0.004,
    },
    {
      id: 'p12',
      // ⬇️ GANTI LINK FOTO 12 DI SINI
      url: '/src/assets/photos/foto12.jpeg',
      caption: 'arghh ini lucu banget, You Are My Everything 💍',
      date: '28 Febuari 2026',
      orbitRadius: 7.4,
      orbitSpeed: -0.0016,
      orbitTiltX: 0.45,
      orbitTiltZ: 0.25,
      selfRotationSpeed: -0.005,
    },
  ],
};
