let worker;

export const initWorker = () => {
    worker = new Worker(new URL('./worker.js', import.meta.url));
    return worker;
}

export const calculate = (functionName, args, isWasm) => {
    return new Promise((resolve) => {
        worker.onmessage = (event) => resolve(event.data);
        worker.postMessage({functionName, args, isWasm});
    });
};

export const terminateWorker = () => {
    if (worker) {
        worker.terminate();
        worker = null;
    }
};