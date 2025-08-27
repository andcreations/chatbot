import { JobBoardChatbotDef } from './JobBoardChatbotDef';
import { OpenAIChatbot } from './openai';

async function run(): Promise<void> {
  const chatbot = new OpenAIChatbot({
    chatbotDef: new JobBoardChatbotDef()
  });
  await chatbot.run();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});