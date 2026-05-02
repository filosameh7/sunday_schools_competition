import { shuffleArray } from '../data/questions';

// Number of steps to reach the dragon
export const MAX_STEPS = 8;
export const STEPS_PER_WRONG = -0.5; // half step back on wrong

export const TEAM_ICONS = ['🛡️', '⚔️', '🏹', '✝️'];
export const TEAM_COLORS = [
  { bg: 'from-blue-600 to-blue-400', border: 'border-blue-400', glow: 'shadow-blue-400', hex: '#60a5fa' },
  { bg: 'from-red-600 to-red-400',  border: 'border-red-400',  glow: 'shadow-red-400',  hex: '#f87171' },
  { bg: 'from-emerald-600 to-emerald-400', border: 'border-emerald-400', glow: 'shadow-emerald-400', hex: '#4ade80' },
  { bg: 'from-purple-600 to-purple-400', border: 'border-purple-400', glow: 'shadow-purple-400', hex: '#c084fc' },
];

export const INITIAL_STATE = {
  phase: 'setup',          // 'setup' | 'game' | 'result'
  teams: [],
  questionPool: [],        // shuffled IDs
  usedCount: 0,            // how many questions consumed
  currentTeamIndex: 0,
  currentQuestion: null,
  selectedAnswer: null,
  isAnswered: false,
  answerCorrect: null,
  disruptedTeam: null,     // index of team being disrupted
  transitioning: false,
  winner: null,
};

export function createTeam(name, iconIndex, colorIndex) {
  return {
    id: Date.now() + Math.random(),
    name,
    icon: TEAM_ICONS[iconIndex],
    color: TEAM_COLORS[colorIndex],
    position: 0,
    lifelines: 2,       // 50:50 uses left
    disrupts: 2,        // disrupt uses left
    shaking: false,
    bouncing: false,
    disrupted: false,
  };
}

export function gameReducer(state, action) {
  switch (action.type) {

    case 'START_GAME': {
      const { teamNames } = action;
      const teams = teamNames.map((name, i) => createTeam(name, i, i));
      // Always use the freshly shuffled pool passed from context
      const pool = shuffleArray(action.pool);
      const firstQ = pool[0];
      return {
        ...INITIAL_STATE,
        phase: 'game',
        teams,
        questionPool: pool,
        usedCount: 1,
        currentTeamIndex: 0,
        currentQuestion: firstQ,
        winner: null,
      };
    }

    case 'SELECT_ANSWER': {
      if (state.isAnswered) return state;
      const { answerIndex } = action;
      const correct = answerIndex === state.currentQuestion.correct;
      const teams = state.teams.map((t, i) => {
        if (i !== state.currentTeamIndex) return t;
        let newPos = t.position + (correct ? 1 : STEPS_PER_WRONG);
        newPos = Math.max(0, Math.min(MAX_STEPS, newPos));
        return { ...t, position: newPos, bouncing: correct, shaking: !correct };
      });

      const winningTeam = teams.find(t => t.position >= MAX_STEPS);
      return {
        ...state,
        teams,
        selectedAnswer: answerIndex,
        isAnswered: true,
        answerCorrect: correct,
        winner: winningTeam ? winningTeam.id : null,
      };
    }

    case 'CLEAR_ANIMATION': {
      return {
        ...state,
        teams: state.teams.map(t => ({ ...t, bouncing: false, shaking: false, disrupted: false })),
        disruptedTeam: null,
      };
    }

    case 'NEXT_TURN': {
      if (state.winner) return { ...state, phase: 'result' };
      const nextIndex = (state.currentTeamIndex + 1) % state.teams.length;
      // Safely wrap around if pool is exhausted
      const safeIndex = state.usedCount % state.questionPool.length;
      const nextQ = state.questionPool[safeIndex];
      return {
        ...state,
        // Clear animation flags inline — no separate CLEAR_ANIMATION dispatch needed
        teams: state.teams.map(t => ({ ...t, bouncing: false, shaking: false, disrupted: false })),
        disruptedTeam: null,
        currentTeamIndex: nextIndex,
        currentQuestion: nextQ,
        usedCount: state.usedCount + 1,
        selectedAnswer: null,
        isAnswered: false,
        answerCorrect: null,
        transitioning: false,
      };
    }

    case 'USE_LIFELINE': {
      // mark current team as having used a lifeline
      return {
        ...state,
        teams: state.teams.map((t, i) =>
          i === state.currentTeamIndex ? { ...t, lifelines: Math.max(0, t.lifelines - 1) } : t
        ),
      };
    }

    case 'DISRUPT': {
      const { targetIndex } = action;
      const teams = state.teams.map((t, i) => {
        if (i === state.currentTeamIndex) {
          return { ...t, disrupts: Math.max(0, t.disrupts - 1) };
        }
        if (i === targetIndex) {
          const newPos = Math.max(0, t.position - 0.5);
          return { ...t, position: newPos, disrupted: true };
        }
        return t;
      });
      return { ...state, teams, disruptedTeam: targetIndex };
    }

    case 'SET_TRANSITIONING':
      return { ...state, transitioning: action.value };

    case 'RESET_GAME':
      return { ...INITIAL_STATE, questionPool: [] };

    case 'LOAD_SAVED': {
      return { ...state, ...action.saved };
    }

    default:
      return state;
  }
}
