import * as colors from 'ansi-colors';

export type TableCell = string | number | boolean; 

export class UI {
  public static printTable(
    columns: string[],
    data: TableCell[][],
    prefix = '',
  ): void {
    const maxWidths = columns.map(column => column.length);
    for (const row of data) {
      for (let index = 0; index < row.length; index++) {
        const cell = row[index];
        const cellWidth = cell.toString().length;
        maxWidths[index] = Math.max(maxWidths[index], cellWidth);
      }
    }

    const SEPARATOR = '  ';
    const totalWidth = (
      maxWidths.reduce((a, b) => a + b, 0) +
      (columns.length - 1) * SEPARATOR.length
    );
    console.log();

    const header = columns
      .map((column, index) => colors.white(column.padEnd(maxWidths[index])))
      .join(SEPARATOR);
    console.log(prefix + header);
    console.log(prefix + colors.gray('─'.repeat(totalWidth)));

    for (const row of data) {
      const line = row.map((cell, index) => {
        return colors.white(cell.toString().padEnd(maxWidths[index]));
      }).join(SEPARATOR);
      console.log(prefix + line);
    }
  }
}