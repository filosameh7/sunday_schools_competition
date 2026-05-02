import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { MAX_STEPS } from '../context/gameReducer';

// Background zones based on position
const ZONES = [
  { min: 0, max: 2,   label: 'القرية',     sky: '#1a3a6e', ground: '#8b6914', accent: '#f5e6a3' },
  { min: 3, max: 4,   label: 'الغابة',     sky: '#0d3b1e', ground: '#3a5a2a', accent: '#86efac' },
  { min: 5, max: 6,   label: 'القلعة',     sky: '#1a1a2e', ground: '#4a4a6a', accent: '#c4b5fd' },
  { min: 7, max: 8,   label: 'كهف التنين', sky: '#2d0606', ground: '#5c1a1a', accent: '#fca5a5' },
];

function getZone(position) {
  return ZONES.find(z => position >= z.min && position <= z.max) || ZONES[0];
}

// Map step size in px — the entire map is 1100px wide internally
const MAP_WIDTH = 1100;
const STEP_PX = MAP_WIDTH / MAX_STEPS;

export default function MapWorld() {
  const { state } = useGame();
  const { teams, currentTeamIndex } = state;

  // Calculate the "dominant" zone based on most advanced team
  const maxPos = Math.max(...teams.map(t => t.position));
  const zone = getZone(maxPos);

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '260px' }}>

      {/* Sky gradient — changes by zone */}
      <motion.div
        className="absolute inset-0"
        animate={{ background: `linear-gradient(to bottom, ${zone.sky} 0%, ${zone.sky}88 60%, transparent 100%)` }}
        transition={{ duration: 1.5 }}
        style={{ zIndex: 0 }}
      />

      {/* Decorative background elements per zone */}
      <ZoneDecor zone={zone} maxPos={maxPos} />

      {/* Ground strip */}
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: '55px', zIndex: 1 }}
        animate={{ background: `linear-gradient(to top, ${zone.ground} 0%, ${zone.ground}88 70%, transparent 100%)` }}
        transition={{ duration: 1.5 }}
      />

      {/* Path track */}
      <div className="absolute bottom-10 left-0 right-0 flex items-center px-6" style={{ zIndex: 2 }}>
        <PathTrack teams={teams} maxPos={maxPos} currentTeamIndex={currentTeamIndex} />
      </div>

      {/* Zone label */}
      <motion.div
        key={zone.label}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 0.7, y: 0 }}
        className="absolute top-2 left-4 text-xs font-arabic font-bold px-2 py-1 rounded-full"
        style={{ background: 'rgba(0,0,0,0.4)', color: zone.accent, zIndex: 10 }}
      >
        📍 {zone.label}
      </motion.div>
    </div>
  );
}

function ZoneDecor({ zone, maxPos }) {
  const pos = maxPos;

  if (pos <= 2) return (
    // Village
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      <div className="absolute bottom-12 left-1/4 text-4xl cloud-drift opacity-80">☁️</div>
      <div className="absolute bottom-12 right-1/3 text-3xl cloud-drift-slow opacity-60">☁️</div>
      <div className="absolute top-4 left-10 text-3xl animate-sparkle">✨</div>
      <div className="absolute top-3 right-20 text-2xl animate-sparkle" style={{ animationDelay: '1s' }}>✝️</div>
      <div className="absolute bottom-14 left-[15%] text-4xl">🏠</div>
      <div className="absolute bottom-14 left-[30%] text-3xl">⛪</div>
      <div className="absolute bottom-14 right-[20%] text-4xl">🌾</div>
    </div>
  );

  if (pos <= 4) return (
    // Forest
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      <div className="absolute bottom-12 left-[10%] text-5xl">🌳</div>
      <div className="absolute bottom-12 left-[25%] text-4xl">🌲</div>
      <div className="absolute bottom-12 right-[15%] text-5xl">🌳</div>
      <div className="absolute bottom-12 right-[30%] text-4xl">🌲</div>
      <div className="absolute top-5 left-1/3 text-3xl cloud-drift opacity-50">🌫️</div>
      <div className="absolute top-3 right-10 text-2xl animate-sparkle">✨</div>
    </div>
  );

  if (pos <= 6) return (
    // Castle
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      <div className="absolute bottom-12 right-[10%] text-5xl">🏰</div>
      <div className="absolute bottom-12 left-[15%] text-4xl">⛰️</div>
      <div className="absolute bottom-12 left-[35%] text-3xl">🗡️</div>
      <div className="absolute top-5 left-1/4 text-3xl cloud-drift opacity-40">☁️</div>
      <div className="absolute top-4 right-1/4 text-2xl animate-sparkle">⚔️</div>
    </div>
  );

  // Dragon cave
  return (
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      <div className="absolute bottom-12 left-[10%] text-4xl">🔥</div>
      <div className="absolute bottom-12 right-[10%] text-4xl">🔥</div>
      <div className="absolute bottom-14 left-1/3 text-3xl opacity-80 animate-sparkle">💥</div>
      <div className="absolute top-4 left-1/2 text-3xl animate-sparkle" style={{ animationDelay: '0.5s' }}>🌋</div>
      <div className="absolute top-3 right-10 text-4xl animate-sparkle">🐉</div>
    </div>
  );
}

