const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

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

var readOne = Promise.promisify(exports.readOne);

exports.readAll = (callback) => {

  fs.readdir(exports.dataDir, (err, files) => {
    var promises = _.map(files, (file) => {
      var id = file.slice(0, 5);
      return readOne(id);
    });

    Promise.all(promises)
      .then(fileArr => callback(null, fileArr))
      .catch(err => callback(err));
  });
};

exports.update = (id, text, callback) => {
  var filePath = path.join(exports.dataDir, id + '.txt');
  var allFiles = fs.readdirSync(exports.dataDir);

  if (allFiles.includes(id + '.txt')) {
    fs.writeFile(filePath, text, (err) => {
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
  var filePath = path.join(exports.dataDir, id + '.txt');
  var allFiles = fs.readdirSync(exports.dataDir);

  if (allFiles.includes(id + '.txt')) {
    fs.unlink(filePath, (err) => {
      if (err) {
        callback(new Error('Error deleting file'));
      } else {
        callback();
      }
    });
  } else {
    callback(new Error(`No item with id: ${id}`));
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
