import { AnthropicTool, AnthropicToolProperty } from './AnthropicClient';
import { Chatbot, ChatbotOptions } from '../chatbot';

export class AnthropicChatbot extends Chatbot {
  private readonly anthropicTools: AnthropicTool[];

  public constructor(options: ChatbotOptions) {
    super(options);
    this.anthropicTools = this.createAnthropicTools();
  }

  private createAnthropicTools(): AnthropicTool[] {
    return this.getChatbotTools().map(tool => {
      const requiredParameterNames = tool.parameters
        .filter(parameter => parameter.required)
        .map(parameter => parameter.name);

      const properties: Record<string, AnthropicToolProperty> = {};
      tool.parameters.forEach(parameter => {
        properties[parameter.name] = {
          type: parameter.type,
          description: parameter.description,
        };
      });

      return {
        name: tool.name,
        description: tool.description,
        input_schema: {
          type: 'object',
          properties,
          required: requiredParameterNames,
        }
      };
    });
  }

  protected async processUserInput(
    userInput: string
  ): Promise<{ message: string }> {
    return {
      message: '',
    }
  }
}