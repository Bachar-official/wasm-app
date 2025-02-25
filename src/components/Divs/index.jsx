import React, { useState } from 'react';
import { createDivsJS } from '../../utils/functions';

function Divs({ module }) {
    const [time, setTime] = useState({js: 0, wasm: 0});

    const run = (isWasm) => {
        const container = document.getElementById('container');
        container.innerHTML = ''; // Очистка контейнера перед тест

        const start = performance.now();

        if (isWasm) {
            module._create_divs(); // Вызов WASM-функции
        } else {
            createDivsJS(); // Вызов JavaScript-функции
        }
        const end = performance.now();

        if (isWasm) {
            setTime({...time, wasm: end - start});
        } else {
            setTime({...time, js: end - start});
        }
    }

    return (
        <div style={{textAlign: 'center'}}>
            <p>Создать 10,000 DIVов</p>
            <p>Time (JS): {time.js.toFixed(2)} ms | Time (WASM): {time.wasm.toFixed(2)} ms</p>
            <button onClick={() => run(false)}>
                JS
            </button>
            <button onClick={() => run(true)}>
                WASM
            </button>
            <div id="container" style={{ position: 'relative', width: '1500px', height: '1500px' }}></div>
        </div>
    );
}

export default Divs;