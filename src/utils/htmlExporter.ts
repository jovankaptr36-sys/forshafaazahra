import { ConfigData } from '../types';

export function generateStandaloneHTML(config: ConfigData): string {
  const jsonPhotos = JSON.stringify(config.photos, null, 2);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Happy Girlfriend Day - ${config.partnerName}</title>
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts: Montserrat, Playfair Display, Dancing Script, Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Montserrat:wght@700;800;900&family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Plus+Jakarta+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">
  
  <!-- Three.js and Postprocessing CDN Libraries -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/EffectComposer.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/RenderPass.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/ShaderPass.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/CopyShader.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/LuminosityHighPassShader.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/UnrealBloomPass.js"></script>
  <!-- Canvas Confetti -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>

  <style>
    body, html {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: #05020a;
      color: #ffffff;
      user-select: none;
      touch-action: manipulation;
    }

    .font-serif-title {
      font-family: 'Playfair Display', serif;
    }

    .font-romantic {
      font-family: 'Dancing Script', cursive;
    }

    .font-montserrat {
      font-family: 'Montserrat', sans-serif;
    }

    /* SEQUENTIAL LETTER CHASER / RUNNING LIGHT ANIMATION (PURE WHITE NEON THEME, LOOPING) */
    @keyframes letterSequentialChaser {
      0% {
        color: rgba(255, 255, 255, 0.25);
        text-shadow: 0 0 3px rgba(255, 255, 255, 0.2);
        transform: scale(0.95);
        filter: blur(1px);
      }
      12% {
        color: #ffffff;
        text-shadow:
          0 0 6px #ffffff,
          0 0 12px #ffffff,
          0 0 24px #ffffff,
          0 0 45px rgba(255, 255, 255, 0.95),
          0 0 75px rgba(255, 255, 255, 0.85),
          0 0 110px rgba(255, 255, 255, 0.7);
        transform: scale(1.15) translateY(-3px);
        filter: blur(0px);
      }
      24% {
        color: rgba(255, 255, 255, 0.75);
        text-shadow: 0 0 8px #ffffff, 0 0 20px rgba(255, 255, 255, 0.8);
        transform: scale(1) translateY(0);
        filter: blur(0px);
      }
      100% {
        color: rgba(255, 255, 255, 0.25);
        text-shadow: 0 0 3px rgba(255, 255, 255, 0.2);
        transform: scale(0.95);
        filter: blur(1px);
      }
    }

    .animate-letter-chase {
      display: inline-block;
      animation: letterSequentialChaser 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }

    /* PULSING TEXT BUTTON ANIMATION (BORDERLESS PURE WHITE GLOW) */
    @keyframes textPulseGlow {
      0%, 100% {
        transform: scale(1);
        filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 15px rgba(255, 255, 255, 0.5));
        opacity: 0.9;
      }
      50% {
        transform: scale(1.1);
        filter: drop-shadow(0 0 18px rgba(255, 255, 255, 1)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.8));
        opacity: 1;
      }
    }

    .btn-pulse-glow {
      animation: textPulseGlow 2s infinite ease-in-out;
    }

    #webgl-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    /* Floating UI */
    .ui-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1.25rem;
      box-sizing: border-box;
    }

    .pointer-active {
      pointer-events: auto;
    }

    .modal-backdrop {
      background: rgba(8, 2, 16, 0.88);
      backdrop-filter: blur(14px);
    }

    /* PLANETARY ZOOM WARP TRANSITION */
    @keyframes planetZoomWarp {
      0% {
        transform: scale(0.1) rotate(0deg);
        opacity: 0;
        filter: blur(12px);
      }
      40% {
        transform: scale(1.4) rotate(120deg);
        opacity: 0.9;
        filter: blur(4px);
      }
      100% {
        transform: scale(5) rotate(360deg);
        opacity: 1;
        filter: blur(0px);
      }
    }

    .animate-planet-warp {
      animation: planetZoomWarp 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  </style>
</head>
<body>

  <!-- ========================================================================= -->
  <!-- 1. HALAMAN PEMBUKA (SPLASH SCREEN)                                        -->
  <!-- ========================================================================= -->
  <div id="splash-screen" class="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-slate-950 via-indigo-950 to-black text-white transition-opacity duration-300">
    
    <!-- Dark Background Stars -->
    <div class="absolute inset-0 pointer-events-none opacity-70">
      <div class="absolute top-1/4 left-1/5 w-1 h-1 bg-white rounded-full animate-ping"></div>
      <div class="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse"></div>
      <div class="absolute bottom-1/4 left-1/3 w-1 h-1 bg-indigo-300 rounded-full animate-ping"></div>
      <div class="absolute top-2/3 right-1/5 w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
      <div class="absolute top-1/2 left-10 w-1 h-1 bg-blue-300 rounded-full animate-ping"></div>
    </div>

    <!-- Top Heart Icon 🩵 -->
    <div class="mt-6 flex items-center justify-center">
      <div class="p-3.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_25px_rgba(0,240,255,0.5)] animate-bounce text-3xl">
        🩵
      </div>
    </div>

    <!-- Center 2 Lines Sequential Letter Chaser Text in Montserrat Bold -->
    <div class="my-auto flex flex-col items-center justify-center text-center max-w-xl w-full px-2">
      <div class="flex flex-col items-center justify-center space-y-2 sm:space-y-3 font-montserrat font-black tracking-wider leading-none">
        <!-- Row 1: FOR YOU -->
        <h1 class="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-wider flex justify-center flex-wrap gap-x-3 sm:gap-x-5">
          <span class="inline-flex whitespace-nowrap">
            <span class="animate-letter-chase" style="animation-delay: 0.00s;">F</span>
            <span class="animate-letter-chase" style="animation-delay: 0.12s;">O</span>
            <span class="animate-letter-chase" style="animation-delay: 0.24s;">R</span>
          </span>
          <span class="inline-flex whitespace-nowrap">
            <span class="animate-letter-chase" style="animation-delay: 0.36s;">Y</span>
            <span class="animate-letter-chase" style="animation-delay: 0.48s;">O</span>
            <span class="animate-letter-chase" style="animation-delay: 0.60s;">U</span>
          </span>
        </h1>

        <!-- Row 2: SHAFA AZAHRA -->
        <h2 class="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-wider flex justify-center flex-wrap gap-x-3 sm:gap-x-5">
          ${config.partnerName.toUpperCase().split(" ").map((word, wIdx, wArr) => {
            const offset = wArr.slice(0, wIdx).reduce((acc, w) => acc + w.length, 0);
            const letters = word.split("").map((c, cIdx) => `<span class="animate-letter-chase" style="animation-delay: ${(0.84 + (offset + cIdx) * 0.12).toFixed(2)}s;">${c}</span>`).join("");
            return `<span class="inline-flex whitespace-nowrap">${letters}</span>`;
          }).join("")}
        </h2>
      </div>

      <!-- Typing Effect: "i have somethin' for u!!" -->
      <div class="mt-8 font-romantic text-2xl sm:text-4xl text-cyan-200 tracking-wide flex items-center justify-center gap-1 min-h-[40px]">
        <span id="splash-typing"></span><span class="w-0.5 h-7 bg-cyan-400 animate-pulse inline-block"></span>
      </div>

      <!-- Pulsing Frameless Button "click here" (No Oval Border) -->
      <button id="enter-btn" class="btn-pulse-glow pointer-active mt-10 text-cyan-200 hover:text-white font-bold text-2xl sm:text-3xl cursor-pointer tracking-wider transition-all transform active:scale-95">
        click here ✨
      </button>
    </div>

    <!-- Credit at Bottom -->
    <div class="mb-4 text-xs sm:text-sm text-cyan-200/60 font-light text-center">
      Created by <span class="font-semibold text-cyan-300">${config.senderName}</span>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- 2. HALAMAN GALAKSI 3D (THREE.JS + BLOOM + ORBITING POLAROIDS)              -->
  <!-- ========================================================================= -->
  <canvas id="webgl-canvas"></canvas>

  <!-- Overlay UI Layer -->
  <div class="ui-container">
    
    <!-- Header Controls -->
    <div class="flex justify-between items-center w-full">
      <!-- Home Button -->
      <button id="home-btn" class="pointer-active bg-slate-900/80 hover:bg-slate-800 text-slate-200 p-2.5 px-4 rounded-full border border-slate-700/60 shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 text-xs font-semibold">
        <span>🏠</span>
        <span class="hidden sm:inline">Laman Awal</span>
      </button>

      <!-- Music Control Button -->
      <!-- ======================================================== -->
      <!-- EDIT AUDIOPLAY / LAGU DI SINI BILA INGIN MENGGANTI LAGU  -->
      <!-- ======================================================== -->
      <button id="music-btn" class="pointer-active bg-cyan-600/80 hover:bg-cyan-500 text-white p-2.5 px-4 rounded-full border border-cyan-300/40 shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 text-xs font-semibold">
        <span id="music-icon">🎵</span>
        <span id="music-label">Putar Musik</span>
      </button>
    </div>

    <!-- Bottom Action Button -->
    <div class="flex items-center justify-between gap-3 w-full pb-1">
      <div class="text-[11px] text-cyan-200/60 font-light hidden sm:block">
        Coba puter dan klik fotonya
      </div>

      <button id="open-letter-btn" class="pointer-active bg-gradient-to-r from-cyan-600 via-indigo-600 to-sky-500 hover:from-cyan-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/30 border border-cyan-300/30 transition-all duration-300 hover:scale-105 flex items-center gap-2 ml-auto">
        <span>Coba klik 💌</span>
      </button>
    </div>

  </div>

  <!-- Love Letter Modal -->
  <div id="letter-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop hidden transition-opacity duration-300 opacity-0 pointer-events-none">
    <div class="bg-gradient-to-br from-slate-900 via-indigo-950/90 to-cyan-950/90 border border-cyan-500/40 p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-2xl text-center relative overflow-hidden">
      <span class="text-4xl mb-2 block">🩵</span>
      <h3 class="font-serif-title text-2xl font-bold text-cyan-200 mb-3">${config.loveLetterTitle}</h3>
      
      <div class="text-sm text-cyan-100/90 space-y-2 text-left font-light leading-relaxed max-h-60 overflow-y-auto pr-2 my-3">
        ${config.loveLetterBody.replace(/\n/g, '<br/>')}
      </div>

      <div class="pt-3 border-t border-cyan-500/20 flex justify-between items-center mt-4">
        <span class="font-romantic text-2xl text-cyan-300">Dari ${config.senderName}</span>
        <button id="close-letter-btn" class="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2 rounded-full text-xs font-semibold">
          Tutup
        </button>
      </div>
    </div>
  </div>

  <!-- Photo Detail Modal -->
  <div id="photo-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop hidden transition-opacity duration-300 opacity-0 pointer-events-none">
    <div class="bg-white p-4 pb-5 rounded-2xl max-w-sm w-full shadow-2xl text-center relative">
      <img id="modal-img" src="" alt="Polaroid" class="w-full h-64 object-cover rounded-xl shadow-inner mb-3">
      <p id="modal-caption" class="font-romantic text-2xl text-gray-800 font-bold mb-1"></p>
      <p id="modal-date" class="text-xs text-gray-400 font-mono mb-4"></p>
      <button id="close-photo-btn" class="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-full text-xs font-medium">
        Tutup
      </button>
    </div>
  </div>

  <!-- Audio Element -->
  <!-- ========================================================================= -->
  <!-- EDIT LINK LAGU DI BAWAH INI (GANTI URL DENGAN LINK MP3 PILIHANMU)       -->
  <!-- ========================================================================= -->
  <audio id="bg-audio" loop src="${config.musicUrl}"></audio>

  <script>
    // =========================================================================
    // EDIT DATA PACAR DAN LIST FOTO POLAROID DI SINI
    // =========================================================================
    const partnerName = "${config.partnerName.replace(/"/g, '\\"')}";
    const senderName = "${config.senderName.replace(/"/g, '\\"')}";

    /* LIST 10-12 FOTO POLAROID BISA DIGANTI ATAU DITAMBAH DI SINI */
    const photosData = ${jsonPhotos};

    // Splash Screen Typing Effect: "i have somethin' for u!!"
    const splashTargetText = "i have somethin' for u!!";
    let splashTypeIndex = 0;
    const splashTypingEl = document.getElementById('splash-typing');

    function typeSplashText() {
      if (splashTypeIndex < splashTargetText.length) {
        splashTypingEl.textContent += splashTargetText.charAt(splashTypeIndex);
        splashTypeIndex++;
        setTimeout(typeSplashText, 90);
      }
    }
    typeSplashText();

    // Halaman 2 Typing Effect: "Untuk Shafa Azahra, dari [Nama Kamu] 💫"
    const fullText = "Untuk " + partnerName + ", dari " + senderName + " 💫";
    let typeIndex = 0;
    const typingEl = document.getElementById('typing-text');

    function typeWriter() {
      if (typeIndex < fullText.length) {
        typingEl.innerHTML += fullText.charAt(typeIndex);
        typeIndex++;
        setTimeout(typeWriter, 80);
      }
    }

    // Audio & Transition from Splash to Halaman 2
    const bgAudio = document.getElementById('bg-audio');
    const musicBtn = document.getElementById('music-btn');
    const musicLabel = document.getElementById('music-label');
    let isPlaying = false;

    function playMusic() {
      bgAudio.play().then(() => {
        isPlaying = true;
        musicLabel.textContent = 'Jeda Musik';
      }).catch(err => {
        console.warn('Autoplay Audio blocked or unavailable', err);
      });
    }

    document.getElementById('enter-btn').addEventListener('click', () => {
      const splash = document.getElementById('splash-screen');
      splash.style.opacity = '0';
      splash.style.pointerEvents = 'none';
      setTimeout(() => {
        splash.style.display = 'none';
        typeWriter();
      }, 700);

      playMusic();
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    });

    musicBtn.addEventListener('click', () => {
      if (isPlaying) {
        bgAudio.pause();
        musicLabel.textContent = 'Putar Musik';
        isPlaying = false;
      } else {
        playMusic();
      }
    });

    // =========================================================================
    // THREE.JS 3D SCENE (PLANET, BLOOM LIGHT, STARFIELD, ORBITING POLAROIDS)
    // =========================================================================
    const canvas = document.getElementById('webgl-canvas');
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    const startCamPos = new THREE.Vector3(0, 32, 45);
    const targetCamPos = new THREE.Vector3(0, 9, 14);
    camera.position.copy(startCamPos);

    let isZooming = false;
    let zoomStartTime = 0;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 28;
    controls.minDistance = 4;
    controls.target.set(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0xff3366, 3.5, 70);
    mainLight.position.set(0, 0, 0);
    scene.add(mainLight);

    const secondaryLight = new THREE.PointLight(0xffffff, 2.0, 80);
    secondaryLight.position.set(8, 12, 8);
    scene.add(secondaryLight);

    // -------------------------------------------------------------
    // PARTICLE PLANET CENTER + GLOWING WIREFRAME & CORE
    // -------------------------------------------------------------
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    // 1. Inner Glowing Cyan/Blue Core Sphere
    const coreGeo = new THREE.SphereGeometry(1.4, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x00f0ff,
      emissiveIntensity: 1.2,
      roughness: 0.2
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    planetGroup.add(coreMesh);

    // 2. Wireframe Lattice Layer
    const wireGeo = new THREE.SphereGeometry(1.6, 24, 24);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    planetGroup.add(wireMesh);

    // 3. Dense Particle Shell forming Planet Shape ("partikel-partikel berbentuk planet")
    const pPlanetCount = 2200;
    const pPlanetGeo = new THREE.BufferGeometry();
    const pPlanetPos = new Float32Array(pPlanetCount * 3);
    const pPlanetColors = new Float32Array(pPlanetCount * 3);

    const pColorsList = [
      new THREE.Color('#00f0ff'),
      new THREE.Color('#38bdf8'),
      new THREE.Color('#ffffff'),
      new THREE.Color('#818cf8')
    ];

    for (let i = 0; i < pPlanetCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.72 + (Math.random() - 0.5) * 0.08;

      pPlanetPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pPlanetPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPlanetPos[i * 3 + 2] = r * Math.cos(phi);

      const c = pColorsList[Math.floor(Math.random() * pColorsList.length)];
      pPlanetColors[i * 3] = c.r;
      pPlanetColors[i * 3 + 1] = c.g;
      pPlanetColors[i * 3 + 2] = c.b;
    }

    pPlanetGeo.setAttribute('position', new THREE.BufferAttribute(pPlanetPos, 3));
    pPlanetGeo.setAttribute('color', new THREE.BufferAttribute(pPlanetColors, 3));

    const pPlanetMat = new THREE.PointsMaterial({
      size: 0.11,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const pPlanetPoints = new THREE.Points(pPlanetGeo, pPlanetMat);
    planetGroup.add(pPlanetPoints);

    // -------------------------------------------------------------
    // ACCRETION DISK RING GALAXY (BACKGROUND MASSIVE PARTICLE DISK)
    // -------------------------------------------------------------
    const diskParticleCount = 9000;
    const diskGeo = new THREE.BufferGeometry();
    const diskPos = new Float32Array(diskParticleCount * 3);
    const diskColors = new Float32Array(diskParticleCount * 3);

    const diskPalette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#38bdf8'),
      new THREE.Color('#00f0ff'),
      new THREE.Color('#6366f1'),
      new THREE.Color('#a855f7')
    ];

    for (let i = 0; i < diskParticleCount; i++) {
      const radDistribution = Math.pow(Math.random(), 0.7);
      const radius = 5.2 + radDistribution * 9.0;
      const angle = Math.random() * Math.PI * 2;
      const heightDev = (Math.random() - 0.5) * (0.15 + (radius / 13) * 0.4);

      diskPos[i * 3] = Math.cos(angle) * radius;
      diskPos[i * 3 + 1] = heightDev;
      diskPos[i * 3 + 2] = Math.sin(angle) * radius;

      const col = diskPalette[Math.floor(Math.random() * diskPalette.length)];
      diskColors[i * 3] = col.r;
      diskColors[i * 3 + 1] = col.g;
      diskColors[i * 3 + 2] = col.b;
    }

    diskGeo.setAttribute('position', new THREE.BufferAttribute(diskPos, 3));
    diskGeo.setAttribute('color', new THREE.BufferAttribute(diskColors, 3));

    const diskMat = new THREE.PointsMaterial({
      size: 0.11,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const diskPoints = new THREE.Points(diskGeo, diskMat);
    scene.add(diskPoints);

    // -------------------------------------------------------------
    // DENSE PARTICLE PLANETARY RINGS (SEPARATED SATURN-STYLE RING)
    // -------------------------------------------------------------
    const ringParticleCount = 7000;
    const ringGeo = new THREE.BufferGeometry();
    const ringPos = new Float32Array(ringParticleCount * 3);
    const ringColors = new Float32Array(ringParticleCount * 3);

    const ringPalette = [
      new THREE.Color('#00f0ff'),
      new THREE.Color('#38bdf8'),
      new THREE.Color('#ffffff'),
      new THREE.Color('#818cf8'),
      new THREE.Color('#7dd3fc')
    ];

    for (let i = 0; i < ringParticleCount; i++) {
      // CLEAR GAP: Planet ends at r=1.76, Ring starts at r=2.75! (Clear 1.0 unit dark gap)
      let radius;
      if (Math.random() < 0.65) {
        // Inner ring band: r = 2.75 to 3.55
        radius = 2.75 + Math.random() * 0.8;
      } else {
        // Outer ring band (with Cassini division gap): r = 3.75 to 4.60
        radius = 3.75 + Math.random() * 0.85;
      }

      const angle = Math.random() * Math.PI * 2;
      const heightDev = (Math.random() - 0.5) * 0.06;

      ringPos[i * 3] = Math.cos(angle) * radius;
      ringPos[i * 3 + 1] = heightDev;
      ringPos[i * 3 + 2] = Math.sin(angle) * radius;

      const col = ringPalette[Math.floor(Math.random() * ringPalette.length)];
      ringColors[i * 3] = col.r;
      ringColors[i * 3 + 1] = col.g;
      ringColors[i * 3 + 2] = col.b;
    }

    ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPos, 3));
    ringGeo.setAttribute('color', new THREE.BufferAttribute(ringColors, 3));

    const ringMat = new THREE.PointsMaterial({
      size: 0.085,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const planetRingPoints = new THREE.Points(ringGeo, ringMat);
    planetRingPoints.rotation.x = 0.22;
    planetGroup.add(planetRingPoints);

    // -------------------------------------------------------------
    // STARFIELD BACKGROUND (DEEP SPACE)
    // -------------------------------------------------------------
    const starCount = 2500;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 30 + Math.random() * 70;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.16,
      transparent: true,
      opacity: 0.75
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // -------------------------------------------------------------
    // MANY POLAROID PHOTO CARDS SPREAD ACROSS THE GALAXY DISK
    // -------------------------------------------------------------
    const polaroidMeshes = [];
    const textureCache = {};

    function createPolaroidTexture(photoObj) {
      if (textureCache[photoObj.url]) {
        return textureCache[photoObj.url];
      }

      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 620;
      const ctx = c.getContext('2d');

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 512, 620);
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, 508, 616);

      ctx.fillStyle = '#1f2937';
      ctx.fillRect(32, 32, 448, 448);

      const texture = new THREE.CanvasTexture(c);
      textureCache[photoObj.url] = texture;

      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = photoObj.url;

      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.rect(32, 32, 448, 448);
        ctx.clip();
        
        const scale = Math.max(448 / img.width, 448 / img.height);
        const x = 32 + (448 - img.width * scale) / 2;
        const y = 32 + (448 - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        ctx.restore();

        ctx.fillStyle = '#111827';
        ctx.font = '600 26px sans-serif';
        ctx.textAlign = 'center';
        let cap = photoObj.caption || 'Memory';
        if (cap.length > 28) cap = cap.substring(0, 25) + '...';
        ctx.fillText(cap, 256, 528);

        if (photoObj.date) {
          ctx.font = '16px monospace';
          ctx.fillStyle = '#6b7280';
          ctx.fillText(photoObj.date, 256, 568);
        }
        texture.needsUpdate = true;
      };

      return texture;
    }

    const polaroidGeo = new THREE.PlaneGeometry(1.05, 1.28);
    const totalCardsCount = 32;
    const listPhotos = photosData && photosData.length > 0 ? photosData : [{ url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500', caption: 'Sweet Memories' }];

    for (let i = 0; i < totalCardsCount; i++) {
      const photo = listPhotos[i % listPhotos.length];
      const texture = createPolaroidTexture(photo);
      const mat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true });

      const mesh = new THREE.Mesh(polaroidGeo, mat);

      const ringTier = i / totalCardsCount;
      const radius = 3.6 + ringTier * 8.2 + (Math.random() - 0.5) * 0.8;
      const angle = (i / totalCardsCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
      const yOffset = (Math.random() - 0.5) * 1.2;

      mesh.userData = {
        photoData: photo,
        orbitRadius: radius,
        orbitSpeed: (0.0012 + (1.0 / radius) * 0.008) * (i % 2 === 0 ? 1 : -0.8),
        angle: angle,
        yOffset: yOffset,
        tiltZ: (Math.random() - 0.5) * 0.3
      };

      scene.add(mesh);
      polaroidMeshes.push(mesh);
    }

    // Bloom Pass Effect
    const renderScene = new THREE.RenderPass(scene, camera);
    const bloomPass = new THREE.UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.1, 0.4, 0.85
    );

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // Animation Loop
    let clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      planetGroup.rotation.y = elapsedTime * 0.2;
      pPlanetPoints.rotation.x = Math.sin(elapsedTime * 0.15) * 0.1;
      wireMesh.rotation.z = elapsedTime * 0.1;

      diskPoints.rotation.y = elapsedTime * 0.04;

      polaroidMeshes.forEach(mesh => {
        const u = mesh.userData;
        u.angle += u.orbitSpeed;

        const x = Math.cos(u.angle) * u.orbitRadius;
        const z = Math.sin(u.angle) * u.orbitRadius;
        const y = u.yOffset + Math.sin(elapsedTime * 0.8 + u.angle * 2) * 0.15;

        mesh.position.set(x, y, z);
        mesh.lookAt(camera.position);
        mesh.rotation.z += u.tiltZ * 0.05;
      });

      starPoints.rotation.y = elapsedTime * 0.01;

      if (isZooming) {
        const zoomDuration = 2.0;
        const elapsedZoom = elapsedTime - zoomStartTime;
        const progress = Math.min(Math.max(elapsedZoom / zoomDuration, 0), 1.0);
        const ease = 1 - Math.pow(1 - progress, 2.5);

        camera.position.lerpVectors(startCamPos, targetCamPos, ease);
        controls.target.set(0, 0, 0);

        if (progress >= 1.0) {
          isZooming = false;
        }
      }

      controls.update();
      composer.render();
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    });

    // Splash Screen & Planetary Transition
    const splash = document.getElementById('splash-screen');
    const warpOverlay = document.getElementById('planet-warp-transition');
    const enterBtn = document.getElementById('enter-btn');
    const homeBtn = document.getElementById('home-btn');

    if (enterBtn) {
      enterBtn.addEventListener('click', () => {
        isZooming = true;
        zoomStartTime = clock.getElapsedTime();
        splash.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => {
          splash.classList.add('hidden');
        }, 300);
      });
    }

    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        camera.position.copy(startCamPos);
        isZooming = false;
        splash.classList.remove('hidden');
        setTimeout(() => {
          splash.classList.remove('opacity-0', 'pointer-events-none');
        }, 10);
      });
    }

    // Touch/Click Interaction with Photos
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.addEventListener('pointerdown', (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(polaroidMeshes);

      if (intersects.length > 0) {
        const selected = intersects[0].object.userData.photoData;
        openPhotoModal(selected);
      }
    });

    // Love Letter & Photo Modals
    const letterModal = document.getElementById('letter-modal');
    document.getElementById('open-letter-btn').addEventListener('click', () => {
      letterModal.classList.remove('hidden');
      setTimeout(() => letterModal.classList.remove('opacity-0', 'pointer-events-none'), 10);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    });

    document.getElementById('close-letter-btn').addEventListener('click', () => {
      letterModal.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => letterModal.classList.add('hidden'), 300);
    });

    const photoModal = document.getElementById('photo-modal');
    function openPhotoModal(data) {
      document.getElementById('modal-img').src = data.url;
      document.getElementById('modal-caption').textContent = data.caption || 'Memory';
      document.getElementById('modal-date').textContent = data.date || '';
      
      photoModal.classList.remove('hidden');
      setTimeout(() => photoModal.classList.remove('opacity-0', 'pointer-events-none'), 10);
    }

    document.getElementById('close-photo-btn').addEventListener('click', () => {
      photoModal.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => photoModal.classList.add('hidden'), 300);
    });
  </script>
</body>
</html>`;
}

