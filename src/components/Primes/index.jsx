import React, { useState } from 'react';
import { getPrimes } from '../../utils/functions';

const COUNT = 1000;

const Primes = ({ module }) => {
    const [primes, setPrimes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [perf, setPerf] = useState(0);

    const calculateJS = async () => {
        setLoading(true);
        const start = performance.now();
        const primes = await getPrimes(COUNT);
        setPerf(performance.now() - start);
        setPrimes(primes);
        setLoading(false);
    }

    const calculateWASM = () => {
        setLoading(true);
        const outputPtr = module._malloc(COUNT * 4);
        const start = performance.now();
        module._get_primes(COUNT, outputPtr);
        setPerf(performance.now() - start);
        const primes = new Uint32Array(module.HEAPU8.buffer, outputPtr, COUNT);
        setPrimes(Array.from(primes));
        module._free(outputPtr);        
        setLoading(false);
    }

    return (loading ? <p>Loading...</p> :
        <div>
            <p>Prime numbers component</p>
            <p>Result got in {perf} ms</p>
            <button onClick={calculateJS}>Calculate in JS</button>
            <button onClick={calculateWASM}>Calculate in WASM</button>
            {primes.map((e) => <p key={`num${e}`}>{e}</p>)}
        </div>
    );
};

export default Primes;