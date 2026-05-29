import { Injectable, computed, inject, signal } from '@angular/core';
import {
  BADGES,
  BadgeLevel,
  GameState,
  MAX_GAME_SCORE,
  MAX_ROUND_SCORE,
  RGB,
  ROUNDS_PER_GAME,
  ROUND_DURATION_SECONDS,
  RoundResult,
} from '../models/game.models';
import {
  hexToRgb,
  proximity,
  randomRgb,
  rgbDistance,
  rgbToHex,
} from './color.utils';
import { StorageService } from './storage.service';
import { TimerService } from './timer.service';

@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly timer = inject(TimerService);
  private readonly storage = inject(StorageService);

  readonly state = signal<GameState>('menu');
  readonly rounds = signal<RoundResult[]>([]);
  readonly currentTarget = signal<RGB | null>(null);
  readonly currentRoundNumber = signal(0);
  readonly lastResult = signal<RoundResult | null>(null);

  readonly totalScore = computed(() =>
    this.rounds().reduce((sum, r) => sum + r.roundScore, 0),
  );

  readonly remaining = this.timer.remaining;

  startGame(): void {
    this.rounds.set([]);
    this.lastResult.set(null);
    this.currentRoundNumber.set(0);
    this.state.set('playing');
    this.nextRound();
  }

  nextRound(): void {
    const round = this.currentRoundNumber() + 1;
    if (round > ROUNDS_PER_GAME) {
      this.endGame();
      return;
    }
    this.currentRoundNumber.set(round);
    this.currentTarget.set(randomRgb());
    this.state.set('playing');
    this.timer.start(ROUND_DURATION_SECONDS, () => this.handleTimeout());
  }

  submitGuess(chosen: RGB): void {
    const target = this.currentTarget();
    if (!target || this.state() !== 'playing') return;
    const timeRemaining = this.timer.stop();
    const distance = rgbDistance(target, chosen);
    const prox = proximity(distance);
    const roundScore = this.computeScore(distance, prox, timeRemaining);
    this.commitResult({
      roundNumber: this.currentRoundNumber(),
      targetHex: rgbToHex(target),
      targetRgb: target,
      chosenHex: rgbToHex(chosen),
      chosenRgb: chosen,
      distance,
      proximity: prox,
      timeRemaining,
      roundScore,
      isTimeout: false,
    });
  }

  private handleTimeout(): void {
    const target = this.currentTarget();
    if (!target || this.state() !== 'playing') return;
    this.commitResult({
      roundNumber: this.currentRoundNumber(),
      targetHex: rgbToHex(target),
      targetRgb: target,
      chosenHex: null,
      chosenRgb: null,
      distance: 0,
      proximity: 0,
      timeRemaining: 0,
      roundScore: 0,
      isTimeout: true,
    });
  }

  private commitResult(result: RoundResult): void {
    this.rounds.update((rs) => [...rs, result]);
    this.lastResult.set(result);
    this.state.set('round-result');
  }

  private computeScore(distance: number, prox: number, timeRemaining: number): number {
    if (distance === 0) {
      return Math.round(500 + timeRemaining * 50);
    }
    const accuracy = Math.round(prox * prox * 500);
    const timeBonus = Math.round(timeRemaining * 50 * prox);
    return accuracy + timeBonus;
  }

  private endGame(): void {
    const total = this.totalScore();
    const badge = this.badgeFor(total);
    this.storage.add({
      score: total,
      date: new Date().toISOString(),
      badge,
    });
    this.state.set('game-over');
  }

  badgeFor(score: number): BadgeLevel {
    const ratio = score / MAX_GAME_SCORE;
    return BADGES.find((b) => ratio >= b.threshold) ?? BADGES[BADGES.length - 1];
  }

  goToMenu(): void {
    this.timer.stop();
    this.state.set('menu');
    this.rounds.set([]);
    this.lastResult.set(null);
    this.currentRoundNumber.set(0);
    this.currentTarget.set(null);
  }

  // exposé pour debug / l'écran round-result
  parseHex(hex: string): RGB {
    return hexToRgb(hex);
  }
}
