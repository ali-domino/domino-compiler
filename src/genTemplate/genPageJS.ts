export default function genPageJS(content: string): string {
  content = content || '';
  const contentLines = content.split('\n');
  return `import { createPage } from "./_runtime";
${contentLines.filter(l => l.trim().startsWith('import')).join('\n')}
export default function initPage(assign) {
  const Page = createPage(assign);
${contentLines.filter(l => l && !l.trim().startsWith('import')).map(l => '  ' + l).join('\n')}
  return Page;
}
`;
}
