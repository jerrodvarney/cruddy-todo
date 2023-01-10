const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  const storeNewFile = (id, cb) => {
    let path = exports.dataDir + '/' + id + '.txt';

    fs.writeFile(path, text, (err) => {
      if (err) {
        throw ('error creating new file');
      } else {
        items[id] = text;
        cb(null, { id, text});
      }
    });
  };

  counter.getNextUniqueId( (err, id) => {
    if (err) {
      throw ('error creating a new ID');
    } else {
      storeNewFile(id, callback);
    }
  });
};

exports.readAll = (callback) => {
  var files = fs.readdirSync(exports.dataDir);
  var fileIds = _.map(files, (filename) => {
    var id = filename.slice(0, 5);
    return { id: id, text: id };
  });

  callback(null, fileIds);
};

exports.readOne = (id, callback) => {
  var filePath = path.join(exports.dataDir, id + '.txt');

  fs.readFile(filePath, (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: text.toString() });
    }
  });
};

exports.update = (id, text, callback) => {
  var filePath = path.join(exports.dataDir, id + '.txt');
  var allFiles = fs.readdirSync(exports.dataDir);

  if (allFiles.includes(id + '.txt')) {
    fs.writeFile(filePath, text, (err, text) => {
      if (err) {
        callback(new Error('Error updating file'));
      } else {
        callback(null, { id, text });
      }
    });
  } else {
    callback(new Error(`No item with id: ${id}`));
  }
};

exports.delete = (id, callback) => {
  ///// refactor to remove a ToDo from dataDir by its id /////

  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
