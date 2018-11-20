const fs = require('fs');
const compiler = require('../lib/').default;

module.exports = function loader(content) {
  console.log('compile domino page: ' + this.resourcePath);
  const dirEndIndex = this.resourcePath.lastIndexOf('/');
  const dir = this.resourcePath.substring(0, dirEndIndex);
  const fileName = this.resourcePath.substring(dirEndIndex + 1);
  const pageName = fileName.substring(0, fileName.lastIndexOf('.'));

  const inputFiles = readAllFiles(dir);
  const out = compiler({
    inputFiles: inputFiles,
    pageName,
  });
  outputDirsCache[dir] = {
    _entryFilePath: this.resourcePath,
    ...out.outputFiles,
  };
  Object.keys(inputFiles).forEach(inputFile => {
    this.addDependency(dir + '/' + inputFile);
  });
  overrideFS(this.fs);

  return `module.exports = require('./_index.jsx');`;
};

const outputDirsCache = {}; // {dir: []}
function overrideFS(_fs) {
  if (_fs.__domino_compiler_override) return;
  _fs.__domino_compiler_override = true;
  const { stat, statSync, readFile } = _fs;
  _fs.readFile = function (...args) {
    const [ path, callback ] = args;
    const dirEndIndex = path.lastIndexOf('/');
    if (dirEndIndex !== -1) {
      const dir = path.substring(0, dirEndIndex);
      const fileName = path.substring(dirEndIndex + 1);
      if (outputDirsCache[dir] && fileName in outputDirsCache[dir]) {
        callback(null, new Buffer(outputDirsCache[dir][fileName]));
        return;
      }
    }
    return readFile.apply(_fs, args);
  };
  _fs.stat = function (...args) {
    const [ path, callback ] = args;
    const dirEndIndex = path.lastIndexOf('/');
    if (dirEndIndex !== -1) {
      const dir = path.substring(0, dirEndIndex);
      const fileName = path.substring(dirEndIndex + 1);
      if (outputDirsCache[dir] && fileName in outputDirsCache[dir]) {
        fs.stat(outputDirsCache[dir]._entryFilePath, callback);
        return;
      }
    }
    return stat.apply(_fs, args);
  };
  _fs.statSync = function (...args) {
    const [ path ] = args;
    const dirEndIndex = path.lastIndexOf('/');
    if (dirEndIndex !== -1) {
      const dir = path.substring(0, dirEndIndex);
      const fileName = path.substring(dirEndIndex + 1);
      if (outputDirsCache[dir] && fileName in outputDirsCache[dir]) {
        return fs.statSync(outputDirsCache[dir]._entryFilePath);
      }
    }
    return statSync.apply(_fs, args);
  };
}

function readAllFiles(dir) {
  const allFiles = {};
  fs.readdirSync(dir).forEach(fileName => {
    const filePath = dir + '/' + fileName;
    if (fs.statSync(filePath).isDirectory()) return;
    allFiles[fileName] = fs.readFileSync(filePath) + '';
  });
  return allFiles;
}
