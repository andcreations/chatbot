import { Content, Schema, Type } from '@google/genai';
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
      const properties: Record<string, Schema> = {};
      tool.parameters.forEach(parameter => {
        properties[parameter.name] = {
          type: Type.STRING,
          description: parameter.description,
        } as Schema;
      });

      return {
        name: tool.name,
        description: tool.description,
        parameters: {
          type: Type.OBJECT,
          properties,
        },
        func: tool.func,
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