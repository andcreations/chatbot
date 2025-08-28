import { FunctionDeclaration } from '@google/genai';

export interface GeminiTool extends FunctionDeclaration {
  func: (args: any) => Promise<any>;
}