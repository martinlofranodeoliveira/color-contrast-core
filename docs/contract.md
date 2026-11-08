# Contract — color-contrast-core

Pure ESM in `src/contrast.mjs`, zero runtime dependencies, Node >= 22.
sRGB hex only (`#rgb`/`#rrggbb`, hash optional). No alpha, no color names.

| Export | Result |
| --- | --- |
| `parseHex(input)` | `[r, g, b]` 0–255. Throws `NOT_STRING`/`EMPTY`/`BAD_HEX`. |
| `luminance(input)` | Relative luminance in [0,1] (linearized sRGB). |
| `contrast(a, b)` | Ratio in [1,21], order-independent. |
| `rate(ratio, large=false)` | `AAA`/`AA`/`fail` (normal: 7/4.5) or `AAA-large`/`AA-large`/`fail` (large: 4.5/3). |
| `checkPair(a, b)` | `{ ratio (2dp), level, levelLarge }`. |

WCAG 2.x formula; thresholds are the normative 4.5/7 (normal) and 3/4.5
(large). Pinned: black/white = 21, #777/white ≈ 4.48.
