const convertXml = require('../lib/genTemplate/genXmlJsx').default;
const fs = require('fs');

const testDir = __dirname + '/xml2jsx';
fs.readdirSync(testDir).filter(n => n.endsWith('.axml')).forEach(fileName => {
  const filePath = testDir + '/' + fileName;
  const out = convertXml({
    fileName,
    content: fs.readFileSync(filePath) + '',
    defaultComponentLib: 'antd',
    defaultComponentExportTags: ['View'],
  });
  const outJS = out.outJS;

  const stdFile = filePath + '.jsx';
  const outFile = filePath + '.check.jsx';

  if (!fs.existsSync(stdFile)) {
    fs.writeFileSync(outFile, outJS);
    console.log('[ERROR] no std out, please check: ' + fileName);
  } else if (fs.readFileSync(stdFile) + '' !== outJS) {
    fs.writeFileSync(outFile, outJS);
    console.log('[ERROR] check fail: ' + fileName);
  } else {
    if (fs.existsSync(outFile)) fs.unlinkSync(outFile);
  }
});