function PathTrack({ teams, maxPos, currentTeamIndex }) {
  const totalSteps = MAX_STEPS;

  return (
    <div className="relative w-full" style={{ height: '80px' }}>
      {/* The road */}
      <div className="absolute bottom-6 left-0 right-0 h-4 rounded-full"
           style={{ background: 'linear-gradient(90deg, #fbbf24 0%, #f97316 50%, #ef4444 100%)', opacity: 0.7 }} />

      {/* Step dots */}
      {Array.from({ length: totalSteps + 1 }).map((_, i) => {
        const pct = (i / totalSteps) * 100;
        const isCurrent = Math.round(maxPos) === i;
        return (
          <div key={i}
            className={`absolute bottom-4 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center
              ${i === totalSteps ? 'text-2xl -bottom-1' : 'bg-white/30'}`}
            style={{ left: `calc(${pct}% - 12px)`, zIndex: 3 }}
          >
            {i === totalSteps ? '🐉' : (
              <span className="text-[8px] font-bold text-white">{i}</span>
            )}
          </div>
        );
      })}

      {/* Team characters — each in its own lane to avoid overlap */}
      {teams.map((team, idx) => {
        const pct = (team.position / totalSteps) * 100;
        const isActive = idx === currentTeamIndex;
        // Lanes: alternate above and below the road
        const laneOffsets = [44, 10, 66, -2]; // bottom px per lane
        const laneBottom = laneOffsets[idx] ?? 30 + idx * 20;

        return (
          <motion.div
            key={team.id}
            className="absolute flex flex-col items-center"
            style={{ zIndex: 10 + idx, bottom: `${laneBottom}px` }}
            animate={{ left: `calc(${pct}% - 20px)` }}
            transition={{ type: 'spring', stiffness: 110, damping: 15 }}
          >
            {/* Glow ring for active team */}
            {isActive && (
              <motion.div
                className="absolute rounded-full"
                animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0.2, 0.8] }}
                transition={{ duration: 1.1, repeat: Infinity }}
                style={{
                  background: team.color.hex,
                  filter: 'blur(8px)',
                  width: '44px', height: '44px',
                  top: '-4px', left: '-4px',
                  zIndex: -1,
                }}
              />
            )}

            {/* Shake / bounce / disrupt wrapper */}
            <motion.div
              animate={
                team.shaking
                  ? { x: [-10, 10, -10, 10, -6, 6, 0] }
                  : team.bouncing
                  ? { y: [0, -28, -12, -20, 0] }
                  : team.disrupted
                  ? { x: [-16, 16, -16, 16, -8, 8, 0], rotate: [-6, 6, -6, 6, 0] }
                  : {}
              }
              transition={{ duration: 0.5 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xl
                bg-gradient-to-br ${team.color.bg} shadow-lg relative`}
              style={{
                border: `2px solid ${team.color.hex}`,
                boxShadow: isActive
                  ? `0 0 16px ${team.color.hex}, 0 0 4px #fff4`
                  : `0 2px 8px ${team.color.hex}44`,
              }}
            >
              {team.icon}
            </motion.div>

            {/* Team name tag */}
            <div
              className="text-[9px] font-arabic text-white mt-0.5 px-1.5 py-0.5 rounded-md whitespace-nowrap"
              style={{ background: `${team.color.hex}88` }}
            >
              {team.name}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
