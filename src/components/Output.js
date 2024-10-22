import { useEffect, useRef, useState } from "react";
import '../App.css'

export function Output({ output }) {
  const [displayedOutput, setDisplayedOutput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);  
  const [input, setInput] = useState("");
  const [isOutputAdded, setOutputAdded] = useState(false); // Flag to ensure static string is added only once
  const outputRef = useRef(null); // Reference to the output container

  useEffect(() => {
    if (currentIndex < output.length) {
      const timeout = setTimeout(() => {
        setDisplayedOutput((prev) => prev + output[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, output]);

  // Auto-scroll when new content is added
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [displayedOutput]);

  const handleInputChange = (e) => {
    if (output && !isOutputAdded && !e.target.value) setInput(output);
    if (!isOutputAdded && e.target.value) {
      setInput(`${output}${e.target.value}`);
      setOutputAdded(true);
    } else setInput(e.target.value)
  };

  // const handleKeyPress = (e) => {
  //   if (e.key === "Enter") {
  //     handleCompile(); // Run the code when Enter is pressed
  //   }
  // };

  return (
    <div className="output-container" ref={outputRef}>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        // onKeyUp={handleKeyPress}
        className="input-prompt"
      />
      <textarea
        value={input}
        onChange={handleInputChange}
      >
      </textarea>
      <pre>{displayedOutput === output ? displayedOutput : output}</pre>
    </div>
  );
}