/* global self */
import { fibonacci, mandelbrot } from '../utils/functions';

let wasmInstance;

const loadWasm = async () => {
    try {
        const module = await import('../wasm/functions.wasm');
        const response = await fetch(module.default);
        const buffer = await response.arrayBuffer();
        const { instance } = await WebAssembly.instantiate(buffer);
        wasmInstance = instance;
        console.info('WASM module loaded');
    } catch(err) {
        console.error('WASM load failed');
    }
    
}

loadWasm();

// eslint-disable-next-line no-restricted-globals
self.onmessage = async (event) => {
    const { functionName, args, isWasm } = event.data;
    let result;

    switch(functionName) {
        case 'fibonacci': result = isWasm ? wasmInstance.exports.fibonacci(args[0]) : fibonacci(args[0]); break;
        case 'mandelbrot': result = isWasm ? wasmInstance.exports.mandelbrot(args[0], args[1], args[2]) : mandelbrot(args[0], args[1], args[2]); break;
        default: result = 0;
    }

    // eslint-disable-next-line no-restricted-globals
    self.postMessage(result);
};