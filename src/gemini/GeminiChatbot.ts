import { Content } from '@google/genai';
import { ChatbotOptions, Chatbot } from '../chatbot';
import { GeminiClient, GeminiCreateChatCompletionInput } from './GeminiClient';
import { GeminiTool } from './GeminiTool';

export class GeminiChatbot extends Chatbot {
  private geminiTools: Array<GeminiTool> = [];
  private messages: Array<Content> = [];
  
  public constructor(options: ChatbotOptions) {
    super(options);
    this.geminiTools = this.createGeminiTools();
  }

  private createGeminiTools(): Array<GeminiTool> {
    return this.getChatbotTools().map(tool => {
      const properties: Record<string, unknown> = {};
      tool.parameters.forEach(parameter => {
        properties[parameter.name] = {
          type: parameter.type,
          description: parameter.description,
        };
      });

      return {
        name: tool.name,
        description: tool.description,
        parameters: properties,
      };
    });
  }

  protected async processUserInput(
    userInput: string
  ): Promise<{ message: string }> {
    const input: GeminiCreateChatCompletionInput = {
      messages: [
        ...this.messages,
        { role: 'user', parts: [{ text: userInput }] },
      ],
      systemInstruction: this.getChatbotSystemPrompt(),
      tools: this.geminiTools,
    };
    const response = await GeminiClient.get().createChatCompletion(input);
    this.messages = response.messages;
    return { message: response.message };
  }
}