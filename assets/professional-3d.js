(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const interactiveSelector = [
    '.hero-image', '.card', '.panel', '.pod', '.path', '.model-card', '.testimonial-card', '.post', '.logo-tile'
  ].join(',');

  const interactiveNodes = Array.from(document.querySelectorAll(interactiveSelector));

  interactiveNodes.forEach((node) => {
    node.classList.add('is-3d-ready');

    if (reducedMotion) {
      return;
    }

    const reset = () => {
      node.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    };

    node.addEventListener('pointermove', (event) => {
      const rect = node.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 9;
      const rotateX = (0.5 - y) * 9;
      node.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px)`;
    });

    node.addEventListener('pointerleave', reset);
    node.addEventListener('blur', reset, true);
  });

  if (reducedMotion) {
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.className = 'pro-3d-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }

  const state = {
    width: 0,
    height: 0,
    particles: []
  };

  const createParticles = () => {
    const count = Math.max(20, Math.floor((state.width + state.height) / 90));
    state.particles = Array.from({ length: count }, () => ({
      x: Math.random() * state.width,
      y: Math.random() * state.height,
      z: Math.random() * 1 + 0.2,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.7
    }));
  };

  const resize = () => {
    state.width = window.innerWidth;
    state.height = window.innerHeight;
    canvas.width = state.width * window.devicePixelRatio;
    canvas.height = state.height * window.devicePixelRatio;
    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    createParticles();
  };

  const draw = () => {
    ctx.clearRect(0, 0, state.width, state.height);
    ctx.fillStyle = 'rgba(51, 155, 255, 0.23)';

    state.particles.forEach((particle) => {
      particle.x += particle.vx * particle.z;
      particle.y += particle.vy * particle.z;

      if (particle.x < -30 || particle.x > state.width + 30 || particle.y < -30 || particle.y > state.height + 30) {
        particle.x = Math.random() * state.width;
        particle.y = Math.random() * state.height;
      }

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * particle.z, 0, Math.PI * 2);
      ctx.fill();
    });

    for (let i = 0; i < state.particles.length; i += 1) {
      for (let j = i + 1; j < state.particles.length; j += 1) {
        const a = state.particles[i];
        const b = state.particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 160) {
          const opacity = (1 - distance / 160) * 0.24;
          ctx.strokeStyle = `rgba(80, 183, 255, ${opacity.toFixed(3)})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    window.requestAnimationFrame(draw);
  };

  resize();
  draw();
  window.addEventListener('resize', resize);
})();
