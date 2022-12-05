const models = require('../models');
const NoteModel = require('../models/Note');

const { Note } = models;

const makeNote = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'A name is required' });
  }

  const noteData = {
    name: req.body.name,
    owner: req.session.account._id,
  };

  try {
    const newNote = new Note(noteData);
    await newNote.save();
    return res.status(201).json({ name: newNote.name });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Note already exists!' });
    }
    return res.status(400).json({ error: 'An error occured' });
  }
};

const makerPage = (req, res) => {
  return res.render('app');
};

const getNotes = (req, res) => {
  return NoteModel.findByOwner(req.session.account._id, (err, docs) => {
    if(err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred!' });
    }

    return res.json({ notes: docs });
  });
}

module.exports = {
  makerPage,
  makeNote,
  getNotes,
};
