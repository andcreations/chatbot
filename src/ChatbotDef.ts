import { OpenAiTool } from './OpenAIClient';

export interface ChatbotDef {
  getOpenAITools(): OpenAiTool[];
  getSystemPrompt(): string;
}