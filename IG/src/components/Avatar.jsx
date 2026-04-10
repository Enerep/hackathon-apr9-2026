export default function Avatar({ emoji, size = 40, ring = false, seen = false }) {
  const px = `${size}px`;
  return (
    <div
      className={`rounded-full flex items-center justify-center shrink-0 ${
        ring ? (seen ? 'story-ring-seen p-[2px]' : 'story-ring-unseen p-[2px]') : ''
      }`}
      style={ring ? { width: size + 6, height: size + 6 } : {}}
    >
      <div
        className="rounded-full bg-paper flex items-center justify-center select-none"
        style={{ width: px, height: px, fontSize: size * 0.5 }}
      >
        {emoji}
      </div>
    </div>
  );
}
