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

function isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) return false;
    }
    return true;
}

async function getPrimes(n) {
    const primes = [];
    let count = 0;
    let candidate = 2;

    while (count < n) {
        if (isPrime(candidate)) {
            primes.push(candidate);
            count++;
        }
        candidate++;
    }

    return Promise.resolve(primes);
}

// Функция Gaussian Blur для JS
const gaussianBlurJS = (pixels, width, height) => {
    const temp = new Uint8ClampedArray(pixels.length);
    const kernel = [1, 2, 1, 2, 4, 2, 1, 2, 1];
    const kernelSum = 16;

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            for (let c = 0; c < 4; c++) {
                let sum = 0;
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        sum += pixels[((y + ky) * width + (x + kx)) * 4 + c] * kernel[(ky + 1) * 3 + (kx + 1)];
                    }
                }
                temp[(y * width + x) * 4 + c] = sum / kernelSum;
            }
        }
    }
    pixels.set(temp);
};

const updateParticlesJS = (particles, count, dt) => {
    // Обновление позиций
    for (let i = 0; i < count * 4; i += 4) {
      particles[i] += particles[i + 2] * dt;   // x += vx * dt
      particles[i + 1] += particles[i + 3] * dt; // y += vy * dt
      if (particles[i] < 0 || particles[i] > 800) particles[i + 2] *= -1;
      if (particles[i + 1] < 0 || particles[i + 1] > 600) particles[i + 3] *= -1;
    }
  
    // Проверка столкновений
    for (let i = 0; i < count * 4; i += 4) {
      for (let j = i + 4; j < count * 4; j += 4) {
        const dx = particles[i] - particles[j];
        const dy = particles[i + 1] - particles[j + 1];
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 4.0) { // Радиус = 2, столкновение при расстоянии < 4
          const temp_vx = particles[i + 2];
          const temp_vy = particles[i + 3];
          particles[i + 2] = particles[j + 2];
          particles[i + 3] = particles[j + 3];
          particles[j + 2] = temp_vx;
          particles[j + 3] = temp_vy;
        }
      }
    }
  };

export { fibonacci, mandelbrotJS, getPrimes, gaussianBlurJS, updateParticlesJS };