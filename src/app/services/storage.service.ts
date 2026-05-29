import { Injectable, signal } from '@angular/core';
import { LeaderboardEntry } from '../models/game.models';

const STORAGE_KEY = 'hexaguessr.leaderboard.v1';
const MAX_ENTRIES = 10;

@Injectable({ providedIn: 'root' })
export class StorageService {
  readonly leaderboard = signal<LeaderboardEntry[]>(this.load());

  get bestScore(): number {
    return this.leaderboard()[0]?.score ?? 0;
  }

  add(entry: LeaderboardEntry): void {
    const next = [...this.leaderboard(), entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_ENTRIES);
    this.leaderboard.set(next);
    this.persist(next);
  }

  clear(): void {
    this.leaderboard.set([]);
    this.persist([]);
  }

  private load(): LeaderboardEntry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private persist(entries: LeaderboardEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // silently continue
    }
  }
}
