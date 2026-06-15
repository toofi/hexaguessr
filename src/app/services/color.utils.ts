import { HSL, PickerPosition, RGB } from '../models/game.models';

const MAX_DISTANCE = Math.sqrt(3 * 255 * 255);

export function randomRgb(): RGB {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0').toUpperCase()).join('');
}

export function hexToRgb(hex: string): RGB {
  const value = hex.replace('#', '');
  return {
    r: parseInt(value.substring(0, 2), 16),
    g: parseInt(value.substring(2, 4), 16),
    b: parseInt(value.substring(4, 6), 16),
  };
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
        break;
      case gn:
        h = ((bn - rn) / d + 2) * 60;
        break;
      case bn:
        h = ((rn - gn) / d + 4) * 60;
        break;
    }
  }
  return { h, s: s * 100, l: l * 100 };
}

export function rgbDistance(target: RGB, chosen: RGB): number {
  const distanceR = target.r - chosen.r;
  const distanceG = target.g - chosen.g;
  const distanceB = target.b - chosen.b;
  const redMean = (target.r + chosen.r) / 2;

  return Math.sqrt(
    (2 + redMean/256) * distanceR ** 2 +
    4 * distanceG ** 2 +
    (2+(255-redMean)/256) * distanceB ** 2);
}

export function proximity(distance: number): number {
  return Math.max(0, 1 - distance / MAX_DISTANCE);
}

export function rgbToPickerPosition(rgb: RGB): PickerPosition {
  const hsl = rgbToHsl(rgb);
  return {
    x: hsl.h / 360,
    y: 1 - hsl.l / 100,
  };
}

export function drawPicker(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const hueGrad = ctx.createLinearGradient(0, 0, w, 0);
  const stops: Array<[number, string]> = [
    [0, '#ff0000'],
    [1 / 6, '#ffff00'],
    [2 / 6, '#00ff00'],
    [3 / 6, '#00ffff'],
    [4 / 6, '#0000ff'],
    [5 / 6, '#ff00ff'],
    [1, '#ff0000'],
  ];
  for (const [stop, color] of stops) {
    hueGrad.addColorStop(stop, color);
  }
  ctx.fillStyle = hueGrad;
  ctx.fillRect(0, 0, w, h);

  const lightGrad = ctx.createLinearGradient(0, 0, 0, h);
  lightGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  lightGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
  lightGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
  lightGrad.addColorStop(1, 'rgba(0, 0, 0, 1)');
  ctx.fillStyle = lightGrad;
  ctx.fillRect(0, 0, w, h);
}
