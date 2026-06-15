import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { GameService } from '../../services/game.service';
import { RGB, ROUNDS_PER_GAME } from '../../models/game.models';
import { drawPicker, rgbToHex } from '../../services/color.utils';

@Component({
  selector: 'app-game',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements AfterViewInit {
  protected readonly game = inject(GameService);
  protected readonly totalRounds = ROUNDS_PER_GAME;

  @ViewChild('canvas', { static: false }) private canvasRef!: ElementRef<HTMLCanvasElement>;

  protected readonly cursorX = signal(0);
  protected readonly cursorY = signal(0);
  protected readonly cursorVisible = signal(false);

  private ctx!: CanvasRenderingContext2D;
  private isDragging = false;

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

  ngAfterViewInit(): void {
    this.initCanvas();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.initCanvas();
  }

  private initCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    this.ctx = ctx;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
    drawPicker(this.ctx, rect.width, rect.height);
  }

  protected onPointerDown(e: PointerEvent): void {
    if (this.game.state() !== 'playing') return;
    e.preventDefault();
    this.isDragging = true;
    this.cursorVisible.set(true);
    try {
      this.canvasRef.nativeElement.setPointerCapture(e.pointerId);
    } catch {
    }
    this.updateCursor(e);
  }

  protected onPointerMove(e: PointerEvent): void {
    if (!this.isDragging) return;
    e.preventDefault();
    this.updateCursor(e);
  }

  protected onPointerUp(e: PointerEvent): void {
    if (!this.isDragging) return;
    this.isDragging = false;
    try {
      this.canvasRef.nativeElement.releasePointerCapture(e.pointerId);
    } catch {
    }
    this.submitGuess();
  }

  private updateCursor(e: PointerEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    this.cursorX.set(x);
    this.cursorY.set(y);
  }

  private submitGuess(): void {
    const dpr = window.devicePixelRatio || 1;
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    const px = Math.min(canvas.width - 1, Math.max(0, Math.floor(this.cursorX() * dpr)));
    const py = Math.min(canvas.height - 1, Math.max(0, Math.floor(this.cursorY() * dpr)));
    const data = this.ctx.getImageData(px, py, 1, 1).data;
    const chosen: RGB = { r: data[0], g: data[1], b: data[2] };
    const position = {
      x: rect.width > 0 ? this.cursorX() / rect.width : 0,
      y: rect.height > 0 ? this.cursorY() / rect.height : 0,
    };
    this.cursorVisible.set(false);
    this.game.submitGuess(chosen, position);
  }
}
