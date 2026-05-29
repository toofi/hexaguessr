import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { GameService } from '../../services/game.service';
import { ROUNDS_PER_GAME } from '../../models/game.models';
import { rgbToHex } from '../../services/color.utils';

@Component({
  selector: 'app-game',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  protected readonly game = inject(GameService);
  protected readonly totalRounds = ROUNDS_PER_GAME;

  protected readonly targetHex = computed(() => {
    const target = this.game.currentTarget();
    return target ? rgbToHex(target) : '#000000';
  });

  protected readonly seconds = computed(() => Math.floor(this.game.remaining()));
  protected readonly hundredths = computed(() => {
    const remaining = this.game.remaining();
    return Math.floor((remaining - Math.floor(remaining)) * 100)
      .toString()
      .padStart(2, '0');
  });

  protected readonly progress = computed(
    () => (this.game.currentRoundNumber() - 1) / this.totalRounds,
  );

  // Placeholder : on validera la couleur cible elle-même pour tester la boucle.
  // Sera remplacé par le canvas picker à l'étape suivante.
  pickTarget(): void {
    const target = this.game.currentTarget();
    if (target) this.game.submitGuess(target);
  }
}
