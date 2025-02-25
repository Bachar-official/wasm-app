import React, { useState } from 'react';
import { getPrimes } from '../../utils/functions';

const COUNT = 1000;

const Primes = ({ module }) => {
    const [primes, setPrimes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [time, setTime] = useState({ js: 0, wasm: 0 });

    const calculateJS = async () => {
        setLoading(true);
        const start = performance.now();
        const primes = await getPrimes(COUNT);
        setTime({ ...time, js: performance.now() - start });
        setPrimes(primes);
        setLoading(false);
    }

    const calculateWASM = () => {
        setLoading(true);
        const outputPtr = module._malloc(COUNT * 4);
        const start = performance.now();
        module._get_primes(COUNT, outputPtr);
        setTime({ ...time, wasm: performance.now() - start });
        const primes = new Uint32Array(module.HEAPU8.buffer, outputPtr, COUNT);
        setPrimes(Array.from(primes));
        module._free(outputPtr);
        setLoading(false);
    }

    return (loading ? <p>Loading...</p> :
        <div>
            <p>Время JS: {time.js} мс | WASM: {time.wasm} мс</p>
            <button onClick={calculateJS}>JS</button>
            <button onClick={calculateWASM}>WASM</button>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {primes.map((e) => <p key={`num${e}`}>{e}|</p>)}
            </div>
        </div>
    );
};

export default Primes;