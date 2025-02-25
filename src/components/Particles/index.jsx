import React, { useState, useEffect, useRef } from "react";
import { updateParticlesJS } from "../../utils/functions";

const WIDTH = 800;
const HEIGHT = 600;
const PARTICLE_COUNT = 10000;

function Particles({ module }) {
    const canvasRef = useRef(null);
    const [fps, setFps] = useState(0);
    const particlesRef = useRef(null);
    const wasmBufferPtrRef = useRef(null);
    const rafRef = useRef(null);
    const runningRef = useRef(null);
    const lastFrameTimeRef = useRef(0);
    const frameCountRef = useRef(0);
  
    const initParticles = () => {
      const particles = new Float32Array(PARTICLE_COUNT * 4);
      for (let i = 0; i < PARTICLE_COUNT * 4; i += 4) {
        particles[i] = Math.random() * WIDTH;
        particles[i + 1] = Math.random() * HEIGHT;
        particles[i + 2] = (Math.random() - 0.5) * 100;
        particles[i + 3] = (Math.random() - 0.5) * 100;
      }
      particlesRef.current = particles;
  
      if (module && !wasmBufferPtrRef.current) {
        wasmBufferPtrRef.current = module._malloc(PARTICLE_COUNT * 4 * 4);
        module.HEAPF32.set(particles, wasmBufferPtrRef.current / 4);
      }
    };
  
    const clearCanvas = (ctx) => {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
    };
  
    const drawParticles = (ctx, particles) => {
      ctx.fillStyle = "white";
      for (let i = 0; i < PARTICLE_COUNT * 4; i += 4) {
        ctx.beginPath();
        ctx.arc(particles[i], particles[i + 1], 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    };
  
    const calculateFps = (timestamp) => {
      frameCountRef.current++;
      const delta = timestamp - lastFrameTimeRef.current;
      if (delta >= 1000) {
        setFps(Math.round((frameCountRef.current * 1000) / delta));
        frameCountRef.current = 0;
        lastFrameTimeRef.current = timestamp;
      }
    };
  
    const animate = (timestamp) => {
      if (!canvasRef.current || !particlesRef.current) return;
  
      const ctx = canvasRef.current.getContext("2d");
      const dt = 0.016;
  
      clearCanvas(ctx);
  
      if (runningRef.current === "js") {
        updateParticlesJS(particlesRef.current, PARTICLE_COUNT, dt);
      } else if (runningRef.current === "wasm" && module?._update_particles) {
        module._update_particles(wasmBufferPtrRef.current, PARTICLE_COUNT, dt);
        particlesRef.current.set(
          module.HEAPF32.subarray(
            wasmBufferPtrRef.current / 4,
            wasmBufferPtrRef.current / 4 + PARTICLE_COUNT * 4
          )
        );
      }
  
      drawParticles(ctx, particlesRef.current);
      calculateFps(timestamp);
  
      if (runningRef.current) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
  
    const startJS = () => {
      if (!particlesRef.current) initParticles();
      runningRef.current = "js";
      lastFrameTimeRef.current = performance.now();
      frameCountRef.current = 0;
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
  
    const startWASM = () => {
      if (!module?._update_particles) {
        console.error("WASM module not loaded or missing update_particles");
        return;
      }
      if (!particlesRef.current) initParticles();
      runningRef.current = "wasm";
      lastFrameTimeRef.current = performance.now();
      frameCountRef.current = 0;
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
  
    const stop = () => {
      runningRef.current = null;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setFps(0);
      if (canvasRef.current) {
        clearCanvas(canvasRef.current.getContext("2d"));
      }
    };
  
    useEffect(() => {
      return () => {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
        if (module && wasmBufferPtrRef.current) {
          module._free(wasmBufferPtrRef.current);
          wasmBufferPtrRef.current = null;
        }
      };
    }, [module]);
  
    return (
      <div style={{ textAlign: "center" }}>
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          style={{ background: "black" }}
        />
        <div style={{ marginTop: "10px" }}>
          <button onClick={startJS} disabled={runningRef.current === "js"}>
            Start JS
          </button>
          <button
            onClick={startWASM}
            disabled={runningRef.current === "wasm" || !module}
          >
            Start WASM
          </button>
          <button onClick={stop} disabled={!runningRef.current}>
            Stop
          </button>
        </div>
        <p>FPS: {fps}</p>
        {runningRef.current && <p>Running: {runningRef.current.toUpperCase()}</p>}
      </div>
    );
  }

export default Particles;