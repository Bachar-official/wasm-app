#include <stdint.h>
#include <stdlib.h>
#include <emscripten.h>
#include <stdio.h>

EMSCRIPTEN_KEEPALIVE
void mandelbrot(int width, int height, int max_iterations, uint8_t* output) {
    for (int py = 0; py < height; py++) {
        for (int px = 0; px < width; px++) {
            double x0 = (px / (double)width) * 3.5 - 2.5;
            double y0 = (py / (double)height) * 2.0 - 1.0;
            double x = 0.0;
            double y = 0.0;
            int iteration = 0;

            while (x * x + y * y <= 4.0 && iteration < max_iterations) {
                double xtemp = x * x - y * y + x0;
                y = 2.0 * x * y + y0;
                x = xtemp;
                iteration++;
            }

            uint8_t color = iteration == max_iterations ? 0 : (iteration * 255 / max_iterations);
            int index = (py * width + px) * 4;
            output[index] = color;     // R
            output[index + 1] = color; // G
            output[index + 2] = color; // B
            output[index + 3] = 255;   // A
        }
    }
}

EMSCRIPTEN_KEEPALIVE
double fibonacci(int n) {
    if (n <= 1) return n;
    double a = 0, b = 1, c;

    for (int i = 2; i <= n; i++) {
        c = a + b;
        a = b;
        b = c;
    }

    return b;
}

int is_prime(int num) {
    if (num <= 1) return 0;
    for (int i = 2; i * i <= num; i++) {
        if (num % i == 0) return 0;
    }
    return 1;
}

EMSCRIPTEN_KEEPALIVE
void get_primes(int n, uint32_t* primes) {
    int count = 0;
    int candidate = 2;

    while (count < n) {
        if (is_prime(candidate)) {
            primes[count++] = candidate;
        }
        candidate++;
    }
}