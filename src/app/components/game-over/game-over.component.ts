import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { GameService } from '../../services/game.service';
import { MAX_GAME_SCORE } from '../../models/game.models';

@Component({
  selector: 'app-game-over',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.scss',
})
export class GameOverComponent {
  protected readonly game = inject(GameService);
  protected readonly maxScore = MAX_GAME_SCORE;

  protected readonly badge = computed(() => this.game.badgeFor(this.game.totalScore()));

  replay(): void {
    this.game.startGame();
  }

  toMenu(): void {
    this.game.goToMenu();
  }
}
