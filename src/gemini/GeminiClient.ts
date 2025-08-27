import { Content, GoogleGenAI } from '@google/genai';
import { GeminiTool } from './GeminiTool';

export class GeminiClient {
  public static instance: GeminiClient;

  private client: GoogleGenAI;
  private readonly modelName = 'gemini-2.5-flash-lite';
  // gemini-2.5-flash
  // gemini-2.5-flash-lite

  private constructor() {
    this.client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    })
  }

  public static init(): void {   
    GeminiClient.instance = new GeminiClient();
  }

  public static get(): GeminiClient {
    if (!GeminiClient.instance) {
      GeminiClient.init();
    }
    return GeminiClient.instance;
  }

  public async generateContent(input: string): Promise<string> {
    const response = await this.client.models.generateContent({
      model: this.modelName,
      contents: input,
    });
    return response.text || '';
  }

  public async createChatCompletion(
    input: GeminiCreateChatCompletionInput,
  ): Promise<GeminiCreateChatCompletionOutput> {
    const response = await this.client.models.generateContent({
      model: this.modelName,
      contents: 'test',
    });    
    return {};
  }
}

export interface GeminiCreateChatCompletionInput {
  modelName?: string;
  messages: Array<Content>;
  tools?: Array<GeminiTool>;
}

export interface GeminiCreateChatCompletionOutput {
}