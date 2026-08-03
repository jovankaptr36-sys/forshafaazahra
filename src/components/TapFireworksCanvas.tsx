import React, { useEffect, useRef } from 'react';

interface TapFireworksCanvasProps {
  active: boolean;
  girlfriendName?: string;
}

export const TapFireworksCanvas: React.FC<TapFireworksCanvasProps> = ({ active, girlfriendName }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle & Floating Text Data Structures
    interface Rocket {
      x: number;
      y: number;
      px: number;
      py: number;
      targetX: number;
      targetY: number;
      vx: number;
      vy: number;
      color: string;
    }

    interface Particle {
      x: number;
      y: number;
      px: number;
      py: number;
      vx: number;
      vy: number;
      color: string;
      alpha: number;
      decay: number;
      size: number;
      gravity: number;
      sparkle: boolean;
      lineWidth: number;
      holdFrames?: number;
    }

    interface FloatingText {
      x: number;
      y: number;
      vy: number;
      text: string;
      subtext?: string;
      alpha: number;
      scale: number;
    }

    const rockets: Rocket[] = [];
    const particles: Particle[] = [];
    const floatingTexts: FloatingText[] = [];

    // Helper to generate text particle coordinates for "I LOVE YOU"
    const generateTextPoints = (text: string, centerX: number, centerY: number) => {
      const offscreen = document.createElement('canvas');
      offscreen.width = width;
      offscreen.height = height;
      const oCtx = offscreen.getContext('2d');
      if (!oCtx) return [];

      const fontSize = Math.min(width / (text.length * 1.1), Math.max(16, height * 0.04));
      oCtx.font = `700 ${fontSize}px 'IBM Plex Sans', 'IBM Plex Mono', sans-serif`;
      oCtx.textAlign = 'center';
      oCtx.textBaseline = 'middle';
      oCtx.fillStyle = '#ffffff';
      oCtx.fillText(text, centerX, centerY);

      const imgData = oCtx.getImageData(0, 0, width, height);
      const data = imgData.data;
      const points: { x: number; y: number; color: string }[] = [];

      const step = Math.max(2, Math.floor(fontSize / 14));

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const alpha = data[(y * width + x) * 4 + 3];
          if (alpha > 128) {
            points.push({ x, y, color: '#ffffff' });
          }
        }
      }
      return points;
    };

    // Trigger explosion at specific tap coordinates
    const explodeAt = (targetX: number, targetY: number) => {
      // 1. Small Pure White Chrysanthemum Burst
      const count = 75;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 1.5;

        particles.push({
          x: targetX,
          y: targetY,
          px: targetX,
          py: targetY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: '#ffffff',
          alpha: 1,
          decay: 0.012 + Math.random() * 0.008,
          size: Math.random() * 1.2 + 0.6,
          gravity: 0.03,
          sparkle: true,
          lineWidth: 1,
        });
      }

      // 2. "I LOVE YOU" Pure White Particle Constellation
      const textPoints = generateTextPoints('I LOVE YOU', targetX, targetY);
      textPoints.forEach((pt) => {
        const speed = Math.random() * 1.2 + 0.2;
        particles.push({
          x: targetX,
          y: targetY,
          px: targetX,
          py: targetY,
          vx: (pt.x - targetX) * 0.08 + (Math.random() - 0.5) * speed,
          vy: (pt.y - targetY) * 0.08 + (Math.random() - 0.5) * speed,
          color: '#ffffff',
          alpha: 1,
          decay: 0.008 + Math.random() * 0.004,
          size: Math.random() * 1.4 + 0.8,
          gravity: 0.012,
          sparkle: true,
          lineWidth: 1,
          holdFrames: 25,
        });
      });

      // 3. Floating Pure White "I LOVE YOU" Label at tap position (no heart icon)
      floatingTexts.push({
        x: targetX,
        y: targetY,
        vy: -1.0,
        text: 'I LOVE YOU',
        subtext: girlfriendName ? `For ${girlfriendName} ✨` : undefined,
        alpha: 1,
        scale: 0.5,
      });
    };

    // Tap/Click Event Handler
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      // Don't trigger if user clicked on UI buttons
      const targetEl = e.target as HTMLElement;
      if (targetEl && (targetEl.closest('button') || targetEl.closest('.pointer-events-auto'))) {
        return;
      }

      let tapX = 0;
      let tapY = 0;

      if ('touches' in e && e.touches.length > 0) {
        tapX = e.touches[0].clientX;
        tapY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        tapX = e.clientX;
        tapY = e.clientY;
      } else {
        return;
      }

      // Spawn Rocket from bottom pointing towards tap location
      const startX = tapX + (Math.random() - 0.5) * 80;
      const startY = height + 10;
      const dx = tapX - startX;
      const dy = tapY - startY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = 15;

      rockets.push({
        x: startX,
        y: startY,
        px: startX,
        py: startY,
        targetX: tapX,
        targetY: tapY,
        vx: (dx / dist) * speed,
        vy: (dy / dist) * speed,
        color: '#ffffff',
      });
    };

    window.addEventListener('click', handlePointerDown);
    window.addEventListener('touchstart', handlePointerDown);

    // Animation Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.px = r.x;
        r.py = r.y;
        r.x += r.vx;
        r.y += r.vy;

        // Draw glowing rocket streak
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(r.px, r.py);
        ctx.lineTo(r.x, r.y);
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 3.5;
        ctx.shadowBlur = 12;
        ctx.shadowColor = r.color;
        ctx.stroke();
        ctx.restore();

        // Check if rocket reached target
        if (r.y <= r.targetY || Math.abs(r.x - r.targetX) < 15) {
          explodeAt(r.targetX, r.targetY);
          rockets.splice(i, 1);
        }
      }

      // Render Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.px = p.x;
        p.py = p.y;

        if (p.holdFrames && p.holdFrames > 0) {
          p.holdFrames--;
          p.vx *= 0.85;
          p.vy *= 0.85;
        } else {
          p.vx *= 0.96;
          p.vy = p.vy * 0.96 + p.gravity;
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;
        }

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);

        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.lineWidth || 2;
        ctx.lineCap = 'round';

        if (p.sparkle && Math.random() > 0.3) {
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;
        }

        ctx.stroke();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.restore();
      }

      // Render Floating Text Banners ("I LOVE YOU")
      for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const ft = floatingTexts[i];
        ft.y += ft.vy;
        ft.alpha -= 0.012;
        ft.scale = Math.min(1, ft.scale + 0.08);

        if (ft.alpha <= 0) {
          floatingTexts.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.translate(ft.x, ft.y);
        ctx.scale(ft.scale, ft.scale);

        // Text Glow Effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffffff';
        ctx.font = "700 18px 'IBM Plex Sans', 'IBM Plex Mono', sans-serif";
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(ft.text, 0, 0);

        if (ft.subtext) {
          ctx.font = "10px 'Plus Jakarta Sans', sans-serif";
          ctx.fillStyle = '#f8fafc';
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#ffffff';
          ctx.fillText(ft.subtext, 0, 16);
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, girlfriendName]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20 w-full h-full"
    />
  );
};
