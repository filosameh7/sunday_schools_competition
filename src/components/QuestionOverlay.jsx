import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';

export default function QuestionOverlay() {
  const { state, selectAnswer, useLifeline } = useGame();
  const { currentQuestion, selectedAnswer, isAnswered, answerCorrect, teams, currentTeamIndex } = state;

  const currentTeam = teams[currentTeamIndex];

  // 50:50 — track which answers have been hidden (derived each question)
  const [hiddenAnswers, setHiddenAnswers] = useState([]);

  // Reset hidden answers whenever the question changes
  useEffect(() => {
    setHiddenAnswers([]);
  }, [currentQuestion?.id]);

  if (!currentQuestion) return null;

  const handleFiftyFifty = () => {
    if (currentTeam.lifelines <= 0 || isAnswered || hiddenAnswers.length > 0) return;

    // Collect wrong answer indices
    const wrongIndices = currentQuestion.answers
      .map((_, i) => i)
      .filter(i => i !== currentQuestion.correct);
    // Shuffle and pick 2
    const shuffled = wrongIndices.sort(() => Math.random() - 0.5);
    setHiddenAnswers(shuffled.slice(0, 2));
    useLifeline();
  };

  const getButtonStyle = (index) => {
    if (!isAnswered) return 'bg-white/10 hover:bg-white/20 border-white/20 text-white';
    if (index === currentQuestion.correct) return 'bg-green-500/80 border-green-400 text-white glow-green';
    if (index === selectedAnswer && index !== currentQuestion.correct)
      return 'bg-red-500/60 border-red-400 text-white';
    return 'bg-white/5 border-white/10 text-white/30';
  };

  return (
    <motion.div
      key={currentQuestion.id}
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Question card */}
      <div className="glass rounded-3xl p-5 shadow-2xl"
           style={{ border: `1px solid ${currentTeam?.color?.hex}44`, boxShadow: `0 0 30px ${currentTeam?.color?.hex}22` }}>

        {/* Team indicator */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg
            bg-gradient-to-br ${currentTeam?.color?.bg}`}
            style={{ boxShadow: `0 0 10px ${currentTeam?.color?.hex}` }}>
            {currentTeam?.icon}
          </div>
          <span className="text-sm font-arabic font-bold" style={{ color: currentTeam?.color?.hex }}>
            {currentTeam?.name} — دورك!
          </span>
          <div className="mr-auto flex gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full"
                style={{
                  background: i < Math.round(currentTeam?.position ?? 0)
                    ? currentTeam?.color?.hex
                    : 'rgba(255,255,255,0.15)'
                }} />
            ))}
          </div>
        </div>

        {/* Question text */}
        <motion.p
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl md:text-2xl font-arabic font-bold text-white text-center py-4 leading-relaxed"
          dir="rtl"
        >
          {currentQuestion.question}
        </motion.p>

        {/* Answer buttons */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          <AnimatePresence>
            {currentQuestion.answers.map((answer, index) => {
              if (hiddenAnswers.includes(index)) return null;
              return (
                <motion.button
                  key={index}
                  layout
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                  whileHover={!isAnswered ? { scale: 1.04 } : {}}
                  whileTap={!isAnswered ? { scale: 0.96 } : {}}
                  onClick={() => !isAnswered && selectAnswer(index)}
                  disabled={isAnswered}
                  className={`relative py-3 px-4 rounded-2xl border-2 font-arabic font-bold text-lg
                    transition-all duration-300 text-right leading-snug
                    ${getButtonStyle(index)}`}
                  dir="rtl"
                >
                  {/* Correct glow pulse */}
                  {isAnswered && index === currentQuestion.correct && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      animate={{ opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      style={{ background: '#4ade8040', pointerEvents: 'none' }}
                    />
                  )}
                  <span className="text-xs opacity-60 ml-2">{['أ', 'ب', 'ج', 'د'][index]}</span>
                  {answer}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Result badge */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`mt-4 text-center py-2 rounded-xl font-arabic font-bold text-xl
                ${answerCorrect ? 'text-green-400' : 'text-red-400'}`}
            >
              {answerCorrect ? '✅ إجابة صحيحة! +1 خطوة 🚀' : '❌ إجابة خاطئة! تراجع قليلاً 😬'}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lifeline strip */}
        <div className="flex gap-2 mt-3 justify-center">
          <motion.button
            whileHover={currentTeam?.lifelines > 0 && !isAnswered ? { scale: 1.05 } : {}}
            whileTap={currentTeam?.lifelines > 0 && !isAnswered ? { scale: 0.95 } : {}}
            onClick={handleFiftyFifty}
            disabled={currentTeam?.lifelines <= 0 || isAnswered || hiddenAnswers.length > 0}
            className={`flex items-center gap-1 px-4 py-2 rounded-xl font-arabic text-sm font-bold border
              transition-all duration-200
              ${currentTeam?.lifelines > 0 && !isAnswered && hiddenAnswers.length === 0
                ? 'bg-purple-600/60 border-purple-400 text-purple-200 hover:bg-purple-500/80'
                : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'}`}
          >
            <span className="text-base">💡</span>
            <span>50:50</span>
            <span className="bg-white/20 rounded-md px-1 text-xs">{currentTeam?.lifelines}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
