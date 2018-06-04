const fs = require("mz/fs");
const path = require("path");
const del = require("del");
const commander = require("commander");
const rootFolder = path.resolve(__dirname, "root");
const outputFolder = path.resolve(__dirname, "output");


function isDirectory(item){
  return fs.stat(item)
    .then(stat => stat.isDirectory());
};

function walker(dir) {
  return fs.readdir(dir).then(items => {
    return Promise.all(items.map(file => {
      file = path.resolve(dir, file);
      return fs.stat(file).then((stat) => {
          return stat.isDirectory()
            ? walker(file)
            : file;
      });
    }));
  }).then((results) => {
      return Array.prototype.concat.apply([], results);
  }).catch(err => err);
}

function createSortDir(outputFolder, data){
  return fs.mkdir(outputFolder)
    .then(_ => data)
    .catch(err => {
      return del(outputFolder).then(_ => createSortDir(outputFolder, data));
    });
}


console.log('start');
walker(rootFolder)
  .then(items => createSortDir(outputFolder, items))
  .then(items => {
    return items.filter(item => {
      const itemName = path.basename(item);
      const newFolderSrc = path.join(outputFolder, itemName[0]);
      return fs.mkdir(newFolderSrc)
        .then(_ => {
          return items;
        })
        .catch(err => err);
    });
  })
  .then(files => {
    return Promise.all(files.map(file => {
      const fileName = path.basename(file);
      const newFolderSrc = path.join(outputFolder, fileName[0]);
      fs.copyFile(file, path.join(newFolderSrc, fileName));
    }));
  })
  .then(_ => console.log('finish'))
  .catch(err => console.log(err));
