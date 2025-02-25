import React, { useState, useEffect } from "react";
import Fibonacci from "./components/Fibonacci";
import components from "./constants/components";
import MandelbrotWASM from "./components/MandelbrotWASM";
import module from "./wasm/functions"; // Указывает на functions.wasm
import Primes from "./components/Primes";
import GaussianBlur from "./components/GaussianBlurWASM";
import Particles from "./components/Particles";

function App() {
  const [page, setPage] = useState(0);
  const [wasmModule, setWasmModule] = useState(null);

  useEffect(() => {
    const loadWASM = async () => {
      try {
        const Module = await module(); // Загружаем WASM один раз
        if (!Module.HEAPU8) {
          throw new Error("HEAPU8 is not defined");
        }
        console.log("WASM Module loaded:", Module);
        setWasmModule(Module);
      } catch (e) {
        console.error("Error loading WASM:", e);
      }
    };

    loadWASM();
  }, []);

  const chooseComponent = () => {
    switch (page) {
      case 0:
        return <Fibonacci module={wasmModule} />;
      case 1:
        return <MandelbrotWASM module={wasmModule} />;
      case 2:
        return <Primes module={wasmModule} />;
      case 3:
        return <GaussianBlur module={wasmModule} />;
      case 4:
        return <Particles module={wasmModule} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <p>Choose component to render:</p>
      <select
        onChange={(event) => {
          setPage(+event.target.value);
        }}
      >
        {Object.entries(components).map((c) => (
          <option key={`component${c[0]}`} value={c[0]}>
            {c[1]}
          </option>
        ))}
      </select>
      <div>{wasmModule ? chooseComponent() : <p>Loading WASM...</p>}</div>
    </div>
  );
}

export default App;