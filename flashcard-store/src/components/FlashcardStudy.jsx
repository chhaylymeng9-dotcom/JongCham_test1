import { useCallback, useEffect, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

/* ---------- FlashcardStudy ----------
A mobile-first, swipeable flashcard study screen. Fully self-contained and
backend-free: hand it a deck of { id, term, pinyin, translation, audioUrl }
and it owns its own session state — current card, learned/review queues,
undo history. Nothing here reads or writes outside its own props.

Swipe (or press) right = "remember"   -> card is done for this round.
Swipe (or press) left  = "review"     -> card is queued for another pass.

The deck prop is only read once, on mount (a session owns its own working
copy so an in-progress round can't be yanked out from under the user by an
unrelated parent re-render). To hand the component a genuinely different
deck, remount it with a changed `key`.
------------------------------------- */

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

const SWIPE_THRESHOLD = 100;
const FLY_DISTANCE = 600;
const SPRING_SNAP = { type: "spring", stiffness: 380, damping: 32 };
const SPRING_FLY = { type: "spring", stiffness: 260, damping: 24 };
const SPRING_STACK = { type: "spring", stiffness: 300, damping: 28 };
const SPRING_FLIP = { type: "spring", stiffness: 260, damping: 28 };

const FONT_STACK =
  "[font-family:-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,'PingFang_SC','Noto_Sans_SC','Helvetica_Neue',Arial,sans-serif]";

export default function FlashcardStudy({ deck, onClose }) {
  const [queue, setQueue] = useState(deck);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showPinyin, setShowPinyin] = useState(false);
  const [bookmarked, setBookmarked] = useState(() => new Set());
  const [learned, setLearned] = useState([]);
  const [reviewAgain, setReviewAgain] = useState([]);
  const [history, setHistory] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // One shared set of drag-derived values — only ever "live" for whichever
  // card currently sits at the top of the stack.
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-15, 15]);
  const reviewOpacity = useTransform(x, [-SWIPE_THRESHOLD - 40, -10], [1, 0]);
  const rememberOpacity = useTransform(x, [10, SWIPE_THRESHOLD + 40], [0, 1]);

  const current = queue[index];
  const done = index >= queue.length;

  const commit = useCallback(
    (direction, card) => {
      setHistory((h) => [...h, { direction, card }]);
      if (direction === "right") setLearned((l) => [...l, card.id]);
      else setReviewAgain((r) => [...r, card.id]);
      setIndex((i) => i + 1);
      setFlipped(false);
      x.set(0);
    },
    [x]
  );

  const swipe = useCallback(
    async (direction) => {
      if (isAnimating || !current) return;
      setIsAnimating(true);
      await animate(x, direction === "right" ? FLY_DISTANCE : -FLY_DISTANCE, SPRING_FLY);
      commit(direction, current);
      setIsAnimating(false);
    },
    [current, isAnimating, commit, x]
  );

  const undo = useCallback(() => {
    if (isAnimating || history.length === 0) return;
    const last = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    if (last.direction === "right") setLearned((l) => l.slice(0, -1));
    else setReviewAgain((r) => r.slice(0, -1));
    setIndex((i) => Math.max(0, i - 1));
    setFlipped(false);
    x.set(0);
  }, [history, isAnimating]);

  const toggleBookmark = useCallback(() => {
    if (!current) return;
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(current.id)) next.delete(current.id);
      else next.add(current.id);
      return next;
    });
  }, [current]);

  const playAudio = useCallback(() => {
    if (!current?.audioUrl) return;
    const audio = new Audio(current.audioUrl);
    audio.play().catch(() => {});
  }, [current]);

  const reviewHardOnes = useCallback(() => {
    const cards = reviewAgain.map((id) => deck.find((c) => c.id === id)).filter(Boolean);
    setQueue(cards);
    setIndex(0);
    setLearned([]);
    setReviewAgain([]);
    setHistory([]);
    setFlipped(false);
    x.set(0);
  }, [reviewAgain, deck, x]);

  const restartDeck = useCallback(() => {
    setQueue(deck);
    setIndex(0);
    setLearned([]);
    setReviewAgain([]);
    setHistory([]);
    setBookmarked(new Set());
    setFlipped(false);
    x.set(0);
  }, [deck, x]);

  useEffect(() => {
    function onKey(e) {
      if (done) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        swipe("left");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        swipe("right");
      } else if (e.key === " ") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        playAudio();
      } else if (e.key === "b" || e.key === "B") {
        e.preventDefault();
        toggleBookmark();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [swipe, playAudio, toggleBookmark, done]);

  function handleDragEnd(_e, info) {
    const offset = info.offset.x;
    if (Math.abs(offset) > SWIPE_THRESHOLD) {
      swipe(offset > 0 ? "right" : "left");
    } else {
      animate(x, 0, SPRING_SNAP);
    }
  }

  const stack = done ? [] : queue.slice(index, index + 3);
  const progressPct = queue.length ? (index / queue.length) * 100 : 0;

  return (
    <div className={cx("min-h-screen bg-gray-100 sm:py-8 flex justify-center", FONT_STACK)}>
      <div className="w-full max-w-[420px] bg-[#E7E7EA] min-h-screen sm:min-h-[760px] relative flex flex-col sm:rounded-[2.25rem] sm:shadow-2xl overflow-hidden">
        <Header showPinyin={showPinyin} onTogglePinyin={() => setShowPinyin((s) => !s)} onClose={onClose} />

        {!done && (
          <>
            <ProgressBar percent={progressPct} />
            <p className="text-center text-sm text-gray-500 mt-2 mb-1 tabular-nums" aria-live="polite">
              {Math.min(index + 1, queue.length)} / {queue.length} words
            </p>
          </>
        )}

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 relative [perspective:1600px]">
          {done ? (
            <Summary
              total={queue.length}
              learnedCount={learned.length}
              reviewCount={reviewAgain.length}
              onReviewHard={reviewHardOnes}
              onRestart={restartDeck}
            />
          ) : (
            <>
              <div className="relative w-[300px] h-[420px]">
                {stack.map((card, position) => (
                  <StackCard
                    key={card.id}
                    card={card}
                    position={position}
                    showPinyin={showPinyin}
                    flipped={position === 0 ? flipped : false}
                    onFlip={() => setFlipped((f) => !f)}
                    bookmarked={bookmarked.has(card.id)}
                    onToggleBookmark={toggleBookmark}
                    onPlayAudio={playAudio}
                    x={x}
                    rotate={rotate}
                    reviewOpacity={reviewOpacity}
                    rememberOpacity={rememberOpacity}
                    onDragEnd={handleDragEnd}
                    draggable={position === 0 && !isAnimating}
                  />
                ))}
              </div>

              <ActionRow
                canUndo={history.length > 0 && !isAnimating}
                onUndo={undo}
                onReview={() => swipe("left")}
                onRemember={() => swipe("right")}
                disabled={isAnimating}
              />

              <KeyHints />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- header ---------- */

function Header({ showPinyin, onTogglePinyin, onClose }) {
  return (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm px-5 pt-3 pb-3 flex flex-col gap-2 border-b border-black/5">
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={onTogglePinyin}
          aria-pressed={showPinyin}
          aria-label="Toggle pinyin"
          className={cx(
            "w-8 h-8 rounded-full flex items-center justify-center text-base font-semibold transition-colors",
            showPinyin ? "bg-[#0B62B0] text-white" : "text-[#0B62B0] hover:bg-[#0B62B0]/10"
          )}
        >
          拼
        </button>
        <button
          onClick={onClose}
          aria-label="Close"
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#0B62B0] hover:bg-[#0B62B0]/10 transition-colors"
        >
          <CloseIcon />
        </button>
      </div>
      <h1 className="text-[32px] leading-none font-bold text-[#0B62B0] tracking-tight">Flashcard</h1>
    </div>
  );
}

/* ---------- progress ---------- */

function ProgressBar({ percent }) {
  return (
    <div className="px-5 pt-3">
      <div className="h-1.5 w-full bg-gray-300/60 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-green-500 rounded-full"
          animate={{ width: `${percent}%` }}
          transition={{ type: "spring", stiffness: 220, damping: 32 }}
        />
      </div>
    </div>
  );
}

/* ---------- card stack ---------- */

function StackCard({
  card,
  position,
  showPinyin,
  flipped,
  onFlip,
  bookmarked,
  onToggleBookmark,
  onPlayAudio,
  x,
  rotate,
  reviewOpacity,
  rememberOpacity,
  onDragEnd,
  draggable,
}) {
  const isTop = position === 0;
  const stackScale = 1 - position * 0.035;
  const stackY = -position * 10;
  const stackRotate = position === 0 ? 0 : position % 2 === 0 ? 2.5 : -2.5;

  return (
    <motion.div
      className={cx(
        "absolute inset-0 rounded-[28px] bg-white shadow-[0_10px_40px_-8px_rgba(0,0,0,0.28)]",
        isTop && "cursor-grab active:cursor-grabbing touch-none"
      )}
      style={{
        zIndex: 10 - position,
        x: isTop ? x : 0,
        rotate: isTop ? rotate : undefined,
      }}
      animate={isTop ? { scale: 1, y: 0 } : { scale: stackScale, y: stackY, rotate: stackRotate }}
      transition={SPRING_STACK}
      drag={isTop && draggable ? "x" : false}
      dragElastic={1}
      onDragEnd={isTop ? onDragEnd : undefined}
      onTap={isTop ? onFlip : undefined}
      aria-hidden={!isTop}
    >
      {isTop && (
        <>
          <Stamp label="REVIEW" opacity={reviewOpacity} />
          <Stamp label="REMEMBER" opacity={rememberOpacity} />
        </>
      )}

      <div className="relative w-full h-full [transform-style:preserve-3d]">
        <motion.div
          className="absolute inset-0 [transform-style:preserve-3d]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={SPRING_FLIP}
        >
          {/* front */}
          <div className="absolute inset-0 rounded-[28px] flex flex-col items-center justify-center px-6 [backface-visibility:hidden]">
            {isTop && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                <IconButton label="Play pronunciation" onClick={(e) => { e.stopPropagation(); onPlayAudio(); }} disabled={!card.audioUrl}>
                  <SpeakerIcon />
                </IconButton>
                <IconButton
                  label={bookmarked ? "Remove bookmark" : "Bookmark this card"}
                  onClick={(e) => { e.stopPropagation(); onToggleBookmark(); }}
                >
                  <BookmarkIcon filled={bookmarked} />
                </IconButton>
              </div>
            )}

            {showPinyin && card.pinyin && (
              <p className="text-gray-400 text-base mb-3 select-none">{card.pinyin}</p>
            )}
            <p className="text-black text-[56px] leading-none font-medium text-center select-none">{card.term}</p>

            {isTop && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFlip();
                }}
                className="absolute bottom-6 text-gray-400 text-sm hover:text-gray-600 transition-colors"
              >
                Show translation
              </button>
            )}
          </div>

          {/* back */}
          <div className="absolute inset-0 rounded-[28px] flex flex-col items-center justify-center px-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <p className="text-black text-3xl font-medium text-center select-none">{card.translation}</p>
            {isTop && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFlip();
                }}
                className="absolute bottom-6 text-gray-400 text-sm hover:text-gray-600 transition-colors"
              >
                Show word
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Stamp({ label, opacity }) {
  const isReview = label === "REVIEW";
  return (
    <motion.div
      style={{ opacity }}
      className={cx(
        "absolute top-8 z-20 pointer-events-none select-none",
        "border-4 rounded-lg px-3 py-1 font-extrabold uppercase text-2xl tracking-widest",
        isReview ? "left-6 -rotate-[20deg] border-pink-500 text-pink-500" : "right-6 rotate-[20deg] border-green-500 text-green-500"
      )}
    >
      {label}
    </motion.div>
  );
}

/* ---------- actions ---------- */

function ActionRow({ canUndo, onUndo, onReview, onRemember, disabled }) {
  return (
    <div className="flex items-center justify-center gap-5 mt-7">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        aria-label="Undo last swipe"
        className="w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 disabled:opacity-30 hover:text-gray-600 transition-colors"
      >
        <UndoIcon />
      </button>
      <button
        onClick={onReview}
        disabled={disabled}
        aria-label="Mark card for review"
        className="w-16 h-16 rounded-full bg-white shadow-lg border-2 border-pink-500 flex items-center justify-center text-pink-500 disabled:opacity-40 active:scale-95 transition-transform"
      >
        <XIcon />
      </button>
      <button
        onClick={onRemember}
        disabled={disabled}
        aria-label="Mark card as remembered"
        className="w-16 h-16 rounded-full bg-white shadow-lg border-2 border-green-500 flex items-center justify-center text-green-500 disabled:opacity-40 active:scale-95 transition-transform"
      >
        <CheckIcon />
      </button>
    </div>
  );
}

function KeyHints() {
  const hints = [
    ["←", "Review"],
    ["→", "Remember"],
    ["Space", "Flip"],
    ["S", "Audio"],
    ["B", "Bookmark"],
  ];
  return (
    <div className="hidden sm:flex items-center justify-center gap-4 mt-6 text-xs text-gray-400 flex-wrap">
      {hints.map(([key, label]) => (
        <span key={label} className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded border border-gray-300 bg-white font-mono text-[10px] text-gray-500">{key}</kbd>
          {label}
        </span>
      ))}
    </div>
  );
}

/* ---------- summary ---------- */

function Summary({ total, learnedCount, reviewCount, onReviewHard, onRestart }) {
  return (
    <div className="text-center px-4 w-full max-w-[300px]">
      <p className="text-2xl font-bold text-gray-800 mb-1">Session complete</p>
      <p className="text-sm text-gray-500 mb-8">You went through {total} words.</p>

      <div className="flex items-center justify-center gap-8 mb-10">
        <div>
          <p className="text-4xl font-bold text-green-500 tabular-nums">{learnedCount}</p>
          <p className="text-xs text-gray-400 uppercase tracking-wide mt-1">Remembered</p>
        </div>
        <div>
          <p className="text-4xl font-bold text-pink-500 tabular-nums">{reviewCount}</p>
          <p className="text-xs text-gray-400 uppercase tracking-wide mt-1">To review</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {reviewCount > 0 && (
          <button onClick={onReviewHard} className="w-full py-3 rounded-full bg-[#0B62B0] text-white font-semibold hover:opacity-90 transition-opacity">
            Review the hard ones
          </button>
        )}
        <button
          onClick={onRestart}
          className="w-full py-3 rounded-full border-2 border-gray-300 text-gray-600 font-semibold hover:border-gray-400 transition-colors"
        >
          Restart deck
        </button>
      </div>
    </div>
  );
}

/* ---------- small pieces ---------- */

function IconButton({ label, onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-black/5 disabled:opacity-30 disabled:pointer-events-none transition-colors"
    >
      {children}
    </button>
  );
}

/* ---------- icons ---------- */

function SpeakerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M19 6a9 9 0 0 1 0 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity=".6" />
    </svg>
  );
}

function BookmarkIcon({ filled }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4-7 4V4.5a1 1 0 0 1 1-1z"
        fill={filled ? "#DC2626" : "none"}
        stroke="#DC2626"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function UndoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 7L4 11l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 11h10a6 6 0 1 1 0 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
