import React, { useState } from 'react';
import { fibonacci } from '../../utils/functions';

const ARGUMENT = 100000;

const Fibonacci = ({ module }) => {
    const [result, setResult] = useState(0);
    const [loading, setLoading] = useState(false);
    const [time, setTime] = useState({ js: 0, wasm: 0 });

    const getResult = async (isWasm) => {
        setLoading(true);
        const start = performance.now();
        const result = isWasm ? module._fibonacci(ARGUMENT) : fibonacci(ARGUMENT);
        const end = performance.now();
        setResult(result);
        setLoading(false);
        if (isWasm) {
            setTime({ ...time, wasm: end - start });
        } else {
            setTime({ ...time, js: end - start });
        }
    }

    return loading ? <div>Loading...</div> : <div>
        <p>Fibonacci calculation</p>
        <p>Result is {result}</p>
        <p>Time (JS) : {time.js} ms | Time (WASM) : {time.wasm} ms</p>
        <button onClick={() => getResult(false)}>Classic</button>
        <button onClick={() => getResult(true)}>WASM</button>
    </div>;
}

export default Fibonacci;



