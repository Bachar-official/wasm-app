function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

function mandelbrot(x, y, maxIter) {
    let r = x;
    let i = y;
    for (let a = 0; a < maxIter; a++) {
        let tmpr = r * r - i * i + x;
        let tmpi = 2 * r * i + y;

        r = tmpr;
        i = tmpi;

        if (r * i > 5) {
            return a / maxIter * 100;
        }
    }

    return 0;
}

export { fibonacci, mandelbrot };