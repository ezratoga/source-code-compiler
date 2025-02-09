const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" },
});

const fileExtensions = {
  python: 'py',
  javascript: 'js',
  java: 'java',
  c: 'c',
  cpp: 'cpp',
  csharp: 'cs',
  go: 'go',
  kotlin: 'kts',
  php: 'php',
  rscript: 'R'
};

const dockerImages = {
  python: 'python:3.9-alpine',
  javascript: 'node:14-alpine',
  java: 'openjdk:11',
  c: 'gcc:latest',
  cpp: 'gcc:latest',
  csharp: 'mono:latest',
  go: 'golang:latest',
  kotlin: 'esolang/kotlin:latest',
  php: 'php:latest',
  rscript: 'rocker/rstudio:latest'
};

let fileName = 'code';

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('runCode', ({ code, language }) => {
    let inputGot = '';

    if (language === 'javascript' && code?.toString()?.trim()?.includes('prompt(')) {
      const question = code?.split('prompt(')[1]?.split(')')[0];
      const objectName = code?.split('prompt(')[0]?.split('=')[0].split(' ')[1];
      const codeToInclude = code?.trim()?.includes(`${question};`) ? 
        code?.split('prompt(')[1]?.replace(`${question});`, '') : 
        code?.split('prompt(')[1]?.replace(`${question})`, '');
      inputGot += `const readline = require('readline');

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
        });

      rl.question(${question}, (${objectName}) => {
        ${codeToInclude}
        rl.close();
      });`
    } else inputGot += code;

    const fileExtension = fileExtensions[language];
    if (['java'].includes(language)) {
      fileName = inputGot?.split('class ')[1].split(/[^a-zA-Z0-9\s ]|\\[ntrbfv]/gi)[0]?.trim();
    }
    const codeFilePath = path.join(__dirname, `${fileName}.${fileExtension}`);
    fs.writeFileSync(codeFilePath, inputGot);

    const dockerImage = dockerImages[language];
    const command = `docker run --rm -i -v "${__dirname}:/app" -w /app ${dockerImage} sh -c "${getRunCommand(language, codeFilePath)}"`;

    // Start Docker process with interactive mode
    // const dockerProcess = spawn(command, { shell: true, stdio: ['pipe', 'pipe', 'pipe', 'inherit'] });

    const dockerProcess = exec(command, { shell: true });

    // Capture stdout and send to the frontend
    dockerProcess.stdout.on('data', (data) => {
      socket.emit('output', data.toString());
    });
  
    // Capture stderr and send to the frontend
    dockerProcess.stderr.on('data', (data) => {
      socket.emit('output', data.toString());
    });
  
    // Handle input from the frontend (not ideal with exec, workaround needed)
    socket.on('input', (input) => {
      if (dockerProcess.stdin) {
        dockerProcess.stdin.write(input + '\n');
      }
    });
  
    // Emit empty output when process closes
    dockerProcess.on('close', () => {
      socket.emit('output', '\n');
    });
  
    // Kill process if the client disconnects
    socket.on('disconnect', () => {
      dockerProcess.kill();
    });
  });
});

function getRunCommand(language, codeFilePath) {
  const commands = {
    python: `python3 ${path.basename(codeFilePath)}`,
    javascript: `node ${path.basename(codeFilePath)}`,
    java: `javac ${fileName}.java && java ${fileName}`,
    c: `gcc ${path.basename(codeFilePath)} -o code && ./code`,
    cpp: `g++ ${path.basename(codeFilePath)} -o code && ./code`,
    csharp: `mcs -out:code.exe ${path.basename(codeFilePath)} && mono code.exe`,
    go: `go run ${path.basename(codeFilePath)}`,
    kotlin: `kotlin ${path.basename(codeFilePath)}`,
    php: `php ${path.basename(codeFilePath)}`,
    rscript: `R -e "source('${path.basename(codeFilePath)}')`
  };
  return commands[language];
}

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
