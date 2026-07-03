import { describe, it, expect } from 'vitest';
import { matchesPattern, extractJsonData } from './network.js';

describe('network listener helpers', () => {
  it('matches substring patterns case-sensitively', () => {
    expect(matchesPattern('https://x.com/api/comment/info?x=1', 'comment/info')).toBe(true);
    expect(matchesPattern('https://x.com/api/orders', 'comment/info')).toBe(false);
    expect(matchesPattern('https://x.com/api/', '')).toBe(true); // empty pattern matches all
  });

  it('extractJsonData parses JSON object bodies only', () => {
    expect(extractJsonData('{"a":1}')).toEqual({ a: 1 });
    expect(extractJsonData('[1,2,3]')).toBeNull();
    expect(extractJsonData('not json')).toBeNull();
  });
});