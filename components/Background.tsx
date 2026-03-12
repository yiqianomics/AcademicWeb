import React, { useEffect, useRef } from 'react';

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Configuration for DNA strands
    const strands = [
      { xOffset: -0.2, color: 'rgba(14, 165, 233, 0.15)', speed: 0.002, amplitude: 60 }, // Blue
      { xOffset: 0.0, color: 'rgba(99, 102, 241, 0.15)', speed: 0.003, amplitude: 80 }, // Indigo
      { xOffset: 0.2, color: 'rgba(148, 163, 184, 0.15)', speed: 0.0025, amplitude: 50 }, // Slate
    ];

    // Floating particles (omics data points)
    const particles: { x: number; y: number; r: number; vy: number; vx: number; alpha: number; originalX: number; originalY: number }[] = [];
    const particleCount = 40;

    // Use a larger area to cover rotation
    const diagonal = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * diagonal * 1.5;
      const y = (Math.random() - 0.5) * diagonal * 1.5;
      particles.push({
        x: x,
        y: y,
        originalX: x,
        originalY: y,
        r: Math.random() * 2 + 1,
        vy: (Math.random() - 0.5) * 0.5,
        vx: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.5 + 0.1
      });
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawHelix = (xPos: number, amplitude: number, phase: number, color: string) => {
      if (!ctx) return;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      
      const diagonal = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
      const halfDiag = diagonal / 1.5;

      // Interaction effect on amplitude based on mouse distance to center (simplified for rotated context)
      // Since context is rotated, mapping mouse is complex. We'll stick to ambient animation + time.
      
      const strandPoints: {x: number, y: number}[] = [];

      for (let y = -halfDiag; y < halfDiag; y += 10) {
        const x = xPos + Math.sin(y * 0.013 + phase) * amplitude;
        strandPoints.push({x, y});
        if (y === -halfDiag) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw "base pairs" (dots on the strand)
      ctx.fillStyle = color;
      strandPoints.forEach((p, i) => {
        if (i % 6 === 0) { // spacing adjusted for higher density
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };

    const animate = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time++;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const diagonal = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);

      ctx.save();
      ctx.translate(cx, cy);
      // Rotate 50 degrees
      ctx.rotate((50 * Math.PI) / 180);

      // Draw Strands
      strands.forEach((strand, i) => {
        // Spread strands out relative to center
        const xPos = strand.xOffset * diagonal; 
        const phase = time * strand.speed + i; 
        
        drawHelix(xPos, strand.amplitude, phase, strand.color);
        drawHelix(xPos, strand.amplitude, phase + Math.PI, strand.color.replace('0.15', '0.08'));
      });

      // Draw Floating Omics Particles
      ctx.fillStyle = 'rgba(100, 116, 139, 0.4)';
      
      // Calculate mouse position relative to center (unrotated for simple distance check, or rotated for interaction)
      // Let's do simple repulsion in the rotated frame? No, simpler to do in global frame but we are in rotated context.
      // Let's stick to particle animation within the rotated frame for consistent "flow" direction.
      
      particles.forEach(p => {
        p.y += p.vy;
        p.x += p.vx;
        
        // Boundaries in rotated frame
        const limit = diagonal / 1.5;
        if (p.y < -limit) p.y = limit;
        if (p.y > limit) p.y = -limit;
        if (p.x < -limit) p.x = limit;
        if (p.x > limit) p.x = -limit;

        // Mouse Interaction: Convert mouse to rotated coordinates to interact with particles
        // Mouse vector relative to center
        const dx = mouseRef.current.x - cx;
        const dy = mouseRef.current.y - cy;
        // Rotate vector -50 deg to match context
        const angle = (-50 * Math.PI) / 180;
        const rx = dx * Math.cos(angle) - dy * Math.sin(angle);
        const ry = dx * Math.sin(angle) + dy * Math.cos(angle);

        // Distance from particle to rotated mouse
        const distToMouse = Math.sqrt((p.x - rx) ** 2 + (p.y - ry) ** 2);
        
        let drawX = p.x;
        let drawY = p.y;
        
        // Repulsion
        if (distToMouse < 150) {
            const repulsion = (150 - distToMouse) / 10;
            const angleToMouse = Math.atan2(p.y - ry, p.x - rx);
            drawX += Math.cos(angleToMouse) * repulsion;
            drawY += Math.sin(angleToMouse) * repulsion;
        }

        ctx.beginPath();
        ctx.arc(drawX, drawY, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-slate-50">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-transparent to-slate-50/50"></div>
    </div>
  );
};

export default Background;
