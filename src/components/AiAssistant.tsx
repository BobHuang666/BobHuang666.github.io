import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, X, Send, Settings, ChevronLeft,
  RotateCcw, Loader2, Bot, User, Copy, Check,
} from 'lucide-react';
import { buildKB, retrieve, buildSystemPrompt, fallbackReply } from '../lib/knowledgeBase';

// ── 类型 ──────────────────────────────────────────────────
type Role = 'user' | 'assistant' | 'system';

interface Msg {
  id: string;
  role: Role;
  content: string;
  pending?: boolean;
}

interface ApiCfg {
  key: string;
  base: string;
  model: string;
}

const STORAGE_KEY = 'ai-assistant-cfg';
const DEFAULT_CFG: ApiCfg = {
  key: '',
  base: 'https://api.openai.com/v1',
  model: 'gpt-4o-mini',
};
const SUGGESTIONS = [
  'Bob 是谁？有什么背景？',
  '介绍一下他的项目经历',
  '获得过哪些奖项？',
  '目前在做什么？',
];
const WELCOME = `你好！我是**小bot**，Bob Huang 个人网站的 AI 助手 ✨

我能回答关于 Bob 的任何问题——学习经历、项目成果、技术技能、竞赛荣誉等。你也可以点击下方快捷提问，或者直接输入你的问题。`;

// ── 流式 LLM 调用 ─────────────────────────────────────────
async function streamLLM(
  messages: { role: Role; content: string }[],
  cfg: ApiCfg,
  onChunk: (t: string) => void,
): Promise<void> {
  const res = await fetch(`${cfg.base}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cfg.key}`,
    },
    body: JSON.stringify({
      model: cfg.model,
      messages,
      max_tokens: 800,
      temperature: 0.7,
      stream: true,
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`API ${res.status}: ${txt.slice(0, 200)}`);
  }
  const reader = res.body!.getReader();
  const dec = new TextDecoder();
  let buf = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop() ?? '';
    for (const line of lines) {
      const data = line.replace(/^data:\s*/, '').trim();
      if (!data || data === '[DONE]') continue;
      try {
        const delta = JSON.parse(data).choices?.[0]?.delta?.content;
        if (delta) onChunk(delta);
      } catch { /* skip malformed */ }
    }
  }
}

// ── Markdown 轻量渲染（加粗 / 斜体 / 链接 / 换行）────────
function renderMd(text: string) {
  const lines = text.split('\n');
  return lines.map((line, li) => {
    // 处理 **bold** / *italic* / [text](url) / `code`
    const parts: (string | JSX.Element)[] = [];
    let rem = line;
    let ki = 0;
    const push = (str: string) => str && parts.push(str);
    while (rem.length > 0) {
      const bold = rem.match(/^\*\*(.+?)\*\*/);
      const italic = rem.match(/^\*(.+?)\*/);
      const link = rem.match(/^\[(.+?)\]\((.+?)\)/);
      const code = rem.match(/^`(.+?)`/);
      if (bold) { parts.push(<strong key={ki++}>{bold[1]}</strong>); rem = rem.slice(bold[0].length); }
      else if (italic) { parts.push(<em key={ki++}>{italic[1]}</em>); rem = rem.slice(italic[0].length); }
      else if (link) { parts.push(<a key={ki++} href={link[2]} className="underline text-indigo-400">{link[1]}</a>); rem = rem.slice(link[0].length); }
      else if (code) { parts.push(<code key={ki++} className="bg-black/20 rounded px-1 text-xs">{code[1]}</code>); rem = rem.slice(code[0].length); }
      else { push(rem[0]); rem = rem.slice(1); }
    }
    const isHr = line.trim() === '---';
    if (isHr) return <hr key={li} className="border-white/20 my-2" />;
    return (
      <span key={li}>
        {parts}
        {li < lines.length - 1 && <br />}
      </span>
    );
  });
}

