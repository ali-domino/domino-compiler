import genRuntime from './genTemplate/genRuntime';
import genIndex from './genTemplate/genIndex';
import genIndexLess from './genTemplate/genIndexLess';
import * as md5 from 'blueimp-md5';
import genXmlJsx from "./genTemplate/genXmlJsx";
import genPageJS from "./genTemplate/genPageJS";

/**
 * 对一个目录进行编译，输入小程序代码，输出 jsx 代码
 */
export default function(input: Input): Output {
  let pageJSON = {} as PageJSON;
  try {
    if (input.inputFiles[input.pageName + '.json']) {
      pageJSON = JSON.parse(input.inputFiles[input.pageName + '.json']);
      if (pageJSON.dominoCompilerConfig) {
        Object.assign(input, pageJSON.dominoCompilerConfig);
      }
    }
  } catch (e) {
    console.warn(e);
  }

  const outputFiles = {};
  Object.keys(input.inputFiles).forEach(fileName => {
    const fileContent = input.inputFiles[fileName];
    const extIndex = fileName.lastIndexOf('.');
    if (extIndex === -1) return;
    const fileExt = fileName.substring(extIndex + 1);
    const fileNameWithoutExt = fileName.substring(0, extIndex);
    if (fileExt === 'axml') {
      const jsOut = genXmlJsx({
        fileName,
        content: fileContent,
        defaultComponentLib: input.defaultComponentLib,
        defaultComponentExportTags: input.defaultComponentExportTags,
        usingComponent: pageJSON.usingComponents,
      });
      outputFiles[fileNameWithoutExt + '.axml.jsx'] = jsOut.outJS;
    } else if (fileExt === 'acss') {
      outputFiles[fileNameWithoutExt + '.less'] = fileContent;
    } else if (fileExt === 'js' && fileNameWithoutExt !== input.pageName) {
      outputFiles[fileNameWithoutExt + '.js'] = fileContent;
    }
  });

  const pageJSXOutFile = input.pageName + '.axml.jsx';
  if (!outputFiles[pageJSXOutFile]) throw Error('page xml not found: ' + pageJSXOutFile);
  const pageStyleOutFile = input.pageName + '.less';
  const pageJSOutFile = input.pageName + '.js';
  let className = '';
  if (outputFiles[pageStyleOutFile]) className = `${input.pageName}-${md5(outputFiles[pageStyleOutFile])}`;

  outputFiles[pageJSOutFile] = genPageJS(input.inputFiles[pageJSOutFile]);
  outputFiles['_runtime.js'] = genRuntime();
  outputFiles['_index.less'] = genIndexLess({
    rootClassName: className,
    rootImportStyleFile: pageStyleOutFile,
  });
  outputFiles['_index.jsx'] = genIndex({
    wrapperLib: input.wrapperLib || DefaultWrapperLib,
    jsPath: pageJSOutFile,
    xmlPath: pageJSXOutFile,
    className,
  });
  return {
    outputFiles,
  };
}

const DefaultWrapperLib = 'domino-compiler/lib/wrapper';

export interface Input {
  inputFiles: {[k: string]: string}; // { 文件名: 文件内容 }: {"todos.js": "....", "todos.axml": "...."}
  pageName: string, // 入口文件名  如 todos
  wrapperLib?: string, // 根组件的 wrapper
  defaultComponentLib?: string, // 默认引入组件的路径
  defaultComponentExportTags?: string[], // 默认引入组件的可使用标签
}

export interface Output {
  outputFiles: {[k: string]: string}; // { 文件名: 文件内容 }
}

export interface PageJSON {
  usingComponents: { [k: string]: string },
  dominoCompilerConfig: Input, // 可以覆盖 input 的参数
}
