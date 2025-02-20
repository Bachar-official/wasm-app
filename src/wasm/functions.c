#include <stdint.h>
#include <stdlib.h>
#include <emscripten.h>
#include <stdio.h>
#include <math.h> // Для render (sin, cos)

// Твои существующие функции
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

// Мой пример 1: Gaussian Blur
EMSCRIPTEN_KEEPALIVE
void gaussian_blur(uint8_t* pixels, int width, int height, int channels) {
    uint8_t* temp = (uint8_t*)malloc(width * height * channels * sizeof(uint8_t));
    float kernel[9] = {1, 2, 1, 2, 4, 2, 1, 2, 1}; // Упрощенный Gaussian kernel 3x3
    float kernel_sum = 16.0;

    for (int y = 1; y < height - 1; y++) {
        for (int x = 1; x < width - 1; x++) {
            for (int c = 0; c < channels; c++) {
                float sum = 0;
                for (int ky = -1; ky <= 1; ky++) {
                    for (int kx = -1; kx <= 1; kx++) {
                        sum += pixels[((y + ky) * width + (x + kx)) * channels + c] * kernel[(ky + 1) * 3 + (kx + 1)];
                    }
                }
                temp[(y * width + x) * channels + c] = (uint8_t)(sum / kernel_sum);
            }
        }
    }
    for (int i = 0; i < width * height * channels; i++) {
        pixels[i] = temp[i];
    }
    free(temp);
}

// Мой пример 3: Raycasting (DOOM-like рендеринг)

EMSCRIPTEN_KEEPALIVE
void render(uint8_t* buffer, int width, int height, float playerX, float playerY, float playerAngle) {
    for (int x = 0; x < width; x++) {
        // Вычисляем угол луча
        float rayAngle = playerAngle - 0.5 + (float)x / width;
        float distance = 0;
        float hitX = playerX, hitY = playerY;

        // Простая комната: стены на расстоянии 5 единиц (куб 10x10)
        while (distance < 10) {
            hitX = playerX + distance * cos(rayAngle);
            hitY = playerY + distance * sin(rayAngle);
            if (hitX < 0 || hitX > 10 || hitY < 0 || hitY > 10) break;
            // Стены на границах комнаты (x=0, x=10, y=0, y=10)
            if (hitX < 0.1 || hitX > 9.9 || hitY < 0.1 || hitY > 9.9) break;
            distance += 0.05; // Точный шаг для плавности
        }

        // Вычисляем высоту стены с учетом расстояния
        int wallHeight = (int)(height / (distance * 0.5));
        // Эффект теней: интенсивность зависит от угла относительно источника света
        float lightAngle = 0; // Источник света прямо перед игроком (angle = 0)
        float angleDiff = fabs(rayAngle - lightAngle);
        float shadowIntensity = 1.0 - (angleDiff * 0.5); // Тени сильнее при большем угле
        if (shadowIntensity < 0.2) shadowIntensity = 0.2; // Минимальная яркость

        for (int y = 0; y < height; y++) {
            int index = (y * width + x) * 4;
            if (y < (height - wallHeight) / 2 || y > (height + wallHeight) / 2) {
                // Пол и потолок с градиентом света
                float floorCeilingIntensity = y < height / 2 ? 
                    (height / 2 - y) / (float)(height / 2) : // Пол (светлее ближе к центру)
                    (y - height / 2) / (float)(height / 2);  // Потолок (светлее ближе к центру)
                uint8_t floorColor = (uint8_t)(100 * floorCeilingIntensity); // Более яркий серый свет
                buffer[index] = floorColor;     // R
                buffer[index + 1] = floorColor; // G
                buffer[index + 2] = floorColor; // B (светлый серый пол)
            } else {
                // Стены (красные с тенями)
                uint8_t intensity = (uint8_t)(255 * shadowIntensity); // Ярко-красные стены
                buffer[index] = intensity;     // R
                buffer[index + 1] = 0;         // G
                buffer[index + 2] = 0;         // B
            }
            buffer[index + 3] = 255; // Альфа-канал
        }
    }
}