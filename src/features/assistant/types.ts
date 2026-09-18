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