// ── 单条消息气泡 ─────────────────────────────────────────
function Bubble({ msg, onCopy }: { msg: Msg; onCopy: (t: string) => void }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end`}>
      {/* 头像 */}
      <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs ${
        isUser ? 'bg-indigo-500' : 'bg-gradient-to-br from-violet-500 to-indigo-600'
      }`}>
        {isUser ? <User size={14} /> : <Bot size={14} />}
      </div>

      {/* 内容 */}
      <div className={`relative group max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
        isUser
          ? 'bg-indigo-500 text-white rounded-br-md'
          : 'bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 rounded-bl-md shadow-sm'
      }`}>
        {msg.pending
          ? <span className="flex gap-1 items-center h-4">
              {[0, 0.2, 0.4].map(d => (
                <span key={d} className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />
              ))}
            </span>
          : <>{renderMd(msg.content)}</>
        }
        {/* 复制按钮 */}
        {!isUser && !msg.pending && (
          <button
            onClick={() => onCopy(msg.content)}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <Copy size={10} />
          </button>
        )}
      </div>
    </div>
  );
}

// ── 设置面板 ─────────────────────────────────────────────
function SettingsPanel({ cfg, onSave, onBack }: {
  cfg: ApiCfg;
  onSave: (c: ApiCfg) => void;
  onBack: () => void;
}) {
  const [draft, setDraft] = useState(cfg);
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-3 border-b border-black/10 dark:border-white/10">
        <button onClick={onBack} className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
          <ChevronLeft size={18} />
        </button>
        <span className="font-semibold text-sm">API 配置</span>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto text-sm">
        <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
          配置 OpenAI 兼容的 API（支持 OpenAI / Groq / Cloudflare 等）。
          API Key 仅存储在本地，不会上传至任何服务器。
        </p>
        {[
          { label: 'API Base URL', key: 'base', placeholder: 'https://api.openai.com/v1' },
          { label: 'Model', key: 'model', placeholder: 'gpt-4o-mini' },
          { label: 'API Key', key: 'key', placeholder: 'sk-...' },
        ].map(({ label, key, placeholder }) => (
          <label key={key} className="block space-y-1">
            <span className="text-slate-600 dark:text-slate-300 text-xs font-medium">{label}</span>
            <input
              type={key === 'key' ? 'password' : 'text'}
              value={draft[key as keyof ApiCfg]}
              onChange={e => setDraft(prev => ({ ...prev, [key]: e.target.value }))}
              placeholder={placeholder}
              className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-mono placeholder:text-slate-400"
            />
          </label>
        ))}
        <p className="text-slate-400 dark:text-slate-500 text-xs">
          不填写 API Key 时，助手将直接展示站内检索结果，同样可用。
        </p>
      </div>
      <div className="p-3 border-t border-black/10 dark:border-white/10">
        <button
          onClick={() => { onSave(draft); onBack(); }}
          className="w-full py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors"
        >
          保存
        </button>
      </div>
    </div>
  );
}

