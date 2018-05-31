const fs = require("mz/fs");
const path = require("path");
const del = require("del");
const commander = require("commander");
let rootFolder = path.resolve(__dirname, "root");


const sortAbc = function(a, b) {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
};


// const createFolder = function(dirStr, callback = function() {}) {
//   if (!fs.existsSync(dirStr)) {
//     fs.mkdir(dirStr, (err, cb) => {
//       callback();
//     });
//   } else {
//     callback();
//   }
// };

const createFolder = function(dirStr) {
  return fs.exists(dirStr)
    .then(exist => !exist ? dirStr : new Error('folder already exists'))
    .then(folderPath => fs.mkdir(dirStr))
    .catch(err => err.errno !== -4075 && console.log(err)); 
};

createFolder(path.join(__dirname, '/sorted'));

const readFile = function(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);

    let pending = list.length;
    if (!pending) return done(null, results);

    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          readFile(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push({
            name: path.parse(file).base,
            path: file
          });
          if (!--pending) done(null, results);
        }
      });
    });
  });
};



const putFileToFolder = function(item, newFolderPath, cb = function() {}) {
  fs.readFile(item.path, (err, itemContent) => {
    if (err) throw err;
    fs.writeFile(`${newFolderPath}/${item.name}`, itemContent, err => {
      if (err) throw err;
      cb();
    });
  });
};

const createItemFolders = function(sortFolder, sortArr) {
  sortArr.forEach(item => {
    const newFolderPath = path.join(`${sortFolder}/${item.name[0]}`);
    createFolder(newFolderPath, () => {
      putFileToFolder(item, newFolderPath);
    });
  });
};

// readFile(rootFolder, (err, results) => {
//   if (err) throw err;
//   const sortArr = results.sort(sortAbc);
//   const sortFolder = path.join(__dirname + "/sorted");

//   del([sortFolder, path.join(sortFolder + "/**/*")])
//     .then(path => {
//       createFolder(sortFolder, err => {
//         if (err) throw err;
//         createItemFolders(sortFolder, sortArr);
//       });
//     })
//     .catch(err => console.log(err));
// });
