export class Log {
  private static enabled = false;

  private static print(message: string): void {
    if (this.enabled) {
      console.log(message);
    }
  }

  private static log(level: string, message: string): void {
    this.print(`[${level}] ${message}`);
  }

  public static info(message: string): void {
    this.log('INFO', message);
  }

  public static error(message: string, error: any): void {
    this.log('ERROR', message);
    if (error != null) {
      if (error instanceof Error) {
        this.print(error.message);
      } else {
        this.print(JSON.stringify(error));
      }
    }
  }
}