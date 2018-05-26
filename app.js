const fs = require('fs');
const path = require('path');
 
var readFile = function(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
		if (err) return done(err);
		
		console.log(list);
 
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
 
readFile(path.resolve(__dirname, 'root'), (err, results) => {
  if (err) throw err;
  console.log(results);
});