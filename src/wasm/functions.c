#include <stdint.h>
#include <stdlib.h>
#include <emscripten.h>
#include <stdio.h>
#include <math.h>

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

EMSCRIPTEN_KEEPALIVE
void gaussian_blur(uint8_t* pixels, int width, int height, int channels) {
    uint8_t* temp = (uint8_t*)malloc(width * height * channels * sizeof(uint8_t));
    float kernel[9] = {1, 2, 1, 2, 4, 2, 1, 2, 1};
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

EMSCRIPTEN_KEEPALIVE
void update_particles(float* particles, int count, float dt) {
  // Обновление позиций
  for (int i = 0; i < count * 4; i += 4) {
    particles[i] += particles[i + 2] * dt;   // x += vx * dt
    particles[i + 1] += particles[i + 3] * dt; // y += vy * dt
    if (particles[i] < 0 || particles[i] > 800) particles[i + 2] *= -1;
    if (particles[i + 1] < 0 || particles[i + 1] > 600) particles[i + 3] *= -1;
  }

  // Проверка столкновений (O(n^2) для наглядности)
  for (int i = 0; i < count * 4; i += 4) {
    for (int j = i + 4; j < count * 4; j += 4) {
      float dx = particles[i] - particles[j];
      float dy = particles[i + 1] - particles[j + 1];
      float dist = sqrtf(dx * dx + dy * dy);
      if (dist < 4.0f) { // Радиус частицы = 2, столкновение при расстоянии < 4
        // Меняем скорости (упрощённый отскок)
        float temp_vx = particles[i + 2];
        float temp_vy = particles[i + 3];
        particles[i + 2] = particles[j + 2];
        particles[i + 3] = particles[j + 3];
        particles[j + 2] = temp_vx;
        particles[j + 3] = temp_vy;
      }
    }
  }
}

EMSCRIPTEN_KEEPALIVE
void create_divs() {
    for (int i = 0; i < 10000; i++) {
        char script[256];
        sprintf(script, "let d = document.createElement('div'); d.style.width = '10px'; d.style.height = '10px'; d.style.background = 'hsl(%d, 50%%, 50%%)'; d.style.position = 'absolute'; d.style.left = '%dpx'; d.style.top = '%dpx'; document.getElementById('container').appendChild(d);", i % 360, (i % 100) * 15, (i / 100) * 15);
        emscripten_run_script(script);
    }
}