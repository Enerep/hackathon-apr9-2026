import { useRef, useState } from 'react';
import { ArrowRight, MapPin, RotateCcw, Send, Users } from 'lucide-react';
import Avatar from '../components/Avatar';
import { communityMoments } from '../data/mockData';

const SWIPE_THRESHOLD = 110;

export default function Explore() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [dragX, setDragX] = useState(0);
  const [nudgeMoment, setNudgeMoment] = useState(null);
  const startX = useRef(null);
  const activePointerId = useRef(null);

  const topMoment = communityMoments[activeIndex];
  const visibleMoments = communityMoments.slice(activeIndex, activeIndex + 3);

  const resetDrag = () => {
    startX.current = null;
    activePointerId.current = null;
    setDragX(0);
  };

  const advanceCard = () => {
    if (!topMoment) return;
    setHistory((prev) => [...prev, activeIndex]);
    setActiveIndex((prev) => prev + 1);
    setNudgeMoment(topMoment);
    resetDrag();
  };

  const handlePointerDown = (event) => {
    activePointerId.current = event.pointerId;
    startX.current = event.clientX;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (startX.current === null || activePointerId.current !== event.pointerId) return;
    const delta = Math.max(0, event.clientX - startX.current);
    setDragX(delta);
  };

  const handlePointerUp = (event) => {
    if (activePointerId.current !== null && activePointerId.current !== event.pointerId) return;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    if (dragX >= SWIPE_THRESHOLD) {
      advanceCard();
      return;
    }
    resetDrag();
  };

  const handleUndo = () => {
    if (!history.length) return;
    const previousIndex = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setActiveIndex(previousIndex);
    setNudgeMoment(null);
    resetDrag();
  };

  const handleSendPing = () => {
    setNudgeMoment((prev) => (prev ? { ...prev, pingSent: true } : prev));
  };

  return (
    <div className="min-h-full bg-cream">
      <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur-sm px-4 pt-2 pb-3 border-b border-tan/15">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display italic text-2xl text-dark">Community</h1>
            <p className="mt-1 text-sm text-brown/60">
              Nearby people-sharing moments you can join.
            </p>
          </div>
          <div className="rounded-full bg-paper px-3 py-1.5 text-[11px] font-semibold text-brown/70">
            {Math.max(communityMoments.length - activeIndex, 0)} nearby now
          </div>
        </div>
      </header>

      <div className="px-4 pt-4 pb-6">
        <div className="rounded-[28px] bg-paper/85 border border-tan/25 px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-brown/70">
            <Users size={16} />
            <span>Swipe right or tap the arrow to open a gentle nudge.</span>
          </div>
        </div>

        <div className="relative mt-4 h-[560px]">
          {visibleMoments.map((moment, offset) => {
            const isTop = offset === 0;
            const tilt = isTop ? dragX * 0.06 : 0;
            const translateY = offset * 14;
            const scale = 1 - offset * 0.04;

            return (
              <article
                key={moment.id}
                className="absolute inset-0 rounded-[32px] border border-tan/20 bg-paper shadow-[0_20px_50px_rgba(61,43,31,0.12)] overflow-hidden select-none"
                style={{
                  transform: isTop
                    ? `translateX(${dragX}px) translateY(${translateY}px) rotate(${tilt}deg) scale(${scale})`
                    : `translateY(${translateY}px) scale(${scale})`,
                  opacity: 1 - offset * 0.14,
                  zIndex: visibleMoments.length - offset,
                  transition: startX.current === null ? 'transform 180ms ease, opacity 180ms ease' : 'none',
                  touchAction: isTop ? 'none' : 'auto',
                }}
                onPointerDown={isTop ? handlePointerDown : undefined}
                onPointerMove={isTop ? handlePointerMove : undefined}
                onPointerUp={isTop ? handlePointerUp : undefined}
                onPointerCancel={isTop ? resetDrag : undefined}
              >
                <div className="relative h-[300px] film-overlay film-grain">
                  <div
                    className="h-full w-full"
                    style={{ backgroundColor: moment.imageColor }}
                  />
                  <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-dark/70 via-dark/20 to-transparent px-5 pb-5 pt-10 text-cream">
                    <div className="inline-flex rounded-full bg-cream/18 px-3 py-1 text-[11px] font-semibold tracking-wide uppercase">
                      Gentle nudge
                    </div>
                    <p className="mt-3 max-w-[220px] text-xl font-display italic leading-tight">
                      {moment.nudge}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-5">
                  <div className="flex items-center gap-3">
                    <Avatar emoji={moment.avatarEmoji} size={48} />
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-dark">{moment.displayName}</p>
                      <p className="text-sm text-brown/60">@{moment.username}</p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-3xl bg-cream px-4 py-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brown/55">
                      <MapPin size={14} />
                      <span>{moment.location}</span>
                      <span>·</span>
                      <span>{moment.distance}</span>
                    </div>
                    <p className="mt-3 text-lg text-dark leading-relaxed">
                      {moment.status}
                    </p>
                    <p className="mt-3 inline-flex rounded-full bg-paper px-3 py-1 text-xs font-medium text-brown/75">
                      You both know {moment.mutualConnection}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleUndo}
                      disabled={!history.length}
                      className="flex-1 min-h-[48px] rounded-full border border-tan/25 bg-cream px-4 text-sm font-semibold text-brown disabled:opacity-35 disabled:cursor-not-allowed"
                    >
                      <span className="inline-flex items-center gap-2">
                        <RotateCcw size={16} />
                        Back
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={advanceCard}
                      disabled={!isTop}
                      className="flex-[1.2] min-h-[48px] rounded-full bg-brown px-4 text-sm font-semibold text-cream shadow-sm disabled:opacity-50"
                    >
                      <span className="inline-flex items-center gap-2">
                        Right swipe
                        <ArrowRight size={16} />
                      </span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {!topMoment && (
            <div className="absolute inset-0 rounded-[32px] border border-dashed border-tan/40 bg-paper/60 px-8 py-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream text-brown/70">
                <Users size={24} />
              </div>
              <p className="mt-5 text-2xl font-display italic text-dark">You are caught up</p>
              <p className="mt-2 text-sm leading-relaxed text-brown/65">
                Add more entries to <span className="font-mono">communityMoments</span> and they will appear here in the same swipe deck.
              </p>
              <button
                type="button"
                onClick={handleUndo}
                disabled={!history.length}
                className="mt-6 min-h-[48px] rounded-full border border-tan/25 bg-cream px-5 text-sm font-semibold text-brown disabled:opacity-35 disabled:cursor-not-allowed"
              >
                Bring the last card back
              </button>
            </div>
          )}
        </div>
      </div>

      {nudgeMoment && (
        <div
          className="fixed inset-0 z-[250] flex items-end bg-dark/40 px-4 pb-24 pt-10"
          onClick={() => setNudgeMoment(null)}
        >
          <div
            className="w-full rounded-[30px] bg-cream p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brown/45">
              Gentle nudge
            </p>
            <h2 className="mt-2 text-2xl font-display italic text-dark">
              Someone you know is here.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brown/75">
              {nudgeMoment.displayName} is at {nudgeMoment.location}. Want to join or send a quick ping first?
            </p>

            <div className="mt-4 rounded-3xl bg-paper px-4 py-3 text-sm text-dark">
              <p>{nudgeMoment.status}</p>
              <p className="mt-2 text-xs font-medium text-brown/60">
                Shared connection: {nudgeMoment.mutualConnection}
              </p>
            </div>

            {nudgeMoment.pingSent && (
              <p className="mt-4 rounded-2xl bg-cream px-3 py-2 text-sm font-medium text-brown">
                Ping sent. They’ll see that you might join.
              </p>
            )}

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setNudgeMoment(null)}
                className="flex-1 min-h-[48px] rounded-full border border-tan/25 px-4 text-sm font-semibold text-brown"
              >
                Maybe later
              </button>
              <button
                type="button"
                onClick={handleSendPing}
                className="flex-1 min-h-[48px] rounded-full bg-brown px-4 text-sm font-semibold text-cream"
              >
                <span className="inline-flex items-center gap-2">
                  <Send size={15} />
                  Send a ping
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
