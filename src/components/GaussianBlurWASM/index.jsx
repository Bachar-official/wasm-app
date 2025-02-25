import React, { useRef, useState } from "react";
import { gaussianBlurJS } from "../../utils/functions";

const GaussianBlur = ({ module }) => {
  const canvasRef = useRef(null);
  const [blurType, setBlurType] = useState(null); // 'js' или 'wasm'
  const [time, setTime] = useState({ js: 0, wasm: 0 });

  const applyBlurJS = () => {
    if (!canvasRef.current) return;

    const width = 800;
    const height = 600;
    const ctx = canvasRef.current.getContext("2d");
    const imageData = ctx.createImageData(width, height);

    // Заполняем холст случайным шумом
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = Math.random() * 255;     // R
      imageData.data[i + 1] = Math.random() * 255; // G
      imageData.data[i + 2] = Math.random() * 255; // B
      imageData.data[i + 3] = 255;                 // A
    }

    const start = performance.now();
    gaussianBlurJS(imageData.data, width, height);
    const end = performance.now();

    setTime((prev) => ({ ...prev, js: end - start }));
    ctx.putImageData(imageData, 0, 0);
    setBlurType("js");
  };

  const applyBlurWASM = () => {
    if (!module || !canvasRef.current) return;

    const width = 800;
    const height = 600;
    const channels = 4;
    const ctx = canvasRef.current.getContext("2d");
    const imageData = ctx.createImageData(width, height);

    // Заполняем холст случайным шумом
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = Math.random() * 255;     // R
      imageData.data[i + 1] = Math.random() * 255; // G
      imageData.data[i + 2] = Math.random() * 255; // B
      imageData.data[i + 3] = 255;                 // A
    }

    const bufferSize = width * height * channels;
    const bufferPtr = module._malloc(bufferSize);

    // Копируем данные в WASM
    module.HEAPU8.set(imageData.data, bufferPtr);

    const start = performance.now();
    module._gaussian_blur(bufferPtr, width, height, channels);
    const end = performance.now();

    // Копируем результат обратно
    imageData.data.set(module.HEAPU8.subarray(bufferPtr, bufferPtr + bufferSize));
    module._free(bufferPtr);

    setTime((prev) => ({ ...prev, wasm: end - start }));
    ctx.putImageData(imageData, 0, 0);
    setBlurType("wasm");
  };

  return (
    <div>
      <canvas ref={canvasRef} width={800} height={600} />
      <div style={{ marginTop: "10px" }}>
        <button onClick={applyBlurJS} disabled={blurType === "js"}>
          JS
        </button>
        <button onClick={applyBlurWASM} disabled={blurType === "wasm"}>
          WASM
        </button>
        <p>
          Время JS: {time.js.toFixed(2)}мс | WASM: {time.wasm.toFixed(2)}мс
        </p>
      </div>
      {blurType && <p>Применено размытие: {blurType.toUpperCase()}</p>}
    </div>
  );
};

export default GaussianBlur;