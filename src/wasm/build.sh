#!/bin/bash
emcc functions.c -s WASM=1 -s EXPORTED_FUNCTIONS="['_fibonacci']" -o functions.js
emcc mandelbrot.c -o mandelbrot.js -s MODULARIZE=1 -O3 -s WASM=1 -s ENVIRONMENT=web -s EXPORTED_FUNCTIONS="['_mandelbrot', '_malloc', '_free']" 