import Anthropic from '@anthropic-ai/sdk';
import { MessageParam, ToolUnion } from '@anthropic-ai/sdk/resources/messages';
import { Log } from './Log';

export class AnthropicClient {
  private static instance: AnthropicClient;

  private client: Anthropic;
  private readonly modelName = 'claude-3-7-sonnet-latest';

  private constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  public static init(): void {
    AnthropicClient.instance = new AnthropicClient();
  }

  public static get(): AnthropicClient {
    if (!AnthropicClient.instance) {
      AnthropicClient.init();
    }
    return AnthropicClient.instance;
  }

  public async createChatCompletion(
    input: AnthropicCreateChatCompletionInput,
  ): Promise<AnthropicCreateChatCompletionOutput> {
    const messages = [...input.messages];
    const response = await this.client.messages.create(
      {
        model: input.modelName ?? this.modelName,
        max_tokens: 1024,
        messages: messages,
        tools: input.tools,
      },
      {},
    );

    const toolCalls = response.content.filter(message => {
      return message.type === 'tool_use';
    });
    if (toolCalls.length > 0) {
      // TODO
    }

    const textBlocks = response.content.filter(itr => itr.type === 'text');
    const textBlockCount = textBlocks.length;
    if (textBlockCount > 1) {
      Log.warn(`Multiple text blocks in Anthropic response ${textBlockCount}`);
    }

    const textBlock = textBlocks[0];
    messages.push({
      role: 'assistant',
      content: textBlock?.text ?? '(no text)',
    });

    return { messages };
  }
}

export interface AnthropicToolProperty {
  type: string;
  description: string;
}

export interface AnthropicTool {
  name: string;
  description: string;
  input_schema: {
    type: 'object',
    properties: Record<string, AnthropicToolProperty>;
    required: string[];
  };
}

export interface AnthropicCreateChatCompletionInput {
  modelName?: string;
  messages: Array<MessageParam>;
  tools?: AnthropicTool[];
}

export interface AnthropicCreateChatCompletionOutput {
  messages: Array<MessageParam>;
}