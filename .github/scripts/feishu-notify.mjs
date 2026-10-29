// 飞书自定义机器人通知脚本（ci.yml / deploy.yml / uptime.yml / daily-report.yml 共用）
//
// 用法：在 GitHub Actions 步骤中 export 以下环境变量后执行 `node .github/scripts/feishu-notify.mjs`：
//   FEISHU_WEBHOOK_URL    必填，机器人的 Webhook 地址；未配置时跳过发送（exit 0），避免流水线报红
//   FEISHU_WEBHOOK_SECRET 可选，机器人在飞书后台开启「签名校验」时填写
//   FEISHU_TITLE          卡片标题
//   FEISHU_COLOR          头部颜色：blue / green / red / orange / purple / grey / turquoise / yellow（默认 blue）
//   FEISHU_BODY           正文，支持 lark_md（**粗体**、[文字](链接)、`代码`），换行用真实换行
//   FEISHU_NOTE           底部灰色小字备注
//   FEISHU_BUTTON_TEXT / FEISHU_BUTTON_URL       单个跳转按钮
//   FEISHU_BUTTONS_JSON   多个按钮，JSON 数组 [{"text":"...","url":"..."}]，优先于单个按钮
//
// 飞书对卡片消息体有约 30KB 上限，正文请保持精简。
import { createHmac } from 'node:crypto'

const WEBHOOK_URL = process.env.FEISHU_WEBHOOK_URL?.trim()

if (!WEBHOOK_URL) {
  console.warn('[feishu] 未配置 FEISHU_WEBHOOK_URL，跳过发送')
  process.exit(0)
}

const title = process.env.FEISHU_TITLE?.trim() || '通知'
const color = process.env.FEISHU_COLOR?.trim() || 'blue'
const body = process.env.FEISHU_BODY?.trim()
const note = process.env.FEISHU_NOTE?.trim()

function buildButtons() {
  const raw = process.env.FEISHU_BUTTONS_JSON?.trim()
  if (raw) {
    return JSON.parse(raw).map(({ text, url, type = 'primary' }) => ({
      tag: 'button',
      text: { tag: 'plain_text', content: text },
      url,
      type,
    }))
  }
  const text = process.env.FEISHU_BUTTON_TEXT?.trim()
  const url = process.env.FEISHU_BUTTON_URL?.trim()
  if (text && url) {
    return [{ tag: 'button', text: { tag: 'plain_text', content: text }, url, type: 'primary' }]
  }
  return []
}

const elements = []
if (body) elements.push({ tag: 'div', text: { tag: 'lark_md', content: body } })
const buttons = buildButtons()
if (buttons.length) elements.push({ tag: 'action', actions: buttons })
if (!elements.length) {
  elements.push({ tag: 'div', text: { tag: 'lark_md', content: '（无内容）' } })
}
if (note) elements.push({ tag: 'note', elements: [{ tag: 'plain_text', content: note }] })

const payload = {
  msg_type: 'interactive',
  card: {
    config: { wide_screen_mode: true },
    header: { template: color, title: { tag: 'plain_text', content: title } },
    elements,
  },
}

// 签名算法：以 `${timestamp}\n${secret}` 为 key，空串为 message 做 HMAC-SHA256 后 Base64
const secret = process.env.FEISHU_WEBHOOK_SECRET?.trim()
if (secret) {
  const timestamp = String(Math.floor(Date.now() / 1000))
  payload.timestamp = timestamp
  payload.sign = createHmac('sha256', `${timestamp}\n${secret}`).update('').digest('base64')
}

let resp
try {
  resp = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10_000),
  })
} catch (err) {
  console.error(`[feishu] 请求异常：${err.message}`)
  process.exit(1)
}

const text = await resp.text()
if (!resp.ok) {
  console.error(`[feishu] HTTP ${resp.status}：${text}`)
  process.exit(1)
}
// 成功响应：{"code":0,"msg":"success"}（旧版字段为 StatusCode）
let data
try {
  data = JSON.parse(text)
} catch {
  console.error(`[feishu] 响应非 JSON：${text}`)
  process.exit(1)
}
const code = data.code ?? data.StatusCode
if (code !== 0) {
  console.error(`[feishu] 发送失败：${text}`)
  process.exit(1)
}
console.log(`[feishu] 已发送：${title}`)
