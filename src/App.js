import React, { useState } from 'react';
import Fibonacci from './components/Fibonacci';
import components from './constants/components';
import Mandelbrot from './components/Mandelbrot';
import MandelbrotWASM from './components/MandelbrotWASM';
import { terminateWorker } from './worker/workerService';

function App() {
  
  const [page, setPage] = useState(0);

  const chooseComponent = () => {
    switch(page) {
      case 0: return <Fibonacci />;
      case 1: return <Mandelbrot />;
      case 2: return <MandelbrotWASM />;
      default: return null;
    }
  }
  return (
    <div>
      <p>Choose component to render:</p>
      <select onChange={(event) => {
        terminateWorker();
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
