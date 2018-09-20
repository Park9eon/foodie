const mongoose = require('mongoose');

const mongoSchema = mongoose.Schema({
  filename: 'string',
  mimetype: 'string',
  extName: 'string',
  uploadedDate: {
    type: 'date',
    default: Date.now(),
  },
});

class FileClass {
}

mongoSchema.loadClass(FileClass);

const File = mongoose.model('file', mongoSchema);

module.exports = File;
