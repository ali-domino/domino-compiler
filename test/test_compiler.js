const compiler = require('../lib/').default;
const fs = require('fs');

const pagesDir = __dirname + '/compiler';
const outputDir = '_output';
const outputCheckDir = '_output_check';

fs.readdirSync(pagesDir).forEach(projectDirName => {
  const projectDirPath = pagesDir + '/' + projectDirName;
  const inputFiles = readAllFiles(projectDirPath);
  let output;
  try {
    output = compiler({
      inputFiles,
      pageName: projectDirName,
    });
  } catch (e) {
    console.log('[ERROR] compiler error: ' + projectDirName + ' : ' + e.message);
    return;
  }

  const outputDirPath = projectDirPath + '/' + outputDir;
  if (!fs.existsSync(outputDirPath)) fs.mkdirSync(outputDirPath);

  const outputCheckDirPath = projectDirPath + '/' + outputCheckDir;
  if (!fs.existsSync(outputCheckDirPath)) fs.mkdirSync(outputCheckDirPath);
  clearDir(outputCheckDirPath);

  // 检查是否一致
  if (isDirSame(output.outputFiles, readAllFiles(outputDirPath))) {
    fs.rmdirSync(outputCheckDirPath);
    return;
  }
  console.log('[ERROR] check fail: ' + projectDirName);
  outFilesToDir(output.outputFiles, outputCheckDirPath);
});

function isDirSame(allFiles1, allFiles2) {
  if (Object.keys(allFiles1).length !== Object.keys(allFiles2).length) return false;
  for (let key of Object.keys(allFiles1)) {
    if (allFiles1[key] !== allFiles2[key]) {
      return false;
    }
  }
  return true;
}

function readAllFiles(dir) {
  const allFiles = {};
  fs.readdirSync(dir).forEach(fileName => {
    if (fileName === outputDir || fileName === outputCheckDir) return;
    const filePath = dir + '/' + fileName;
    allFiles[fileName] = fs.readFileSync(filePath) + '';
  });
  return allFiles;
}

function outFilesToDir(allFiles, dir) {
  Object.keys(allFiles).forEach(fileName => {
    fs.writeFileSync(dir + '/' + fileName, allFiles[fileName]);
  });
}

function clearDir(dir) {
  fs.readdirSync(dir).forEach(fileName => {
    const filePath = dir + '/' + fileName;
    if (fs.statSync(filePath).isDirectory()) {
      clearDir(filePath);
    }
    fs.unlinkSync(filePath);
  });
}
