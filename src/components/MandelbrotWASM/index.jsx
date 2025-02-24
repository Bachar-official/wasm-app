import React, { useState, useRef } from 'react';
import { mandelbrotJS } from '../../utils/functions';

const ITERATIONS = 100;

const MandelbrotWASM = ({ module }) => {
    const canvasRef = useRef(null);
    const [time, setTime] = useState({ js: 0, wasm: 0 });

    function loadWasm() {
        try {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;
            const imageData = ctx.createImageData(width, height);

            // Вычисляем размер буфера (4 байта на пиксель: RGBA)
            const bufferSize = width * height * 4;

            // Выделяем память в WASM
            const outputPtr = module._malloc(bufferSize);

            // Замеряем время выполнения
            const start = performance.now();
            module._mandelbrot(width, height, ITERATIONS, outputPtr);
            setTime({ ...time, wasm: performance.now() - start });

            // Копируем данные из памяти WASM в JavaScript
            const output = new Uint8Array(module.HEAPU8.buffer, outputPtr, bufferSize);

            // Копируем данные в imageData
            imageData.data.set(output);

            // Отображаем результат на canvas
            ctx.putImageData(imageData, 0, 0);

            // Освобождаем память
            module._free(outputPtr);
        } catch (error) {
            console.error('Error loading WASM:', error);
        }
    }

    function loadJs() {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const imageData = ctx.createImageData(width, height);
        const bufferSize = width * height * 4;
        const start = performance.now();
        const output = mandelbrotJS(width, height, ITERATIONS);
        setTime({ ...time, js: performance.now() - start })
        imageData.data.set(output);
        ctx.putImageData(imageData, 0, 0);
    }

    return <div>
        <div>
            Time (JS) : {time.js} ms | Time (WASM) : {time.wasm} ms
        </div>
        <div>
            <button onClick={loadJs}>JS</button>
            <button onClick={loadWasm}>WASM</button>
        </div>
        <canvas ref={canvasRef} width={1024} height={768} /></div>;
};

export default MandelbrotWASM;