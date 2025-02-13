import React, { useEffect, useRef } from 'react';
import { mandelbrotJS } from '../../utils/functions';

const MandelbrotJS = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                const width = canvas.width;
                const height = canvas.height;
                const imageData = ctx.createImageData(width, height);
                const bufferSize = width * height * 4;
                const start = performance.now();
                const output = mandelbrotJS(width, height, 100);
                console.log(`JS Time: ${performance.now() - start}ms`);
                imageData.data.set(output);
                ctx.putImageData(imageData, 0, 0);
    }, []);

    return <canvas ref={canvasRef} width={1024} height={768} />;
};

export default MandelbrotJS;