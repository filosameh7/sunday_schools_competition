import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import MapWorld from './MapWorld';
import QuestionOverlay from './QuestionOverlay';
import TeamControls from './TeamControls';
import { MAX_STEPS } from '../context/gameReducer';

// Screen flash component for disrupt
function DisruptFlash({ active }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-50"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ background: 'rgba(220, 38, 38, 0.4)' }}
        />
      )}
    </AnimatePresence>
  );
}

// Turn transition banner
function TurnBanner({ team, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-0 left-0 right-0 z-40 flex justify-center py-3"
          style={{ pointerEvents: 'none' }}
        >
          <div
            className="glass px-8 py-3 rounded-b-3xl font-arabic font-bold text-xl text-white"
            style={{
              border: `1px solid ${team?.color?.hex}66`,
              boxShadow: `0 4px 30px ${team?.color?.hex}55`,
            }}
          >
            <span style={{ color: team?.color?.hex }}>{team?.icon}</span>
            {' '}دور {team?.name}! 🎯
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function GameScene() {
  const { state, nextTurn, clearAnimation, resetGame } = useGame();
  const {
    teams,
    currentTeamIndex,
    isAnswered,
    answerCorrect,
    disruptedTeam,
  } = state;

  const currentTeam = teams[currentTeamIndex];
  const [showBanner, setShowBanner] = useState(true);
  const [flashRed, setFlashRed] = useState(false);
  // Guard against double-firing in React StrictMode
  const advanceGuard = useRef(false);

  // Show banner briefly at start of each turn
  useEffect(() => {
    setShowBanner(true);
    const t = setTimeout(() => setShowBanner(false), 2000);
    return () => clearTimeout(t);
  }, [currentTeamIndex]);

  // Handle disrupt flash
  useEffect(() => {
    if (disruptedTeam !== null) {
      setFlashRed(true);
      setTimeout(() => setFlashRed(false), 500);
    }
  }, [disruptedTeam]);

  // Auto advance after answer — single flat timer, guard prevents double calls
  useEffect(() => {
    // Reset guard when new turn begins
    if (!isAnswered) {
      advanceGuard.current = false;
      return;
    }
    if (advanceGuard.current) return;
    advanceGuard.current = true;

    const hasWinner = teams.some(t => t.position >= MAX_STEPS);
    const delay = hasWinner ? 2200 : 2000;

    const timer = setTimeout(() => {
      nextTurn(); // NEXT_TURN clears animations atomically in the reducer
    }, delay);

    return () => clearTimeout(timer);
  }, [isAnswered]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="relative flex flex-col"
      style={{
        minHeight: '100dvh',
        background: 'linear-gradient(180deg, #050510 0%, #0a0a20 50%, #060614 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Red flash on disrupt */}
      <DisruptFlash active={flashRed} />

      {/* Turn banner */}
      <TurnBanner team={currentTeam} visible={showBanner} />

      {/* ── TOP HUD ── */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1 relative z-10 flex-shrink-0">
        <button
          onClick={resetGame}
          className="text-white/40 hover:text-white/80 font-arabic text-sm transition-colors"
        >
          ↩ خروج
        </button>
        <div className="text-center">
          <div className="text-yellow-300 font-game text-base">
            ✝️ رحلة مار جرجس ✝️
          </div>
          <div className="text-white/50 text-xs font-arabic">
            السؤال #{state.usedCount} من {state.questionPool.length}
          </div>
        </div>
        {/* Active team badge */}
        <div
          className="flex items-center gap-1 px-3 py-1 rounded-full glass font-arabic text-sm"
          style={{ border: `1px solid ${currentTeam?.color?.hex}66`, color: currentTeam?.color?.hex }}
        >
          {currentTeam?.icon} {currentTeam?.name}
        </div>
      </div>

      {/* ── MAP WORLD ── */}
      <div
        className="relative z-10 mx-2 rounded-2xl overflow-hidden flex-shrink-0"
        style={{
          boxShadow: '0 0 30px rgba(250,204,21,0.1)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <MapWorld />
      </div>

      {/* ── QUESTION CARD ── */}
      <div className="flex-1 flex flex-col gap-2 px-3 pt-3 pb-3 relative z-10 overflow-y-auto">
        {/* Key forces a fresh mount (and fresh enter animation) every turn */}
        <motion.div
          key={`q-${state.currentTeamIndex}-${state.usedCount}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        >
          <QuestionOverlay />
        </motion.div>

        <TeamControls />
      </div>

      {/* ── Floating particles on correct answer ── */}
      <AnimatePresence>
        {isAnswered && answerCorrect && (
          <>
            {['⭐', '✨', '🌟', '💫', '🎉', '🏅', '✝️', '🛡️'].map((emoji, i) => (
              <motion.div
                key={i}
                className="fixed pointer-events-none text-2xl"
                style={{
                  left: `${15 + Math.random() * 70}%`,
                  top: `${25 + Math.random() * 30}%`,
                  zIndex: 30,
                }}
                initial={{ opacity: 1, scale: 0.5, y: 0 }}
                animate={{ opacity: 0, scale: 1.5, y: -80 }}
                transition={{ duration: 1, delay: i * 0.1 }}
              >
                {emoji}
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
