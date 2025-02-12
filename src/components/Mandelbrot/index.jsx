import React, { useRef, useEffect } from 'react';

const WIDTH = 1024;
const HEIGHT = 768;
const MAX_ITER = 100;

const Mandelbrot = () => {
    const canvasRef = useRef(null);

    const drawMandelbrot = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(WIDTH, HEIGHT);
        const data = imageData.data;

        for (let x = 0; x < WIDTH; x++) {
            for (let y = 0; y < HEIGHT; y++) {
                let zx = 0;
                let zy = 0;
                let iteration = 0;
                const cx = (x / WIDTH) * 4 - 2; // масштабирование по оси X
                const cy = (y / HEIGHT) * 4 - 2; // масштабирование по оси Y

                while (zx * zx + zy * zy < 4 && iteration < MAX_ITER) {
                    const tmp = zx * zx - zy * zy + cx;
                    zy = 2 * zx * zy + cy;
                    zx = tmp;
                    iteration++;
                }

                const colorValue = iteration === MAX_ITER ? 0 : (iteration / MAX_ITER) * 255;
                const pixelIndex = (x + y * WIDTH) * 4;
                data[pixelIndex] = colorValue;     // Red
                data[pixelIndex + 1] = colorValue; // Green
                data[pixelIndex + 2] = colorValue; // Blue
                data[pixelIndex + 3] = 255;        // Alpha
            }
        }

        ctx.putImageData(imageData, 0, 0);
    };

    useEffect(() => {
        drawMandelbrot();
    }, [WIDTH, HEIGHT, MAX_ITER]);

    return <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />;
};

export default Mandelbrot;
