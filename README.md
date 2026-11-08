# color-contrast-core

WCAG 2.x relative luminance and contrast ratio for sRGB hex colors. Zero
runtime dependencies, Node >= 22.

Part of the LOFRANO TECNOLOGIA open-source lab. MIT.

```js
import { checkPair } from './src/contrast.mjs';
checkPair('#000000', '#ffffff'); // { ratio: 21, level: 'AAA', levelLarge: 'AAA-large' }
```

```sh
npm test          # 6 tests, node:test, no dependencies
npm run demo
```

Hex only, thresholds 4.5/7 (normal) and 3/4.5 (large). MIT — see `LICENSE`.
[Versão em português](README.pt-BR.md).
