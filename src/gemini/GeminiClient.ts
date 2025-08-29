import { 
  Content,
  ContentUnion,
  GenerateContentParameters,
  GenerateContentResponse,
  GoogleGenAI,
} from '@google/genai';
import { Log } from '../Log';
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
    const messages = [...input.messages];
    const params: GenerateContentParameters = {
      model: this.modelName,
      contents: messages,
      config: {
        systemInstruction: input.systemInstruction,
        tools: [{
          functionDeclarations: input.tools,
        }],
      },
    };
    const response = await this.client.models.generateContent(params);
  
    const content = response.candidates?.[0]?.content;
    if (content) {
      messages.push(content);
    }
    Log.debug(`Gemini response:\n${JSON.stringify(response, null, 2)}`);

    const functionCalls = response.functionCalls ?? [];
    for (const functionCall of functionCalls) {
      if (!functionCall.name) {
        Log.warn(`Call by Gemini of an unknown tool`);
        continue;
      }
      const tool = (input.tools ?? []).find(tool => {
        return tool.name === functionCall.name;
      });
      if (!tool) {
        Log.warn(`Unknown tool call by Gemini: ${functionCall.name}`);
        continue;
      }

      const functionResult = await tool.func(functionCall.args);
      messages.push({
        role: 'user',
        parts: [
          {
            functionResponse: {
              id: functionCall.id,
              name: functionCall.name,
              response: {
                output: functionResult,
              },
            },
          }
        ]
      })
    }

    return {
      message: this.extractTextResponse(response),
      messages,
    };
  }

  private extractTextResponse(response: GenerateContentResponse): string {
    let text = '';
    (response.candidates ?? []).forEach(candidate => {
      (candidate?.content?.parts ?? []).forEach(part => {
        if (part.text?.length) {
          text += part.text;
        }
      });
    });
    return text;
  }
}

export interface GeminiCreateChatCompletionInput {
  modelName?: string;
  messages: Array<Content>;
  systemInstruction?: ContentUnion;
  tools?: Array<GeminiTool>;
}

export interface GeminiCreateChatCompletionOutput {
  message: string;
  messages: Array<Content>;
}