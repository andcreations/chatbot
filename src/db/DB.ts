import * as fs from 'fs';

export class DB {
  public static loadJson<T>(fileName: string): T[] {
    const data = fs.readFileSync(fileName, 'utf8');
    return JSON.parse(data);
  }
}