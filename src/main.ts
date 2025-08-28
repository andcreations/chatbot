import { GeminiClient } from './gemini';
import { GeminiChatbot } from './gemini/GeminiChatbot';
import { OpenAIChatbot } from './openai';
import { JobBoardChatbotDef } from './JobBoardChatbotDef';

async function run(): Promise<void> {
  // const chatbot = new OpenAIChatbot({
  //   chatbotDef: new JobBoardChatbotDef()
  // });
  // await chatbot.run();

  const chatbot = new GeminiChatbot({
    chatbotDef: new JobBoardChatbotDef()
  });
  await chatbot.run();

  // const gemini = GeminiClient.get();
  // const res = await gemini.generateContent('Why is the sky blue?');
  // console.log(res);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});