import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { ChatbotOptions, Chatbot } from '../chatbot';
import { OpenAiTool } from './OpenAITool';
import { OpenAiClient, OpenAiCreateChatCompletionInput } from './OpenAIClient';

export class OpenAIChatbot extends Chatbot {
  private openaiTools: OpenAiTool[] = [];
  private messages: Array<ChatCompletionMessageParam> = [];

  public constructor(options: ChatbotOptions) {
    super(options);
    this.openaiTools = this.createOpenAITools();
    this.messages.push({
      role: 'system',
      content: this.getChatbotSystemPrompt(),
    });
  }

  private createOpenAITools(): OpenAiTool[] {
    return this.getChatbotTools().map(tool => {
      const properties: Record<string, unknown> = {};
      tool.parameters.forEach(parameter => {
        properties[parameter.name] = {
          type: parameter.type,
          description: parameter.description,
        };
      });

      return {
        type: 'function',
        function: {
          name: tool.name,
          description: tool.description,
          parameters: {
            type: 'object',
            properties,
          },
        },
        func: tool.func,
      };
    });
  }

  protected async processUserInput(
    userInput: string
  ): Promise<{ message: string }> {
    const input: OpenAiCreateChatCompletionInput = {
      messages: [
        ...this.messages,
        { role: 'user', content: userInput },
      ],
      tools: this.openaiTools,
    };
    const output = await OpenAiClient.get().createChatCompletion(input);
    this.messages = output.messages;
    return {
      message: output.message,
    };
  }
}