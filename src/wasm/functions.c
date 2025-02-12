double fibonacci(int n) {
  if (n <= 0) return 0;
  if (n == 1) return 1;

  double a = 0, b = 1, c;

  for (int i = 2; i <= n; i++) {
      c = a + b;
      a = b;
      b = c;
  }

  return b;
}

float mandelbrot(float x, float y, int maxIter) {
    float real = x;
    float imag = y;
    float n = 0;

    while(n < maxIter) {
      float r2 = real * real;
      float i2 = imag * imag;

      if (r2 + i2 > 4) break;

      imag = 2 * real * imag + y;
      real = r2 - i2 + x;
      n++;
    }

    return n;
}