// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

// src/App.js
import React, { useState } from "react";
import CodeEditor from "./components/CodeEditor";
import { compileCode, handleIfAnynput } from "./api";
import { Output } from "./components/Output";
import './App.css';
import { basicSyntax } from "./helper/constant";

function App() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [input, setInput] = useState('');
  const [output, setOutput] = useState("");

  const handleOption = async (event) => {
    const value = event.target.value;
    setLanguage(value);
    setCode(basicSyntax[value] || '// Write your code here');
  };

  const handleCompile = async () => {
    const checkAnyInput = await handleIfAnynput(language, code, input);
    if (checkAnyInput) {
      setOutput(checkAnyInput);
    } else {
      const result = await compileCode(language, code, input);
      setOutput(result?.run?.output);
    }
  };

  const resetOutput = async () => {
    setOutput('');
  }

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      if (code) {
        handleCompile();
      }
      setInput('');
    }
  };

  return (
    <div className="App">
      <h1>Online Code Compiler</h1>

      <select onChange={(e) => handleOption(e)} value={language}>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="c">C</option>
        <option value="c++">C++</option>
        <option value="csharp.net">C#</option>
        <option value="java">Java</option>
      </select>

      <button onClick={handleCompile}>Compile & Run</button>
      <button onClick={resetOutput}>Clear Output</button>
      
      <CodeEditor language={language} onCodeChange={setCode} initial={code} />
      <div style={{ backgroundColor: '#000', color: '#0f0', padding: '20px', fontFamily: 'monospace', height: '100vh' }}>
        <Output output={output} input={input} />
        <form onSubmit={handleSubmit}>
          <span style={{ color: '#0ff' }}>&gt;</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              backgroundColor: 'black',
              color: 'lime',
              border: 'none',
              outline: 'none',
              width: '100%',
              paddingLeft: '5px',
            }}
            autoFocus
          />
        </form>
      </div>
    </div>
  );
}

export default App;
