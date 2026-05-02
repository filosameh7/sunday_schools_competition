import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

export default function TeamControls() {
  const { state, disrupt, clearAnimation } = useGame();
  const { teams, currentTeamIndex, isAnswered } = state;

  const currentTeam = teams[currentTeamIndex];

  const handleDisrupt = (targetIndex) => {
    if (currentTeam.disrupts <= 0 || isAnswered) return;
    disrupt(targetIndex);
    // Clear disruption animation after 800ms
    setTimeout(() => clearAnimation(), 800);
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {teams.map((team, idx) => {
          if (idx === currentTeamIndex) return null; // skip self
          return (
            <motion.button
              key={team.id}
              whileHover={currentTeam.disrupts > 0 && !isAnswered ? { scale: 1.06 } : {}}
              whileTap={currentTeam.disrupts > 0 && !isAnswered ? { scale: 0.94 } : {}}
              onClick={() => handleDisrupt(idx)}
              disabled={currentTeam.disrupts <= 0 || isAnswered}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-arabic font-bold text-sm border
                transition-all duration-200
                ${currentTeam.disrupts > 0 && !isAnswered
                  ? 'bg-orange-600/60 border-orange-400 text-orange-200 hover:bg-orange-500/80'
                  : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'}`}
              style={
                currentTeam.disrupts > 0 && !isAnswered
                  ? { boxShadow: '0 0 12px rgba(251,146,60,0.4)' }
                  : {}
              }
            >
              <span>⚡</span>
              <span>اضرب {team.icon}</span>
              <span className="bg-white/20 rounded px-1 text-xs">{currentTeam.disrupts}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Team position mini-scoreboard */}
      <div className="flex gap-2 justify-center flex-wrap mt-1">
        {teams.map((team, idx) => (
          <div key={team.id}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full glass text-xs font-arabic"
            style={{
              border: `1px solid ${team.color.hex}44`,
              boxShadow: idx === currentTeamIndex ? `0 0 10px ${team.color.hex}` : 'none',
            }}
          >
            <span>{team.icon}</span>
            <span className="text-white/80">{team.name}</span>
            <span className="font-bold" style={{ color: team.color.hex }}>
              {Math.floor(team.position)}/8
            </span>
            {/* disrupted flash */}
            {team.disrupted && (
              <motion.span
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="text-red-400"
              >⚡</motion.span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
