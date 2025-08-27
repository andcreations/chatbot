import { ChatbotDef } from './ChatbotDef';
import { ChatbotOptions } from './ChatbotOptions';
import { ChatbotTool } from './ChatbotTool';
import { ChatbotUI } from './ChatbotUI';


export abstract class Chatbot {
  public constructor(private readonly options: ChatbotOptions) {
  }

  public async run(): Promise<void> {
    while (true) {
      console.log();
      const userInput = await ChatbotUI.readUserInput('> ');
      const { message } = await this.processUserInput(userInput);

      console.log();
      ChatbotUI.writeAssistantMessage(message);
    }
  }

  protected getChatbotDef(): ChatbotDef {
    return this.options.chatbotDef;
  }

  protected getChatbotSystemPrompt(): string {
    return this.getChatbotDef().getSystemPrompt();
  }

  protected getChatbotTools(): ChatbotTool[] {
    return this.getChatbotDef().getTools();
  }

  protected abstract processUserInput(
    userInput: string
  ): Promise<{ message: string }>;
}