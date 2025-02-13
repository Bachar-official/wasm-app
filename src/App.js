import React, { useState, useEffect } from 'react';
import Fibonacci from './components/Fibonacci';
import components from './constants/components';
import Mandelbrot from './components/Mandelbrot';
import MandelbrotWASM from './components/MandelbrotWASM';
import module from './wasm/functions'

function App() {

  const [page, setPage] = useState(0);
  const [wasmModule, setWasmModule] = useState(null);

  useEffect(() => {
    const loadWASM = async () => {
      try {
        const Module = await module();
        if (!Module.HEAPU8) {
          throw new Error('HEAPU8 is not defined');
        }
        setWasmModule(Module);
        console.info('WASM loaded!');
      } catch (e) {
        console.error('Error loading WASM:', e);
      }
      const Module = await module();
      if (!Module.HEAPU8) {
        throw new Error('HEAPU8 is not defined');
      }
    }

    loadWASM();
  }, []);

  const chooseComponent = () => {
    switch (page) {
      case 0: return <Fibonacci module={wasmModule} />;
      case 1: return <Mandelbrot />;
      case 2: return <MandelbrotWASM module={wasmModule} />;
      default: return null;
    }
  }
  return (
    <div>
      <p>Choose component to render:</p>
      <select onChange={(event) => {
        setPage(+event.target.value);
      }}>
        {Object.entries(components).map((c) => (<option key={`component${c[0]}`} value={c[0]}>{c[1]}</option>))}
      </select>
      <div>
        {chooseComponent()}
      </div>

    </div>
  );
}

export default App;
