const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { spawn } = require('child_process');
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
};

const dockerImages = {
  python: 'python:3.9-alpine',
  javascript: 'node:14-alpine',
  java: 'openjdk:11',
  c: 'gcc:latest',
  cpp: 'gcc:latest',
  csharp: 'mono:latest',
};

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('runCode', ({ code, language }) => {
    const fileExtension = fileExtensions[language];
    const codeFilePath = path.join(__dirname, `code.${fileExtension}`);
    fs.writeFileSync(codeFilePath, code);

    const dockerImage = dockerImages[language];
    const command = `docker run --rm -i -v "${__dirname}:/app" -w /app ${dockerImage} sh -c "${getRunCommand(language, codeFilePath)}"`;

    // Start Docker process with interactive mode
    const dockerProcess = spawn(command, { shell: true, stdio: ['pipe', 'pipe', 'pipe'] });

    dockerProcess.stdout.on('data', (data) => {
      socket.emit('output', data.toString());
    });

    dockerProcess.stderr.on('data', (data) => {
      socket.emit('output', data.toString());
    });

    // Listen for input from the frontend and send it to the Docker process stdin
    socket.on('input', (input) => {
      dockerProcess.stdin.write(input + '\n');
    });

    // No longer emit exit code
    dockerProcess.on('close', () => {
      socket.emit('output', '\n');
    });

    socket.on('disconnect', () => {
      dockerProcess.kill();
    });
  });
});

function getRunCommand(language, codeFilePath) {
  const commands = {
    python: `python3 ${path.basename(codeFilePath)}`,
    javascript: `node ${path.basename(codeFilePath)}`,
    java: 'javac Code.java && java Code',
    c: `gcc ${path.basename(codeFilePath)} -o code && ./code`,
    cpp: `g++ ${path.basename(codeFilePath)} -o code && ./code`,
    csharp: `mcs -out:code.exe ${path.basename(codeFilePath)} && mono code.exe`,
  };
  return commands[language];
}

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
