export interface ChatbotToolParameter {
  name: string;
  type: string;
  description: string;
  required?: boolean;
}

export interface ChatbotTool {
  name: string;
  description: string;
  parameters: ChatbotToolParameter[];
  func: <T= any, R = any>(args: T) => Promise<R>;
}