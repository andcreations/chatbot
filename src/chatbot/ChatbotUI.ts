import * as colors from 'ansi-colors';
import { TableCell, UI } from '../ui';

export class ChatbotUI {
  public static readonly MAX_TERMINAL_WIDTH = 180;
  public static readonly ASSISTANT_OUTPUT_PADDING = 20;
  public static readonly ASSISTANT_OUTPUT_WIDTH = 120;
  public static readonly SEPARATOR_WIDTH = 30;
  
  public static async readUserInput(promptText: string): Promise<string> {
    return new Promise((resolve) => {
      process.stdout.write(promptText);
      process.stdin.resume();
      process.stdin.setEncoding('utf8');
      const onData = (data: string) => {
        process.stdin.pause();
        process.stdin.removeListener('data', onData);
        ChatbotUI.separator(ChatbotUI.SEPARATOR_WIDTH);
        resolve(data);
      };
      process.stdin.on('data', onData);
    });
  }

  public static async writeAssistantMessage(message: string): Promise<void> {
    const outputWidth = Math.max(
      ChatbotUI.ASSISTANT_OUTPUT_WIDTH,
      ChatbotUI.getTerminalWidth() - ChatbotUI.ASSISTANT_OUTPUT_PADDING,
    )
    const lines = ChatbotUI.splitTextToWidth(message, outputWidth);
    for (const line of lines) {
      ChatbotUI.padLeft(ChatbotUI.ASSISTANT_OUTPUT_PADDING);
      process.stdout.write(line + '\n');
    }
    ChatbotUI.padLeft(ChatbotUI.ASSISTANT_OUTPUT_PADDING);
    ChatbotUI.separator(ChatbotUI.SEPARATOR_WIDTH);
  }

  public static writeAssistantTable(columns: string[], data: TableCell[][]): void {
    if (data.length === 0) {
      return;
    }
    const padding = ' '.repeat(ChatbotUI.ASSISTANT_OUTPUT_PADDING);
    UI.printTable(columns, data, padding);
  }

  private static padLeft(width: number): void {
    process.stdout.write(' '.repeat(width));
  }

  private static separator(width: number): void {
    process.stdout.write(colors.gray('─'.repeat(width)) + '\n');
  }

  private static splitTextToWidth(text: string, width: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + (currentLine ? ' ' : '') + word).length > width) {
        if (currentLine) {
          lines.push(currentLine);
        }
        // If the word itself is longer than width, split the word
        if (word.length > width) {
          let start = 0;
          while (start < word.length) {
            lines.push(word.slice(start, start + width));
            start += width;
          }
          currentLine = '';
        } else {
          currentLine = word;
        }
      } else {
        currentLine += (currentLine ? ' ' : '') + word;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines.flatMap(line => line.split('\n'));
  }

  private static getTerminalWidth(): number {
    let width = 80;
    if (process && process.stdout && typeof process.stdout.columns === 'number') {
      width = process.stdout.columns;
    }
    if (width > ChatbotUI.MAX_TERMINAL_WIDTH) {
      width = ChatbotUI.MAX_TERMINAL_WIDTH;
    }
    return width;
  }
}
