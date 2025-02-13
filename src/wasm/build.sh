#!/bin/bash
emcc functions.c -o functions.js -s MODULARIZE=1 -O3 -s WASM=1 -s ENVIRONMENT=web -s EXPORTED_FUNCTIONS="['_mandelbrot', '_malloc', '_free', '_fibonacci']" 