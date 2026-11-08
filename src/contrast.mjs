// SPDX-License-Identifier: MIT
// WCAG 2.x relative luminance and contrast ratio for sRGB hex colors.
// Pure math, no network, no I/O.

export class ColorError extends Error {
  constructor(code, detail = '') {
    super(detail ? `${code}: ${detail}` : code);
    this.name = 'ColorError';
    this.code = code;
  }
}

/** Parse '#rgb' or '#rrggbb' (hash optional, case-insensitive) -> [r,g,b]. */
export function parseHex(input) {
  if (typeof input !== 'string') throw new ColorError('NOT_STRING');
  const t = input.trim().replace(/^#/, '');
  if (t.length === 0) throw new ColorError('EMPTY');
  let full = t;
  if (/^[0-9a-fA-F]{3}$/.test(t)) full = t.split('').map((c) => c + c).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(full)) throw new ColorError('BAD_HEX');
  return [0, 2, 4].map((i) => Number.parseInt(full.slice(i, i + 2), 16));
}

const linear = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

/** Relative luminance in [0,1] per WCAG 2.x. */
export function luminance(input) {
  const [r, g, b] = parseHex(input);
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/** Contrast ratio in [1,21], lighter first internally (order-independent). */
export function contrast(a, b) {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

/** WCAG thresholds: normal text AA 4.5 / AAA 7; large text AA 3 / AAA 4.5. */
export function rate(ratio, large = false) {
  if (typeof ratio !== 'number' || !(ratio >= 1 && ratio <= 21)) throw new ColorError('BAD_RATIO');
  if (large) {
    if (ratio >= 4.5) return 'AAA-large';
    if (ratio >= 3) return 'AA-large';
    return 'fail';
  }
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  return 'fail';
}

/** Convenience: { ratio (2dp), level, levelLarge }. */
export function checkPair(a, b) {
  const ratio = contrast(a, b);
  return {
    ratio: Math.round(ratio * 100) / 100,
    level: rate(ratio, false),
    levelLarge: rate(ratio, true),
  };
}
