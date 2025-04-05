const router = require('express').Router();
const Note = require('../models/Note');
const auth = require('../middleware/auth');

// Get all notes for a user
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id })
      .sort({ updatedAt: -1 });
    
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific note
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new note
router.post('/', auth, async (req, res) => {
  const { title, content, tags } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    const newNote = new Note({
      title,
      content,
      tags: tags || [],
      userId: req.user.id
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a note
router.put('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (req.body.title !== undefined) note.title = req.body.title;
    if (req.body.content !== undefined) note.content = req.body.content;
    if (req.body.tags !== undefined) note.tags = req.body.tags;
    
    note.updatedAt = Date.now();
    
    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a note
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await Note.deleteOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search notes by tag
router.get('/tag/:tag', auth, async (req, res) => {
  try {
    const notes = await Note.find({ 
      userId: req.user.id,
      tags: req.params.tag
    }).sort({ updatedAt: -1 });
    
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search notes by title or content
router.get('/search/:query', auth, async (req, res) => {
  try {
    const notes = await Note.find({ 
      userId: req.user.id,
      $or: [
        { title: { $regex: req.params.query, $options: 'i' } },
        { content: { $regex: req.params.query, $options: 'i' } }
      ]
    }).sort({ updatedAt: -1 });
    
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
