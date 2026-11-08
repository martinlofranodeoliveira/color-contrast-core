#!/usr/bin/env node
// Demo: fixed pairs, asserts exact levels. --assert exits non-zero on mismatch.
import { checkPair } from '../src/contrast.mjs';

const CASES = [
  ['#000000', '#ffffff', 21, 'AAA'],
  ['#ffffff', '#ffffff', 1, 'fail'],
  ['#777777', '#ffffff', null, 'fail'], // ratio asserted in tests
];

let failed = 0;
for (const [a, b, ratio, level] of CASES) {
  const r = checkPair(a, b);
  const pass = (ratio === null || r.ratio === ratio) && r.level === level;
  if (!pass) failed++;
  console.log(`${pass ? 'PASS' : 'FAIL'} ${a} vs ${b} -> ${r.ratio} ${r.level}/${r.levelLarge}`);
}
if (process.argv.includes('--assert') && failed > 0) process.exit(1);
if (failed > 0) process.exitCode = 1;
console.log(failed === 0 ? 'demo: all cases as expected' : `demo: ${failed} mismatch(es)`);
