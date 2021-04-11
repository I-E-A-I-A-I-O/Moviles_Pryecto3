export class QueryFunctions {
  public generateValues(
    rows: number,
    parameters: number,
    nowIndex?: number
  ): string {
    let values: string = '';
    let count: number = 0;
    for (let i = 0; i < rows; i++) {
      values += '(';
      for (let n = 0; n < parameters; n++) {
        if (n > 0 && n <= parameters - 1) {
          values += ', ';
        }
        if (nowIndex !== undefined && nowIndex === n) {
          values += 'NOW()';
          continue;
        }
        values += `$${++count}`;
      }
      values += ')';
      if (i !== rows - 1) {
        values += ', ';
      }
    }
    return values;
  }
}
