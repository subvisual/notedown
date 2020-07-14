function hexToRgb(hex: string) {
import { memoize } from "lodash";
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

const hexToHsl = memoize((hex: string) => {
  let { r, g, b } = hexToRgb(hex);

  r /= 255;
  g /= 255;
  b /= 255;

  // Find greatest and smallest channel values
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  // calculate hue
  // no difference
  if (delta == 0) h = 0;
  // red is max
  else if (cmax == r) h = ((g - b) / delta) % 6;
  // green is max
  else if (cmax == g) h = (b - r) / delta + 2;
  // blue is max
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  // make negative hues positive behind 360°
  if (h < 0) h += 360;

  // calculate lightness
  l = (cmax + cmin) / 2;

  // calculate saturation
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l };
});

export function isDark(hex: string, threshold = 125) {
  const { r, g, b } = hexToRgb(hex);

  return (r * 299 + g * 587 + b * 114) / 1000 < threshold;
}

export function textColorForBackground(backgroundColor: string) {
  if (isDark(backgroundColor)) return "#FFFFFF";
  else return "#333333";
}

export function shadowColorForBackground(backgroundColor: string) {
  if (isDark(backgroundColor)) return "rgba(0, 0, 0, 1)";
  else if (isDark(backgroundColor, 170)) return "rgba(0, 0, 0, 0.50)";
  else return "rgba(0, 0, 0, 0.25)";
}

export function shadeColor(color: string, percent: number) {
  const p = isDark(color) ? percent : -1 * percent;

  const { r, g, b } = hexToRgb(color);

  let R = Math.floor((r * (100 + p)) / 100);
  let G = Math.floor((g * (100 + p)) / 100);
  let B = Math.floor((b * (100 + p)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  const RR = R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
  const GG = G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
  const BB = B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

  return "#" + RR + GG + BB;
}

export function smallContrast(color: string) {
  let { h, s, l } = hexToHsl(color);

  if (l > 50) l -= 15;
  else l += 15;

  return `hsl(${h},${s}%,${l}%)`;
}
