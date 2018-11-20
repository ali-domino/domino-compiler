const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;

/**
 * 将 Mustache 语法输出成 代码表达式
 * 如： aa{{bb}}cc  ->  "aa" + bb + "cc"
 */
export default function(text: string): string {
  const tagRE = defaultTagRE;
  if (!tagRE.test(text)) {
    return;
  }
  const tokens = [];
  let lastIndex = tagRE.lastIndex = 0;
  let match, index, tokenValue;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      tokenValue = text.slice(lastIndex, index);
      tokens.push(JSON.stringify(tokenValue));
    }
    // tag token
    const exp: string = match[1].trim();
    const isComplexExp = /\+|-|\*|\/|&&|\|\|/.test(exp);
    tokens.push(isComplexExp ? `(${exp})` : exp);
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    tokenValue = text.slice(lastIndex);
    tokens.push(JSON.stringify(tokenValue));
  }
  return tokens.join(' + ');
}
