import { introduceMySelf } from "../src/test.jest";

describe('introduce my self', () => {
  it('should introduce me', () => {
    expect(introduceMySelf('Hussain', 'Ali')).toBe("Hello Hussain Ali")
  });
});