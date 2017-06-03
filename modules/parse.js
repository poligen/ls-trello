var path = require('path');
var fs = require('fs');

module.exports = {
  __readFile: function() {
    return JSON.parse(fs.readFileSync(this.file_path,'utf8'));
  },
  getLastId: function() {
    return this.__readFile().lastId;
  },
  get: function() {
    return this.__readFile().data;
  },
  set: function (data) {
    if(!data.id) {
      data.id = this.getLastId() + 1;
    }
    fs.writeFileSync(this.file_path, JSON.stringify({
      lastId: data.id,
      data: data,
    }),'utf8');
  },
  initialize: function(jsonFile) {
    this.file_path = path.resolve(path.dirname(__dirname), jsonFile);
    return this;
  },
};
