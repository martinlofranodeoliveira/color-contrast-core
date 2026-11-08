import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseHex, luminance, contrast, rate, checkPair, ColorError } from '../src/contrast.mjs';

describe('parsing', () => {
  it('accepts 3/6 digits, optional hash, any case', () => {
    assert.deepEqual(parseHex('#fff'), [255, 255, 255]);
    assert.deepEqual(parseHex('000000'), [0, 0, 0]);
    assert.deepEqual(parseHex('#4A8BE8'), [74, 139, 232]);
  });
  it('rejects garbage', () => {
    assert.throws(() => parseHex(''), (e) => e.code === 'EMPTY');
    assert.throws(() => parseHex('#ggg'), (e) => e.code === 'BAD_HEX');
    assert.throws(() => parseHex('#12345'), (e) => e.code === 'BAD_HEX');
    assert.throws(() => parseHex(42), (e) => e.code === 'NOT_STRING');
  });
});

describe('luminance and ratio', () => {
  it('black is 0, white is 1', () => {
    assert.equal(luminance('#000'), 0);
    assert.equal(luminance('#fff'), 1);
  });
  it('black vs white is exactly 21, same color is 1', () => {
    assert.equal(contrast('#000', '#fff'), 21);
    assert.equal(contrast('#fff', '#000'), 21);
    assert.equal(contrast('#abc', '#abc'), 1);
  });
  it('#777 on white is ~4.47 (fails AA normal, passes AA large)', () => {
    const r = contrast('#777777', '#ffffff');
    assert.ok(r > 4.4 && r < 4.6, `got ${r}`);
    const c = checkPair('#777777', '#ffffff');
    assert.equal(c.level, 'fail');
    assert.equal(c.levelLarge, 'AA-large');
  });
});

describe('rating', () => {
  it('applies WCAG thresholds', () => {
    assert.equal(rate(21), 'AAA');
    assert.equal(rate(7), 'AAA');
    assert.equal(rate(4.5), 'AA');
    assert.equal(rate(4.49), 'fail');
    assert.equal(rate(3, true), 'AA-large');
    assert.equal(rate(2.99, true), 'fail');
    assert.throws(() => rate(0.5), (e) => e.code === 'BAD_RATIO');
    assert.ok(new ColorError('X') instanceof Error);
  });
});
