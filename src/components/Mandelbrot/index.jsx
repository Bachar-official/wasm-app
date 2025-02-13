import React, { useEffect, useRef } from 'react';
import module from '../../wasm/mandelbrot';

function mandelbrotJS(width, height, maxIterations) {
            const output = new Uint8Array(width * height * 4);
            for (let py = 0; py < height; py++) {
                for (let px = 0; px < width; px++) {
                    let x0 = (px / width) * 3.5 - 2.5;
                    let y0 = (py / height) * 2.0 - 1.0;
                    let x = 0;
                    let y = 0;
                    let iteration = 0;
        
                    while (x * x + y * y <= 4 && iteration < maxIterations) {
                        const xtemp = x * x - y * y + x0;
                        y = 2 * x * y + y0;
                        x = xtemp;
                        iteration++;
                    }
        
                    const color = iteration === maxIterations ? 0 : (iteration * 255 / maxIterations);
                    const index = (py * width + px) * 4;
                    output[index] = color;     // R
                    output[index + 1] = color; // G
                    output[index + 2] = color; // B
                    output[index + 3] = 255;   // A
                }
            }
            return output;
        }

const MandelbrotWASM = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                const width = canvas.width;
                const height = canvas.height;
                const imageData = ctx.createImageData(width, height);
                const bufferSize = width * height * 4;
                const start = performance.now();
                const output = mandelbrotJS(width, height, 1000);
                console.log(`JS Time: ${performance.now() - start}ms`);
                imageData.data.set(output);
                ctx.putImageData(imageData, 0, 0);
    }, []);

    return <canvas ref={canvasRef} width={1024} height={768} />;
};

export default MandelbrotWASM;