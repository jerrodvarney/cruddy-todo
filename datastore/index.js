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
  ///// refactor to return an array of ToDos to client upon a GET to the collection /////
  // read dataDir and build list of files //
  // store each id from each file as well //
  // send ToDo id as both id and text to the client for now //

  /////AFTER ALL OTHER REFACTORS/////
  // refactor test for readAll to expect correct ToDo text //
  // read about promises to make all the async work together //
  // use 'Promise.all' //

  console.log('files: =========== ', fs.readdirSync(exports.dataDir));
  //create file directory array
  //remove .txt from each file name in the array

  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  ///// refactor to read a single ToDo from dataDir based on its id /////
  // must read contents of ToDo file and send it back to client //

  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  ///// refactor to rewrite the a stored ToDo based on its id /////

  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
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
