import React, { useEffect, useRef } from 'react';

export const DynamicBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const context = ctx;

        let animationFrameId: number;
        const particles: Particle[] = [];
        const backgroundStars: Star[] = [];
        const mouse = { x: 0, y: 0, active: false };
        const gravityPoints: { x: number; y: number; weight: number }[] = [];

        const numParticles = 150;
        const numStars = 400;
        const EFFECT_RADIUS = 500;

        // --- Gravity Point Scanner ---
        const updateGravityPoints = () => {
            gravityPoints.length = 0;
            const elements = document.querySelectorAll('h1, h2, h3, .text-app-primary, a, button');
            elements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                gravityPoints.push({
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                    weight: Math.min(rect.width * rect.height, 50000) / 50000 // Normalized weight
                });
            });
        };

        // --- Resizing ---
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
            updateGravityPoints();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.active = true;
        };

        // --- Background Stars ---
        class Star {
            x: number;
            y: number;
            originX: number;
            originY: number;
            size: number;
            opacity: number;
            pulse: number;
            pulseSpeed: number;
            parallaxFactor: number;

            constructor() {
                this.x = this.originX = Math.random() * canvas.width;
                this.y = this.originY = Math.random() * canvas.height;
                this.size = Math.random() * 1.8;
                this.opacity = 0.2 + Math.random() * 0.5;
                this.pulse = Math.random() * Math.PI;
                this.pulseSpeed = 0.01 + Math.random() * 0.03;
                this.parallaxFactor = 0.005 + Math.random() * 0.02;
            }

            draw() {
                this.pulse += this.pulseSpeed;
                const currentOpacity = this.opacity + Math.sin(this.pulse) * 0.15;

                // Parallax drift
                const dx = (mouse.x - canvas.width / 2) * this.parallaxFactor;
                const dy = (mouse.y - canvas.height / 2) * this.parallaxFactor;
                this.x = this.originX - dx;
                this.y = this.originY - dy;

                context.beginPath();
                context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                context.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
                context.fill();
            }
        }

        const initStars = () => {
            backgroundStars.length = 0;
            for (let i = 0; i < numStars; i++) {
                backgroundStars.push(new Star());
            }
        };

        // --- Main Particles ---
        class Particle {
            angle: number;
            distance: number;
            speed: number;
            size: number;
            color: string;
            rotationSpeed: number;
            targetX: number;
            targetY: number;

            constructor() {
                this.targetX = 0;
                this.targetY = 0;
                this.reset(true);
            }

            reset(initial = false) {
                this.angle = Math.random() * Math.PI * 2;
                this.distance = initial ? Math.random() * EFFECT_RADIUS : EFFECT_RADIUS + Math.random() * 100;
                this.speed = 0.8 + Math.random() * 2.5;
                this.size = 0.5 + Math.random() * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.04;
                const colors = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#6366f1', '#818cf8'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update(mx: number, my: number) {
                this.distance -= this.speed;
                this.angle += this.rotationSpeed;

                // Subtle gravity towards nearest point
                if (gravityPoints.length > 0) {
                    let nearest = gravityPoints[0];
                    let minDist = Math.hypot(this.targetX - nearest.x, this.targetY - nearest.y);

                    for (let i = 1; i < gravityPoints.length; i++) {
                        const d = Math.hypot(this.targetX - gravityPoints[i].x, this.targetY - gravityPoints[i].y);
                        if (d < minDist) {
                            minDist = d;
                            nearest = gravityPoints[i];
                        }
                    }

                    if (minDist < 200) {
                        this.angle += (nearest.x > this.targetX ? 0.005 : -0.005) * nearest.weight;
                        this.distance += 0.2; // Slow down the collapse slightly near elements
                    }
                }

                if (this.distance < 10) {
                    this.reset();
                }
            }

            draw(mx: number, my: number) {
                this.targetX = mx + Math.cos(this.angle) * this.distance;
                this.targetY = my + Math.sin(this.angle) * this.distance;

                const opacity = (1 - this.distance / (EFFECT_RADIUS + 100)) * 0.8;
                if (opacity <= 0) return;

                context.save();
                context.beginPath();
                context.arc(this.targetX, this.targetY, this.size, 0, Math.PI * 2);
                context.fillStyle = this.color;
                context.globalAlpha = opacity;
                context.shadowBlur = 12;
                context.shadowColor = this.color;
                context.fill();

                // Advanced Trail
                const trailLength = 4;
                for (let i = 1; i <= trailLength; i++) {
                    const tx = mx + Math.cos(this.angle - this.rotationSpeed * i * 0.5) * (this.distance + this.speed * i * 2);
                    const ty = my + Math.sin(this.angle - this.rotationSpeed * i * 0.5) * (this.distance + this.speed * i * 2);
                    context.beginPath();
                    context.arc(tx, ty, this.size * (1 - i / trailLength), 0, Math.PI * 2);
                    context.fillStyle = this.color;
                    context.globalAlpha = opacity * (0.2 / i);
                    context.fill();
                }

                context.restore();
            }
        }

        const drawGrid = () => {
            const gridSize = 60;
            const scrollX = (mouse.x - canvas.width / 2) * 0.05;
            const scrollY = (mouse.y - canvas.height / 2) * 0.05;

            context.save();
            context.translate(-scrollX, -scrollY);
            context.strokeStyle = 'rgba(139, 92, 246, 0.08)';
            context.lineWidth = 0.5;

            for (let x = -gridSize; x < canvas.width + gridSize; x += gridSize) {
                context.beginPath();
                context.moveTo(x, -gridSize);
                context.lineTo(x, canvas.height + gridSize);
                context.stroke();
            }
            for (let y = -gridSize; y < canvas.height + gridSize; y += gridSize) {
                context.beginPath();
                context.moveTo(-gridSize, y);
                context.lineTo(canvas.width + gridSize, y);
                context.stroke();
            }
            context.restore();
        };

        const drawNebula = () => {
            if (!mouse.active) return;
            // Pulsing aurora-like glow
            const time = Date.now() * 0.001;
            const pulse = (Math.sin(time) + 1) * 0.5;

            const gradient = context.createRadialGradient(
                mouse.x, mouse.y, 0,
                mouse.x, mouse.y, EFFECT_RADIUS * (1 + pulse * 0.2)
            );
            gradient.addColorStop(0, 'rgba(139, 92, 246, 0.15)');
            gradient.addColorStop(0.3, 'rgba(99, 102, 241, 0.08)');
            gradient.addColorStop(0.7, 'rgba(167, 139, 250, 0.03)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            context.fillStyle = gradient;
            context.fillRect(0, 0, canvas.width, canvas.height);
        };

        const animate = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);

            drawGrid();
            backgroundStars.forEach(star => star.draw());
            drawNebula();

            if (mouse.active) {
                particles.forEach(p => {
                    p.update(mouse.x, mouse.y);
                    p.draw(mouse.x, mouse.y);
                });
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        // --- Setup ---
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        // Scan for gravity points periodically (to catch route changes/content loading)
        const gravityInterval = setInterval(updateGravityPoints, 2000);

        handleResize();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            clearInterval(gravityInterval);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[0]"
            style={{ mixBlendMode: 'screen' }}
        />
    );
};
