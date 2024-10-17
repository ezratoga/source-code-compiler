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

function App() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

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

      <select onChange={(e) => setLanguage(e.target.value)} value={language}>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
      </select>

      <button onClick={handleCompile}>Compile & Run</button>
      <button onClick={resetOutput}>Clear Output</button>
      
      <CodeEditor language={language} onCodeChange={setCode} />
      {/* <h2>Output:</h2> */}
      <Output output={output} />
    </div>
  );
}

export default App;
