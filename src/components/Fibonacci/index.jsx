import React, { useState } from 'react';
import { fibonacci } from '../../utils/functions';

const Fibonacci = ({ module }) => {
    const [result, setResult] = useState(0);
    const [loading, setLoading] = useState(false);
    const [time, setTime] = useState({ js: 0, wasm: 0 });
    const [ARGUMENT, SET_ARGUMENT] = useState(1);

    const setMember = (event) => {
            SET_ARGUMENT(event.target.value);
    }

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

    return loading ? <div>Loading...</div> : <div style={{textAlign: 'center'}}>
        <p>Введите номер члена ряда Фибоначчи:</p>
        <input onChange={setMember} value={ARGUMENT} type="number"/>
        <p>Результат: {result}</p>
        <p>Время JS : {time.js} мс | WASM : {time.wasm} мс</p>
        <button onClick={() => getResult(false)}>JS</button>
        <button onClick={() => getResult(true)}>WASM</button>
    </div>;
}

export default Fibonacci;



