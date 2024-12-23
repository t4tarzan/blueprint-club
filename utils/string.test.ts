import { capitalize } from './string';

describe('String Utils', () => {
  describe('capitalize', () => {
    it('should capitalize the first letter of a string', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should handle empty strings', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle already capitalized strings', () => {
      expect(capitalize('World')).toBe('World');
    });

    it('should handle single character strings', () => {
      expect(capitalize('a')).toBe('A');
    });
  });
});
