import * as md5 from 'blueimp-md5';
import xml2js, { Element as _Element } from '../libs/xml2js';
import _parseMustacheText from "./parseMustacheText";
import ParseVarsHelper from "./ParseVarsHelper";

export default function (option: Option): Output {
  let xml = xml2js(`<root>${option.content}</root>`).elements[0];
  const commandAttrs = [option.forAttrName, option.forItemAttrName, option.forIndexAttrName,
    option.ifAttrName, option.elseIfAttrName, option.elseAttrName, option.forKeyAttrName];

  const indent = typeof option.indentSpace === 'number' ? option.indentSpace : 2;
  let deep = 0;
  let output = '';
  let extraStyle = '';
  const allTags = [];
  const importTemplates = new Set<string>(); // 需要 import 的模版
  const parseVarsHelper = new ParseVarsHelper();

  function linkChildrenBrother(element: Element) {
    if (!element || !element.elements) return;
    for (let i = 0; i < element.elements.length; i++) {
      element.elements[i].previousSibling = element.elements[i - 1];
      element.elements[i].nextSibling = element.elements[i + 1];
    }
  }

  function formatTagName(tag: string) {
    if (!tag || tag === 'template' || tag === 'include') return tag;
    if (option.formatTagName) return option.formatTagName(tag);
    return tag;
  }

  // class -> className
  function formatAttrName(tag: string) {
    if (tag === 'class') return 'className';
    return tag;
  }

  function parseMustacheText(text) {
    const exp = _parseMustacheText(text);
    parseVarsHelper.parseExp(exp);
    return exp;
  }

  function indentStr() {
    return ''.padEnd(indent * deep);
  }

  function styleAttrToClass(element: Element) {
    const style = element.attributes && element.attributes.style;
    if (style) {
      delete element.attributes.style;
      let classValue = element.attributes.class || '';
      const newClassName = 'style-' + md5(style);
      classValue = (classValue + ' ' + newClassName).trim();
      classValue = classValue.trim();
      element.attributes.class = classValue;
      extraStyle += `.${newClassName} {\n${style.split(';').map(l => '  ' + l).join(';\n')}\n}\n`;
    }
  }

  function attributesStr(element: Element) {
    const attrs = element.attributes;
    if (!attrs) return '';
    let attrStr = Object.keys(attrs)
      .filter(key => !commandAttrs.includes(key))
      .map(key => {
        let value = attrs[key] + '';
        const parsedExp = parseMustacheText(value);
        if (parsedExp) {
          value = `{${parsedExp}}`;
        } else if (option.isAttrTypeFunction && option.isAttrTypeFunction(element.name, key, value)) {
          parseVarsHelper.addVar(value);
          value = `{${value}}`;
        } else {
          value = `"${value}"`;
        }
        return `${formatAttrName(key)}=${value}`;
      }).join(' ') || '';

    return attrStr;
  }

  function printElement(element: Element) {
    if (element.type === 'element') {
      if (element.name === 'include') {
        const isRootElement = xml.elements.includes(element);
        if (isRootElement) {
          output += `${indentStr()}require('${element.attributes.src}.jsx').default(_props)\n`;
        } else {
          output += `${indentStr()}{require('${element.attributes.src}.jsx').default(_props)}\n`;
        }
        return;
      }
      if (element.name === 'template') {
        const isRootElement = xml.elements.includes(element);
        allTags.push('template');
        let dataAttrValue = element.attributes.data || '{}';
        if (dataAttrValue.startsWith('{{') && dataAttrValue.endsWith('}}')) {
          // {{a: b}} -> {a: b} 转为标准js句法块
          dataAttrValue = dataAttrValue.substring(1, dataAttrValue.length - 1);
        }
        parseVarsHelper.parseExp(`(${dataAttrValue})`);
        if (isRootElement) {
          output += `${indentStr()}template({ is: "${element.attributes.is}", data: ${dataAttrValue}, pProps: _props, scope: _component })\n`;
        } else {
          output += `${indentStr()}{template({ is: "${element.attributes.is}", data: ${dataAttrValue}, pProps: _props, scope: _component })}\n`;
        }
        return;
      }
      styleAttrToClass(element);

      const elementTag = formatTagName(element.name);
      allTags.push(elementTag);

      // 处理指令
      let prefix = '';
      let suffix = '';
      let needScopeOut = false;
      let forAttrValue = element.attributes && element.attributes[option.forAttrName];
      if (forAttrValue) {
        const forAttrExp = parseMustacheText(forAttrValue) || `"${forAttrValue}"`;
        const forItemAttrValue = element.attributes && element.attributes[option.forItemAttrName] || 'item';
        const forIndexAttrValue = element.attributes && element.attributes[option.forIndexAttrName] || 'index';
        let forKeyAttrValue = element.attributes && element.attributes[option.forKeyAttrName];
        if (forKeyAttrValue) {
          delete element.attributes[option.forKeyAttrName];
          if (forKeyAttrValue === '*this') forKeyAttrValue = `{{${forItemAttrValue}}}`;
          element.attributes.key = forKeyAttrValue;
        }
        if (!element.attributes.key) {
          element.attributes.key = `{{${forIndexAttrValue}}}`;
        }
        prefix = `{(${forAttrExp} || []).map((${forItemAttrValue}, ${forIndexAttrValue}) => `;
        parseVarsHelper.scopeIn(forItemAttrValue, forIndexAttrValue);
        needScopeOut = true;
        suffix = ')}';
      }
      const ifAttrValue = element.attributes && element.attributes[option.ifAttrName];
      const elseIfAttrValue = element.attributes && element.attributes[option.elseIfAttrName];
      const hasElseAttr = element.attributes && option.elseAttrName in element.attributes;
      const nextElementAttrs = element.nextSibling && element.nextSibling.attributes;
      const hasIfNext = nextElementAttrs && (nextElementAttrs[option.elseIfAttrName] || nextElementAttrs[option.elseAttrName]);
      if (ifAttrValue) {
        const ifAttrExp = parseMustacheText(ifAttrValue);
        if (forAttrValue) { // if in for
          prefix += `${ifAttrExp} ? `;
          suffix = (hasIfNext ? ' :' : ' : null') + suffix;
        } else {
          prefix += `{${ifAttrExp} ? `;
          suffix = (hasIfNext ? ' :' : ' : null}') + suffix;
        }
      } else if (elseIfAttrValue) {
        const elseIfAttrExp = parseMustacheText(elseIfAttrValue);
        prefix += `${elseIfAttrExp} ? `;
        suffix = (hasIfNext ? ' :' : ' : null}') + suffix;
      } else if (hasElseAttr) {
        suffix = '}' + suffix;
      }

      output += `${indentStr()}${prefix}<${elementTag}`;
      const attrsStr = attributesStr(element);
      if (attrsStr) { // 属性
        output += ` ${attrsStr}`;
      }
      if (!element.elements || element.elements.length === 0) { // 自闭合
        output += '/>';
      } else {
        output += '>\n';
        deep++;
        element.elements.forEach(printElement);
        deep--;
        output += `${indentStr()}</${elementTag}>`;
      }
      output += `${suffix}\n`;
      if (needScopeOut) parseVarsHelper.scopeOut();
    } else if (element.type === 'text') {
      output += indentStr();
      const parsedExp = parseMustacheText(element.text.trim());
      if (parsedExp) {
        output += `{${parsedExp}}`;
      } else {
        output += element.text.trim();
      }
      output += '\n';
    } else if (element.type === 'comment') {
      output += `${indentStr()}<!-- ${element.comment} -->\n`;
    } else {
      console.warn('unSupport xml element type: ' + element.type);
    }
  }

  let templateName = null;
  xml.elements.forEach(el => {
    if (el.type === 'element' && el.name === 'import') {
      importTemplates.add(el.attributes.src);
    } else if (el.type === 'element') {
      linkChildrenBrother(el);
      if (el.name === 'template' && el.attributes.name) {
        templateName = el.attributes.name;
        printElement(el.elements[0]);
      } else {
        printElement(el);
      }
    } else if (el.type === 'comment') {
      output += `// ${el.comment.trim()}\n`;
    }
  });

  return {
    jsx: output,
    tags: Array.from(new Set(allTags)),
    vars: parseVarsHelper.getNeedImportVars(),
    importTemplates: Array.from(importTemplates).filter(i => i), // 去重 & 去空
    templateName,
    extraStyle,
  };
}

export interface Option {
  content: string;
  ifAttrName: string; // a:if
  elseIfAttrName: string; // a:elif
  elseAttrName: string; // a:else
  forAttrName: string; // a:for
  forItemAttrName: string; // a:for-item
  forIndexAttrName: string; // a:for-index
  forKeyAttrName: string; // a:key
  indentSpace?: number; // 默认 2
  isAttrTypeFunction?: (tag: string, attrName: string, attrValue: string) => boolean; // 对于类似 onTap="addTap" 的写法需要处理成入参为 方法
  formatTagName?: (tag: string) => string;
}

export interface Output {
  jsx: string; // 输出的 xml 部分
  tags: string[]; // 输出需要被引入的组件标签
  vars: string[]; // 输出需要引入的局部变量
  importTemplates: string[]; // 输出需要 import 的模版路径
  templateName?: string; // 如果当前文件是模版片段的声明，这个字段才会有值，会返回模版名称
  extraStyle: string; // 额外输出的样式文本内容
}

interface Element extends _Element {
  previousSibling: Element;
  nextSibling: Element;
  elements: Element[];
}
