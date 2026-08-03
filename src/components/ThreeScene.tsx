import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ConfigData, PolaroidPhoto } from '../types';

interface ThreeSceneProps {
  config: ConfigData;
  showSplash?: boolean;
  onSelectPhoto: (photo: PolaroidPhoto) => void;
}

export const ThreeScene: React.FC<ThreeSceneProps> = ({ config, showSplash = false, onSelectPhoto }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isZoomingRef = useRef<boolean>(false);
  const zoomStartTimeRef = useRef<number>(0);
  const prevShowSplashRef = useRef<boolean>(showSplash);

  const startCamPos = new THREE.Vector3(0, 32, 45);
  const targetCamPos = new THREE.Vector3(0, 9, 14);

  // Trigger zoom animation when showSplash transitions from true to false
  useEffect(() => {
    if (prevShowSplashRef.current && !showSplash) {
      isZoomingRef.current = true;
      zoomStartTimeRef.current = -1; // Will be set in clock loop
    } else if (!prevShowSplashRef.current && showSplash) {
      isZoomingRef.current = false;
    }
    prevShowSplashRef.current = showSplash;
  }, [showSplash]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    // If showSplash is active initially, start camera far away for cinematic zoom-in
    if (showSplash) {
      camera.position.copy(startCamPos);
    } else {
      camera.position.copy(targetCamPos);
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 28;
    controls.minDistance = 4;
    controls.target.set(0, 0, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0x00f0ff, 3.5, 70);
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
      roughness: 0.2,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    planetGroup.add(coreMesh);

    // 2. Wireframe Lattice Layer around Planet Core
    const wireGeo = new THREE.SphereGeometry(1.6, 24, 24);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
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
      new THREE.Color('#818cf8'),
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
      blending: THREE.AdditiveBlending,
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
      new THREE.Color('#a855f7'),
    ];

    for (let i = 0; i < diskParticleCount; i++) {
      // Background disk starts further out at r = 5.2 to avoid cluttering planetary ring
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
      blending: THREE.AdditiveBlending,
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
      new THREE.Color('#7dd3fc'),
    ];

    for (let i = 0; i < ringParticleCount; i++) {
      // CLEAR GAP: Planet ends at r=1.76, Ring starts at r=2.75! (Clear 1.0 unit dark gap)
      let radius: number;
      if (Math.random() < 0.65) {
        // Inner ring band: r = 2.75 to 3.55
        radius = 2.75 + Math.random() * 0.8;
      } else {
        // Outer ring band (with Cassini division gap): r = 3.75 to 4.60
        radius = 3.75 + Math.random() * 0.85;
      }

      const angle = Math.random() * Math.PI * 2;
      const heightDev = (Math.random() - 0.5) * 0.06; // Very sleek flat ring

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
      blending: THREE.AdditiveBlending,
    });
    const planetRingPoints = new THREE.Points(ringGeo, ringMat);
    // Tilt the planetary ring slightly for an iconic 3D perspective
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
      opacity: 0.75,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // -------------------------------------------------------------
    // MANY POLAROID PHOTO CARDS SPREAD ACROSS THE GALAXY DISK
    // -------------------------------------------------------------
    const polaroidMeshes: THREE.Mesh[] = [];
    const textureMap = new Map<string, THREE.CanvasTexture>();

    // Helper function to build 2D Canvas for Polaroid Frame
    const createPolaroidTexture = (photo: PolaroidPhoto): THREE.CanvasTexture => {
      if (textureMap.has(photo.url)) {
        return textureMap.get(photo.url)!;
      }

      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 620;
      const ctx = canvas.getContext('2d')!;

      // Background Card
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 512, 620);

      // Card Inner Shadow/Border
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, 508, 616);

      // Photo Frame Placeholder
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(32, 32, 448, 448);

      const texture = new THREE.CanvasTexture(canvas);
      textureMap.set(photo.url, texture);

      // Load image onto canvas
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = photo.url;
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
        ctx.font = '600 26px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        
        let caption = photo.caption || 'Memory';
        if (caption.length > 28) {
          caption = caption.substring(0, 25) + '...';
        }
        ctx.fillText(caption, 256, 528);

        if (photo.date) {
          ctx.fillStyle = '#6b7280';
          ctx.font = '16px monospace';
          ctx.fillText(photo.date, 256, 568);
        }

        texture.needsUpdate = true;
      };

      return texture;
    };

    const cardGeometry = new THREE.PlaneGeometry(1.05, 1.28);

    // Create MANY cards (32 total) spread across the galaxy rings
    const userPhotos = config.photos && config.photos.length > 0 ? config.photos : [
      { id: '1', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500', caption: 'Sweet Memories' }
    ];
    const totalCardsCount = 32;

    for (let i = 0; i < totalCardsCount; i++) {
      const photo = userPhotos[i % userPhotos.length];
      const texture = createPolaroidTexture(photo);

      const material = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        roughness: 0.35,
        metalness: 0.1,
      });

      const mesh = new THREE.Mesh(cardGeometry, material);

      // Distribute radially from inner ring 3.8 to outer ring 12.0
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
        tiltX: (Math.random() - 0.5) * 0.3,
        tiltZ: (Math.random() - 0.5) * 0.3,
      };

      scene.add(mesh);
      polaroidMeshes.push(mesh);
    }

    // -------------------------------------------------------------
    // POSTPROCESSING (UNREAL BLOOM PASS)
    // -------------------------------------------------------------
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      1.1, // Bloom strength
      0.4, // Bloom radius
      0.82 // Bloom threshold
    );

    const composer = new EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(bloomPass);

    // -------------------------------------------------------------
    // ANIMATION & RENDER LOOP
    // -------------------------------------------------------------
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotate particle planet & wireframe
      planetGroup.rotation.y = elapsedTime * 0.2;
      pPlanetPoints.rotation.x = Math.sin(elapsedTime * 0.15) * 0.1;
      wireMesh.rotation.z = elapsedTime * 0.1;

      // Rotate galaxy accretion particle disk slowly
      diskPoints.rotation.y = elapsedTime * 0.04;

      // Rotate and orbit polaroid photo cards across galaxy disk
      polaroidMeshes.forEach((mesh) => {
        const u = mesh.userData;
        u.angle += u.orbitSpeed;

        const x = Math.cos(u.angle) * u.orbitRadius;
        const z = Math.sin(u.angle) * u.orbitRadius;
        const y = u.yOffset + Math.sin(elapsedTime * 0.8 + u.angle * 2) * 0.15;

        mesh.position.set(x, y, z);

        // Point face gently toward camera so photos stay readable
        mesh.lookAt(camera.position);
        mesh.rotation.z += u.tiltZ * 0.05;
      });

      // Starfield subtle background drift
      starPoints.rotation.y = elapsedTime * 0.01;

      // Smooth Camera Zoom-In Transition when entering planet scene
      if (isZoomingRef.current) {
        if (zoomStartTimeRef.current === -1) {
          zoomStartTimeRef.current = elapsedTime;
        }
        const zoomDuration = 2.0; // 2.0s responsive smooth zoom-in
        const elapsedZoom = elapsedTime - zoomStartTimeRef.current;
        const progress = Math.min(Math.max(elapsedZoom / zoomDuration, 0), 1.0);
        // Smooth Ease-Out for elegant deceleration as camera approaches planet
        const ease = 1 - Math.pow(1 - progress, 2.5);

        camera.position.lerpVectors(startCamPos, targetCamPos, ease);
        controls.target.set(0, 0, 0);

        if (progress >= 1.0) {
          isZoomingRef.current = false;
        }
      }

      controls.update();
      composer.render();
    };

    animate();

    // -------------------------------------------------------------
    // RAYCASTING FOR CLICK / TOUCH SELECTION
    // -------------------------------------------------------------
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(polaroidMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        if (hit.userData && hit.userData.photoData) {
          onSelectPhoto(hit.userData.photoData);
        }
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', handlePointerDown);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      composer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('pointerdown', handlePointerDown);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [config, onSelectPhoto]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
    />
  );
};
