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

const mandelbrot = (x, y, maxIter) => {
    let real = x;
    let imag = y;
    let n = 0;

    while (n < maxIter) {
        const real2 = real * real;
        const imag2 = imag * imag;

        if (real2 + imag2 > 4) break;

        imag = 2 * real * imag + y;
        real = real2 - imag2 + x;
        n++;
    }

    return n;
};

export { fibonacci, mandelbrot };