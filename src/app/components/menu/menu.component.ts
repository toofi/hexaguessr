import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GameService } from '../../services/game.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  private readonly game = inject(GameService);
  protected readonly storage = inject(StorageService);

  start(): void {
    this.game.startGame();
  }
}
