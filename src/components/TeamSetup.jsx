import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { TEAM_ICONS, TEAM_COLORS } from '../context/gameReducer';

export default function TeamSetup() {
  const { startGame } = useGame();
  const [teamCount, setTeamCount] = useState(2);
  const [teamNames, setTeamNames] = useState(['فريق النور', 'فريق النصر', 'فريق الإيمان', 'فريق الرجاء']);

  const handleStart = () => {
    const names = teamNames.slice(0, teamCount).map(n => n.trim() || `فريق ${TEAM_ICONS[teamNames.indexOf(n)]}`);
    startGame(names);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
         style={{ background: 'linear-gradient(135deg, #0f0a1e 0%, #1a0a2e 40%, #0d1a3e 100%)' }}>

      {/* Animated stars */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}

      {/* Light rays */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{
          position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '600px',
          background: 'radial-gradient(ellipse at center, rgba(250,204,21,0.15) 0%, transparent 70%)',
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="relative z-10 flex flex-col items-center w-full max-w-2xl px-4"
      >
        {/* Title */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-center mb-2"
        >
          <div className="text-7xl mb-2">🛡️</div>
          <h1 className="font-game text-4xl md:text-5xl text-yellow-300 drop-shadow-lg"
              style={{ textShadow: '0 0 30px #facc15, 0 0 60px #f59e0b' }}>
            مع مار جرجس
          </h1>
          <p className="text-blue-200 text-lg mt-1 font-arabic">رحلة الإيمان ضد التنين 🐉</p>
        </motion.div>

        {/* Cross decoration */}
        <div className="text-4xl my-3 opacity-40">✝️</div>

        {/* Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="glass rounded-3xl p-6 w-full shadow-2xl"
          style={{ border: '1px solid rgba(250,204,21,0.3)', boxShadow: '0 0 40px rgba(250,204,21,0.1)' }}
        >
          {/* Team count selector */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-yellow-300 font-arabic text-lg font-bold">عدد الفرق:</span>
            {[2, 3, 4].map(n => (
              <motion.button key={n}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setTeamCount(n)}
                className={`w-12 h-12 rounded-xl font-game text-xl font-bold transition-all duration-200
                  ${teamCount === n
                    ? 'bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/50'
                    : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
              >
                {n}
              </motion.button>
            ))}
          </div>

          {/* Team name inputs */}
          <div className="space-y-3">
            <AnimatePresence>
              {Array.from({ length: teamCount }).map((_, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ delay: i * 0.1, type: 'spring' }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                    bg-gradient-to-br ${TEAM_COLORS[i].bg} shadow-lg`}
                    style={{ boxShadow: `0 0 12px ${TEAM_COLORS[i].hex}60` }}
                  >
                    {TEAM_ICONS[i]}
                  </div>
                  <input
                    type="text"
                    value={teamNames[i]}
                    onChange={e => {
                      const next = [...teamNames];
                      next[i] = e.target.value;
                      setTeamNames(next);
                    }}
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3
                               text-white font-arabic text-lg placeholder-white/40 outline-none
                               focus:border-yellow-400 focus:shadow-lg transition-all text-right"
                    placeholder={`اسم الفريق ${i + 1}`}
                    dir="rtl"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Start button */}
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 0 30px #facc15' }}
            whileTap={{ scale: 0.96 }}
            onClick={handleStart}
            className="mt-6 w-full py-4 rounded-2xl font-game text-2xl font-bold
                       bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900
                       shadow-xl shadow-yellow-400/40 transition-all duration-200"
          >
            🚀 ابدأ الرحلة!
          </motion.button>
        </motion.div>

        {/* Info strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-4 flex gap-4 text-sm text-blue-200 font-arabic"
        >
          <span>🗺️ 8 خطوات</span>
          <span>•</span>
          <span>⚡ تحديات خاصة</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
