import * as acorn from 'acorn';
import * as walk from 'acorn/dist/walk';

/**
 * 记录渲染 xml 中需要引用的变量
 */
export default class ParseVarsHelper {
  private needImportVarSet = new Set<string>();
  private tmpScopeVars: Array<Array<string>> = [];

  scopeIn(...tmpVars: string[]) {
    this.tmpScopeVars.push(tmpVars);
  }

  scopeOut() {
    this.tmpScopeVars.pop();
  }

  private isVarInTmpScope(varName: string): boolean {
    for (let scope of this.tmpScopeVars) {
      if (!scope) continue;
      for (let scopeVar of scope) {
        if (scopeVar === varName) return true;
      }
    }
    return false;
  }

  addVar(varName: string) {
    this.needImportVarSet.add(varName);
  }

  /**
   * 解析 js 表达式并记录用到的变量
   * @param exp
   */
  parseExp(exp: string): void {
    if (!exp) return;
    const option: any = { ecmaVersion: 2018 };
    walk.simple(acorn.parse(exp, option), {
      Identifier: (node) => {
        if (!this.isVarInTmpScope(node.name)) {
          this.needImportVarSet.add(node.name);
        }
      },
    });
  }

  getNeedImportVars(): string[] {
    return Array.from(this.needImportVarSet);
  }
}
