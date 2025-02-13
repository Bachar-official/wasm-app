import React, { useEffect, useRef } from 'react';
import module from '../../wasm/mandelbrot';

const MandelbrotWASM = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const loadWASM = async () => {
            try {
                const Module = await module();
                if (!Module.HEAPU8) {
                    throw new Error('HEAPU8 is not defined');
                }
                const { _mandelbrot, _malloc, _free } = Module;
        
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                const width = canvas.width;
                const height = canvas.height;
                const imageData = ctx.createImageData(width, height);
        
                // Вычисляем размер буфера (4 байта на пиксель: RGBA)
                const bufferSize = width * height * 4;
        
                // Выделяем память в WASM
                const outputPtr = _malloc(bufferSize);
        
                // Замеряем время выполнения
                const start = performance.now();
                _mandelbrot(width, height, 1000, outputPtr);
                console.log(`WASM Time: ${performance.now() - start}ms`);
        
                // Копируем данные из памяти WASM в JavaScript
                const output = new Uint8Array(Module.HEAPU8.buffer, outputPtr, bufferSize);
        
                // Копируем данные в imageData
                imageData.data.set(output);
        
                // Отображаем результат на canvas
                ctx.putImageData(imageData, 0, 0);
        
                // Освобождаем память
                _free(outputPtr);
            } catch (error) {
                console.error('Error loading WASM:', error);
            }
        };

        loadWASM();
    }, []);

    return <canvas ref={canvasRef} width={1024} height={768} />;
};

export default MandelbrotWASM;