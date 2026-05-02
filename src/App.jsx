import { AnimatePresence, motion } from 'framer-motion';
import { GameProvider, useGame } from './context/GameContext';
import TeamSetup from './components/TeamSetup';
import GameScene from './components/GameScene';
import ResultScreen from './components/ResultScreen';

function AppRouter() {
  const { state } = useGame();
  const { phase } = state;

  return (
    <AnimatePresence mode="wait">
      {phase === 'setup' && (
        <motion.div key="setup"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{ position: 'fixed', inset: 0, overflowY: 'auto' }}
        >
          <TeamSetup />
        </motion.div>
      )}

      {phase === 'game' && (
        <motion.div key="game"
          initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column' }}
        >
          <GameScene />
        </motion.div>
      )}

      {phase === 'result' && (
        <motion.div key="result"
          initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          style={{ position: 'fixed', inset: 0, overflowY: 'auto' }}
        >
          <ResultScreen />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppRouter />
    </GameProvider>
  );
}
