export type GameState = 'menu' | 'playing' | 'round-result' | 'game-over';

export const ROUNDS_PER_GAME = 10;
export const ROUND_DURATION_SECONDS = 10;
export const MAX_ROUND_SCORE = 1000;
export const MAX_GAME_SCORE = MAX_ROUND_SCORE * ROUNDS_PER_GAME;

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface RoundResult {
  roundNumber: number;
  targetHex: string;
  targetRgb: RGB;
  chosenHex: string | null;
  chosenRgb: RGB | null;
  distance: number;
  proximity: number;
  timeRemaining: number;
  roundScore: number;
  isTimeout: boolean;
}

export interface LeaderboardEntry {
  score: number;
  date: string;
  badge: BadgeLevel;
}

export interface BadgeLevel {
  emoji: string;
  label: string;
  threshold: number;
  color: string;
}

export const BADGES: BadgeLevel[] = [
  { threshold: 0.95, emoji: '🎯', label: 'Eagle eye', color: '#4ade80' },
  { threshold: 0.8, emoji: '🎨', label: 'Colour expert', color: '#4ade80' },
  { threshold: 0.65, emoji: '👁', label: 'Good eye', color: '#facc15' },
  { threshold: 0.5, emoji: '🖌', label: 'Apprentice', color: '#facc15' },
  { threshold: 0.3, emoji: '😅', label: 'Colour-blind?', color: '#f87171' },
  { threshold: 0, emoji: '💀', label: 'Hopeless', color: '#f87171' },
];
