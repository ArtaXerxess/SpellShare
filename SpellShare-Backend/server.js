const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:4200',  // Allow requests from your frontend (Angular)
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }
});

// CORS Middleware (Optional as socket.io handles this above)
app.use(cors({
  origin: 'http://localhost:4200',  // Allow only your frontend
  methods: ['GET', 'POST'],        // Allow specific methods
  allowedHeaders: ['Content-Type'], // Allow specific headers
}));

// Define the path for the JSON file where code will be stored
const CODE_FILE_PATH = path.join(__dirname, 'code.json');

// Function to load the code from the JSON file
function loadCodeFromFile() {
  try {
    const data = fs.readFileSync(CODE_FILE_PATH, 'utf-8');
    return JSON.parse(data).code || '';  // Return the code or an empty string if not found
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('code.json file not found. Creating a new one...');
      saveCodeToFile('');  // Create the file with an empty code value
      return '';  // Return empty code
    } else if (error.name === 'SyntaxError') {
      console.error('Malformed code.json file. Resetting to default.');
      saveCodeToFile('');  // Reset the file with an empty code value
      return '';  // Return empty code
    } else {
      console.error('Error reading code from file:', error);
      throw error;
    }
  }
}

// Function to save the code to the JSON file
function saveCodeToFile(code) {
  const codeData = JSON.stringify({ code }, null, 2);  // Pretty-print the JSON
  try {
    fs.writeFileSync(CODE_FILE_PATH, codeData);
    console.log('Code saved to file');
  } catch (error) {
    console.error('Error writing code to file:', error);
  }
}

// Load the initial code from the file
let userCode = loadCodeFromFile();

// When a user connects to the Socket.io server
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Send the current code content to the newly connected client
  socket.emit('codeUpdate', userCode);

  // Listen for incoming code updates from the client
  socket.on('updateCode', (data) => {
    userCode = data.code;  // Update the stored code content
    console.log('Code updated: ', userCode);
    
    // Save the updated code to the JSON file
    saveCodeToFile(userCode);
    
    // Broadcast the updated code to all other connected clients
    socket.broadcast.emit('codeUpdate', userCode);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
