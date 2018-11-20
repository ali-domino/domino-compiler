export default function(option: Option): string {
  const { rootClassName, rootImportStyleFile } = option;
  const contentParts = [];
  if (rootClassName && rootImportStyleFile) {
    contentParts.push(`.${rootClassName} {
  @import './${rootImportStyleFile}';
}`);
  }
  if (!contentParts.length) return '';
  return contentParts.join('\n') + '\n';
}

export interface Option {
  rootClassName?: string;
  rootImportStyleFile?: string;
}
