import { OpenAI } from 'openai';
import { 
  ChatCompletionMessageParam,
  ChatCompletionFunctionTool,
} from 'openai/resources/chat/completions';

export class OpenAiClient {
  private static instance: OpenAiClient;

  private client: OpenAI;
  private readonly modelName = 'gpt-4o-mini';

  private constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  public static init(): void {
    OpenAiClient.instance = new OpenAiClient();
  }

  public static get(): OpenAiClient {
    if (!OpenAiClient.instance) {
      OpenAiClient.instance = new OpenAiClient();
    }
    return OpenAiClient.instance;
  }

  public async createChatCompletion(
    input: OpenAiCreateChatCompletionInput,
  ): Promise<OpenAiCreateChatCompletionOutput> {
    const messages = [...input.messages];
    const completion = await this.client.chat.completions.create({
      model: input.modelName ?? this.modelName,
      messages,
      tools: input.tools,
    });

    const choice = completion.choices[0];
    const message = choice.message;
    const toolCalls = message.tool_calls ?? [];

    if (toolCalls.length > 0) {
      messages.push(message);
      for (const toolCall of toolCalls) {
        if (toolCall.type !== 'function') {
          continue;
        }
        
        const name = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments ?? '{}');

        const tool = input.tools?.find(tool => tool.function.name === name);  
        if (!tool) {
          throw new Error(`Tool ${name} not found`);
        }

        const result = await tool.func(args);
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }

      // follow up after tool calls
      const completion = await this.client.chat.completions.create({
        model: input.modelName ?? this.modelName,
        messages,
        tools: input.tools,
      });
      const choice = completion.choices[0];
      messages.push(choice.message);
      return {
        message: choice.message.content ?? '',
        messages,
      };
    }

    // no tool calls, return final answer
    messages.push(choice.message);
    return {
      message: choice.message.content ?? '',
      messages,
    };
  }
}

export interface OpenAiTool extends ChatCompletionFunctionTool {
  func: (args: any) => Promise<any>;
}

export interface OpenAiCreateChatCompletionInput {
  modelName?: string;
  messages: Array<ChatCompletionMessageParam>;
  tools?: Array<OpenAiTool>;
}

export interface OpenAiCreateChatCompletionOutput {
  message: string;
  messages: Array<ChatCompletionMessageParam>;
  error?: string;
  errorCode?: string;
}