// ── 主组件 ───────────────────────────────────────────────
const AiAssistant = () => {
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cfg, setCfg] = useState<ApiCfg>(DEFAULT_CFG);
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 'welcome', role: 'assistant', content: WELCOME },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [unread, setUnread] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 懒加载知识库（首次渲染时一次性构建）
  const kb = useMemo(() => buildKB(), []);

  // 从 localStorage 还原配置
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setCfg(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  // 滚动到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  // 打开时自动聚焦
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
      setUnread(false);
    }
  }, [open]);

  const saveCfg = useCallback((c: ApiCfg) => {
    setCfg(c);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  }, []);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || busy) return;
    setInput('');

    const userMsg: Msg = { id: Date.now().toString(), role: 'user', content: text.trim() };
    const pendingId = `pending-${Date.now()}`;
    const pendingMsg: Msg = { id: pendingId, role: 'assistant', content: '', pending: true };

    setMsgs(prev => [...prev, userMsg, pendingMsg]);
    setBusy(true);

    try {
      // RAG 检索
      const chunks = retrieve(text, kb);

      if (cfg.key.trim()) {
        // ── LLM 流式调用 ──────────────────────────────────
        const systemPrompt = buildSystemPrompt(chunks);
        const history = msgs
          .filter(m => !m.pending && m.role !== 'system')
          .slice(-8) // 最多携带 8 条历史
          .map(m => ({ role: m.role, content: m.content }));

        let accumulated = '';
        await streamLLM(
          [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user', content: text },
          ],
          cfg,
          (chunk) => {
            accumulated += chunk;
            setMsgs(prev =>
              prev.map(m => m.id === pendingId ? { ...m, content: accumulated, pending: false } : m)
            );
          },
        );
      } else {
        // ── 无 API Key：直接展示检索结果 ──────────────────
        const reply = fallbackReply(chunks);
        setMsgs(prev =>
          prev.map(m => m.id === pendingId ? { ...m, content: reply, pending: false } : m)
        );
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setMsgs(prev =>
        prev.map(m => m.id === pendingId
          ? { ...m, content: `❌ 请求失败：${errMsg}\n\n请检查 API 配置是否正确。`, pending: false }
          : m
        )
      );
    } finally {
      setBusy(false);
      if (!open) setUnread(true);
    }
  }, [busy, cfg, kb, msgs, open]);

  const clearChat = useCallback(() => {
    setMsgs([{ id: 'welcome', role: 'assistant', content: WELCOME }]);
  }, []);

  return (
    <>
      {/* ── 浮动按钮 ── */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        aria-label="打开 AI 助手"
        className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-transform duration-150 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open
            ? <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X size={20} />
              </motion.span>
            : <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Sparkles size={20} />
              </motion.span>
          }
        </AnimatePresence>
        {/* 未读红点 */}
        {unread && !open && (
          <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-rose-500 rounded-full border-2 border-white" />
        )}
      </motion.button>

      {/* ── 聊天面板 ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-22 left-6 z-50 w-80 sm:w-96 h-[520px] flex flex-col rounded-2xl overflow-hidden
              bg-white/80 dark:bg-slate-900/85 backdrop-blur-2xl
              border border-white/50 dark:border-slate-700/60
              shadow-2xl shadow-indigo-500/10"
            style={{ bottom: '5.5rem' }}
          >
            {showSettings
              ? <SettingsPanel cfg={cfg} onSave={saveCfg} onBack={() => setShowSettings(false)} />
              : <>
                  {/* 标题栏 */}
                  <div className="flex items-center gap-2 px-3.5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shrink-0">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <Bot size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-tight">小bot · AI 助手</p>
                      <p className="text-xs text-white/70 leading-tight truncate">
                        {cfg.key ? `${cfg.model}` : '知识库检索模式'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={clearChat}
                        className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                        title="清空对话"
                      >
                        <RotateCcw size={14} />
                      </button>
                      <button
                        onClick={() => setShowSettings(true)}
                        className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                        title="设置 API Key"
                      >
                        <Settings size={14} />
                      </button>
                    </div>
                  </div>

                  {/* 消息列表 */}
                  <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3">
                    {msgs.map(msg => (
                      <Bubble key={msg.id} msg={msg} onCopy={handleCopy} />
                    ))}

                    {/* 快捷提问（仅初始状态显示） */}
                    {msgs.length === 1 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {SUGGESTIONS.map(s => (
                          <button
                            key={s}
                            onClick={() => sendMessage(s)}
                            className="text-xs px-3 py-1.5 rounded-full border border-indigo-300 dark:border-indigo-700
                              text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/40
                              transition-colors"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                    <div ref={bottomRef} />
                  </div>

                  {/* 复制成功提示 */}
                  <AnimatePresence>
                    {copied && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-16 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-slate-800 text-white text-xs flex items-center gap-1.5 shadow-lg"
                      >
                        <Check size={11} /> 已复制
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* 输入区域 */}
                  <div className="shrink-0 p-3 border-t border-black/10 dark:border-white/10">
                    <div className="flex gap-2 items-end">
                      <input
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && !busy && sendMessage(input)}
                        placeholder="问点什么吧…"
                        disabled={busy}
                        className="flex-1 px-3.5 py-2.5 rounded-xl text-sm bg-black/5 dark:bg-white/10
                          border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500
                          placeholder:text-slate-400 disabled:opacity-50 transition-shadow"
                      />
                      <button
                        onClick={() => sendMessage(input)}
                        disabled={busy || !input.trim()}
                        className="w-10 h-10 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40
                          text-white flex items-center justify-center transition-colors shrink-0"
                      >
                        {busy ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      </button>
                    </div>
                    <p className="text-center text-[10px] text-slate-400 dark:text-slate-600 mt-2">
                      {cfg.key ? 'RAG 增强 · 对话历史保留' : '当前为知识库检索模式 · 点击⚙️配置 API Key 启用 LLM'}
                    </p>
                  </div>
                </>
            }
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiAssistant;
