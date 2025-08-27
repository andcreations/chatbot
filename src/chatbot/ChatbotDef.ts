import { ChatbotTool } from './ChatbotTool';

export interface ChatbotDef {
  getTools(): ChatbotTool[];
  getSystemPrompt(): string;
}