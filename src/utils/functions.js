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

function mandelbrot(x, y, maxIter) {
    let real = 0; // Начальное значение для действительной части
    let imag = 0; // Начальное значение для мнимой части
    let n;

    for (n = 0; n < maxIter; n++) {
        const r2 = real * real; // Квадрат действительной части
        const i2 = imag * imag;  // Квадрат мнимой части

        if (r2 + i2 > 4) break; // Проверка выхода

        imag = 2 * real * imag + y; // Обновление мнимой части
        real = r2 - i2 + x;          // Обновление действительной части
    }

    return n; // Возвращаем количество итераций
}

export { fibonacci, mandelbrot };