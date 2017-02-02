const path = require("path");
const gutil = require("gulp-util");
const through = require("through2");
const objectAssign = require("object-assign");
const archiver = require("archiver");

archiver.registerFormat("asar", require("./asar"));

module.exports = function (filename, opts) {
  if (!filename) {
    throw new gutil.PluginError("gulp-asar", "`filename` required");
  }

  var firstFile;
  const archive = archiver("asar");

  return through.obj(function (file, enc, cb) {
    if (file.relative === "") {
      return cb();
    }

    if (firstFile === undefined) {
      firstFile = file;
    }

    archive.append(file.contents, objectAssign({
      name: file.relative.replace(/\\/g, "/") + (file.isNull() ? "/" : ""),
      mode: file.stat && file.stat.mode,
      date: file.stat && file.stat.mtime ? file.stat.mtime : null
    }, opts));

    cb();
  }, function (cb) {
    if (firstFile === undefined) {
      return cb();
    }

    archive.finalize();

    this.push(new gutil.File({
      cwd: firstFile.cwd,
      base: firstFile.base,
      path: path.join(firstFile.base, filename),
      contents: archive
    }));

    cb();
  });
};
