import React, { useState, useEffect, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import io from 'socket.io-client';
import './OnlineCompiler.css';

const socket = io.connect('http://localhost:5000');

function OnlineCompiler() {
  const [code, setCode] = useState('// Write your code here');
  const [ioConsole, setIoConsole] = useState('');
  const [userInput, setUserInput] = useState('');
  const [language, setLanguage] = useState('python');
  const ioConsoleRef = useRef(null);

  useEffect(() => {
    // Listen for output from the backend
    socket.on('output', (data) => {
      setIoConsole((prev) => prev + data); // Append new data to ioConsole
    });

    return () => {
      socket.off('output');
    };
  }, []);

  const handleRunCode = () => {
    // Clear output, send code and language to backend
    socket.emit('runCode', { code, language });
    setIoConsole(''); // Clear output console on each run
    setUserInput(''); // Clear input on each run
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default newline behavior
      socket.emit('input', userInput); // Send input to backend
      setIoConsole((prev) => prev + userInput + '\n'); // Display input in console
      setUserInput(''); // Clear the input after sending
    }
  };

  const clearOutput = (event) => {
    setIoConsole('');
    setUserInput('');
  };

  return (
    <div className='right'>
      <h1>Online Compiler</h1>
      <select onChange={(e) => setLanguage(e.target.value)} value={language}>
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
        <option value="java">Java</option>
        <option value="c">C</option>
        <option value="cpp">C++</option>
        <option value="csharp">C#</option>
      </select>
      
      <button onClick={handleRunCode}>Run</button>
      <button onClick={clearOutput}>Clear</button>

      <div className='grid-container'>
      <MonacoEditor
        height="400px"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(newValue) => setCode(newValue)}
      />
      
      <textarea
        className='terminal'
        ref={ioConsoleRef}
        value={ioConsole + userInput} // Combine output and current input
        onKeyDown={handleKeyDown}     // Capture Enter key
        onChange={(e) => setUserInput(e.target.value.slice(ioConsole.length))} // Allow typing without affecting output
        rows="10"
        placeholder="Input/Output Console"
      />
      </div>
    </div>
  );
}

export default OnlineCompiler;
