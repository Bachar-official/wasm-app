#!/bin/bash
emcc functions.c -o functions.js \
    -s MODULARIZE=1 \
    -O3 \
    -s WASM=1 \
    -s ENVIRONMENT=web \
    -s EXPORTED_FUNCTIONS="['_mandelbrot', '_fibonacci', '_get_primes', '_gaussian_blur', '_update_particles', '_create_divs', '_malloc', '_free']" \
    -s EXPORTED_RUNTIME_METHODS="['cwrap', 'ccall']"