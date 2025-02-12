#!/bin/bash
emcc functions.c -s WASM=1 -s EXPORTED_FUNCTIONS="['_fibonacci', '_mandelbrot']" -o functions.js