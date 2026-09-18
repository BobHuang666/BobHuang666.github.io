import type { AssistantApiConfig, AssistantRole } from './types';

/** Stream an OpenAI-compatible chat-completions response to the supplied callback. */
export async function streamAssistantReply(
  messages: { role: AssistantRole; content: string }[],
  config: AssistantApiConfig,
  onChunk: (text: string) => void,
): Promise<void> {
  const response = await fetch(`${config.base}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.key}` },
    body: JSON.stringify({
      model: config.model,
      messages,
      max_tokens: 800,
      temperature: 0.7,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${(await response.text()).slice(0, 200)}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('The API response has no readable body.');
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      const data = line.replace(/^data:\s*/, '').trim();
      if (!data || data === '[DONE]') continue;
      try {
        const text = JSON.parse(data).choices?.[0]?.delta?.content;
        if (text) onChunk(text);
      } catch {
        // Ignore malformed event fragments from compatible providers.
      }
    }
  }
}
