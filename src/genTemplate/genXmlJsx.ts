import axml2jsx from "../axml2jsx/axml2jsx";

const runtimeTags = ['template'];

export default function genXmlJsx(option: Option): Out {
  const jsxOut = axml2jsx({
    content: option.content,
    ifAttrName: 'a:if',
    elseIfAttrName: 'a:elif',
    elseAttrName: 'a:else',
    forAttrName: 'a:for',
    forItemAttrName: 'a:for-item',
    forIndexAttrName: 'a:for-index',
    forKeyAttrName: 'a:key',
    isAttrTypeFunction(tag, attrName, attrValue) {
      return attrName.startsWith('on'); // FIXME 解析 Page.js 判断是否定义了方法 & 使用组件属性类型来判断
    },
    formatTagName(tag) {
      return tag;
    },
  });

  const preImportLines = [];

  const importTags = Array.from(new Set(jsxOut.tags.map(tag => tag.split('.')[0]))); // Table.Column => Table & 去重
  if (jsxOut.importTemplates.length) {
    if (!importTags.includes('template')) {
      importTags.push('template');
    }
  }

  // 处理标签的引入
  const usedRuntimeTags = [];
  const usedDefaultLibTags = [];
  const usedUserDefinedTags = [];
  importTags.forEach(tag => {
    if (option.usingComponent && option.usingComponent[tag]) usedUserDefinedTags.push(tag);
    else if (option.defaultComponentExportTags && option.defaultComponentExportTags.includes(tag)) usedDefaultLibTags.push(tag);
    else if (runtimeTags.includes(tag)) usedRuntimeTags.push(tag);
  });
  if (usedRuntimeTags.length) {
    preImportLines.push(`import { ${usedRuntimeTags.join(', ')} } from './_runtime.js';`);
  }
  if (usedDefaultLibTags.length) {
    preImportLines.push(`import { ${usedDefaultLibTags.join(', ')} } from '${option.defaultComponentLib}';`);
  }
  if (usedUserDefinedTags.length) {
    usedUserDefinedTags.forEach(tag => {
      // TODO usingComponents 声明的支持小程序组件
      preImportLines.push(`import ${tag} from '${option.usingComponent[tag]}';`);
    });
  }

  const preRenderLines = [];
  const funcName = jsxOut.templateName ? '_template' : '_component';
  if (jsxOut.vars.length) preRenderLines.push(`const { ${jsxOut.vars.join(', ')} } = _props;`);

  if (jsxOut.importTemplates && jsxOut.importTemplates.length) {
    jsxOut.importTemplates.forEach(importSrc => {
      preRenderLines.push(`template.reg(${funcName}, require('${importSrc}.jsx').default);`);
    });
  }

  let outJS = `import React from 'react';
${preImportLines.filter(l => l).join('\n')}
${jsxOut.extraStyle ? genAppendStyle(jsxOut.extraStyle) : ''}
export default function ${funcName}(_props) {
${preRenderLines.filter(l => l).map(l => '  ' + l).join('\n')}
  return (
${jsxOut.jsx.split('\n').filter(l => l).map(l => '    ' + l).join('\n')}
  );
}
`;
  if (jsxOut.templateName) {
    outJS += `_template.templateName = '${jsxOut.templateName}';\n`;
  }

  return {
    outJS,
  };
}

function genAppendStyle(style: string) {
  return `const style = document.createElement('style');
style.setAttribute('type', 'text/css');
style.appendChild(document.createTextNode(\`${style}\`));
document.head.appendChild(style);`;
}

export interface Option {
  fileName: string, // xml 的文件名
  content: string, // xml 的文件内容
  defaultComponentLib?: string, // 默认引入组件的路径
  defaultComponentExportTags?: string[], // 默认引入组件的可使用标签
  usingComponent?: { [tag : string]: string }, // 用户在 页面.json 中定义使用的第三方组件
}

export interface Out {
  outJS: string, // 输出的 jsx 源码
}
