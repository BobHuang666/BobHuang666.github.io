/** AI 助手的消息与 API 配置类型 */
export type AssistantRole = 'user' | 'assistant' | 'system';

export interface AssistantMessage {
  id: string;
  role: AssistantRole;
  content: string;
  pending?: boolean;
}

export interface AssistantApiConfig {
  key: string;
  base: string;
  model: string;
}
