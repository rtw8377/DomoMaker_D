const mongoose = require('mongoose');
const _ = require('underscore');

let NoteModel = {};

const setName = (name) => _.escape(name).trim();

const NoteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

NoteSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: mongoose.Types.ObjectId(ownerId),
  };

  return NoteModel.find(search).select('name').lean().exec(callback);
};

NoteModel = mongoose.model('Note', NoteSchema);

module.exports = NoteModel;
