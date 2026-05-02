import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

function fireConfetti() {
  const duration = 5000;
  const end = Date.now() + duration;

  const colors = ['#facc15', '#f97316', '#4ade80', '#60a5fa', '#c084fc', '#fff'];

  const frame = () => {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();

  // Central burst
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { x: 0.5, y: 0.4 },
    colors,
  });
}

export default function ResultScreen() {
  const { state, resetGame } = useGame();
  const { teams, winner } = state;
  const firedRef = useRef(false);

  const winningTeam = teams.find(t => t.id === winner);

  useEffect(() => {
    if (!firedRef.current) {
      firedRef.current = true;
      fireConfetti();
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
         style={{ background: 'linear-gradient(135deg, #0f0a1e, #1a0a2e, #0d1a3e)' }}>

      {/* Stars */}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 4 + 1,
            height: Math.random() * 4 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}

      {/* Sun burst / rays */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div key={i}
            className="absolute left-1/2 top-1/2 origin-left"
            style={{
              width: '50vw',
              height: '2px',
              background: `linear-gradient(90deg, ${winningTeam?.color?.hex ?? '#facc15'}66, transparent)`,
              transform: `translateY(-50%) rotate(${i * 30}deg)`,
            }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 text-center">

        {/* Animated trophy */}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="text-9xl mb-4"
        >
          🏆
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: 'spring' }}
          className="font-game text-5xl md:text-6xl mb-2"
          style={{ color: winningTeam?.color?.hex ?? '#facc15', textShadow: `0 0 30px ${winningTeam?.color?.hex ?? '#facc15'}` }}
        >
          فريق الفائز!
        </motion.h1>

        {/* Winner card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 180 }}
          className="glass rounded-3xl px-10 py-6 mt-4 shadow-2xl"
          style={{
            border: `2px solid ${winningTeam?.color?.hex ?? '#facc15'}`,
            boxShadow: `0 0 60px ${winningTeam?.color?.hex ?? '#facc15'}55`,
          }}
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            className="text-7xl mb-2"
          >
            {winningTeam?.icon ?? '🛡️'}
          </motion.div>
          <div className="text-3xl font-arabic font-bold text-white">
            {winningTeam?.name ?? 'الفائز'}
          </div>
          <div className="text-lg text-yellow-300 font-arabic mt-1">
            🐉 هزم التنين وأنقذ القرية! ⛪
          </div>
        </motion.div>

        {/* All teams final positions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-6 flex gap-4 flex-wrap justify-center"
        >
          {[...teams]
            .sort((a, b) => b.position - a.position)
            .map((team, rank) => (
              <div key={team.id}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl glass font-arabic text-sm"
                style={{ border: `1px solid ${team.color.hex}55` }}
              >
                <span className="text-yellow-300 font-bold">#{rank + 1}</span>
                <span>{team.icon}</span>
                <span className="text-white">{team.name}</span>
                <span className="font-bold" style={{ color: team.color.hex }}>
                  {Math.floor(team.position)}/8
                </span>
              </div>
            ))}
        </motion.div>

        {/* Decorative crosses */}
        <div className="flex gap-6 mt-6 text-3xl opacity-40">
          <motion.span animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>✝️</motion.span>
          <motion.span animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}>✨</motion.span>
          <motion.span animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}>✝️</motion.span>
        </div>

        {/* Play again button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px #facc15' }}
          whileTap={{ scale: 0.95 }}
          onClick={resetGame}
          className="mt-8 px-10 py-4 rounded-2xl font-game text-2xl font-bold
                     bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900
                     shadow-xl shadow-yellow-400/40"
        >
          🔄 لعبة جديدة
        </motion.button>
      </div>
    </div>
  );
}
