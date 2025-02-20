import React, { useEffect, useRef } from "react";

const RaycastingWASM = ({ module }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!module || !canvasRef.current) return;

    const width = 800;
    const height = 600;
    const channels = 4;
    const ctx = canvasRef.current.getContext("2d");
    const imageData = ctx.createImageData(width, height);
    const bufferSize = width * height * channels;
    const bufferPtr = module._malloc(bufferSize);

    let player = { x: 5, y: 5, angle: 0 };
    let animationFrameId;

    const renderLoop = () => {
      console.log("Rendering frame with angle:", player.angle.toFixed(4));
      const start = performance.now();
      module._render(bufferPtr, width, height, player.x, player.y, player.angle);
      console.log(`Raycasting WASM Time: ${performance.now() - start}ms`);

      const output = new Uint8Array(module.HEAPU8.buffer, bufferPtr, bufferSize);
      imageData.data.set(output);
      ctx.putImageData(imageData, 0, 0);

      // Плавное увеличение угла с нормализацией в [0, 2π]
      player.angle += 0.02;
      while (player.angle >= Math.PI * 2) player.angle -= Math.PI * 2; // Плавное обнуление
      while (player.angle < 0) player.angle += Math.PI * 2; // Убедимся, что угол положительный

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    // Очистка памяти и анимации
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      module._free(bufferPtr);
    };
  }, [module]);

  return (
    <div>
      <h2>Raycasting (WASM) - Rotation Inside Cube</h2>
      <canvas ref={canvasRef} width={800} height={600} />
    </div>
  );
};

export default RaycastingWASM;