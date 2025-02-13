import React, { useState } from 'react';
import { fibonacci } from '../../utils/functions';

const ARGUMENT = 1000;

const Fibonacci = ({module}) => {
    const [result, setResult] = useState(0);
    const [loading, setLoading] = useState(false);
    const [perf, setPerf] = useState(0);

    const getResult = async (isWasm) => {
        setLoading(true);
        setPerf(0);
        const start = performance.now();
        const result = isWasm ? module._fibonacci(ARGUMENT) : fibonacci(ARGUMENT);
        const end = performance.now();
        setResult(result);
        setLoading(false);
        setPerf(end - start);
    }

    return loading ? <div>Loading...</div> : <div>
        <p>Fibonacci calculation</p>
        <p>Result is {result}</p>
        <p>Done in {perf} ms</p>
        <button onClick={() => getResult(false)}>Classic</button>
        <button onClick={() => getResult(true)}>WASM</button>
    </div>;
}

export default Fibonacci;



