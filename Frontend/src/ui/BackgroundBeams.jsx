import React, { useEffect, useRef } from "react";

function createBeam(width, height) {
    const angle = -35 + Math.random() * 10;
    return {
        x: Math.random() * width * 1.5 - width * 0.25,
        y: Math.random() * height * 1.5 - height * 0.25,
        width: 20 + Math.random() * 40,
        length: height * 2,
        angle,
        speed: 0.4 + Math.random() * 0.8,
        opacity: 0.08 + Math.random() * 0.1,
        hue: 190 + Math.random() * 70,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
    };
}

export default function BeamsBackground({ className = "", intensity = "medium" }) {
    const canvasRef = useRef(null);
    const beamsRef = useRef([]);
    const animationFrameRef = useRef(0);
    const MINIMUM_BEAMS = 10; // reduced for performance

    const opacityMap = {
        subtle: 0.6,
        medium: 0.75,
        strong: 0.9,
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const updateCanvasSize = () => {
            const dpr = Math.min(1.5, window.devicePixelRatio || 1); // limit high-res drain
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(1, 0, 0, 1, 0, 0); // reset before scale
            ctx.scale(dpr, dpr);

            beamsRef.current = Array.from({ length: MINIMUM_BEAMS }, () =>
                createBeam(width, height)
            );
        };

        updateCanvasSize();
        window.addEventListener("resize", updateCanvasSize);

        const resetBeam = (beam, index) => {
            beam.y = height + 100;
            beam.x = Math.random() * width;
            beam.width = 40 + Math.random() * 60;
            beam.speed = 0.4 + Math.random() * 0.3;
            beam.hue = 190 + (index * 70) / MINIMUM_BEAMS;
            beam.opacity = 0.1 + Math.random() * 0.1;
            return beam;
        };

        const drawBeam = (ctx, beam) => {
            ctx.save();
            ctx.translate(beam.x, beam.y);
            ctx.rotate((beam.angle * Math.PI) / 180);

            const pulsingOpacity =
                beam.opacity *
                (0.8 + Math.sin(beam.pulse) * 0.2) *
                opacityMap[intensity];

            const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);
            gradient.addColorStop(0, `hsla(${beam.hue}, 85%, 65%, 0)`);
            gradient.addColorStop(0.1, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity * 0.5})`);
            gradient.addColorStop(0.4, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`);
            gradient.addColorStop(0.6, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`);
            gradient.addColorStop(0.9, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity * 0.5})`);
            gradient.addColorStop(1, `hsla(${beam.hue}, 85%, 65%, 0)`);

            ctx.fillStyle = gradient;
            ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
            ctx.restore();
        };

        let lastTime = 0;
        const frameInterval = 1000 / 30; // target ~30fps

        const animate = (timestamp) => {
            if (timestamp - lastTime < frameInterval) {
                animationFrameRef.current = requestAnimationFrame(animate);
                return;
            }
            lastTime = timestamp;

            ctx.clearRect(0, 0, width, height);
            ctx.filter = "blur(8px)"; // reduced from 35px

            beamsRef.current.forEach((beam, index) => {
                beam.y -= beam.speed;
                beam.pulse += beam.pulseSpeed;

                if (beam.y + beam.length < -100) {
                    resetBeam(beam, index);
                }

                drawBeam(ctx, beam);
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("resize", updateCanvasSize);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [intensity]);

    return (
        <div className={`relative min-h-screen w-full overflow-hidden bg-neutral-950 ${className}`}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0"
                style={{ filter: "blur(5px)" }} // lower canvas blur
            />
        </div>
    );
}
