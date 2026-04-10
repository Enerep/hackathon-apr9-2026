import { notifications } from '../data/mockData';
import Avatar from '../components/Avatar';
import { HumanBadge } from '../components/Badge';
import { Heart, MessageCircle, UserPlus } from 'lucide-react';

const typeIcon = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
};

export default function Activity() {
  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur-sm px-4 pt-2 pb-2 border-b border-tan/15">
        <h1 className="font-display italic text-xl text-dark">Activity</h1>
      </header>

      {notifications.length === 0 ? (
        <div className="text-center py-24 px-6">
          <div className="text-5xl mb-4">🌱</div>
          <p className="text-sm text-brown/60 max-w-[220px] mx-auto">
            It's quiet here. Go share something real.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-tan/10">
          <div className="px-4 py-2.5">
            <span className="text-xs font-semibold text-brown/50 uppercase tracking-wider">Recent</span>
          </div>
          {notifications.map((n) => {
            const Icon = typeIcon[n.type];
            return (
              <div key={n.id} className="flex items-center gap-3 px-4 py-3 active:bg-paper/60 transition-colors">
                <Avatar emoji={n.avatarEmoji} size={42} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-dark leading-relaxed">
                    <span className="font-semibold">{n.username}</span>{' '}
                    <HumanBadge />{' '}
                    <span className="text-brown/70">{n.message}</span>
                  </p>
                  <p className="text-[11px] text-brown/40 mt-0.5">{n.timestamp}</p>
                </div>
                <Icon size={16} strokeWidth={1.8} className="text-brown/25 shrink-0" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
