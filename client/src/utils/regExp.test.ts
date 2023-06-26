import {
  comma,
  dotAndZeroes,
  floatNumberWithUpTo18DecimalPlaces,
  floatNumberWithUpTo2DecimalPlaces,
  numbersOnly,
  percentageOnly,
} from './regExp';

const regExpTestCases = [
  {
    name: 'floatNumberWithUpTo2DecimalPlaces',
    regExp: floatNumberWithUpTo2DecimalPlaces,
    testCases: [
      { expectedValue: true, test: '1' },
      { expectedValue: true, test: '1.0' },
      { expectedValue: true, test: '1.00' },
      { expectedValue: false, test: '1.000' },
      { expectedValue: false, test: '1.0000' },
      { expectedValue: false, test: '1.00000' },
      { expectedValue: false, test: '1.000000' },
      { expectedValue: true, test: '1.' },
      { expectedValue: false, test: '.000000000000000000' },
      { expectedValue: false, test: '1.a' },
      { expectedValue: false, test: '1.-' },
      { expectedValue: false, test: 'abc' },
      { expectedValue: false, test: '+123123123' },
      { expectedValue: false, test: '+12312awdawda' },
      { expectedValue: false, test: '+adawdawd' },
      { expectedValue: false, test: 'adawdawd' },
      { expectedValue: false, test: 'test' },
      { expectedValue: false, test: '+673829123' },
      { expectedValue: false, test: '/13123123123123' },
      { expectedValue: true, test: '999999999' },
    ],
  },
  {
    name: 'floatNumberWithUpTo18DecimalPlaces',
    regExp: floatNumberWithUpTo18DecimalPlaces,
    testCases: [
      { expectedValue: true, test: '1' },
      { expectedValue: true, test: '1.0' },
      { expectedValue: true, test: '1.000' },
      { expectedValue: true, test: '1.0000' },
      { expectedValue: true, test: '1.00000' },
      { expectedValue: true, test: '1.000000' },
      { expectedValue: true, test: '1.0000000' },
      { expectedValue: true, test: '1.00000000' },
      { expectedValue: true, test: '1.000000000' },
      { expectedValue: true, test: '1.0000000000' },
      { expectedValue: true, test: '1.00000000000' },
      { expectedValue: true, test: '1.000000000000' },
      { expectedValue: true, test: '1.0000000000000' },
      { expectedValue: true, test: '1.00000000000000' },
      { expectedValue: true, test: '1.000000000000000' },
      { expectedValue: true, test: '1.000000000000000' },
      { expectedValue: true, test: '1.0000000000000000' },
      { expectedValue: true, test: '1.000000000000000000' }, // 18 decimal places
      { expectedValue: false, test: '1.0000000000000000000' }, // 19 decimal places
      { expectedValue: true, test: '1.' },
      { expectedValue: false, test: '.000000000000000000' },
      { expectedValue: false, test: '1.a' },
      { expectedValue: false, test: '1.-' },
      { expectedValue: false, test: 'abc' },
      { expectedValue: false, test: '+123123123' },
      { expectedValue: false, test: '+12312awdawda' },
      { expectedValue: false, test: '+adawdawd' },
      { expectedValue: false, test: 'adawdawd' },
      { expectedValue: false, test: 'test' },
      { expectedValue: false, test: '+673829123' },
      { expectedValue: false, test: '/13123123123123' },
      { expectedValue: true, test: '999999999' },
    ],
  },
  {
    name: 'numbersOnly',
    regExp: numbersOnly,
    testCases: [
      { expectedValue: true, test: '1' },
      { expectedValue: true, test: '1234567890' },
      { expectedValue: true, test: '0123456789' },
      { expectedValue: false, test: '0123456789a' },
      { expectedValue: false, test: '0123456789.' },
      { expectedValue: false, test: 'a0123456789' },
      { expectedValue: false, test: '.0123456789' },
      { expectedValue: false, test: '01234a56789' },
      { expectedValue: false, test: '01234.56789' },
    ],
  },
  {
    name: 'dotAndZeroes',
    regExp: dotAndZeroes,
    testCases: [
      { expectedValue: true, test: '0' },
      { expectedValue: true, test: '0.0' },
      { expectedValue: true, test: '0.00' },
      { expectedValue: true, test: '0.000' },
      { expectedValue: false, test: '0.001' },
      { expectedValue: false, test: '0.0012' },
      { expectedValue: true, test: '0.001200' },
      { expectedValue: false, test: '1.' },
      { expectedValue: true, test: '1.0' },
      { expectedValue: true, test: '12.0' },
      { expectedValue: false, test: '12.01' },
    ],
  },
  {
    name: 'comma',
    regExp: comma,
    testCases: [
      { expectedValue: false, test: '0' },
      { expectedValue: true, test: '0,0' },
      { expectedValue: true, test: '0,00' },
      { expectedValue: true, test: '0,000' },
      { expectedValue: false, test: '0.000' },
      { expectedValue: false, test: '0.001' },
      { expectedValue: true, test: '0,001200' },
      { expectedValue: false, test: '1.' },
      { expectedValue: true, test: '1,0' },
      { expectedValue: true, test: '12,0' },
      { expectedValue: false, test: '12.01' },
    ],
  },
  {
    name: 'percentageOnly',
    regExp: percentageOnly,
    testCases: [
      { expectedValue: false, test: '0,0' },
      { expectedValue: false, test: '0,00' },
      { expectedValue: false, test: '0.0' },
      { expectedValue: false, test: '0.00' },
      { expectedValue: false, test: '0.001' },
      { expectedValue: false, test: '101' },
      { expectedValue: false, test: '100.0' },
      { expectedValue: false, test: '100.00' },
      { expectedValue: false, test: '100,0' },
      { expectedValue: false, test: '100,00' },
      { expectedValue: false, test: '100.01' },
      { expectedValue: false, test: '100,01' },
      { expectedValue: true, test: '0' },
      { expectedValue: true, test: '100' },
      { expectedValue: true, test: '1' },
      { expectedValue: true, test: '99' },
      { expectedValue: true, test: '19' },
      { expectedValue: true, test: '35' },
      { expectedValue: true, test: '9' },
      { expectedValue: true, test: '68' },
    ],
  },
];

describe('regExp', () => {
  for (const { name, regExp, testCases } of regExpTestCases) {
    describe(name, () => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      for (const { expectedValue, test } of testCases) {
        it(`properly test ${test} as ${expectedValue}`, () => {
          expect(regExp.test(test)).toBe(expectedValue);
        });
      }
    });
  }
});
