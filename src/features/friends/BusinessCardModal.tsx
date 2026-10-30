import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Eye,
  EyeOff,
  Download,
  RefreshCw,
  Check,
  X,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { uiText } from '../../data/uiText';
import { BUSINESS_CARD_CIPHERTEXT } from '../../data/businessCard';
import { decryptBusinessCard, type BusinessCardData } from '../../utils/crypto';
import { buildCardSvg, downloadSvgAsPng, type CardSvgResult } from './cardSvg';

type Step = 'password' | 'select' | 'preview';

const t = uiText.friends.card;
const CONFIGURED = BUSINESS_CARD_CIPHERTEXT.length > 0;

export const BusinessCardModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [step, setStep] = useState<Step>('password');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BusinessCardData | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [values, setValues] = useState<Record<string, string>>({});
  const [card, setCard] = useState<CardSvgResult | null>(null);

  const selectableKeys = useMemo(
    () => (data ? Object.keys(data.fields) : []),
    [data],
  );

  // 打开时重置状态
  useEffect(() => {
    if (open) {
      setStep('password');
      setPassword('');
      setShowPwd(false);
      setError('');
      setLoading(false);
      setData(null);
      setSelected(new Set());
      setValues({});
      setCard(null);
    }
  }, [open]);

  // Esc 关闭
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleUnlock = async () => {
    if (!password.trim()) {
      setError(t.passwordEmpty);
      return;
    }
    if (!CONFIGURED) {
      setError(t.notConfigured);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const decrypted = await decryptBusinessCard(BUSINESS_CARD_CIPHERTEXT, password);
      setData(decrypted);
      setSelected(new Set(Object.keys(decrypted.fields)));
      setValues(Object.fromEntries(Object.entries(decrypted.fields).map(([k, v]) => [k, v.value])));
      setStep('select');
    } catch {
      setError(t.passwordError);
    } finally {
      setLoading(false);
    }
  };

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const updateValue = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const buildContent = () => {
    if (!data) return null;
    const fields = selectableKeys
      .filter((k) => selected.has(k))
      .map((k) => ({
        key: k,
        label: data.fields[k].label,
        value: values[k] ?? data.fields[k].value,
      }));
    return { title: t.cardTitle, fields };
  };

  const handleGenerate = () => {
    const content = buildContent();
    if (!content) return;
    setCard(buildCardSvg(content));
    setStep('preview');
  };

  const handleDownload = () => {
    if (!card) return;
    const name = values.name || data?.fields.name?.value || '名片';
    downloadSvgAsPng(card.svg, card.width, card.height, `名片-${name}.png`);
  };

  const handleReset = () => {
    setData(null);
    setSelected(new Set());
    setValues({});
    setCard(null);
    setPassword('');
    setError('');
    setStep('password');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="关闭"
            >
              <X className="h-5 w-5" />
            </button>

            {/* 标题区 */}
            <div className="px-6 pt-6 pb-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="inline-flex w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 text-white items-center justify-center">
                  <Lock className="h-4 w-4" />
                </span>
                {t.title}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t.desc}</p>
            </div>

            <div className="px-6 pb-6">
              {step === 'password' && (
                <div className="space-y-4">
                  {!CONFIGURED && (
                    <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-3 text-sm text-amber-700 dark:text-amber-300">
                      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>{t.notConfigured}</span>
                    </div>
                  )}
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t.passwordLabel}
                  </label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={password}
                      autoFocus
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                      placeholder={t.passwordPlaceholder}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 pr-11 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      aria-label="切换口令可见"
                    >
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {error && <p className="text-sm text-rose-500">{error}</p>}
                  <button
                    onClick={handleUnlock}
                    disabled={loading}
                    className="btn-primary w-full disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t.loading}
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        {t.passwordSubmit}
                      </>
                    )}
                  </button>
                </div>
              )}

              {step === 'select' && data && (
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t.selectTitle}
                      </p>
                      <div className="flex gap-2 text-xs">
                        <button
                          onClick={() => setSelected(new Set(selectableKeys))}
                          className="px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors"
                        >
                          {t.selectAll}
                        </button>
                        <button
                          onClick={() => setSelected(new Set())}
                          className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          {t.selectNone}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{t.selectDesc}</p>
                    <div className="space-y-2">
                      {selectableKeys.map((key) => {
                        const f = data.fields[key];
                        const on = selected.has(key);
                        return (
                          <div
                            key={key}
                            className={`flex items-start gap-3 rounded-xl border p-3 transition-all ${
                              on
                                ? 'border-indigo-400 dark:border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/30'
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => toggle(key)}
                              className={`mt-0.5 shrink-0 w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                                on
                                  ? 'bg-indigo-600 border-indigo-600 text-white'
                                  : 'border-slate-300 dark:border-slate-600 text-transparent hover:border-indigo-400'
                              }`}
                              aria-label={on ? `取消展示${f.label}` : `展示${f.label}`}
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <div className="flex-1 min-w-0">
                              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                                {f.label}
                              </label>
                              <input
                                type="text"
                                value={values[key] ?? f.value}
                                disabled={!on}
                                onChange={(e) => updateValue(key, e.target.value)}
                                placeholder={f.value}
                                className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                                  on
                                    ? 'border-slate-300 dark:border-slate-600'
                                    : 'border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed'
                                }`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <button onClick={handleGenerate} className="btn-primary w-full">
                    {t.generate}
                  </button>
                </div>
              )}

              {step === 'preview' && card && (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.previewTitle}</p>
                  <div className="card-preview mx-auto max-w-xs rounded-2xl overflow-hidden shadow-lg">
                    <div dangerouslySetInnerHTML={{ __html: card.svg }} />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button onClick={handleDownload} className="btn-primary flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      {t.download}
                    </button>
                    <button
                      onClick={() => setStep('select')}
                      className="flex-1 inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      {t.back}
                    </button>
                    <button
                      onClick={handleReset}
                      className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      aria-label={t.reset}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
