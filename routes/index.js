exports.index = function(req, res){
  res.render('index');
};

exports.compare = function (req, res) {
  var fs = require('fs'),
      files = [req.files.file1.path, req.files.file2.path];

  async.map(files, function (path, cb) {
    fs.readFile(path, 'utf8', function (error, data) {
      fs.unlink(path);
      cb(null, csv.parse(data));
    });
  }, function (error, data) {
    var file1 = data[0].slice(1),
        file2 = data[1].slice(1),
        header1 = data[0][0],
        header2 = data[1][0],
        result = [];

    file1 = _.sortBy(file1, function (d) { return d[0]; });
    file2 = _.sortBy(file2, function (d) { return d[0]; });

    _.each(file1, function (row, row_ind) {
      var no_match = false;
      _.each(row, function (col, col_ind) {
        if (col !== file2[row_ind][col_ind]) {
          no_match = true;
          return;
        }
      });

      if (no_match) result.push(row[0]);
    });

    if (result.length === 0) {
      res.send('no mismatch');
    } else {
      result.unshift('id');
      result = result.map(function (d) { return [d]; });
      result = csv.stringify(result);

      res.set('Content-disposition', 'filename=' + (new Date ()).getTime() + '.csv');
      res.set('Content-Type', 'application/octet-stream');
      res.send(result);
    }
  });
}