const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware to parse JSON data and handle form submissions
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (e.g., CSS, JavaScript) from a 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html on the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Load existing notes from notes.json if available
let notes = [];
if (fs.existsSync('notes.json')) {
  const data = fs.readFileSync('notes.json', 'utf8');
  try {
    notes = JSON.parse(data);
  } catch (error) {
    console.error('Error parsing notes.json:', error);
  }
}

// Save notes to notes.json file
const saveNotes = () => {
  fs.writeFileSync('notes.json', JSON.stringify(notes), 'utf8');
};

// API endpoint to retrieve all notes
app.get('/api/notes', (req, res) => {
  res.json(notes);
});

// API endpoint to create a new note
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  notes.push(newNote);
  saveNotes(); // Save notes to the file after adding a new note
  res.status(201).json(newNote);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
