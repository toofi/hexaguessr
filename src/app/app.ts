import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GameService } from './services/game.service';
import { MenuComponent } from './components/menu/menu.component';
import { GameComponent } from './components/game/game.component';
import { RoundResultComponent } from './components/round-result/round-result.component';
import { GameOverComponent } from './components/game-over/game-over.component';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MenuComponent, GameComponent, RoundResultComponent, GameOverComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly game = inject(GameService);
}
