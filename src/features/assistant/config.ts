import type { AssistantApiConfig } from './types';

export const ASSISTANT_STORAGE_KEY = 'ai-assistant-cfg';

export const DEFAULT_ASSISTANT_CONFIG: AssistantApiConfig = {
  key: '',
  base: 'https://api.openai.com/v1',
  model: 'gpt-4o-mini',
};
