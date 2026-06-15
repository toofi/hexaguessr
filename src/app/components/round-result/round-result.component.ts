import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  computed,
  inject,
} from '@angular/core';
import { GameService } from '../../services/game.service';
import { drawPicker, rgbToPickerPosition } from '../../services/color.utils';

@Component({
  selector: 'app-round-result',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './round-result.component.html',
  styleUrl: './round-result.component.scss',
})
export class RoundResultComponent implements AfterViewInit {
  protected readonly game = inject(GameService);
  protected readonly result = this.game.lastResult;

  @ViewChild('canvas', { static: false }) private canvasRef!: ElementRef<HTMLCanvasElement>;

  protected readonly secondsLeft = computed(() => {
    const r = this.result();
    if (!r) return '0.00';
    return r.timeRemaining.toFixed(2);
  });

  protected readonly targetPosition = computed(() => {
    const result = this.result();
    return result ? rgbToPickerPosition(result.targetRgb) : { x: 0, y: 0 };
  });

  protected readonly chosenPosition = computed(() => this.result()?.chosenPosition ?? null);

  ngAfterViewInit(): void {
    this.renderPicker();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.renderPicker();
  }

  private renderPicker(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    drawPicker(ctx, rect.width, rect.height);
  }

  next(): void {
    this.game.nextRound();
  }
}
