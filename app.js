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

//createFolder(path.join(__dirname, '/sorted'));

const createFolder = function(dirStr) {
  return fs.exists(dirStr)
    .then(exist => !exist ? dirStr : new Error('folder already exists'))
    .then(folderPath => fs.mkdir(dirStr))
    .catch(err => err.errno !== -4075 && console.log(err)); 
};

// const readFile = function(dir, done){
//   let results = [];

//   fs.readdir(dir)
//     .then()
// }



// const walker = function(dir, done) {
//   let results = [];
//   fs.readdir(dir, function(err, list) {
//     if (err) return done(err);

//     let pending = list.length;
//     if (!pending) return done(null, results);

//     list.forEach(function(file) {
//       file = path.resolve(dir, file);
//       fs.stat(file, function(err, stat) {
//         if (stat && stat.isDirectory()) {
//           walker(file, function(err, res) {
//             results = results.concat(res);
//             if (!--pending) done(null, results);
//           });
//         } else {
//           results.push({
//             name: path.parse(file).base,
//             path: file
//           });
//           if (!--pending) done(null, results);
//         }
//       });
//     });
//   });
// };

const myPath = path.join(__dirname, '/root');

const isDirectory = function(item){
  return fs.stat(item)
    .then(stat => stat.isDirectory());
};


let results = [];
let stack = [];


// const walker = function(dir){
//   return fs.readdir(dir)
//     .then(names => names.map(item => path.join(dir, item)))
//     // .then(items => {
//     //   return Promise.all(items.map(item => isDirectory(item)))
//     //     .then(data => {
//     //       return data.filter(function(val, idx){
//     //         if(!val){
//     //           return stack.push(items[idx]);
//     //         }else{
//     //           return new Promise((resolve, reject) => {
//     //             walker(items[idx]);
//     //             reject();
//     //           }).catch(err => err);
//     //         }
//     //       });
//     //     });
//     // })
//     // .then(stat => {
//     //   stack.concat(stack);
//     // })
//     .catch(err => console.log(err));
// };



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

walker(myPath)
  .then(item => console.log(item))
  .catch(err => err);

// const putFileToFolder = function(item, newFolderPath, cb = function() {}) {
//   fs.readFile(item.path, (err, itemContent) => {
//     if (err) throw err;
//     fs.writeFile(`${newFolderPath}/${item.name}`, itemContent, err => {
//       if (err) throw err;
//       cb();
//     });
//   });
// };

// const createItemFolders = function(sortFolder, sortArr) {
//   sortArr.forEach(item => {
//     const newFolderPath = path.join(`${sortFolder}/${item.name[0]}`);
//     createFolder(newFolderPath, () => {
//       putFileToFolder(item, newFolderPath);
//     });
//   });
// };

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
