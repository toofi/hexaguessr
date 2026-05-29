import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-round-result',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './round-result.component.html',
  styleUrl: './round-result.component.scss',
})
export class RoundResultComponent {
  protected readonly game = inject(GameService);
  protected readonly result = this.game.lastResult;

  protected readonly secondsLeft = computed(() => {
    const r = this.result();
    if (!r) return '0.00';
    return r.timeRemaining.toFixed(2);
  });

  next(): void {
    this.game.nextRound();
  }
}
