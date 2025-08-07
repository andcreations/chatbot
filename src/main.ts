import { OpenAIChatbot } from './OpenAIChatbot';

async function run(): Promise<void> {
  const chatbot = new OpenAIChatbot();
  await chatbot.run();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});