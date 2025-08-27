import { ChatCompletionFunctionTool } from 'openai/resources/index';

export interface OpenAiTool extends ChatCompletionFunctionTool {
  func: (args: any) => Promise<any>;
}