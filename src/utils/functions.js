function fibonacci(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;

    let a = 0, b = 1, c;

    for (let i = 2; i <= n; i++) {
        c = a + b;
        a = b;
        b = c;
    }

    return b;
}

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

export { fibonacci, mandelbrotJS };