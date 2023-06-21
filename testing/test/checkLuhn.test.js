import { checkLuhn, sumdigits } from '../src/js/checkLuhn';

test('Test checkLuhn', () => {
  const inputData = [
    { card: '5084840100137725', result: true },
    { card: '5121075011631319', result: true },
    { card: '5856373368004110', result: true },
    { card: '4229680011724554', result: false },
  ];
  for (const input of inputData) {
    const res = checkLuhn(input.card);
    expect(res.LastDigit === res.calcLastDigit).toBe(input.result);
  }
});

test('Test sumdigits', () => {
  const inputData = [
    { in: 10, out: 1 },
    { in: 12, out: 3 },
    { in: 14, out: 5 },
    { in: 16, out: 7 },
    { in: 18, out: 9 },
  ];
  for (const input of inputData) {
    expect(sumdigits(input.in)).toBe(input.out);
  }
});