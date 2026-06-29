/**
 * 通用头像组件
 * - 旋转光环 + 在线状态小圆点
 * - 图片加载失败时渲染文字缩写 SVG
 * - size 支持 sm / md / lg 三档
 */

interface AvatarProps {
  src: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  showRing?: boolean;      // 旋转彩色光环（Hero 专用）
  showStatus?: boolean;    // 在线绿点
  className?: string;
}

const SIZE_MAP = {
  sm:  { img: 'w-16 h-16', ring: '-inset-1', dot: 'w-4 h-4' },
  md:  { img: 'w-24 h-24 md:w-28 md:h-28', ring: '-inset-1.5', dot: 'w-5 h-5' },
  lg:  { img: 'w-28 h-28 md:w-32 md:h-32', ring: '-inset-2', dot: 'w-6 h-6' },
};

const fallbackSvg = (label: string) =>
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><circle cx="48" cy="48" r="48" fill="%236366f1" fill-opacity="0.85"/><text x="50%25" y="58%25" font-size="34" fill="white" text-anchor="middle" font-family="sans-serif" font-weight="bold">${encodeURIComponent(label)}</text></svg>`;

const Avatar = ({
  src,
  name,
  size = 'md',
  showRing = false,
  showStatus = false,
  className = '',
}: AvatarProps) => {
  const s = SIZE_MAP[size];
  const initials = name
    .split(' ')
    .map((w) => w[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');

  return (
    <div className={`relative shrink-0 ${className}`}>
      {showRing && (
        <div
          className={`absolute ${s.ring} rounded-full bg-gradient-to-tr from-pink-400 via-amber-300 to-indigo-400 opacity-70 blur-md animate-[spin_8s_linear_infinite]`}
        />
      )}
      <img
        src={src}
        alt={name}
        onError={(e) => {
          (e.target as HTMLImageElement).src = fallbackSvg(initials || name.slice(0, 2));
        }}
        className={`relative ${s.img} rounded-full object-cover ${showRing ? 'ring-4 ring-white/70 shadow-2xl' : 'border-4 border-white dark:border-slate-800 shadow-lg'} transition-transform duration-300 hover:scale-105`}
        loading="eager"
        decoding="async"
      />
      {showStatus && (
        <span
          className={`absolute bottom-1 right-1 ${s.dot} bg-green-400 rounded-full ring-2 ring-white dark:ring-slate-800 shadow flex items-center justify-center`}
        >
          <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-60" />
        </span>
      )}
    </div>
  );
};

export default Avatar;
