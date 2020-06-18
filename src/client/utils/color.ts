function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

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
