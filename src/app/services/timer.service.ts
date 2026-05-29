import { Injectable, NgZone, OnDestroy, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TimerService implements OnDestroy {
  readonly remaining = signal(0);
  readonly running = signal(false);

  private rafId: number | null = null;
  private startTime = 0;
  private duration = 0;
  private onTimeout: (() => void) | null = null;

  constructor(private readonly zone: NgZone) {}

  start(durationSeconds: number, onTimeout?: () => void): void {
    this.stop();
    this.duration = durationSeconds;
    this.onTimeout = onTimeout ?? null;
    this.startTime = performance.now();
    this.remaining.set(durationSeconds);
    this.running.set(true);
    this.zone.runOutsideAngular(() => this.tick());
  }

  stop(): number {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.running.set(false);
    return this.remaining();
  }

  ngOnDestroy(): void {
    this.stop();
  }

  private tick = (): void => {
    const elapsed = (performance.now() - this.startTime) / 1000;
    const left = Math.max(0, this.duration - elapsed);
    this.zone.run(() => this.remaining.set(left));
    if (left <= 0) {
      this.rafId = null;
      this.running.set(false);
      this.zone.run(() => this.onTimeout?.());
      return;
    }
    this.rafId = requestAnimationFrame(this.tick);
  };
}
