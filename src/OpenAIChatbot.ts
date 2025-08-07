import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { ChatbotUI } from './ChatbotUI';
import { OpenAiClient, OpenAiCreateChatCompletionInput } from './OpenAIClient';
import { JobBoardChatbotDef } from './JobBoardChatbotDef';
import { ChatbotDef } from './ChatbotDef';

export class OpenAIChatbot {
  private chatbotDef: ChatbotDef = new JobBoardChatbotDef();
  private messages: Array<ChatCompletionMessageParam> = [];

  public constructor() {
    this.messages.push({
      role: 'system',
      content: this.chatbotDef.getSystemPrompt(),
    });
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

  private async processUserInput(userInput: string): Promise<{
    message: string;
  }> {
    const input: OpenAiCreateChatCompletionInput = {
      messages: [
        ...this.messages,
        { role: 'user', content: userInput },
      ],
      tools: this.chatbotDef.getOpenAITools(),
    };
    const output = await OpenAiClient.get().createChatCompletion(input);
    this.messages = output.messages;
    return {
      message: output.message,
    };
  }
}