/* ============================================================
   DYNAMIC FLOWER PETALS EFFECT FOR ENTRY / COVER SCREEN
   ============================================================ */

export function initFlowerEffect() {
  const canvas = document.getElementById('flower-canvas');
  if (!canvas) return { stop: () => {}, burst: () => {} };

  const ctx = canvas.getContext('2d');
  let animationId = null;
  let isRunning = true;
  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Mouse / touch interaction point
  const mouse = { x: -1000, y: -1000, active: false };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
    height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  resize();
  window.addEventListener('resize', resize);

  // Mouse / Touch listeners
  const onPointerMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  };

  const onPointerLeave = () => {
    mouse.active = false;
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerleave', onPointerLeave, { passive: true });

  // Petal color palettes (Rose, Jasmine, Gold leaf, Champagne)
  const PALETTES = [
    {
      type: 'rose',
      colorStart: '#FDEDEC',
      colorMid: '#F5B7B1',
      colorEnd: '#E74C3C',
      shadowColor: 'rgba(231, 76, 60, 0.2)',
      veinColor: 'rgba(192, 57, 43, 0.4)'
    },
    {
      type: 'rose',
      colorStart: '#FBEEE6',
      colorMid: '#EDBB99',
      colorEnd: '#DC7633',
      shadowColor: 'rgba(220, 118, 51, 0.18)',
      veinColor: 'rgba(186, 74, 0, 0.35)'
    },
    {
      type: 'jasmine',
      colorStart: '#FFFFFF',
      colorMid: '#FEFBF3',
      colorEnd: '#F9EBEA',
      shadowColor: 'rgba(201, 164, 92, 0.2)',
      veinColor: 'rgba(201, 164, 92, 0.35)'
    },
    {
      type: 'gold',
      colorStart: '#FFF8DC',
      colorMid: '#E5C378',
      colorEnd: '#C9A45C',
      shadowColor: 'rgba(201, 164, 92, 0.35)',
      veinColor: 'rgba(168, 134, 62, 0.4)'
    },
    {
      type: 'champagne',
      colorStart: '#FAF0E6',
      colorMid: '#E8D0C5',
      colorEnd: '#C39B8B',
      shadowColor: 'rgba(195, 155, 139, 0.2)',
      veinColor: 'rgba(150, 110, 95, 0.3)'
    }
  ];

  function createPetal(burst = false, originX = width / 2, originY = height / 2) {
    const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
    const depth = 0.4 + Math.random() * 0.6; // 0.4 to 1.0 (depth scale)
    const baseSize = 9 + Math.random() * 14;
    const size = baseSize * depth;

    if (burst) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      return {
        ...palette,
        x: originX + (Math.random() - 0.5) * 40,
        y: originY + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size,
        baseSize,
        depth,
        opacity: 0.8 + Math.random() * 0.2,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        vRotX: (Math.random() - 0.5) * 0.08,
        vRotY: (Math.random() - 0.5) * 0.08,
        vRotZ: (Math.random() - 0.5) * 0.05,
        swaySpeed: 0.02 + Math.random() * 0.02,
        swayAmp: 1.5 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        gravity: 0.08,
        isBurst: true,
        life: 1.0,
        decay: 0.006 + Math.random() * 0.008
      };
    }

    return {
      ...palette,
      x: Math.random() * width,
      y: Math.random() * (height * 1.3) - height * 0.3,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (0.9 + Math.random() * 1.5) * depth,
      size,
      baseSize,
      depth,
      opacity: 0.45 + depth * 0.45,
      rotX: Math.random() * Math.PI * 2,
      rotY: Math.random() * Math.PI * 2,
      rotZ: Math.random() * Math.PI * 2,
      vRotX: 0.01 + Math.random() * 0.025,
      vRotY: 0.01 + Math.random() * 0.025,
      vRotZ: (Math.random() - 0.5) * 0.02,
      swaySpeed: 0.012 + Math.random() * 0.02,
      swayAmp: 1.0 + Math.random() * 2.2,
      phase: Math.random() * Math.PI * 2,
      isBurst: false
    };
  }

  // Petal density based on screen size
  const petalCount = Math.min(Math.floor((width * height) / 14000), 55);
  const petals = [];
  for (let i = 0; i < petalCount; i++) {
    petals.push(createPetal(false));
  }

  // Sparkling pollen particles for fairy-tale wedding atmosphere
  const sparkleCount = 20;
  const sparkles = [];
  for (let i = 0; i < sparkleCount; i++) {
    sparkles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1 + Math.random() * 2,
      vy: 0.3 + Math.random() * 0.6,
      vx: (Math.random() - 0.5) * 0.3,
      alpha: Math.random(),
      fadeSpeed: 0.01 + Math.random() * 0.02,
      color: Math.random() > 0.4 ? '#C9A45C' : '#FFF3D1'
    });
  }

  let time = 0;

  function render() {
    if (!isRunning) return;

    ctx.clearRect(0, 0, width, height);
    time += 1;

    // Render Sparkles
    for (let i = 0; i < sparkles.length; i++) {
      const sp = sparkles[i];
      sp.y += sp.vy;
      sp.x += sp.vx;
      sp.alpha += sp.fadeSpeed;
      if (sp.alpha >= 1 || sp.alpha <= 0) {
        sp.fadeSpeed = -sp.fadeSpeed;
      }
      if (sp.y > height) {
        sp.y = -5;
        sp.x = Math.random() * width;
      }

      ctx.save();
      ctx.fillStyle = sp.color;
      ctx.globalAlpha = Math.max(0, Math.min(1, sp.alpha)) * 0.6;
      ctx.shadowColor = sp.color;
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Render Petals
    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];

      // Physics update
      if (p.isBurst) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.life -= p.decay;
        p.opacity = Math.max(0, p.life);
        if (p.life <= 0 || p.y > height + 50) {
          petals.splice(i, 1);
          i--;
          continue;
        }
      } else {
        // Continuous gentle breeze & fall
        const sway = Math.sin(time * p.swaySpeed + p.phase) * p.swayAmp;
        p.x += p.vx + sway * 0.4;
        p.y += p.vy;

        // Interactive mouse gentle push
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100 && dist > 0) {
            const force = (100 - dist) / 100 * 1.5;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force * 0.5;
          }
        }

        // Recycle petal when falling below screen
        if (p.y > height + 30) {
          p.y = -25 - Math.random() * 40;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 20;
        if (p.x > width + 30) p.x = -20;
      }

      // 3D rotation update
      p.rotX += p.vRotX;
      p.rotY += p.vRotY;
      p.rotZ += p.vRotZ;

      // Draw the organic petal
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotZ);

      // Simulate 3D tumbling via X & Y scale projection
      const scaleX = Math.cos(p.rotY);
      const scaleY = Math.sin(p.rotX);
      ctx.scale(Math.abs(scaleX) < 0.15 ? (scaleX < 0 ? -0.15 : 0.15) : scaleX, scaleY);

      // Petal gradient fill
      const s = p.size;
      const grad = ctx.createLinearGradient(0, -s, 0, s);
      grad.addColorStop(0, p.colorStart);
      grad.addColorStop(0.65, p.colorMid);
      grad.addColorStop(1, p.colorEnd);

      ctx.fillStyle = grad;
      ctx.globalAlpha = p.opacity;
      ctx.shadowColor = p.shadowColor;
      ctx.shadowBlur = 6 * p.depth;

      ctx.beginPath();
      if (p.type === 'rose') {
        // Heart-curved rose petal
        ctx.moveTo(0, -s);
        ctx.bezierCurveTo(s * 0.85, -s * 0.7, s * 0.9, s * 0.3, 0, s);
        ctx.bezierCurveTo(-s * 0.9, s * 0.3, -s * 0.85, -s * 0.7, 0, -s);
      } else if (p.type === 'jasmine') {
        // Elegant pointed jasmine petal
        ctx.moveTo(0, -s * 1.15);
        ctx.bezierCurveTo(s * 0.5, -s * 0.6, s * 0.55, s * 0.4, 0, s * 0.9);
        ctx.bezierCurveTo(-s * 0.55, s * 0.4, -s * 0.5, -s * 0.6, 0, -s * 1.15);
      } else {
        // Gold / champagne curved blossom petal
        ctx.moveTo(0, -s * 0.9);
        ctx.bezierCurveTo(s * 0.75, -s * 0.5, s * 0.75, s * 0.5, 0, s * 0.9);
        ctx.bezierCurveTo(-s * 0.75, s * 0.5, -s * 0.75, -s * 0.5, 0, -s * 0.9);
      }
      ctx.fill();

      // Subtle delicate center vein
      if (p.depth > 0.55) {
        ctx.strokeStyle = p.veinColor;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = p.opacity * 0.4;
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.7);
        ctx.quadraticCurveTo(s * 0.08, 0, 0, s * 0.65);
        ctx.stroke();
      }

      ctx.restore();
    }

    animationId = requestAnimationFrame(render);
  }

  // Start loop
  animationId = requestAnimationFrame(render);

  // Trigger burst shower of petals
  function burst(x = width / 2, y = height / 2, count = 45) {
    for (let i = 0; i < count; i++) {
      petals.push(createPetal(true, x, y));
    }
  }

  // Gracefully stop animation
  function stop() {
    isRunning = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerleave', onPointerLeave);
  }

  return { stop, burst };
}
