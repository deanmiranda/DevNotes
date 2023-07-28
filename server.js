const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser'); // Import body-parser

const app = express();
const port = process.env.PORT || 3000;

// Parse incoming request bodies in a middleware before your handlers
app.use(bodyParser.json());

// Serve static files (e.g., CSS, JavaScript) from a 'public' directory
app.use(express.static('public'));

// Serve index.html on the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve notes.html on the root route
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'notes.html'));
});

// Load existing notes from notes.json if available
let notes = [];

if (fs.existsSync('db/db.json')) {
  const data = fs.readFileSync('db/db.json', 'utf8');
  console.log('data', data)
  try {
    notes = JSON.parse(data);
  } catch (error) {
    console.error('Error parsing notes.json:', error);
  }
}

// Save notes to notes.json file
const saveNotes = (notes) => {
  console.log('save notes to db', notes);
  fs.writeFileSync('db/db.json', JSON.stringify(notes), 'utf8');
};

// API endpoint to retrieve all notes
app.get('/api/notes', async (req, res) => {
  res.json(notes);
});

// API endpoint to create a new note
app.post('/api/notes', async (req, res) => {
  const newNote = req.body;
  notes.push(newNote);
  saveNotes(notes); // Save notes to the file after adding a new note
  res.status(201).json(newNote);
});

// API endpoint to delete a note
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const index = notes.findIndex((note) => JSON.stringify(note.id) === noteId);
  
  if (index !== -1) {
    notes.splice(index, 1);
    saveNotes(notes); // Save notes to the file after deleting the note
    res.status(200).json({ message: 'Note deleted successfully.' });
  } else {
    res.status(404).json({ message: 'Note not found.' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
