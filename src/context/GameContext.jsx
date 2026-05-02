import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { gameReducer, INITIAL_STATE } from './gameReducer';
import { ALL_QUESTIONS, shuffleArray } from '../data/questions';

const GameContext = createContext(null);

const STORAGE_KEY = 'sunday_game_v2';

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE, () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Restore Set from array
        return { ...INITIAL_STATE, ...parsed };
      }
    } catch (_) { /* ignore */ }
    return INITIAL_STATE;
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) { /* ignore */ }
  }, [state]);

  const startGame = (teamNames) => {
    const pool = shuffleArray(ALL_QUESTIONS);
    dispatch({ type: 'START_GAME', teamNames, pool });
  };

  const selectAnswer = (answerIndex) => {
    dispatch({ type: 'SELECT_ANSWER', answerIndex });
  };

  const nextTurn = () => {
    dispatch({ type: 'NEXT_TURN' });
  };

  const clearAnimation = () => {
    dispatch({ type: 'CLEAR_ANIMATION' });
  };

  const useLifeline = () => {
    dispatch({ type: 'USE_LIFELINE' });
  };

  const disrupt = (targetIndex) => {
    dispatch({ type: 'DISRUPT', targetIndex });
  };

  const resetGame = () => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: 'RESET_GAME' });
  };

  return (
    <GameContext.Provider value={{
      state,
      dispatch,
      startGame,
      selectAnswer,
      nextTurn,
      clearAnimation,
      useLifeline,
      disrupt,
      resetGame,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
