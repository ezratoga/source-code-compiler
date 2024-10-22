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
import { compileCode } from "./api";
import { Output } from "./components/Output";
import './App.css';
import { basicSyntax } from "./helper/constant";

function App() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  const handleOption = async (event) => {
    const value = event.target.value;
    setLanguage(value);
    setCode(basicSyntax[value] || '// Write your code here');
  };

  const handleCompile = async () => {
    const result = await compileCode(language, code);
    setOutput(result?.run?.output);
  };

  const resetOutput = async () => {
    setOutput('');
  }

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
      <Output output={output} />
    </div>
  );
}

export default App;
